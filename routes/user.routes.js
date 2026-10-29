const express=require('express')
const auth=require('../middleware/auth.middleware')

const router=express.Router();
const UserController=require('../controllers/user.controller')
router.post('/signup',UserController.signup);
router.post('/login',UserController.login);
router.get('/getAllUsers',auth,UserController.getAllUsers)
router.delete('/softDelete/:id',UserController.softDeleteUser)

module.exports=router