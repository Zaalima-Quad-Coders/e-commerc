import handleAsynError from "../middleware/handleAsynError.mjs";
import crypto from "crypto"; 
import HandleError from "../utils/handleError.mjs";
import User from "../models/userModel.mjs"
import { sendToken } from "../utils/jwtToken.mjs";
import { sendEmail } from "../utils/sendEmail.mjs";
import {v2 as cloudinary} from 'cloudinary'

export const registerUser = handleAsynError(async (req, res, next) => {
    const { name, email, password, avatar } = req.body;  
    const myCloud = await  cloudinary.uploader.upload(avatar,{
        folder:"avatars",
        width :150,
        crop: "scale"
    })
    const user = await User.create({ 
        name,
        email, 
        password, 
        avatar: { 
            public_id: myCloud.public_id, 
            url: myCloud.secure_url
        }
    });
    sendToken(user, 201, res);
})


//Login 

export const loginUser = handleAsynError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new HandleError("Please enter email and password", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new HandleError("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new HandleError("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
})

//Logout User
export const logoutUser = handleAsynError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
})


//Forgot Password
export const requestPasswordReset = handleAsynError(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new HandleError("User not found with this email", 404));
    }
    let resetToken;
    try {
        resetToken = user.generatePasswordResetToken();
        await user.save({ validateBeforeSave: false });
    } catch (error) {
        return next(new HandleError("Could not save reset token,try again later", 500));
    }
    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/reset/${resetToken}`;
    const message = `Your password reset token is as follow:\n\n${resetPasswordUrl}\n\nIf you have not requested this email, then ignore it.`;
    try {
        await sendEmail({
            email: user.email,
            subject: `Password reset request`,
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new HandleError("Email could not be sent, Please try again later", 500));
    }
})

//Reset Password
export const resetPassword = handleAsynError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        return next(new HandleError("Invalid or expired token", 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new HandleError("Passwords do not match", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
})

//Get User Details
export const getUserDetails = handleAsynError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
})

//Update User Password
export const updateUserPassword = handleAsynError(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword} = req.body;
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(oldPassword);
    if (!isPasswordMatched) {
        return next(new HandleError("Old password is incorrect", 400));
    }
    if (newPassword !== confirmPassword) {
        return next(new HandleError("Passwords do not match", 400));
    }
    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);
})

//Update User Profile
export const updateUserProfile = handleAsynError(async (req, res, next) => {
    const {name, email,avatar} = req.body;
    const newUserData = {
        name,
        email,
    };
    if(avatar!==""){
        const user= await User.findById(req.user.id);
        const imageId = user.avatar.public_id
        await cloudinary.uploader.destroy(imageId)
        const myCloud = await cloudinary.uploader.upload(avatar,{
            folder:"avatars",
            width:150,
            crop:'scale'
        })
     newUserData = {
        public_id : myCloud.public_id,
        url : myCloud.secure_url,
     }

    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
    });
})


//getting admin info
export const getUserLiist = handleAsynError(async (req, res, next) => {  
    const users = await User.find();
    if (!users) {
        return next(new HandleError("Users not found", 404));
    }   
    res.status(200).json({
        success: true,
        users,
    });
})

// admin get single user details

export const getSingleUser = handleAsynError(async (req, res, next) => {  
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new HandleError("User not found", 404));
    }
    res.status(200).json({
        success: true,
        user,
    });
})


//Admin update user role

export const updateUserRole = handleAsynError(async (req, res, next) => {  
    const { role } = req.body;
    const newUserData = {
        role,
    };
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        return next(new HandleError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "User role updated successfully",
        user,
    });
})

//Admin delete user

export const deleteUser = handleAsynError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new HandleError("User not found", 404));
    }
    await user.remove();
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
})