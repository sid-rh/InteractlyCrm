const express=require('express');
const router=express.Router();

const{createContact,getContact,updateContact,deleteContact}=require('../controller/ContactController');

router.post('/createContact',createContact);
router.post('/getContact',getContact);
router.post('/updateContact',updateContact);
router.post('/deleteContact',deleteContact);

module.exports=router;