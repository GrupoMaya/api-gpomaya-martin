const mongoose = require('mongoose')
const { Schema } = mongoose

const SettingsSchema = new Schema({
  razonSocial: {
    type: String,
    required: false
  },
  rfc: {
    type: String,
    required: true,
    unique: true
  },
  direccion: {
    type: String,
    requires: true
  },
  ciudad: {
    type: String,
    required: false
  },
  representante: {
    type: String,
    required: false
  },
  slug: {
    enum: ['xavier', 'martin'],
    type: String  
  }

}, { timestamps: true })

const Settings = mongoose.model('Settings', SettingsSchema)

module.exports = {
  Settings
}
