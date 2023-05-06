const mongoose = require('mongoose');

const CampgroundSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please add a name'],
        unique: true,
        trim: true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    address:{
        type: String,
        required: [true,'Please add a address'],
    },
    tel:{
        type: String,
        trim: true,
        maxlength:[15,'Tel can not be more than 15 characters']
    },
    capacity:{
        type:Number,
        required: [true,'Please add a  capacity'],
    }
},  {
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});


CampgroundSchema.pre('deleteOne', { query: true, document: true },async function(next){
    console.log(`Bookings being removed from Campground ${this._id}`);
    await this.model(`Booking`).deleteMany({campground:this._id});
    next();
});

CampgroundSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'campground',
    justOne:false
});

module.exports=mongoose.model('Campground', CampgroundSchema);