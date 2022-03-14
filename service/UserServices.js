const { User } = require('../models')

module.exports = {

  create: async (payload) => new User(payload).save(),
        
  findUserByEmail: (email) => User.findOne({ email }),

  findUsers: () => User.find().select('-password'),

  findUserById: (id) => User.findById(id).select('-password'),

  findByIdAndUpdate: (id, body) => {
    User.findByIdAndUpdate(id, body, { new: true }).exec()
      .then(user => user)
      .catch(err => err)
  },
  findByIdAndDelete: (id, body) => 
    User.findByIdAndUpdate(id, body, function (err, doc) {
      if (err) throw new Error('Bad Error user')
      doc.is_Acvive = body
      doc.save()
    }).then(doc => doc)  
} 
