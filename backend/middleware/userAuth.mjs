import handleAsynError from "../middleware/handleAsynError.mjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.mjs";
import HandleError from "../utils/handleError.mjs";

export const verifyUserAuth = handleAsynError(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new HandleError("Please login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
});
 
export const roleBasedAccess = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new HandleError(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }
        next();
    }
}
