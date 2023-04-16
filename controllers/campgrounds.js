const Campground = require('../models/Campground');

//@desc     Get all campgrounds
//@route    GET /api/v5/campgrounds/
//@access   Public
exports.getCampgrounds = async (req,res,next) => {
    let query;

    const reqQuery = {...req.query};
    const removeFields = ['select','sort','page','limit'];

    removeFields.forEach(param=>delete reqQuery[param]);

    // select and sort
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);
    console.log(queryStr);
    query = Campground.find(JSON.parse(queryStr)).populate('bookings');

    if(req.query.select){
        const fields=req.query.select.split(',').join(' ');
        query=query.select(fields);
    }
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    } else{
        query=query.sort('-createdAt');
    }

    // pagination
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10)||25;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    const total = await Campground.countDocuments();
    query = query.skip(startIndex).limit(limit);

    try{
        const campgrounds = await query;

        const pagination = {};
        if(endIndex<total){
            pagination.next = {page:page+1,limit}
        }
        if(startIndex>0){
            pagination.prev = {page:page-1,limit}
        }

        res.status(200).json({success:true,
                                count:campgrounds.length,
                                pagination, 
                                data:campgrounds});
    } catch(err){
        res.status(400).json({success:false});
    }
    
};

//@desc     Get single campground
//@route    GET /api/v5/campgrounds/:id
//@access   Public
exports.getCampground = async (req,res,next) => {
    try{
        const campground = await Campground.findById(req.params.id);
        if(!campground){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data:campground});
    }catch(err){
        res.status(400).json({success:false});
    }
};

//@desc     Create new campground
//@route    POST /api/v5/campgrounds/
//@access   Private
exports.createCampground = async (req,res,next) => {
    try{
        const campground = await Campground.create(req.body);
        res.status(200).json({
                success:true,
                data:campground
    });
    }catch(err){
        res.status(400).json({success:false});
    }
    
};

//@desc     Update campground
//@route    PUT /api/v5/campgrounds/:id
//@access   Private
exports.updateCampground = async (req,res,next) => {
    try{
        const campground = await Campground.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!campground){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data:campground});
    }catch(err){
        res.status(400).json({success:false});
    }
};

//@desc     Delete campground
//@route    DELETE /api/v5/campgrounds/:id
//@access   Private
exports.deleteCampground = async(req,res,next) =>{
    try{
        const campground = await Campground.findById(req.params.id);
        if(!campground){
            return res.status(400).json({success:false});
        }
        campground.remove();
        res.status(200).json({success:true, data: {}});
    }catch(err){
        res.status(400).json({success:false});
    }
};