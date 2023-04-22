const Booking = require('../models/Booking');
const Campground = require('../models/Campground');

//@desc     Get Campground's Booking nummber of a day
//@route    GET /api/v5/campground/:campgroundId/status/:date
//@access   Public
exports.getStatus = async (req,res,next) =>{
    let campgroundId = req.params.campgroundId;

    try{
        const datetime = new Date(req.params.date);
        const existedbookings = await Booking.find({campground: campgroundId,
                                                    date: datetime.toISOString()});
        //check if campground existed
        const campground = await Campground.findById(campgroundId);
        if(!campground){
            return res.status(404).json({success:false,
                        message:`No campground with the id of ${campgroundId}`});
        }
        res.status(200).json({success: true,
                                campground: campground._id,
                                bookingNumber: existedbookings.length,
                                capacity: campground.capacity,
                                date: datetime.toISOString()});
    }catch(err){
        return res.status(500).json({success:false,
                        message:"Canont find Campground's booking status"});
    }
}

//@desc     Get Campground's average Booking nummber of a the last n day
//@route    GET /api/v5/campground/:campgroundId/status/average/:dayNumber
//@access   Private
exports.getAverage = async (req,res,next) =>{
    try{
    const dayNumber = Number(req.params.dayNumber)
    let campgroundId = req.params.campgroundId;
    //get current date
    let datenow = new Date();
    datenow = new Date(datenow.getUTCFullYear(), datenow.getUTCMonth() ,datenow.getUTCDate())
    //up to before tomorrow
    const tomorrow = new Date(datenow.getTime() + 86400000);
    //start at the n days before
    const lastNday = new Date(datenow.getTime() - (dayNumber-1)*86400000);
    
    const queryJson = {date:{$gte:lastNday.toISOString(),
                            $lt:tomorrow.toISOString()}};
    
    let query;
        if(campgroundId){
            queryJson.campground = campgroundId;
            query = Booking.find(queryJson);
        }else{
            query = Booking.find(queryJson);
        }
    const bookings = await query;
    res.status(200).json({success: true,
            bookingNumber: bookings.length,
            dayNumber: dayNumber,
            average: bookings.length/dayNumber,
            fromDate: lastNday.toISOString(),
            beforeDate:tomorrow.toISOString(),
            bookings:bookings});
            
    }catch(err){
        return res.status(500).json({success:false,
                    message:"Canont find Campground's booking infomation"});
    }
}

//@desc     Get Recommendation Campground from qurey
//@route    GET /api/v5/campground/recommendation
//@access   Public
exports.getRecommendation  = async (req,res,next) =>{
    let night = parseInt(req.query.night,10) || 1;
    let max = parseInt(req.query.max,10) || 10;
    night = (night<=3)? night:3;

    let dateStart;
    let dateEnd;

    //calculate date time period
    try{
        // console.log(req.query.period_start, req.query.period_end);
        if(req.query.period_start){
            dateStart = new Date(req.query.period_start);
            // range from start to end date
            if(req.query.period_end){
                dateEnd = new Date(req.query.period_end);
            }
            //range only 1 day at the start date and up to 1 night
            else{
                dateEnd = new Date(req.query.period_start);
                night = 1;
            }
            dateEnd = new Date(dateEnd.getTime() + 86400000);
        }else{
            // if not specify range to only current date and up to 1 day
            let datenow = new Date();
            dateStart = new Date(datenow.getUTCFullYear(), datenow.getUTCMonth() ,datenow.getUTCDate());
            dateEnd = new Date(dateStart.getTime() + 86400000);
            night = 1;
        }
        //check if date error
        if(!dateStart || !dateEnd){
            throw "err";
        }
        // check if range valid
        if(dateStart.getTime() >= dateEnd.getTime()){
            throw "err";
        }
    }catch(err){
        return res.status(500).json({success:false,message:"Invalid Date format"});
    }

    const bookingQuery = {date:{$gte:dateStart.toISOString(),
                            $lt:dateEnd.toISOString()}};
    const periodDays = parseInt((dateEnd.getTime()-dateStart.getTime())/86400000);
    
    // console.log(bookingQuery);
    try{
        const bookings =  await Booking.find(bookingQuery).select("date campground");
        const campgrounds = await Campground.find();

        let campBookingDays = {}
        let recommendationList = Array();

        //create list of number of bookings per day from startdate to enddate for each campground
        campgrounds.forEach((camp)=>{
            campBookingDays[camp.id] = {days:Array(periodDays).fill(0),
                                        cap:camp.capacity,
                                        name:camp.name,
                                        address:camp.address,
                                        tel:camp.tel};
        });
        
        // count booking for each date for each campground
        bookings.forEach((booking)=>{
            let day = new Date(booking.date);
            day = parseInt((day.getTime()-dateStart.getTime())/86400000);
            campBookingDays[booking.campground].days[day] += 1;
        });
        
        //calculate available booking period for each campground
        for (const [camp, d] of Object.entries(campBookingDays)) {
            let daylist = [];
            let start = 0;
            for(let i=0; i<d.days.length; i++){
                if(d.days[i] >= d.cap){
                    //if long enough period add to the list
                    if(i-start >= night){
                        daylist.push({fromDate:start, toDate:i-1});
                    }
                    start = (i+1 < d.days.length)? i+1 : d.days.length-1;
                }
            }
            if((d.days.length) - start >= night){
                daylist.push({fromDate:start, toDate:d.days.length-1});
            }

            //if have at least 1 available period add to recommendation
            if(daylist.length>0){
                recommendationList.push({id:camp, name:d.name, address:d.address,
                            tel:d.tel, capacity:d.cap, availableDays:daylist});
            }
        }

        // sort reccommendation by total date available
        recommendationList.sort((a,b)=>{
            let sumA = 0;
            a.availableDays.forEach((range)=>{
                sumA += range.toDate - range.fromDate;
            })

            let sumB = 0;
            b.availableDays.forEach((range)=>{
                sumB += range.toDate - range.fromDate;
            })
            return sumB - sumA;
        });

        max = (recommendationList.length > max)? max : recommendationList.length
        recommendationList = recommendationList.slice(0,max);

        // calculate date time from number of day to the start day
        recommendationList.forEach((camp)=>{
            camp.availableDays.forEach((dateRange)=>{
                let datetime = dateStart.getTime() + dateRange.fromDate*86400000;
                dateRange.fromDate = (new Date(datetime)).toISOString();
                datetime = dateStart.getTime() + dateRange.toDate*86400000;
                dateRange.toDate = (new Date(datetime)).toISOString();
            })
        });
        
        res.status(200).json({success: true,
            //bookings:bookings,
            //campgrounds:campgrounds,
            //campBookingDays:campBookingDays,
            count: recommendationList.length,
            recommended:recommendationList});

    }catch(err){
        return res.status(500).json({success:false,message:"Invalid Date format"});
    }
}