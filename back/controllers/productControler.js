
const Product = require('../models/productModel');
const Errorhandler = require('../utils/errorHandler')
const catchAsynError = require('../middl/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures')





// exports.getProducts = (req,res,next) =>{
//     res.status(200).json({
//         success : true,
//         message : "this rout will show all the porducts in db"
//     }) 
// }



//get products = http://localhost:7000/api/v1/products
//fiter prodect = http://localhost:7000/api/v1/product?keyword=Pro
exports.getProducts = catchAsynError(async(req,res,next) =>{
    const resPerPage = 2
    const apiFeature= new APIFeatures(Product.find(), req.query)
    .search().filter().paginate(resPerPage);

    const porducts = await apiFeature.query;
    res.status(200).json({
        success : true,
        count: porducts.length,
        porducts
    }) 
})


//create product = http://localhost:7000/api/v1/product/new
exports.newProduct = catchAsynError(async(req,res,next) =>{

    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    });
})

// get a single product = http://localhost:7000/api/v1/product/:id
exports.getSingleProducts =catchAsynError (async(req,res,next) =>{
    const product = await Product.findById(req.params.id)

    if(!product) {
    //    return res.status(404).json({
    //         success:false,
    //         message:'rroducty is not define'
    //     });
    return next(new Errorhandler("Product not found test" , 404))
    }
    res.status(201).json({
        success:true,
        product
    });
})

//update product =http://localhost:7000/api/v1/product/65ef0ecdb58c05c990a8a30f

exports.updateProduct =catchAsynError(async(req,res,next) =>{
    const product = await Product.findById(req.params.id)

    if(!product) {
       return res.status(404).json({
            success:false,
            message:'rroducty is not define'
        });
    }

     await Product.findByIdAndUpdate(req.params.id, req.body ,{
        new: true,
        runValidators:true
    });

    res.status(200).json({
        success:true,
        product
    });
})
//delete product =http://localhost:7000/api/v1/product/65ef0ecdb58c05c990a8a30f

exports.deleteProduct =catchAsynError(async(req,res,next) =>{
    const product = await Product.findById(req.params.id)

    if(!product) {
       return res.status(404).json({
            success:false,
            message:'rroducty is not define'
        });
    }

    await Product.findByIdAndDelete(req.params.id, req.body ,{
        new: true,
        runValidators:true
    });


    res.status(200).json({
        success:true,
        message:'product deleted'
    });
})