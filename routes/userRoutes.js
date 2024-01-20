// import
const router = require('express').Router();
const userController = require("../controllers/userController")

// creating user api
router.post('/create', userController.createUser)

// creating login api
router.post('/login', userController.loginUser)

//get all users API
router.get("/get_user", userController.getAllUsers)

//Get single user API | /get_product/:id
router.get("/get_single_user/:id" , userController.getSingleUsers)

//update user API
router.put("/update_user/:id", userController.updateUser)


//update user API
router.delete("/delete_user/:id", userController.deleteUser)
// exporting
module.exports = router;