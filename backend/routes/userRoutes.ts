import express from 'express'
import {
  authUser,
  registerUser,
  getUsers,
  deleteUser,
  updateUser,
  getUserById,
  getUserProfile,
  updateUserProfile,
  resetUserPassword,
  forgotUserPassword,
  testReset,
  confirmUser
} from '../controllers/userController'
import { protect, admin } from '../middleware/authMiddleware'
const router = express.Router()
// registerUser - create the confirmationToken and send it to provided email
router.route('/').post(registerUser).get(protect, admin, getUsers)
// this one sends an email with resetToken
router.route('/forgotPassword').post(forgotUserPassword)
// this one logs the user in upon receiving the resetToken - inactive
router.route('/passwordReset').get(resetUserPassword)

// this is the one used to log in user with the use of resetToken
router.route('/reset').post(testReset)

// confirm by the user in the email with the token
router.route('/userconfirmation').post(confirmUser)

// router.route('/adminconfirmation/:id').put(protect, admin, confirmUserByAdmin)

router.post('/login', authUser)

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)

export default router
