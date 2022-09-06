const { Proyecto, Clientes, Lotes, Pagos, Settings, Documents } = require('../models')
const mongoose = require('mongoose')
const { NumerosaLetras, dateIntlRef, monyIntlRef } = require('../util/numerosLetas')

module.exports = {
  addProyecto: async (payload) => {
    return new Proyecto(payload).save()
  },
  getAllClientes: async () => Clientes.aggregate().match({}).project({ nombre: 1 }),
  // 
  getAllProyectos: async () => {

    const agg = [
      {
        $match: {
          isActive: true
        }
      }, {
        $lookup: {
          from: 'lotes', 
          localField: '_id', 
          foreignField: 'proyecto',
          pipeline: [
            {
              $match: { isActive: true }
            },
            {
              $lookup: {
                from: 'clientes', 
                localField: 'cliente', 
                foreignField: '_id',          
                as: 'clienteData'         
              }
            },
            {
              $unwind: '$clienteData'
            },
            {
              $project: {
                clienteData: 1
              }
            }
          ],
          as: 'activos'
        }
      }
    ]
    
    const query = new Promise((resolve) => {
      resolve(
        Proyecto.aggregate(agg)
      )
    }).then(res => res)
  
    return await query
    
  },
  // 
  getProyectoById: async (id) => {
    // mongodb  skip paginate function 
        
    const agg = [
      {
        $match: {
          proyecto: mongoose.Types.ObjectId(id),
          isActive: true
        }
      }, {
        $lookup: {
          from: 'clientes', 
          localField: 'cliente', 
          foreignField: '_id',          
          as: 'clienteData'
        }
      }, {
        $sort: {
          lote: 1
        }
      }
    ]

    const query = new Promise((resolve) => {
      resolve(
        Lotes.aggregate(agg)
      )
    }).then(res => res)

    const resultQuery = await Promise.all([query])
      .then(res => {
        return res[0].filter(item => item.clienteData.length > 0)
      })
    return resultQuery
  },
  // 
  getProyectoByName: (name) => {
    const proyectos = Proyecto.find({ title: name })
    return proyectos
  },
  // 
  createCLient: async (payload) => {
    return new Clientes(payload).save()
  },
  // añadir lote a nuevo usuario y se crean los documentos para llevar control de los consecutivos
  assignLoteToNewUser: async (payload, params) => {
    const { idProyecto } = params

    const dataUser = {
      nombre: payload.nombre,
      phone: payload.phone,
      address: payload.address,
      email: payload.email
    }

    const saveLote = async (idCliente) => {
      const datalote = {
        proyecto: idProyecto,
        cliente: idCliente,
        lote: payload.lote,
        manzana: payload.manzana,
        precioTotal: payload.precioTotal,
        enganche: payload.enganche,
        financiamiento: payload.financiamiento,
        plazo: payload.plazo,
        mensualidad: payload.mensualidad,
        inicioContrato: payload.inicioContrato
      }

      const res = await new Promise((resolve) => {
        resolve(new Lotes(datalote).save())
      })
      return res
    }

    const dataUserPromise = new Promise((resolve) => {
      resolve(new Clientes(dataUser).save())
    })
      .then((res) => {
        return saveLote(res._id)
      })
      .then(res => res)

    // creamos los folios de documentos
    const docMensualidad = async (payload) => {
      const mutation = await new Promise((resolve) => {
        resolve(
          Documents({ 
            cliente: payload.cliente.toString(),
            proyecto: payload.proyecto.toString(),
            lote: payload._id,
            tipoDocumento: 'mensualidad'
          }).save()
        )
      })
        .then(res => res)

      return mutation
    }

    const docSaldoInicial = async (payload) => {
      const mutation = await new Promise((resolve) => {
        resolve(
          Documents({ 
            cliente: payload.cliente.toString(),
            proyecto: payload.proyecto.toString(),
            lote: payload._id,
            tipoDocumento: 'saldoinicial'
          }).save()
        )
      })
        .then(res => res)

      return mutation
    }

    const docExtra = async (payload) => {
      const mutation = await new Promise((resolve) => {
        resolve(
          Documents({ 
            cliente: payload.cliente.toString(),
            proyecto: payload.proyecto.toString(),
            lote: payload._id,
            tipoDocumento: 'extra'
          }).save()
        )
      })
        .then(res => res)

      return mutation
    }

    const docAcreditado = async (payload) => {
      const mutation = await new Promise((resolve) => {
        resolve(
          Documents({ 
            cliente: payload.cliente.toString(),
            proyecto: payload.proyecto.toString(),
            lote: payload._id,
            tipoDocumento: 'acreditado'
          }).save()
        )
      })
        .then(res => res)

      return mutation
    }

    const data = Promise.all([dataUserPromise])
      .then(async (res) => {

        const doc = res[0]
        
        await docMensualidad(doc)
        await docExtra(doc)
        await docAcreditado(doc)
        await docSaldoInicial(doc)

        return doc

      })

    return await data

  },
  assignLote: async (payload, { idProyecto }) => {

    const datalote = {
      proyecto: idProyecto,
      cliente: payload.idUser,
      lote: payload.lote,
      manzana: payload.manzana,
      precioTotal: payload.precioTotal,
      enganche: payload.enganche,
      financiamiento: payload.financiamiento,
      plazo: payload.plazo,
      mensualidad: payload.mensualidad,
      inicioContrato: payload.inicioContrato
    }

    // creamos los folios de documentos
    const docMensualidad = async (payload) => {
      const mutation = await new Promise((resolve) => {
        resolve(
          Documents({ 
            cliente: payload.cliente.toString(),
            proyecto: payload.proyecto.toString(),
            lote: payload._id,
            tipoDocumento: 'mensualidad'
          }).save()
        )
      })
        .then(res => res)

      return mutation
    }

    const docExtra = async (payload) => {
      const mutation = await new Promise((resolve) => {
        resolve(
          Documents({ 
            cliente: payload.cliente.toString(),
            proyecto: payload.proyecto.toString(),
            lote: payload._id,
            tipoDocumento: 'extra'
          }).save()
        )
      })
        .then(res => res)

      return mutation
    }

    const docAcreditado = async (payload) => {
      const mutation = await new Promise((resolve) => {
        resolve(
          Documents({ 
            cliente: payload.cliente.toString(),
            proyecto: payload.proyecto.toString(),
            lote: payload._id,
            tipoDocumento: 'acreditado'
          }).save()
        )
      })
        .then(res => res)

      return mutation
    }

    const docSaldoInicial = async (payload) => {
      const mutation = await new Promise((resolve) => {
        resolve(
          Documents({ 
            cliente: payload.cliente.toString(),
            proyecto: payload.proyecto.toString(),
            lote: payload._id,
            tipoDocumento: 'saldoinicial'
          }).save()
        )
      })
        .then(res => res)

      return mutation
    }

    const newLote = new Promise((resolve) => {
      resolve(
        new Lotes(datalote).save()
      )  
    })

    return Promise.all([newLote])
      .then(async (res) => {
        
        const doc = res[0]

        await docMensualidad(doc)
        await docExtra(doc)
        await docAcreditado(doc)
        await docSaldoInicial(doc)

        return doc

      })
  },
  // todos los lotes con nombre de usuario del proyecto
  getAllLotesByProyectId: async (idProyecto) => {

    // tenemos que obtener la lista de lotes por proyecto
    const fletchLotesById = async () => {
      const query = await new Promise((resolve) => {
        resolve(
          Lotes.aggregate()
            .match({ isActive: false })
            .match({ proyecto: mongoose.Types.ObjectId(idProyecto) })
            .project({ cliente: 1, _id: 0 })

        )
      }).then(res => res)

      return query
    }

    // CON EL ID DE CLIENTE BUSCAMOS LOS NOMBRES Y HACEMOS UN "JOIN"
    const fletchClienteID = async (idcliente) => {
      const query = await new Promise((resolve) => {
        resolve(
          Clientes.aggregate()
            .match({ _id: mongoose.Types.ObjectId(idcliente) })
            .lookup({ 
              from: 'lotes', 
              localField: '_id', 
              foreignField: 'cliente', 
              as: 'lotes'
            })
        )
      }).then(res => res)

      return query
    }

    // RESOLVEMOS LAS PETICIONES
    const getDataLoteClientName = async () => {

      const lotes = await fletchLotesById()      
      const lotesIds = Object
        .values(lotes)
        .map(({ cliente }) => cliente[0])

      const querysArray = Object
        .values(lotesIds)
        .map(item => fletchClienteID(item))

      const resolvePromise = Promise.all(querysArray)
        .then(res => res)

      return resolvePromise
    }

    return getDataLoteClientName()
    
  }, 
  findCliente: async ({ text }) => {

    const regText = text?.split(' ').map(item => new RegExp(`${item}.*`, 'i')) 
    
    const queryName = await new Promise((resolve) => {
      resolve(
        Clientes.aggregate()
          .match({ nombre: { $all: regText } })
          
      )
    }).then(res => res)

    return Promise.all([queryName])
      .then(res => res)

  },
  findMailCliente: async ({ email }) => {
  
    const query = await new Promise((resolve) => {
      resolve(
        Clientes.aggregate().match({ email })
      )
    }).then(res => {
      if (res.length === 0) {
        return null
      }
      return res 
    })
    return query 
  },
  getClienteById: async (id) => {
    const query = await new Promise((resolve) => {
      resolve(
        Clientes.findById(id)
      )
    })
      .then(res => res)

    return query
  },
  lotesByIdCliente: async (id) => {
    
    const lotesQuery = await new Promise((resolve) => {
      resolve(
        Lotes.aggregate()
          .match({ cliente: mongoose.Types.ObjectId(id) })
      )
    }).then(res => res)
     
    return lotesQuery

  },
  addPagoToLote: async (body) => {
  /** 
   * DATOS DEL MODELO DE PAGOS
   * @params cliente { ObjectID }
   * @params proyecto { ObjectID }
   * @params lote { ObjectID }
   * @params mes { string }
   * @params refPago { string }
   * @params cantidad { string }
   * @params { string }
   * El pago se debe guardar en pago de lote
   * 
   */

    return await Pagos(body).save()
    
  },
  getPagosByClienteAndProject: async (clienteId, proyectoId) => {

    const payload = new Promise((resolve) => {
      resolve(
        Pagos.aggregate()
          .match({ cliente: mongoose.Types.ObjectId(clienteId) })
      )
    })
      .then(res => res)
      .catch(err => console.log(err))
    
    const res = await Promise.all([payload])
      .then(res => res[0])

    return res

  },
  getPagosByProject: async ({ idcliente }, { idProject }) => {
    const agg = [
      [
        {
          $match: {
            proyecto: mongoose.Types.ObjectId(idProject)
          }
        }, {
          $match: {
            cliente: mongoose.Types.ObjectId(idcliente)
          }
        }
      ]
    ]

    const pagos = new Promise((resolve) => {
      resolve(
        Pagos.aggregate(agg)
      )
    })
      .then(res => res)

    return await Promise.all([pagos])
      .then(res => res[0])

  },
  infoToInvoiceById: async ({ idPago }) => {
    // traer la informacion del pago
    const loteInfo = await new Promise((resolve) => {
      resolve(
        Pagos.aggregate()
          .match({ _id: mongoose.Types.ObjectId(idPago) })
          .lookup({ 
            from: 'proyectos', 
            localField: 'proyecto', 
            foreignField: '_id', 
            as: 'dataProject'
          })
          .lookup({
            from: 'clientes', 
            localField: 'cliente', 
            foreignField: '_id', 
            as: 'dataClient'
          })
          .lookup({
            from: 'lotes', 
            localField: 'lote', 
            foreignField: '_id', 
            as: 'dataLote'
          })
      )
    }).then(res => res)

    return loteInfo

  },
  statusPaymentByLoteId: async ({ loteId }) => {

    const agg = [
      {
        $match: {
          _id: mongoose.Types.ObjectId(loteId)
        }
      }, {
        $lookup: {
          from: 'pagos', 
          let: {
            cliente: '$cliente', 
            proyecto: '$proyecto'
          }, 
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        '$proyecto', '$$proyecto'
                      ]
                    }, {
                      $eq: [
                        '$cliente', '$$cliente'
                      ]
                    }
                  ]
                }
              }
            }
          ], 
          as: 'pagos'
        }
      }
    ]
    
    const loteInfo = await new Promise((resolve) => {
      resolve(
        Lotes.aggregate(agg)
      )
    }).then(res => res)

    return loteInfo
  },
  PagarNota: async ({ idPago }, body) => {
    const query = await Pagos.findByIdAndUpdate(idPago, body)
    return query
  },
  createInvoice: async (body, query, getSettings) => {

    const { mensualidad, dataClient, fechaPago, dataLote, mes, ctaBancaria, banco, refBanco, dataProject, folio, textoObservaciones, extraSlug, refPago, mensajeRecibo } = body
    console.log({ body })
   
    const letrasToTexto = NumerosaLetras(mensualidad)
    const precioMensualidad = monyIntlRef(+mensualidad)
    const lafecha = dateIntlRef({ date: fechaPago })
    /**
     * TODO 
     * el folio y el numero de mensualidad debe salir del length de pedidos
     */
    const htmlextraSlug = extraSlug || `Mensualidad ${folio || '1'} de ${dataLote[0].plazo}`
    const hmtltextoObservaciones = textoObservaciones || refPago
    const htmlManzana = dataLote[0].manzana !== '' && dataLote[0].manzana !== null ? `Manzana ${dataLote[0].manzana}` : ''

    const textoDescription = `
      ${htmlextraSlug} correspondiente al mes
      de ${dateIntlRef({ date: mes, type: 'month' }).toUpperCase()}       
      <br>
        Proyecto: ${dataProject[0].title}
      <br>
        Lote o Fraccion: ${dataLote[0].lote} ${htmlManzana} 
      <br>      
      Pago recibido en la cuenta bancaria 
      ${ctaBancaria} del Banco
      ${banco} con número de
      referencia ${refBanco} en
      ${dateIntlRef({ date: fechaPago })}
    `

    const firmaXavier = `
    <img 
      class="sello"
      src="https://firebasestorage.googleapis.com/v0/b/gpo-maya.appspot.com/o/pagado.jpg?alt=media&token=07847cf9-51ff-4726-8394-df95102e6649" 
      alt="sello de pagado"
    />
    <span class="firmas__line">
      <p>Xavier Juliano Nieto Vargas</p>
    </span>
    <span class="firmaXavier"></span>        
    <span>Nombre y firma de quien Recibe</span>
    `

    const firmaMartin = `
    <img 
      class="sello"
      src="https://firebasestorage.googleapis.com/v0/b/gpo-maya.appspot.com/o/pagado.jpg?alt=media&token=07847cf9-51ff-4726-8394-df95102e6649" 
      alt="sello de pagado"
    />
    <span class="firmas__line">
      <p>MARTIN ERNESTO SANCHEZ MANJARREZ</p>
    </span>
    <span class="firmaXavier"></span>        
    <span>Nombre y firma de quien Recibe</span>
    `

    const firmaIkai = `
    <img 
      class="sello"
      src="https://firebasestorage.googleapis.com/v0/b/gpo-maya.appspot.com/o/pagado.jpg?alt=media&token=07847cf9-51ff-4726-8394-df95102e6649" 
      alt="sello de pagado"
    />
    <span class="firmas__line">
      <p>Nazario Tun May </p>
    </span>
    <span class="firmaXavier"></span>        
    <span>Nombre y firma de quien Recibe</span>
    `

    const htmlOwnersFirma = {
      xavier: firmaXavier,
      martin: firmaMartin,
      ikai: firmaIkai
    }

    const webTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <style>
        
        body{
          display: flex;
          justify-content: center;
          font-family: Arial, Helvetica, sans-serif;
        }
    
        .logo{
          width: 200px;
          height: auto;
        }
    
        .container{
          width: 800px;
        }
    
        .header{
          padding: 10px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
    
        .header *{
          margin: 0;
          padding: 0;
          line-height: normal;
        }
    
        .under__line{
          text-decoration: underline;
        }
    
        .header > h2{
          font-weight: normal;
          font-size: 21px;
        }
        
        .datos__cliente{
          display: flex;
          border: 2px solid black;
          width: 800px;
          height: fit-content;
          padding: 4px;
          box-sizing: border-box;
          font-size: 13px;
          line-height: 16px;
    
        }
    
        .datos__cliente span{
          display: flex;
          padding: 12px;
        }
    
        .datos__cliente span:first-child{
          margin: 21px 20% 0 0;
          text-transform: uppercase;
        }
    
        .datos__cliente > div span:first-child{
          margin: 1px;
    
        }
    
        .datos__cliente span p:first-child{
          font-weight: bold;
          margin-right: 10px;
          align-items: flex-start;
        }
    
        .datos__invoice{
          height: fit-content;
          width: 100%;
          margin: 21px 0;
          
        }
    
        .tabla__pagos{
          width: 100%;
          padding: 0;
          border-collapse: collapse;
        }

        .tabla__pagos td:first-child {
            width: 30px;
            overflow: hidden;
            display: inline-block;
            white-space: nowrap;
        }

        .tabla__pagos td:last-child {
            width: 120px;
            overflow: hidden;
            display: inline-block;
            white-space: nowrap;
        }

        .tabla_pagos td{
          width: 10px;
          background-color: #e6e6e6;
        }
    
        .tabla__pagos thead{
          background-color: #5c5c5c;
          font-size: 12px;  
        }
    
        .tabla__pagos thead th{          
          padding: 2px;
          text-align: left;
          border: 2px solid black;
          color: white;          
        }
   

        .tabla__pagos tbody td{
          text-align: center;
        }
    
        .tabla__pagos tbody td:nth-child(2){
          text-align: left;
        }
    
        .observaciones{
          font-size: 13px;
          border: 2px solid black;
          border-bottom: transparent;
          display: flex;
          justify-content: space-between;
        }
    
        .observaciones p:first-child{
          font-weight: bold;
          margin: 10px;
        }
    
        .top_border{
          border-top: transparent;
          border-bottom: 2px solid black;
          display: flex;
          flex-direction: column;
        }
    
        .linea__total{
          margin-top: 80px;
          margin-right: 2px;
          border-top: 2px solid black;
          width: 240px;
        } 
    
        .total__numeros{
          display: flex;
          justify-content: space-between;
          font-weight: bold;
        }
        
        .observaciones img{
          width: 400px;
          height: auto;
          object-fit: contain;
          margin-left: 40px;
        }
    
        .comentarios{
          display: flex;
          flex-direction: column;
        }
    
        .comentarios li{
          margin: 15px;
        }
    
        .font_blue{
          color: blue;
          font-weight: bold;
        }
    
        .font_red{
          color: red;
          font-weight: bold;
        }
    
        .firma_cliente{
          display: flex;
          flex-direction: column;
        }
    
        .firmas__line{
          height: 1px;
          margin-top: 50px;      
          border-top: 2px solid black;
        }
    
        .firmas__line p{
          position: absolute;
          width: 100%;
          bottom: -15px;
          left: 200px;
          padding: 20px;
          text-decoration: underline;      
        }
    
        .secction__firmas{
          position: relative;
          display: flex;
          justify-content: space-evenly;
          width: 55%;
          font-size: 12px;
        }
    
        .sello{
          width: 100px !important;
          height: auto;
          position: absolute;
          bottom: 70px;
          left: 250px;
          z-index: 2;
        }
    
        .firmaXavier{
          background-image: url('https://firebasestorage.googleapis.com/v0/b/gpo-maya.appspot.com/o/firmaXAVIER.jpg?alt=media&token=eff2fa13-0833-4809-bdb0-6fd0687d26fb');      
          background-repeat: no-repeat;
          background-position: center;
          position: absolute;
          bottom: 10px;
          left: 250px;
          width: 80px;
          height: 80px;
          z-index: 1;
        }
    
    
    
      </style>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RECIBO DE PAGO</title>
    </head>
    <body>
    <div class="container">
    
      <section class="header">
        <img src="https://firebasestorage.googleapis.com/v0/b/gpo-maya.appspot.com/o/logo.png?alt=media&token=31e8e01e-09ff-4d9d-a73b-688b5506743f" alt="logo de la empresa grupo maya es una piramide y el mar" class="logo">    
          <h2>${getSettings[0].razonSocial}</h2>
            <p>RFC:${getSettings[0].rfc}</p>
            <p>${getSettings[0].direccion}</p>
            <p>${getSettings[0].ciudad}</p>
            <h1 class="under__line">RECIBO DE PAGO</h1>
      </section>
    
      <section class="datos__cliente">
      <span>
        <p>RECIBI DE:</p>
        <p>${dataClient[0].nombre}</p>
      </span>
      <div>
        <span>
          <p>Fecha:</p>
          <p>${lafecha}</p>
        </span>
        <span>
          <p>Folio:</p>
          <p>${folio}</p>
        </span>
      </div>
    </section>
    <section class="datos__invoice">
      <table class="tabla__pagos">
        <thead>
          <th>Cantidad</th>
          <th>Descripción</th>          
          <th>Importe</th>
        </thead>
        <tbody>
          <td>
            <p>1.0</p>
          </td>
          <td>
            <p>
              ${mensajeRecibo || textoDescription}
            </p>
          </td>          
          <td class="precio_total">
            <p>${precioMensualidad}</p> 
          </td>
        </tbody>
      </table>
    
    </section>
    <div>
      <p>
        ${hmtltextoObservaciones}
      </p>  
    </div>
    <section class="observaciones">
      <p>IMPORTE CON LETRA <br/>${letrasToTexto}</p>
      <span>
        <div class="linea__total"/>
        <span class="total__numeros">
          <p>TOTAL</p>
          <p>${precioMensualidad}</p>
        </span> 
      </span>
    </section>
      <section class="observaciones top_border">
        <div class="secction__firmas">
          <div class="firma_cliente">
            <span class="firmas__line"></span>
            <span>Nombre y Firma de quien aporta</span>
          </div>
    
          <div class="firma_cliente">        
            ${htmlOwnersFirma[`${getSettings[0].slug}`]}
          </div>
        </div>  
        <div class="comentarios">
          <ul>
            <li>
              Recuerde que si paga dentro de los 5 días naturales siguientes a la fecha estipulada en su contrato, sigue siendo acreedor al crédito sin intereses, después del día 5 el interés es del 10%
            </li>
            <li>
              Es obligatorio realizar su pago con su referencia, que son las iniciales de su nombre y el número de lote. Ejemplo: correcto: <span class="font_blue">jjgs46.</span> <span class="font_red">Incorrecto: pago terreno, nombre de la persona, lote tulum</span>  
            </li>
          </ul>
        </div>
      </section>
      </div>
    </body>
    </html>
    `    
    return webTemplate

  },
  findUser: async (query) => {
    const araryQuery = query.split(' ').map(query => new RegExp(`${query}.*`, 'i'))

    const userList = new Promise((resolve) => {
      resolve(
        Clientes
          .aggregate()
          .match({ nombre: { $all: araryQuery } })
      )
    }).then(res => res)

    const responseQuery = await Promise.all([userList])
      .then((res) => {
        return res[0]
      })

    return responseQuery

  },
  settingsAppSave: (body) => new Settings(body).save(),
  settingsGetData: async () => await Settings.find(),

  // añadir pago con mumero consecutivo
  // TODO añadir dentro de la logica un SALDO INICIAL
  consecutivoMensualidad: async (body) => {   

    const filter = [
      {
        $match: {
          tipoDocumento: body.tipoPago
        }
      }, 
      {
        $match: {
          lote: mongoose.Types.ObjectId(body.lote)
        }
      }
    ]

    const folioFunction = async () => {
      const query = await new Promise((resolve) => {
        resolve(
          Documents.aggregate(filter)
        )
      }).then(async (res) => {
        const id = res[0]?._id
        const folio = res[0]?.folio        

        if (body.folioincial) {
          // cuando es saldo inicial buscamos el documento por lote y le sumamos el folio que tiene como inicial de lo cotrario recuperamos el folio de la ultima mensualidad y le sumamos 1
          return await Documents.findOneAndUpdate({ lote: body.lote, tipoDocumento: 'mensualidad' }, { folio: +body.folioincial })
            .then(res => res)
            .catch(err => err)

        } else if (!body.folioincial) {          
          return await Documents.findByIdAndUpdate(id, { folio: folio + 1 })
            .then(res => res)
            .catch(err => err)
        }
      })

      return query 
    }

    const folio = folioFunction()

    const addPagoClient = async (payload) => {
      const mutation = await new Promise((resolve) => {
        resolve(
          Pagos(payload).save()
        )
      })
        .then(res => res)
        .catch(error => console.log(error, '1'))

      return mutation
    }
    
    return await Promise.all([folio])
      .then(async (res) => {
        const folio = res[0].folio
        return await addPagoClient({ ...body, folio })
      })
      .then(res => res)
      .catch(error => console.log(error, 2))

  },
  settingsAppPatch: ({ _id, ...restOfdata }) => {
    return Settings.findByIdAndUpdate(_id, restOfdata)
  },
  getClienteDetailById: async (id) => {    
    const agg = [
      {
        $match: {
          _id: mongoose.Types.ObjectId(id)
        }
      }, {
        $lookup: {
          from: 'lotes', 
          localField: '_id', 
          foreignField: 'cliente', 
          as: 'lotes'
        }
      }
    ]

    const cliente = await new Promise((resolve) => {
      resolve(
        Clientes.aggregate(agg)
      )
    }).then(res => res)

    return Promise.all(cliente)
      .then(async ([res]) => res)
    
  },
  loteById: async (id) => {    
    const lote = await new Promise((resolve) => {
      resolve(
        Lotes.aggregate()
          .match({ _id: mongoose.Types.ObjectId(id) })
          .project({            
            precioTotal: 1,
            enganche: 1,
            mensualidad: 1,
            plazo: 1,
            inicioContrato: 1,
            financiamiento: 1,
            lote: 1,
            manzanas: 1
          })
      )
    }).then(res => res[0])

    return Promise.all([lote])
      .then(res => {        
        return res[0]
      })
  },
  updateLoteById: async (id, body) => {
    const lote = await new Promise((resolve) => {
      resolve(
        Lotes.findByIdAndUpdate(id, body)
      )
    }).then(res => res)

    return Promise.all([lote])
      .then(res => res[0])
  },
  getPagosById: async (id) => {
    const pagos = await new Promise((resolve) => {
      resolve(
        Pagos.aggregate()
          .match({ _id: mongoose.Types.ObjectId(id) })
          .project({
            _id: 1,
            refPago: 1,
            mensualidad: 1,
            ctaBancaria: 1,
            banco: 1,
            tipoPago: 1,
            fechaPago: 1,
            extraSlug: 1,
            refBanco: 1,
            mes: 1,
            mensajeRecibo: 1
          })
      )
    }).then(res => res[0])

    return Promise.all([pagos])
      .then(res => res[0])
  },
  updatePagoById: async (id, body) => {
    const pago = await new Promise((resolve) => {
      resolve(
        Pagos.findByIdAndUpdate(id, body)
      )
    }).then(res => res)

    return Promise.all([pago])
      .then(res => res[0])
  },
  getNamesById: async (id, documentType) => {
    const Model = () => {
      switch (documentType) {
        case 'Proyecto':
          return Proyecto          
        case 'Lote':
          return Lotes
        case 'Cliente':
          return Clientes 
        case 'Pagos':
          return Pagos
      }
    }
    
    const documentInfo = new Promise((resolve) => {
      resolve(
        Model().findOne({ _id: mongoose.Types.ObjectId(id) })
      )
    })
      .then(res => res)
      .catch(err => err)

    return Promise.all([documentInfo])

  },
  masiveUpdateCliente: async (body) => {

    const updateDocument = (cliente) => {
      return new Promise((resolve) => {
        resolve(
          Clientes.findOneAndUpdate({ email: cliente.email }, cliente)
        )
      })
        .then(res => res)
        .catch(err => console.log(err))
    }      

    return Promise.all(body.map(async (cliente) => await updateDocument(cliente)))
      .then(res => {        
        return res
      })
  },
  modifyCliente: async (id, body) => {
    const cliente = await new Promise((resolve) => {
      resolve(
        Clientes.findByIdAndUpdate(id, body)
      )
    }).then(res => res)

    return Promise.all([cliente])
      .then(res => res[0])
  },
  getMorosos: async () => {

    const today = new Date().getTime()

    // todos los clientes
    const promiseClients = Promise.resolve(
      Clientes.find()
    ).then(res => res)

    const allClients = await promiseClients

    // por cada cliete ejecutamos el ultimo pago
    const getLastPaymenByID = async (id) => {

      const agg = [
        {
          $match: {
            cliente: mongoose.Types.ObjectId(id)
          }
        },
        {
          $match: {
            tipoPago: 'mensualidad'
          }
        },        
        {
          $lookup: {
            from: 'clientes', 
            localField: 'cliente', 
            foreignField: '_id', 
            as: 'cliente_data'
          }
        }, {
          $lookup: {
            from: 'proyectos', 
            localField: 'proyecto', 
            foreignField: '_id', 
            as: 'proyecto_data'
          }
        }, {
          $lookup: {
            from: 'lotes', 
            localField: 'lote', 
            foreignField: '_id', 
            as: 'lote_data'
          }
        },
        {
          $sort: {
            mes: -1
          }
        },
        {
          $limit: 1
        }
      ]

      return await Promise.resolve(
        Pagos.aggregate(agg)
      )
        .then(res => res)
    }    

    return Promise.all(allClients.map(async (item) => await getLastPaymenByID(item._id)))
      .then(res => {
        const allPayments = res.flat()
        const pagos30 = Object.values(allPayments)
          .filter(({ mes }) => {
            const datePago = new Date(mes).getTime()
            const diff = Math.ceil((today - datePago) / (24 * 3600 * 1000))
            //  more than 30 and less 60
            return diff > 30 && diff < 60
          })

        const pagos60 = Object.values(allPayments)
          .filter(({ mes }) => {
            const datePago = new Date(mes).getTime()
            const diff = Math.ceil((today - datePago) / (24 * 3600 * 1000))            
            return diff > 61
          })
        
        return { treinta_dias: pagos30, sesenta_dias: pagos60 }
      })
    
  },
  getLotesByProject: async (id) => {

    // make a aggreagation mongo wihit project insisde lookup
    
    const agg = [
      {
        $match: {
          _id: mongoose.Types.ObjectId(id)
        }
      }, {
        $lookup: {
          from: 'lotes', 
          localField: '_id', 
          foreignField: 'proyecto', 
          as: 'lotes'
        }
      }
    ]

    return await Promise.resolve(
      Proyecto.aggregate(agg)
    )
      .then(res => {
        console.log(res)
        return res[0].lotes
      })
  }, 
  updateProyectoById: async (id, body) => {
    const proyecto = await Proyecto.findByIdAndUpdate(id, body)
    return proyecto
  }, 
  searchRefPagos: async (refPago) => {
    const agg = [
      {
        $match: {
          refBanco: {
            $regex: new RegExp(refPago, 'gi')
          }
        }
      },
      {
        $lookup: {
          from: 'clientes',
          localField: 'cliente',
          foreignField: '_id',
          as: 'cliente_data'
        }
      },
      {
        $lookup: {
          from: 'proyectos',
          localField: 'proyecto',
          foreignField: '_id',
          as: 'proyecto_data'          
        }
      },
      {
        $lookup: {
          from: 'lotes',
          localField: 'lote',
          foreignField: '_id',
          as: 'lote_data'          
        }
      }
    ]

    const pagos = await Pagos.aggregate(agg)
      .then(res => res)
      .catch(err => err)

    return pagos
  }
}
