// const { Proyecto, Clientes, Lotes, Pagos } = require('../models')
const mongoose = require('mongoose')
const {
  Lotes,
  Pagos,
  Documents,
  Proyecto,
  Clientes,
  PagosRecords
} = require('../models')
const { tiposPago, getDecimalValue } = require('../util/constants')
const XLSX = require('xlsx')
const { Types } = mongoose

module.exports = {
  getAllLotesByProyectId: async (idProyecto) => {
    const agg = [
      {
        $match: {
          proyecto: Types.Types.ObjectId(idProyecto)
        }
      },
      {
        $match: {
          isActive: true
        }
      },
      {
        $lookup: {
          from: 'proyectos',
          localField: 'proyecto',
          foreignField: '_id',
          as: 'proyecto'
        }
      },
      {
        $unwind: {
          path: '$proyecto'
        }
      },
      {
        $lookup: {
          from: 'clientes',
          localField: 'cliente',
          foreignField: '_id',
          as: 'cliente'
        }
      },
      {
        $unwind: {
          path: '$cliente'
        }
      }
    ]

    const lotes = await Lotes.aggregate(agg)
    const title = lotes[0].proyecto.title

    return {
      title,
      lotes: [...lotes]
    }
  },
  getPagosByProject: async ({ idcliente }, { idProject }) => {
    const agg = [
      {
        $match: {
          proyecto: Types.ObjectId(idProject)
        }
      },
      {
        $match: {
          cliente: Types.ObjectId(idcliente)
        }
      },
      {
        $lookup: {
          from: 'clientes',
          localField: 'cliente',
          foreignField: '_id',
          as: 'client'
        }
      },
      {
        $unwind: {
          path: '$client'
        }
      },
      {
        $lookup: {
          from: 'proyectos',
          localField: 'proyecto',
          foreignField: '_id',
          as: 'project'
        }
      },
      {
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
        lote: Types.ObjectId(lote.toString()),
        cliente: Types.ObjectId(cliente.toString()),
        tipoDocumento: tipoPago
      }

      if (fixConsecutive) {
        await Documents.findOneAndUpdate({ ...filter }, { folio }).exec()
      }

      await Pagos.findByIdAndUpdate(idPago, { folio }).exec()
      return pago
    } catch (error) {
      return error
    }
  },
  getClientDetails: async (idClient, idProject) => {
    const agg = [
      {
        $match: {
          proyecto: Types.ObjectId(idProject),
          cliente: Types.ObjectId(idClient)
        }
      },
      {
        $lookup: {
          from: 'clientes',
          localField: 'cliente',
          foreignField: '_id',
          as: 'client'
        }
      },
      {
        $unwind: {
          path: '$client'
        }
      },
      {
        $lookup: {
          from: 'proyectos',
          localField: 'proyecto',
          foreignField: '_id',
          as: 'project'
        }
      },
      {
        $unwind: {
          path: '$project'
        }
      }
    ]

    const dataLote = await Lotes.aggregate(agg)
    const pagos = await Pagos.aggregate(agg)
    const pagosByType = tiposPago.map((tipo) => {
      return {
        [tipo]: pagos.filter((pago) => pago.tipoPago === tipo)
      }
    })

    const sumatoria = {
      extras: pagosByType
        .filter((f) => f.extra)[0]
        .extra.reduce((acc, pago) => acc + parseInt(getDecimalValue(pago)), 0),
      mensualidades: pagosByType
        .filter((f) => f.mensualidad)[0]
        .mensualidad.reduce(
          (acc, pago) => acc + parseInt(getDecimalValue(pago)),
          0
        ),
      enganche: pagosByType
        .find((f) => f.saldoinicial)
        .saldoinicial.reduce(
          (acc, pago) => acc + parseInt(getDecimalValue(pago)),
          0
        ),
      acreditados: pagosByType
        .find((f) => f.acreditado)
        .acreditado.reduce(
          (acc, pago) => acc + parseInt(getDecimalValue(pago)),
          0
        )
    }

    sumatoria.acapital =
      sumatoria.mensualidades + sumatoria.enganche + sumatoria.acreditados

    const dataToXML = {
      client: pagos[0].client,
      project: pagos[0].project,
      lote: dataLote[0],
      sumatoria
    }

    const pagosArrayMensualidades = pagosByType
      .filter((f) => f.mensualidad)[0]
      .mensualidad.map((p) => {
        return {
          fecha: p.mes,
          folio: p.folio,
          mensualidad: getDecimalValue(p),
          refPago: p.refPago,
          refBanco: p.refBanco,
          ctaBancaria: p.ctaBancaria,
          banco: p.banco
        }
      })

    const pagosArrayAcreditados = pagosByType
      .filter((f) => f.acreditado)[0]
      .acreditado.map((p) => {
        return {
          fecha: p.mes,
          mensualidad: getDecimalValue(p),
          refPago: p.refPago,
          folio: p.folio,
          refBanco: p.refBanco,
          ctaBancaria: p.ctaBancaria,
          banco: p.banco
        }
      })

    const pagosArrayExtra = pagosByType
      .filter((f) => f.extra)[0]
      .extra.map((p) => {
        return {
          fecha: p.mes,
          mensualidad: getDecimalValue(p),
          refPago: p.refPago,
          folio: p.folio,
          refBanco: p.refBanco,
          ctaBancaria: p.ctaBancaria,
          banco: p.banco
        }
      })

    const pagosArraySaldosIniciales = pagosByType
      .filter((f) => f.saldoinicial)[0]
      .saldoinicial.map((p) => {
        return {
          fecha: p.mes,
          mensualidad: getDecimalValue(p),
          refPago: p.refPago,
          folio: p.folio,
          refBanco: p.refBanco,
          ctaBancaria: p.ctaBancaria,
          banco: p.banco
        }
      })

    const workbook = XLSX.utils.book_new()
    const mensualidesShett = XLSX.utils.json_to_sheet(pagosArrayMensualidades)
    const acreditadosShett = XLSX.utils.json_to_sheet(pagosArrayAcreditados)
    const extraShett = XLSX.utils.json_to_sheet(pagosArrayExtra)
    const saldosInicialesShett = XLSX.utils.json_to_sheet(
      pagosArraySaldosIniciales
    )
    const clientSheet = XLSX.utils.json_to_sheet([dataToXML.client])
    const projectSheet = XLSX.utils.json_to_sheet([dataToXML.project])
    const loteSheet = XLSX.utils.json_to_sheet([dataToXML.lote])
    const resumenPagos = XLSX.utils.json_to_sheet([dataToXML.sumatoria])

    XLSX.utils.book_append_sheet(workbook, mensualidesShett, 'Mensualidades')
    XLSX.utils.book_append_sheet(workbook, acreditadosShett, 'Acreditados')
    XLSX.utils.book_append_sheet(workbook, extraShett, 'Extra')
    XLSX.utils.book_append_sheet(
      workbook,
      saldosInicialesShett,
      'Saldos Iniciales'
    )
    XLSX.utils.book_append_sheet(workbook, clientSheet, 'Cliente')
    XLSX.utils.book_append_sheet(workbook, projectSheet, 'Proyecto')
    XLSX.utils.book_append_sheet(workbook, loteSheet, 'Lote')
    XLSX.utils.book_append_sheet(workbook, resumenPagos, 'Resumen Pagos')

    return {
      workbook
    }
  },

  getPagosByProjectAndClient: async (idProject, idClient) => {
    const agg = [
      {
        $match: {
          proyecto: Types.ObjectId(idProject),
          cliente: Types.ObjectId(idClient)
        }
      },
      {
        $lookup: {
          from: 'clientes',
          localField: 'cliente',
          foreignField: '_id',
          as: 'cliente'
        }
      },
      {
        $unwind: {
          path: '$cliente'
        }
      },
      {
        $lookup: {
          from: 'lotes',
          localField: 'lote',
          foreignField: '_id',
          as: 'lote'
        }
      },
      {
        $unwind: {
          path: '$lote'
        }
      }
    ]

    const agglote = [
      {
        $match: {
          proyecto: Types.ObjectId(idProject),
          cliente: Types.ObjectId(idClient)
        }
      }
    ]

    const pagos = await Pagos.aggregate(agg)
    const project = await Proyecto.findById(idProject)
    const lotes = await Lotes.aggregate(agglote)

    return {
      cliente: pagos[0].cliente,
      lote: lotes[0],
      project: project,
      pagos: [...pagos]
    }
  },

  findCliente: async (query) => {
    const agg = [
      {
        $match: {
          $or: [{ nombre: { $regex: query, $options: 'i' } }]
        }
      }
    ]

    const clientes = await Clientes.aggregate(agg)
    return clientes
  },

  getLoteByClient: async (idClient) => {
    const agg = [
      {
        $match: {
          cliente: Types.ObjectId(idClient)
        }
      },
      {
        $lookup: {
          from: 'proyectos',
          localField: 'proyecto',
          foreignField: '_id',
          as: 'proyecto'
        }
      },
      {
        $unwind: {
          path: '$proyecto'
        }
      },
      {
        $lookup: {
          from: 'clientes',
          localField: 'cliente',
          foreignField: '_id',
          as: 'cliente'
        }
      },
      {
        $unwind: {
          path: '$cliente'
        }
      }
    ]

    const lotes = await Lotes.aggregate(agg)
    return {
      lotes: [...lotes]
    }
  },
  findOneClientByProject: async ({ clientName }) => {
    const filter = {
      nombre: { $regex: clientName, $options: 'i' }
    }

    const client = await Clientes.find(filter)
    const filtered = client.filter((c) => {
      const nmongo = c.nombre.toLowerCase().replace(/\s/g, '')
      const nclient = clientName.toLowerCase().replace(/\s/g, '')
      return nmongo === nclient
    })
    return {
      filtered
    }
  },

  getAllPagosRecords: async () => {
    return await PagosRecords.find()
  }
}
