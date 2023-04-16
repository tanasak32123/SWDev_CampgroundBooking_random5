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
        const campground = await Campground.findById(campgroundId);
        if(!campground){
            return res.status(404).json({success:false,message:`No campground with the id of ${campgroundId}`});
        }
        res.status(200).json({success: true,
                                campground: campground._id,
                                bookingNumber: existedbookings.length,
                                capacity: campground.capacity,
                                date: datetime.toISOString()});
    }catch(err){
        return res.status(500).json({success:false,message:"Canont find Campground's booking status"});
    }
    
}

//@desc     Get Campground's average Booking nummber of a the last n day
//@route    GET /api/v5/campground/:campgroundId/status/average/:dayNumber
//@access   Private
exports.getAverage = async (req,res,next) =>{
    try{
    const dayNumber = Number(req.params.dayNumber)
    let campgroundId = req.params.campgroundId;
    let datenow = new Date();
    datenow = new Date(datenow.getUTCFullYear(), datenow.getUTCMonth()-1 , datenow.getUTCDate())
    const tomorrow = new Date(datenow.getTime() + 86400000);
    const lastNday = new Date(datenow.getTime() - dayNumber*86400000);
    
    const queryJson = {date:{$gte:lastNday.toISOString(),
                            $lt:tomorrow.toISOString()}}
    
    let query;
        if(campgroundId){
            queryJson.campground = campgroundId;
            query = Campground.find(queryJson);
        }else{
            query = Campground.find(queryJson);
        }
    const bookings = await query;
    res.status(200).json({success: true,
            bookingNumber: bookings.length,
            dayNumber: dayNumber,
            average: bookings.length/dayNumber,
            fromDate: lastNday.toISOString(),
            toDate:datenow.toISOString()});
            
    }catch(err){
        return res.status(500).json({success:false,message:"Canont find Campground's booking infomation"});
    }
}

exports.getRecommend  = async (req,res,next) =>{

}