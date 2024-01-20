const Products = require('../model/productModel');
const cloudinary = require('cloudinary');


const createProduct = async (req,res) =>{
    // step 1 : Check incomming data
    console.log(req.body);
    console.log(req.files);

    // step:2 destructuring
    const {productName, 
        productPrice, 
        productDescription, 
        productCategory} = req.body;

    const {productImage} = req.files;

    // step 3 : validate the data
    if(!productName || !productPrice || !productDescription || !productCategory || !productImage){
        return res.json({
            success : false,
            message : "Please fill all the fields."
        })
    }

        // step 4 : try catch block
        try {
            // step 5 : upload image to cloudinary
            const uploadedImage = await cloudinary.v2.uploader.upload(
                productImage.path,
                {
                    folder : "products",
                    crop : "scale"
                }
            )
    
            // save the products
            const newProduct = new Products({
                productName : productName,
                productPrice : productPrice,
                productDescription : productDescription,
                productCategory : productCategory,
                productImageUrl : uploadedImage.secure_url
            })
            await newProduct.save();
            res.status(200).json({
                success : true,
                message : "Product created successfully",
                data : newProduct
            })
    
            
        } catch (error) {
            console.log(error);
            res.status(500).json("Server Error")
        }

}


//function for getting all the product
const getAllProducts = async (req, res) => {
  try{
      const listOfProducts =  await Products.find();
      res.json({
          success: true,
          message: "Product fetched successfully",
          products : listOfProducts
      })

  }catch(error){
      res.status(500).json("Server Error")

  }
}

// get product by id
const getSingleProduct = async (req ,res)=>{
  const id=req.params.id;
  if(!id) {return res.json(
  {
   message: 'No record with given id:',
   success:false,
  }
    )
  }
    try{
      const singleProduct = await Products.findById(id);
      res.json({
        success:true,
        message: 'Product Fetched',
        product: singleProduct,
      })
    }catch(error){
      console.log(error);
      res.status(500).json('Server Error')
    }
}
//Create order 
const createOrder = async (req, res) => {
  console.log(req.body);
  const{userId , productId , quantity} = req.body;
  if(!userId || !productId || !quantity){
    return res.json({
      success: false,
      message : "All field are required"
    })
  }
  try {
    const newOrder = new Orders({
      userId : userId,
      productId: productId,
      quantity: quantity
    });

    await newOrder.save();
    res.json({
      success: true,
      message: "Order successfully ",
      order: newOrder
    })
  }catch(error){
    console.log(error);
    res.status(500).json({
      success: false,
      message: "server error"
    });
  }
}


const updateProduct = async (req,res)=>{
     // step 1 : Check incomming data
     console.log(req.body);
     console.log(req.files);
 
     // step 2 : destructuring
     const {productName, 
         productPrice, 
         productDescription, 
         productCategory} = req.body;
 
     const {productImage} = req.files;
    //  destructure id from url
    const id = req.params.id;
    //  step 3 : validating
    if (!productName || !productPrice ||!productDescription||!productCategory)
     {
      res.json(
        {
          success: false,
          message:'Please fill all fields'
        });
      }
      try{
        if(productImage){
          let uploadedImage = await cloudinary.v2.uploader.upload(
            productImage.path,
            {
              folder:'products',
              crop:'scale'
            }
            );
            // update the product
            const updatedProduct= {
              productName:productName,
              productPrice:productPrice,
              productDescription:productDescription,
              productCategory:productCategory,
              productImageUrl:uploadedImage.secure_url
            }
            await Products.findByIdAndUpdate(id,updatedProduct);
            res.json({
              success:true,
              message:"Updated Successfully",
              product:updatedProduct
            })
        } else{
          const updatedProduct= {
            productName:productName,
            productPrice:productPrice,
            productDescription:productDescription,
            productCategory:productCategory,
          }
          await Products.findByIdAndUpdate(id,updatedProduct);
          res.json({
            success:true,
            message:"Updated Successfully Without Image",
            product:updatedProduct
          })
        }
      }catch(error){
        console.log(error)
        res.status(500).json(
          {
            success:false,
            message:'Server Error'
          }
        )
     }
    }
    
    const deleteProduct = async (req, res) => {
        try {
            const deleteProduct = await Products.findByIdAndDelete(req.params.id);
            if(!deleteProduct){
                return res.json({
                    success: false,
                    message: "Product not found"
                })
            }
            res.json({
                success: true,
                message: "Product deleted Sucesfully"
            })

        }catch (error){
            console.log(error);
            res.status(500).json({
                success: false,
                message : "server error"
            })
        }
    }


 module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createOrder,
  
}
