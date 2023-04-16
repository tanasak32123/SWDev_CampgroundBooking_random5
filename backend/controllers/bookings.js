const Booking = require('../models/Booking');
const Campground = require('../models/Campground');

//@desc     Get all Bookings
//@route    GET /api/v5/campgrounds/:campgroundId/bookings/
//@access   Private
exports.getBookings = async (req,res,next) => {
    let query;
    let campgroundId = req.params.campgroundId;

    // show only bookings that their owned if user is not an admin
    if(req.user.role !== 'admin'){
        if(campgroundId){
            query=Booking.find({user:req.user.id,campground:campgroundId}).populate({
                path:'campground',
                select: 'name address tel'
            });
        }else{
            query=Booking.find({user:req.user.id}).populate({
                path:'campground',
                select: 'name address tel'
            });
        }
    }else{
        if(campgroundId){
            query=Booking.find({campground:campgroundId}).populate({
                path: 'campground',
                select: 'name address tel'
            });
        }else{
            query=Booking.find().populate({
                path: 'campground',
                select: 'name address tel'
            });
        }
    }

    try {
        const bookings = await query;
        res.status(200).json({success:true, count: bookings.length, data: bookings});
    } catch (error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Booking"});
    }
};

//@desc     Get single Booking
//@route    GET /api/v5/bookings/:id
//@access   Private
exports.getBooking = async (req,res,next)=>{
    try {
        const booking = await Booking.findById(req.params.id).populate({
            path: 'campground',
            select: 'name address tel'
        });
        if(!booking){
            return res.status(404).json({success:false,message:`No Booking with the id of ${req.params.id}`});
        }
        res.status(200).json({
            success:true,
            data: booking
        });
    } catch (error){
        console.log(error);
        return res.status(500).json({success:false,message:"Canont find Booking"});
    }
}

//@desc     Add Booking
//@route    POST /api/v5/campground/:campgroundId/bookings/
//@access   Private
exports.addBooking = async (req,res,next) =>{
    try{
        req.body.campground = req.params.campgroundId;

        req.body.user = req.user.id;
        
        // make sure each user cannot have more than 3 bookings
        const existedbookings = await Booking.find({user:req.user.id});
        if(existedbookings.length >= 3 && req.user.role !== 'admin'){
            return res.status(400).json({success:false,message:`The user with ID ${req.user.id} has already made 3 bookings`});
        }

        // make sure campground existed
        const campground = await Campground.findById(req.params.campgroundId);
        if(!campground){
            return res.status(404).json({success:false,message:`No campground with the id of ${req.params.campgroundId}`});
        }

        const booking = await Booking.create(req.body);
        res.status(200).json({success:true,data:booking});
    } catch (error){
        console.log(error);
        return res.status(500).json({success:false,message:"Canont create Booking"});
    }
}

//@desc     Update Booking
//@route    PUT /api/v5/bookings/:id
//@access   Private
exports.updatebooking = async (req,res,next)=>{
    try{
        let booking = await Booking.findById(req.params.id);
        if(!booking){
            return res.status(404).json({success:false,messag:`No booking with the id of ${req.params.id}`});
        }
        
        //make sure that user is booking owner
        if(booking.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,messag:`User ${req.user.id} is not authorized to update this booking`});
        }

        booking = await Booking.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({success:true,data:booking});
    } catch (error){
        console.log(error);
        return res.status(500).json({success:false,messag:`Cannot update Booking`});
    }
};

//@desc     Delete Booking
//@route    DELETE /api/v5/bookings/:id
//@access   Private
exports.deleteBooking = async (req,res,next)=>{
    try{
        let booking = await Booking.findById(req.params.id);
        if(!booking){
            return res.status(404).json({success:false,messag:`No booking with the id of ${req.params.id}`});
        }

        //make sure that user is booking owner
        if(booking.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,messag:`User ${req.user.id} is not authorized to delete this booking`});
        }

        await Booking.remove();
        res.status(200).json({success:true,data:{}});
    } catch (error){
        console.log(error);
        return res.status(500).json({success:false,messag:`Cannot delete booking`});
    }
};