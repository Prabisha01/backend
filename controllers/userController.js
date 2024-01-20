const Users = require("../model/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary');


const createUser = async (req, res) => {
    try {
        // Step 1: Check if data is coming or not
        console.log(req.body);
        console.log(req.files);

        // Step 2: Destructure the data
        const { firstName, lastName, email, password } = req.body;
        const { userImage } = req.files;

        // Step 3: Validate the incoming data
        if (!firstName || !lastName || !email || !password || !userImage) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields and an image."
            });
        }

        // Step 4: Upload image to Cloudinary
        const uploadedImage = await cloudinary.v2.uploader.upload(
            userImage.path,
            {
                folder: "users",
                crop: "scale"
            }
        );

        // Step 5: Check existing user
        const existingUser = await Users.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists."
            });
        }

        // Step 6: Password encryption
        const randomSalt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, randomSalt);

        // Step 7: Create new user
        const newUser = new Users({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: encryptedPassword,
            userImageUrl: uploadedImage.secure_url
        });

        // Step 8: Save user and respond
        await newUser.save();
        res.status(200).json({
            success: true,
            message: "User created successfully.",
            data: newUser
        });
    } catch (error) {
        console.error("Error in createUser:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message  // Include the error message for debugging
        });
    }
};
const loginUser = async (req, res) => {
    // Step 1 : Check if data is coming or not
    console.log(req.body);

    // step 2 : Destructure the data
    const {email, password} = req.body;

    // step 3 : validate the incomming data
    if(!email || !password){
        return res.json({
            success : false,
            message : "Please fill all the fields."
        })
    }

    // step 4 : try catch block
    try {
        // step 5 : Find user
        const user = await Users.findOne({email : email}) // user store all the data of user
        if(!user){
            return res.json({
                success : false,
                message : "User does not exists."
            })
        }
        // Step 6 : Check password
        const passwordToCompare = user.password;
        const isMatch = await bcrypt.compare(password, passwordToCompare)
        if(!isMatch){
            return res.json({
                success : false,
                message : "Password does not match."
            })
        }

        // Step 7 : Create token
        const token = jwt.sign(
            {id : user._id, isAdmin: user.isAdmin},
            process.env.JWT_TOKEN_SECRET,
        )

        // Step 8 : Send Response
        res.status(200).json({
            success : true,
            token : token,
            userData : user,
            message : "Welcome to NursyEase"
        })
        
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

//function for getting all the product
const getAllUsers = async (req, res) => {
    try{
        const listOfUsers =  await Users.find();
        res.json({
            success: true,
            message: "User fetched successfully",
            users : listOfUsers
        })
  
    }catch(error){
        res.status(500).json("Server Error")
  
    }
  }
  
  // get product by id
  const getSingleUsers = async (req ,res)=>{
    const id=req.params.id;
    if(!id) {return res.json(
    {
     message: 'No record with given id:',
     success:false,
    }
      )
    }
      try{
        const singleUser = await Users.findById(id);
        res.json({
          success:true,
          message: 'User Fetched',
          user: singleUser,
        })
      }catch(error){
        console.log(error);
        res.status(500).json('Server Error')
      }
  }
  
  const updateUser = async (req, res) => {
    // step 1: Check incoming data
    console.log(req.body);
    console.log(req.files);

    // step 2: Destructuring
    const { firstName, lastName, email, password } = req.body;
    const { userImage } = req.files;

    // destructure id from URL
    const id = req.params.id;

    // step 3: Validating
    if (!firstName || !lastName || !email || !password) {
        return res.json({
            success: false,
            message: 'Please enter all the fields'
        });
    }

    try {
        let updatedUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
        };

        if (userImage) {
            try {
                const uploadedImage = await cloudinary.v2.uploader.upload(
                    userImage.path,
                    {
                        folder: 'users',
                        crop: 'scale'
                    }
                );
                updatedUser.userImage = uploadedImage.secure_url;
            } catch (error) {
                console.log(error);
                // Handle the error (e.g., continue with the existing image or default image path)
            }
        }

        const updatedUserData = await Users.findByIdAndUpdate(id, updatedUser, { new: true });

        if (!updatedUserData) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: userImage ? 'Updated successfully with image' : 'Updated successfully without image',
            user: updatedUserData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}
const deleteUser = async (req, res) => {
        try {
            const deleteUser = await Users.findByIdAndDelete(req.params.id);
            if(!deleteUser){
                return res.json({
                    success: false,
                    message: "User not found"
                })
            }
            res.json({
                success: true,
                message: "User deleted Sucesfully"
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
    createUser, 
    loginUser,
    updateUser,
    getAllUsers,
    getSingleUsers,
    deleteUser,

};