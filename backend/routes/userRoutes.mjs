import express from 'express';
import { deleteUser, getSingleUser, getUserDetails, getUserLiist, loginUser, logoutUser, registerUser, requestPasswordReset, resetPassword, updateUserPassword, updateUserProfile, updateUserRole } from '../controllers/userController.mjs';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.mjs';
const router = express.Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(logoutUser)
router.route("/password/forgot").post(requestPasswordReset)
router.route("reset/:token").post(resetPassword)
router.route("/profile").get(verifyUserAuth,getUserDetails)
router.route("/password/update").put(verifyUserAuth,updateUserPassword)
router.route("/profile/update").put(verifyUserAuth,updateUserProfile)
router.route("/admin/users").get(verifyUserAuth,roleBasedAccess("admin"),getUserLiist)
router.route("/admin/user/:id")
.get(verifyUserAuth,roleBasedAccess("admin"),getSingleUser)
.put(verifyUserAuth,roleBasedAccess("admin"),updateUserRole)
.delete(verifyUserAuth,roleBasedAccess("admin"),deleteUser)

export default router;