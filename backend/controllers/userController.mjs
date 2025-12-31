import handleAsynError from "../middleware/handleAsynError.mjs";
import HandleError from "../utils/handleError.mjs";
import User from "../models/userModel.mjs"
import { sendToken } from "../utils/jwtToken.mjs";

export const registerUser = handleAsynError(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new HandleError("All fields are required", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new HandleError("User already exists", 409));
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "sample_id",
            url: "profilepicUrl"
        }
    });

    sendToken(user, 201, res);
});


//Login 

export const loginUser = handleAsynError(async(req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password){
        return next(new HandleError("Please enter email and password", 400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new HandleError("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new HandleError("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
})

//Logout User
export const logoutUser = handleAsynError(async(req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
})


//Reset Password
export const requestPasswordReset = handleAsynError(async(req, res, next) => {
    const{ email } = req.body;
    const user = await User.findOne({email});
    if(!user){
        return next(new HandleError("User not found with this email", 404));
    }
    let resetToken;
    try {
        resetToken = user.generatePasswordResetToken();
        await user.save({validateBeforeSave: false});
    } catch (error) {
        return next(new HandleError("Could not save reset token,try again later", 500));
    }
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    const message = `Your password reset token is as follow:\n\n${resetPasswordUrl}\n\nIf you have not requested this email, then ignore it.`;
    try {
       await sendEmail({
            email: user.email,
            subject: `E-commerce Password Recovery`,
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        }); 
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new HandleError("Email could not be sent, Please try again later", 500));
    }
})
