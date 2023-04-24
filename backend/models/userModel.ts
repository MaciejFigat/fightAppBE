import { model, Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface UserDocument extends Document {
  name: string
  email: string
  password: string
  isAdmin?: boolean
  matchPassword: (password: string) => Promise<boolean>
  resetPasswordToken?: string | number
  resetPasswordExpires?: string | number | any
  status: 'Pending' | 'Active'
  confirmationCode: string | number | any
  coinsAvailable: number
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    },
    resetPasswordToken: {
      type: String,
      required: false
    },
    resetPasswordExpires: {
      type: Date,
      required: false
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Active'],
      default: 'Pending'
    },
    confirmationCode: {
      type: String,
      unique: true
    },
    coinsAvailable: {
      type: Number,
      required: false
    }
  },
  {
    timestamps: true
  }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = model<UserDocument>('User', userSchema)

export default User
