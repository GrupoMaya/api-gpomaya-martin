const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { Schema } = mongoose

const userSchema = new Schema({
  is_Active: {
    type: Boolean,
    default: true
  },
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String, 
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'user']
  }

}, { timestamps: true }
)

// middleWere de password

userSchema.pre('save', function (next) {   

  const SALT = 10
  const user = this

  if (!user.isModified('password')) return next()
    
  return bcrypt.hash(user.password, SALT, function (err, hash) {
    if (err) return next(err)  
    user.password = hash
    return next()
  })
})

const User = mongoose.model('Users', userSchema)

module.exports = {
  User
}
