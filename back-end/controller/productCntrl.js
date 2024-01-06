const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify =require("slugify");
const User = require("../models/userModel");


const createProduct = asyncHandler(async(req ,res)=>{
  try { 
      if(req.body.title){
        req.body.slug = slugify(req.body.title);
      }
     const newProduct = await Product.create(req.body);
     res.json(newProduct);
  } catch (error) {
    throw new Error(error)
  }
})



const productUpdate = asyncHandler(async(req,res)=>{
  const {id}= req.params;
  try {
    if(req.body.title){
      req.body.slug = slugify(req.body.title);
    }
    const productUpdate =   await Product.findByIdAndUpdate(id , req.body ,{
      new:true
    });
    res.json(productUpdate);


    } catch (error) {
    throw new Error(error);
   }
})


const deleteProduct = asyncHandler(async(req,res)=>{
  const {id}= req.params;
  try {
    const deleteProduct =   await Product.findByIdAndDelete(id);
    res.json(deleteProduct);

    } catch (error) {
    throw new Error(error);
   }
})




const getaProduct = asyncHandler(async(req,res)=>{
  const {id} = req.params;
  try {
    
    const findProduct = await Product.findById(id).populate("color");
    res.json(findProduct);
  } catch (error) {
     throw new Error(error);
  }
})


const getAllProduct = asyncHandler(async(req , res)=>{
  
  try {

    //  Filtring
    const queryObj = {...req.query};
    const excludeFields = ["page" , "sort" ,"limit" , "fields"];
    excludeFields.forEach( (el) => delete queryObj[el])
     console.log(queryObj);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g , (match) => `$${match}`);

    console.log(JSON.parse(queryStr))
  let query = Product.find(JSON.parse(queryStr));
  
  // Sorting

      if(req.query.sort){
           const sortBy = req.query.sort.split(",").join(" ");
          query = query.sort(sortBy);
         } else{
          query= query.sort("-createdAt");
         }

//  limitting the feilds
    if(req.query.fields){
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }


//   Pagination
   
   const page = req.query.page;
   const limit = req.query.limit;
   const skip = (page -1 ) * limit;
   query = query.skip(skip).limit(limit);
   if( req.query.page){
     const productCount = await Product.countDocuments();
     if( skip >= productCount) throw new Error("This Page Does not Exist");
   }


  const product = await query;
    
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
})


const addToWishlist = asyncHandler(async(req , res)=>{
  const { _id } = req.user;
  const {  prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alReadyAdded = user.wishlist.find((id) => id.toString() === prodId);

    if(alReadyAdded){
      let user = await User.findByIdAndUpdate(
        _id ,
        {
          $pull : { wishlist : prodId },
        },
        {
          new : true
        }
      );
      res.json(user);
    }else{
      let user = await User.findByIdAndUpdate(
        _id ,
        {
          $push : { wishlist : prodId },
        },
        {
          new : true
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }

})


const rating = asyncHandler(async(req ,res)=>{
  const { _id }= req.user;
  const { star , prodId , comment} = req.body;
  try {
    const product = await Product.findById(prodId);
      let alreadyRated = product.ratings.find(
        (userId) => userId.postedby.toString() === _id.toString()
      );
      if(alreadyRated){
       const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
        $set : { "ratings.$.star" : star , "ratings.$.comment": comment},
        },
        {
          new :true,
        }
       );
    
      }else{
        const rateProduct = await Product.findByIdAndUpdate(
          prodId,
          {
            $push :{
              ratings:{
                star:star,
                comment:comment,
                postedby : _id,
              },
            },
          },  { new : true,}
        );
       }


       // total rating 
       const getallRatings = await Product.findById(prodId);
       let totalRating = getallRatings.ratings.length;
       console.log("totalRating" ,totalRating)
       let ratingSum = getallRatings.ratings.map((item) => item.star).reduce((prev , curr) => prev + curr , 0);
       
       let actualRating = Math.round(ratingSum / totalRating);
       let finalRating = await Product.findByIdAndUpdate(
        prodId,
        {
          totalrating : actualRating,
        },{ new : true }
       )
       res.json(finalRating);

  } catch (error) {
    throw new Error(error);
  }
});



module.exports={
    createProduct,
    getaProduct,
    getAllProduct,
    productUpdate,
    deleteProduct,
    addToWishlist,
    rating,
};