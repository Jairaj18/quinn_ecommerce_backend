import express from 'express';
import {createUser,loginUser,getAllUser,getaUser, deleteUser, updateUser, unblockUser, blockUser, handleRefreshToken, logout, updatePassword, forgetPasswordToken, resetPassword} from '../controllers/user.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register', createUser);
router.post('/forgot-password-token', forgetPasswordToken)
router.post('/resetPassword/:token', resetPassword)
router.put('/updatePassword', authMiddleware, updatePassword)
router.post('/login', loginUser);
router.get('/allusers',getAllUser);
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout);

router.get('/getUserById/:id',authMiddleware,isAdmin,getaUser);
router.delete('/deleteUserById/:id',authMiddleware, deleteUser);
router.put('/updateUserById/:id',authMiddleware,updateUser);
router.put('/block-user/:id', authMiddleware,isAdmin,blockUser);
router.put('/unblock-user/:id', authMiddleware,isAdmin,unblockUser );

export default router;
