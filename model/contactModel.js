const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    contactName:{
        type: String,
        required: true,
   
    },
    contactEmail: {
        type: String,
        required: true,
    },
    contactMessage:{
        type: String,
        required: true,   
    }
})

const Contacts= mongoose.model('contacts', contactSchema);
module.exports= Contacts;