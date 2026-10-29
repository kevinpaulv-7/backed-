const User=require('../models/user.model')
const tokenService=require('../jwt/token.service')

const bcrypt=require('bcrypt')
class UserService{
    async signup(name,email,password){
            const existingUser = await User.findOne({email});

        if (existingUser) {
            throw new Error('User already exists with this email');
        }
        const hashedPassword=await bcrypt.hash(password,10)
            const user=await User.create({name,email,password:hashedPassword})
            return user;
    }
    async loginUser(email,password){
        const user=await User.findOne({email}).select("+password")
        if(!user){
            throw new Error("User not Found")
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            throw new Error("Invalid credentials")
        }
        const payload={
            id:user._id,
            email:user.email,
            isActive:user.isActive,
        }
        const token=tokenService.generateToken(payload)
        const userWithoutPassword=user.toObject()
        delete userWithoutPassword.password
        return{user:userWithoutPassword,token}
    }
    async getAllUsers(){
        const user=await User.find({isActive:true})
        return user
    }
    async softDeleteUser(id){
        const user=await User.findById(id)
        if(!user){
            throw new Error("User not found")
        }
        user.isActive=false
        await user.save()
        return user
    }
}

module.exports=new UserService();
