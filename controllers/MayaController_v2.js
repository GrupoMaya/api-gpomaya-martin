const MayaServices = require('../service/MayaServices_v2')
const XLSX = require('xlsx')
const fs = require('fs')

module.exports = {
  getAllLotesByProyectId: async (req, res) => {
    const { idProyecto } = req.params

    try {
      const payload = await MayaServices.getAllLotesByProyectId(idProyecto)      
      if (!payload) throw new Error(`No se encontraron registos con el id ${idProyecto}`)
      return res.status(200).json({ message: payload })

    } catch (error) {
      return res.status(400).json({ error: JSON.stringify(error) })
    }
  },

  getPagosByProject: async (req, res) => {
    const { query, params } = req

    try {
      const payload = await MayaServices.getPagosByProject(query, params)
      if (!payload) throw new Error(`No se encontraron registos con el id ${query.idProject}`)
      return res.status(200).json({ message: payload })

    } catch (error) {      
      return res.status(400).json({ error: JSON.stringify(error) })
    }
  },

  updateFolioPagoById: async (req, res) => {
    const { idPago } = req.params
    const { folio, fixConsecutive } = req.body

    try {
      const payload = await MayaServices.updateFolioPagoById(idPago, folio, fixConsecutive)
      if (!payload) throw new Error(`No se encontraron registos con el id ${idPago}`)
      return res.status(200).json({ message: payload })

    } catch (error) {      
      return res.status(400).json({ error: JSON.stringify(error) })
    }
  },

  getClientDetails: async (req, res) => {
    const { idClient, idProject } = req.params
    console.log({ idClient, idProject })
    try {
      const payload = await MayaServices.getClientDetails(idClient, idProject)      
      if (!payload) throw new Error(`No se encontraron registos con el id ${idClient}`)
      const filePath = 'Pagos.xlsx';
      XLSX.writeFile(payload.workbook, filePath, { type: 'buffer' })
      
      const fileStream = fs.createReadStream(filePath)
      fileStream.pipe(res)      
      
    } catch (error) {            
      return res.status(400).json({ error: JSON.stringify(error) })
    }
  },

  getPagosByProjectAndClient: async (req, res) => {
    const { idProject, idClient } = req.params

    try {
      const payload = await MayaServices.getPagosByProjectAndClient(idProject, idClient)
      if (!payload) throw new Error(`No se encontraron registos con el id ${idProject}`)
      return res.status(200).json({ message: payload })

    } catch (error) {      
      return res.status(400).json({ error: JSON.stringify(error) })
    }
  },

  findClient: async (req, res) => {
    const { query } = req    
    try {
      const payload = await MayaServices.findCliente(query.query)
      if (!payload) throw new Error(`No se encontraron registos con el id ${query.query}`)
      return res.status(200).json({ message: payload })

    } catch (error) {
      return res.status(400).json({ error: JSON.stringify(error) })
    }
  },

  getLoteByClient: async (req, res) => {
    const { idClient } = req.params
    try {
      const payload = await MayaServices.getLoteByClient(idClient)
      if (!payload) throw new Error(`No se encontraron registos con el id ${idClient}`)
      return res.status(200).json({ message: payload })

    } catch (error) {
      return res.status(400).json({ error: JSON.stringify(error) })
    }
  }

}
