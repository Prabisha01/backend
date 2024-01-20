const Blog = require('../model/blogModel');
const cloudinary = require('cloudinary');

const blogController = {
  createBlog: async (req, res) => {
    try {
      const { blogTitle, blogContent, blogAuthor, blogCategory, blogDate } = req.body;
      const { blogImage } = req.files;

      if (!blogTitle || !blogContent || !blogAuthor || !blogCategory || !blogDate || !blogImage) {
        return res.json({
          success: false,
          message: "Please fill all the fields."
        });
      }

      const uploadedImage = await cloudinary.v2.uploader.upload(blogImage.path, {
        folder: "blogs",
        crop: "scale"
      });

      const newBlog = new Blog({
        blogTitle,
        blogContent,
        blogAuthor,
        blogCategory,
        blogImageUrl: uploadedImage.secure_url,
        blogDate
      });

      await newBlog.save();
      res.status(201).json({
        success: true,
        message: "Blog created successfully",
        data: newBlog
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getAllBlogs: async (req, res) => {
    try {
      const blogs = await Blog.find();
      res.json(blogs);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getSingleBlog: async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json(blog);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateBlog: async (req, res) => {
    try {
      const { blogTitle, blogContent, blogAuthor, blogCategory, blogDate } = req.body;
      const { blogImage } = req.files;
      const id = req.params.id;

      const updatedData = {
        blogTitle,
        blogContent,
        blogAuthor,
        blogCategory,
        blogDate
      };

      if (blogImage) {
        const uploadedImage = await cloudinary.v2.uploader.upload(blogImage.path, {
          folder: "blogs",
          crop: "scale"
        });
        updatedData.blogImageUrl = uploadedImage.secure_url;
      }

      const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, { new: true });

      if (!updatedBlog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }

      res.json({
        success: true,
        message: "Blog updated successfully",
        data: updatedBlog
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  deleteBlog: async (req, res) => {
    try {
      const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
      if (!deletedBlog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json({ message: 'Blog post deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = blogController;
