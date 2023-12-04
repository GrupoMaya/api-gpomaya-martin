// const { Proyecto, Clientes, Lotes, Pagos } = require('../models')
const { Lotes, Pagos, Documents } = require('../models')
const { ObjectId } = require('mongodb')

module.exports = {
  getAllLotesByProyectId: async (idProyecto) => {
    const agg = [
      {
        $match: {
          proyecto: ObjectId(idProyecto)
        }
      }, {
        $lookup: {
          from: 'proyectos', 
          localField: 'proyecto', 
          foreignField: '_id', 
          as: 'proyectoData'
        }
      }, {
        $unwind: {
          path: '$proyectoData'
        }
      }, {
        $lookup: {
          from: 'clientes', 
          localField: 'cliente', 
          foreignField: '_id', 
          as: 'clienteData'
        }
      }, {
        $unwind: {
          path: '$clienteData'
        }
      }
    ]

    const lotes = await Lotes.aggregate(agg)
    const title = lotes[0].proyectoData.title    
    
    return {
      title,
      lotes: [...lotes]
    }
    
  },
  getPagosByProject: async ({ idcliente }, { idProject }) => {
    const agg = 
      [
        {
          $match: {
            proyecto: ObjectId(idProject)
          }
        }, {
          $match: {
            cliente: ObjectId(idcliente)
          }
        }, {
          $lookup: {
            from: 'clientes', 
            localField: 'cliente', 
            foreignField: '_id', 
            as: 'client'
          }
        }, {
          $unwind: {
            path: '$client'
          }
        }, {
          $lookup: {
            from: 'proyectos', 
            localField: 'proyecto', 
            foreignField: '_id', 
            as: 'project'
          }
        }, {
          $unwind: {
            path: '$project'
          }
        }
      ]      

    const pagos = await Pagos.aggregate(agg)
    return {
      pagos: [...pagos],
      client: pagos[0].client,
      project: pagos[0].project
    }
  },
  updateFolioPagoById: async (idPago, folio, fixConsecutive) => {    
  try {
    // get pago by id
    const pago = await Pagos.findById(idPago)
    const { lote, cliente, tipoPago } = pago
    
    const filter = {
      lote: ObjectId(lote.toString()),
      cliente: ObjectId(cliente.toString()),
      tipoDocumento: tipoPago
    }    

    if (fixConsecutive) {
      await Documents.findOneAndUpdate({...filter}, { folio }).exec()
    }

    await Pagos.findByIdAndUpdate(idPago, { folio }).exec()
    return pago
   } catch (error) {      
      return error
   }
  }
}
