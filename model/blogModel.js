const mongoose = require('mongoose');

// Blog Post Schema
const blogSchema = new mongoose.Schema({
  blogTitle: {
    type: String,
    required: true
  },
  blogContent: {
    type: String,
    required: true
  },
  blogAuthor: {
    type: String,
    required: true
  },
  blogDate: {
    type: Date,
    default: Date.now
  },
  blogCategory:{
    type : String,
    required : true,
    trim : true,
},
blogImageUrl : {
    type : String,
    required : true,
    trim : true,
}

});

// BlogPost model based on the schema
const Blogs = mongoose.model('blogs', blogSchema);

module.exports = Blogs;
