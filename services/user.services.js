const User=require('../models/user.model')
const UserProfile=require('../models/user.profile.model')
const tokenService=require('../jwt/token.service')
const mongoose = require('mongoose');

const bcrypt=require('bcrypt');
const { error } = require('three');
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
    // async getAllUsers(){
    //     const user=await User.find({isActive:true}).populate('profile')
    //     return user
    // }
    async getAllUsers(){
        const users=await User.find({isActive:true});
        const userid=users.map((users)=>users._id);
        const userProfiles=await UserProfile.find({user:{$in:userid},});

        const userWithProfile = users.map((user)=>{
            const profile = userProfiles.find(
                (profile)=>profile.user.toString()===user._id.toString(),
            );
            return{
            ...user.toObject(),
            profile:profile||null,
        };
        })
        return userWithProfile;
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
    async addUserProfile(userId,profileData){
        if(!mongoose.isValidObjectId(userId)){
            throw new error("Invalid User Id");
        }

        const user = await User.findById(userId);

        if(!user){
            throw new error("User not Found");
        }

        const userProfile=await UserProfile.create({
            user:userId,
            age:profileData.age,
            dob:profileData.dob,
            bio:profileData.bio,
        });
        user.profile=userProfile._id;
        await user.save();

        return userProfile;
    }
}

module.exports=new UserService();
