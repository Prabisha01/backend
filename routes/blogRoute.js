const router = require('express').Router();
const blogController = require("../controllers/blogController");


// Create Blog API
router.post('/create_blog',blogController.createBlog)

//get all blog API
router.get("/get_blog", blogController.getAllBlogs)


//Get single blog API 
router.get("/get_blog/:id" , blogController.getSingleBlog)

//update blog API
router.put("/update_blog/:id",  blogController.updateBlog)


//delete delete API
router.delete("/delete_blog/:id", blogController.deleteBlog)


module.exports = router;