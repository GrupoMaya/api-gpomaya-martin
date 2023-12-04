const MayaServices = require('../service/MayaServices_v2')

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
  }

}
