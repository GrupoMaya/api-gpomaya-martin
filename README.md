## API DE GESTION DE PAGOS DE POR PROYECTO PARA GRUPO MAYA

<!-- lote/pago -->
### Agregar pago al lote
ruta: router.post('/api/v1/lote/pago', MayaController.addPagoToLote)
<br/>
 objeto:
````javascript
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
````
El proceso es el siguiente: 

cuando se crea un lote, generan sus documentos de "padre": 
<li>mensualidad</li>
<li>extra</li>
<li>acreditado</li>
<li>saldoinicial</li>

<br/>

Es cuando entra el endpoint de add pago, ya que busca el documento padre del tipo de pago y genera el consecutivo siguiente. 

