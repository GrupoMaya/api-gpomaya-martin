const mongoose = require('mongoose')
const { Schema } = mongoose

// Definición de esquemas para subdocumentos
const PagosExtraSchema = new Schema({
  id_pago_: String,
  tipo: String,
  extraSlug: String,
  mensualidad: Number
})

const ClienteDataSchema = new Schema({
  _id: Schema.Types.ObjectId,
  isActive: Boolean,
  lotes: [String],
  pagos: [String],
  nombre: String,
  phone: String,
  address: String,
  email: String,
  createdAt: Date,
  updatedAt: Date,
  __v: Number
})

const ProyectoDataSchema = new Schema({
  _id: Schema.Types.ObjectId,
  isActive: Boolean,
  lotes: [String],
  title: String,
  address: String,
  createdAt: Date,
  updatedAt: Date,
  __v: Number
})

const LoteDataSchema = new Schema({
  _id: Schema.Types.ObjectId,
  isActive: Boolean,
  proyecto: [Schema.Types.ObjectId],
  cliente: [Schema.Types.ObjectId],
  lote: String,
  manzana: String,
  precioTotal: Number,
  enganche: Number,
  financiamiento: Number,
  plazo: Number,
  mensualidad: Number,
  inicioContrato: Date,
  __v: Number
})

// Esquema principal
const TransaccionSchema = new Schema(
  {
    _id: {
      cliente: Schema.Types.ObjectId,
      lote: [Schema.Types.ObjectId]
    },
    totalMensualidad: Number,
    pagosExtra: [PagosExtraSchema],
    pagosMoratorios: Number,
    numeroDePagos: Number,
    cliente_data: ClienteDataSchema,
    proyecto_data: ProyectoDataSchema,
    lote_data: LoteDataSchema,
    isPaid: Boolean
  },
  { timestamps: true }
)

// Modelo
const Transaccion = mongoose.model('Transaccion', TransaccionSchema)

module.exports = {
  PagosRecords: Transaccion
}
