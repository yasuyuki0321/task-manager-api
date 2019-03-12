const mongoose = require('mongoose')
const validater = require('validator')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validater.isEmail(value)) {
          throw new Error('Email is invalid.')
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Do not use "password" as a password.')
        }
      }
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error('Age must be a positive number')
        }
      }
    },
    tokens: [
      {
        token: {
          type: String,
          require: true
        }
      }
    ],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
)

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Unable to login.')
  }
  const isMatch = await bycrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login.')
  }

  return user
}

userSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

// hash the plane text password before saving
userSchema.pre('save', async function(next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bycrypt.hash(user.password, 8)
  }

  next()
})

// delete user tasks when user removed
userSchema.pre('remove', async function(next) {
  const user = this
  await Task.deleteMany({ owner: user.id })
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
