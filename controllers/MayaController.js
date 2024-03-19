const puppeteer = require('puppeteer')
const { MayaService } = require('../service')

module.exports = {
  login: () => {},
  register: () => {},
  addProyecto: async (req, res) => {
    const { body } = req    
    try {

      const proyectoExist = await MayaService.getProyectoByName(body?.title)
      if (Object.values(proyectoExist).length > 0) throw new Error('Ya existe el documento')

      const payload = await MayaService.addProyecto(body)
      if (payload) {
        return res.status(200).json({ message: payload })
      }

    } catch (error) {      
      return res.status(400).json({ error })
    }
  },
  getAllProyectos: async (req, res) => {
    try {
      const payload = await MayaService.getAllProyectos()
      if (!payload) throw new Error('Error al leer los datos de la base de datos')

      return res.status(200).json({ message: payload })

    } catch (error) {
      return res.status(400).json({ error })
    }
  },
  getProyectoById: async (req, res) => {
    const { id } = req.params
    try {
      const payload = await MayaService.getProyectoById(id)
      if (!payload) throw new Error('Id invalido')      
      
      return res.status(200).json({ message: payload })

    } catch (error) {    
      return res.status(400).json({ error })
    }
  },
  addCliente: async (req, res) => {
    const { body } = req  
    try {

      // buscamos si existe el documento
      const isExsit = await MayaService.findMailCliente(body.email)
      if (isExsit !== null) throw new Error('El usuario ya existe')

      const payload = await MayaService.createCLient(body)
      return res.status(200).json({ message: payload })

    } catch (error) {
      return res.status(400).json({ error: JSON.stringify(error) })
    }
  },
  assignLoteToNewUser: async (req, res) => {
    // este metodo se ocupa para guardar el nuevo cliente a un nuevo lote
    const { body, params } = req

    try {
      // buscamos si existe el documento
      const isExsit = await MayaService.findMailCliente(body)      
      if (isExsit !== null) throw new Error('El usuario ya existe')
 
      // creamos el usuario y lote
      const payload = await MayaService.assignLoteToNewUser(body, params)      
      if (!payload) throw new Error('Error en la asignacion del documento')

      return res.status(200).json({ message: payload })

    } catch (error) {
      return res.status(400).json({ error: JSON.stringify(error) })
    }

  },
  assignLote: async (req, res) => {
    const { body, params } = req   

    try {
      const mutate = await MayaService.assignLote(body, params)
      if (!mutate) throw new Error('Error en la asignacion de lote')

      return res.status(200).json({ message: mutate })

    } catch (error) {
      return res.status(400).json({ message: error })
    }

  },
  getAllClientes: async (req, res) => {
    try {
      const allClientes = await MayaService.getAllClientes()
      if (!allClientes) throw new Error('Error al leer los datos de la base de datos')
      return res.status(200).json({ message: allClientes })
    } catch (error) {
      return res.status(400).json({ error })
    }
  },
  getClienteById: async (req, res) => {

    try {
      const query = await MayaService.getClienteById(req.params.id)
      if (!query) throw new Error('No hay datos con el id')

      return res.status(200).json({ message: query })

    } catch (error) {
      return res.status(400).json({ error })
    }
  },
  getAllLotesByProyectId: async (req, res) => {
    const { idProyecto } = req.params

    try {

      const payload = await MayaService.getAllLotesByProyectId(idProyecto)
      if (!payload) throw new Error(`No se encontraron registos con el id ${idProyecto}`)
      return res.status(200).json({ message: payload.flat() })

    } catch (error) {
      return res.status(400).json({ error: JSON.stringify(error) })
    }

  },
  findCliente: async ({ query }, res) => {

    try {
      const payload = await MayaService.findCliente(query)
      if (!payload) throw new Error('No hay información con el parametro de busqueda')

      return res.status(200).json({ message: payload })

    } catch (error) {
      return res.status(400).json({ message: error })
    }
  },
  findMailCliente: async ({ query }, res) => {

    try {
      const payload = await MayaService.findMailCliente(query)
      if (!payload) throw new Error('No hay información con el parametro de busqueda')

      return res.status(200).json({ message: payload })

    } catch (error) {
      return res.status(400).json({ message: error })
    }

  },
  lotesByIdCliente: async (req, res) => {

    const { id } = req.params

    try {
      const payload = await MayaService.lotesByIdCliente(id)
      if (!payload) throw new Error('No hay lotes para el id del usuario')

      return res.status(200).json({ message: payload }) 

    } catch (error) {
      return res.status(400).json({ message: error })
    }

  },
  addPagoToLote: async ({ body }, res) => {  
    try {
      const mutation = await MayaService.consecutivoMensualidad(body)
      return res.status(200).json({ message: mutation })

    } catch (error) {
      return res.status(400).json({ message: error })
    }
  },
  getPagosByClienteAndProject: async (req, res) => {

    const { clienteId } = req.params

    try {
      const payload = await MayaService.getPagosByClienteAndProject(clienteId)
      if (!payload) throw new Error('No hay datos para tu busqueda')

      return res.status(200).json({ message: payload })

    } catch (error) {
      return res.status(400).json({ message: error })
    }
  },
  getPagosByProject: async (req, res) => {
    const { query, params } = req

    try {
      const getPagos = await MayaService.getPagosByProject(query, params)
      if (getPagos.lenth === 0) throw new Error('No hay pagos con la infomacion proporcionada')

      return res.status(200).json({ message: getPagos })
    } catch (error) { 
      return res.status(400).json({ error })
    }
  },
  infoToInvoiceById: async ({ params }, res) => {

    try {
      const payload = await MayaService.infoToInvoiceById(params)
      if (!payload) throw new Error('No hay datos con ese id')

      return res.status(200).json({ message: payload })

    } catch (error) {
      return res.status(200).json({ message: error })
    }
  },
  statusPaymentByLoteId: async ({ params }, res) => {

    try {
      const payload = await MayaService.statusPaymentByLoteId(params)
      if (!payload) throw new Error('No hay datos con ese id')

      return res.status(200).json({ message: payload })

    } catch (error) {
      return res.status(200).json({ message: error })
    }
  },
  PagarNota: async ({ params, body }, res) => {
    
    try {
      const payload = await MayaService.PagarNota(params, body)
      if (!payload) throw new Error('No hay datos con ese id')

      return res.status(200).json({ message: payload })

    } catch (error) {
      return res.status(200).json({ message: error })
    }
  },
  createInvoice: async (req, res) => {   
    
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      headless: true
    })

    const page = await browser.newPage()    
    try {

      const getSettings = await MayaService.settingsGetData()
      const getPDFdata = await MayaService.createInvoice(req.body, req.query, getSettings)      
      await page.setContent(getPDFdata)

      const pdf = await page.pdf({
        format: 'letter',
        printBackground: true,
        scale: 0.8,
        margin: {
          left: '0px',
          top: '0px',
          right: '0px',
          bottom: '0px'
        }
      })

      await browser.close()
      res.contentType('application/pdf')

      return res.send(pdf)
      
    } catch (error) {
      console.log({ error })
      return res.status(400).json({})
    }
  },
  findUser: async (req, res) => {
    const { user } = req.query
    try {

      const getUsers = await MayaService.findUser(user)
      if (!getUsers.length > 0) throw new Error('No hay usuarios relacionados con tu busqueda')

      return res.status(200).json({ message: getUsers })
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  },
  settingsAppSave: async ({ body }, res) => {
    
    try {
      const mutation = await MayaService.settingsAppSave(body)
      if (!mutation) throw new Error('No se puedo guardar tu registro')

      return res.status(200).json({ message: mutation })
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  },
  settingsGetData: async ({ body }, res) => {
    
    try {
      const query = await MayaService.settingsGetData(body)
      if (query.length === 0) throw new Error('Error servidor')

      return res.status(200).json({ message: query })
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  },
  settingsAppPatch: async ({ body }, res) => {
    
    try {
      const query = await MayaService.settingsAppPatch(body)
      if (query.length === 0) throw new Error('Error servidor')

      return res.status(200).json({ message: query })
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  },
  getClienteDetailById: async ({ params }, res) => {

    const { id } = params
    
    try {
      const dataInfo = await MayaService.getClienteDetailById(id)
      return res.status(200).json({ message: dataInfo })

    } catch (error) {
      return res.status(400).json({ message: error })
    }
  },
  loteById: async ({ params }, res) => {
    const { id } = params

    try {
      const loteInfo = await MayaService.loteById(id)
      return res.status(200).json({ message: loteInfo })
    } catch (error) {
      return res.status(400).json({ message: error })      
    }

  },
  updateLoteById: async ({ params, body }, res) => {
    const { id } = params
    try {
      const loteInfo = await MayaService.updateLoteById(id, body)
      return res.status(200).json({ message: loteInfo })
    } catch (error) {
      return res.status(400).json({ message: error })      
    }

  },
  getPagosById: async ({ params }, res) => {
    const { id } = params   

    try {
      const loteInfo = await MayaService.getPagosById(id)
      return res.status(200).json({ message: loteInfo })
    } catch (error) {
      return res.status(400).json({ message: error })      
    }

  },
  updatePagoById: async (req, res) => {
    const { id } = req.params    
    try {
      const loteInfo = await MayaService.updatePagoById(id, req.body)
      return res.status(200).json({ message: loteInfo })
    } catch (error) {
      return res.status(400).json({ message: error })      
    }

  },
  getNamesById: async ({ params }, res) => {
    const { id, documentType } = params

    try {
      const infoValues = await MayaService.getNamesById(id, documentType)
      if (!infoValues) throw new Error('No hay datos con ese id')

      return res.status(200).json({ message: infoValues })

    } catch (error) {
      return res.status(400).json({ message: error })
    }
  },
  masiveUpdateCliente: async ({ body }, res) => {
    try {
      const response = await MayaService.masiveUpdateCliente(body)
      if (!response) throw new Error('No se puedo actualizar')

      return res.status(200).json({ message: response })
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  },
  modifyCliente: async (req, res) => {
    const { id } = req.params
    
    try {
      const response = await MayaService.modifyCliente(id, req.body)
      if (!response) throw new Error('No se puedo actualizar')

      return res.status(200).json({ message: response })
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  },
  getMorosos: async (req, res) => {
    try {
      const allMorososo = await MayaService.getMorosos()
      if (!allMorososo) throw new Error('on morososo finder')

      return res.status(200).json({ message: allMorososo })
    } catch (error) {
      return res.status(400).json({ error: 'Error get morosos' })
    }
  },
  getLotesByProject: async (req, res) => {
    try {
      const { id } = req.params
      const allLotes = await MayaService.getLotesByProject(id)
      if (!allLotes) throw new Error('on lotes finder')

      return res.status(200).json({ message: allLotes })
    } catch (error) {
      return res.status(400).json({ error: 'Error get lotes' })
    }
  }, 
  updateProyectoById: async (req, res) => {
    const { id } = req.params
    
    try {
      const response = await MayaService.updateProyectoById(id, req.body)
      if (!response) throw new Error('No se puedo actualizar')

      return res.status(200).json({ message: response })
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  },
  searchRefPagos: async (req, res) => {
    const { ref } = req.query
    try {
      const response = await MayaService.searchRefPagos(ref)
      if (!response) throw new Error('No se puedo actualizar')

      return res.status(200).json({ message: response })
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  }
    
}
