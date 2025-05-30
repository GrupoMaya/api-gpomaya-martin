const mongoose = require('mongoose')
const { Schema } = mongoose

/**
* tipos de pago
* @params normal string de pago mensualidad
* @params extra string de pago extra
* @params acreditado string de pago acreditado
*/

const PagosSchema = new Schema({
  isActive: {
    type: Boolean,
    default: true,
    required: false
  },
  folio: {
    type: Number
  },
  status: {
    type: Boolean,
    default: false
  },
  cliente: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clientes'
  }],
  proyecto: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'proyecto'
  }],
  lote: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lotes'
  }],
  mes: {
    type: Date,
    require: true
  },
  refPago: {
    type: String,
    require: false
  },
  mensualidad: mongoose.Decimal128,
  ctaBancaria: {
    type: String,
    require: false
  },
  banco: {
    type: String,
    require: false
  },
  tipoPago: {
    // normal, extra, acreditado
    type: String,
    require: false
  },
  fechaPago: {
    type: Date,
    require: false
  },
  refBanco: {
    type: String,
    require: true
  },
  textoObservaciones: {
    type: String,
    require: false
  },
  extraSlug: {
    type: String,
    require: false
  },
  mensajeRecibo: {
    type: String
  }

}, { timestamps: true })

const Pagos = mongoose.model('Pagos', PagosSchema)

module.exports = {
  Pagos
}
