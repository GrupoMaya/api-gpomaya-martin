const mongoose = require('mongoose')
const { Schema } = mongoose

const DocumentsSchema = new Schema({
  cliente: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'clientes'
    }
  ],
  lote: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'lotes'
    }
  ],
  proyecto: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'proyectos'
    }
  ],
  tipoDocumento: {
    type: String,
    required: false
  },
  folio: {
    type: Number,
    default: 1
  }, 
    log: {
      type: String,
      required: false
  },

}, { timestamps: true })

const Documents = mongoose.model('Documents', DocumentsSchema)

module.exports = {
  Documents
}
