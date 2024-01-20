const contactController = require("../controllers/contactController")
const router = require('express').Router();

//create contact api
router.post('/sendMessage', contactController.sendMessage)

//get all products API
router.get("/get_contact", contactController.getAllContacts)


//Get single product API | /get_product/:id
router.get("/get_single_contact/:id" , contactController.getSingleContact)


//delete product API
router.delete("/delete_contact/:id", contactController.deleteContact)


// exporting
module.exports = router;