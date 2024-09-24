const express = require("express");
const router = express.Router();
const { MayaController, MayaServicesV2 } = require("../controllers");
const { verifyToken } = require("../middlewares/authUser");

router.use(express.urlencoded({ extended: true }));
router.use(express.json({ extended: true }));

router.post("/api/v1/login", MayaController.login);

router.post("/api/v1/register", MayaController.register);

router.post("/api/v1/add/proyecto", MayaController.addProyecto);

// todos LOS PROYECTOS ACTIVOS
router.get("/api/v1/proyectos", MayaController.getAllProyectos);

// projecto por id
router.get("/api/v1/proyecto/:id", MayaController.getProyectoById);

// nombre proyecto por id
router.get("/api/v1/getnames/:documentType/:id", MayaController.getNamesById);

// clientes
router.post("/api/v1/add/cliente", MayaController.addCliente);

// lotes por id de cliente
router.get("/api/v1/lotes/cliente/:id", MayaController.lotesByIdCliente);

// lote por id
router.get("/api/v1/lote/:id", MayaController.loteById);

// buscar cliente
router.get("/api/v1/search/cliente", MayaController.findCliente);

// buecar cliente por email
router.get("/api/v1/search/email/cliente", MayaController.findMailCliente);

// todos los clientes
router.get("/api/v1/cliente", MayaController.getAllClientes);

// modificar nombre cliente
router.patch("/api/v1/modify/cliente/:id", MayaController.modifyCliente);

// clientes por id
router.get("/api/v1/cliente/:id", MayaController.getClienteById);

// todos los clientes con lote por id de proyecto
router.get(
  "/api/v1/lotes/proyecto/:idProyecto",
  MayaController.getAllLotesByProyectId,
);

// COMPUESTOS
// Crear usuario y añadirlo a nuevo proyecto
router.post(
  "/api/v1/assign/lote/user/:idProyecto/",
  MayaController.assignLoteToNewUser,
);

// Añadir lote a cliente existente
router.post("/api/v1/add/lote/user/:idProyecto/", MayaController.assignLote);

// LEER INFORMACION DE PAGO
router.get("/api/v1/showinfoinvoice/:idPago", MayaController.infoToInvoiceById);

// agregar pago de lote por projecto
router.post("/api/v1/lote/pago", MayaController.addPagoToLote);

// todos los pagos de cliente por proyecto
router.get(
  "/api/v1/cliente/pagos/:clienteId",
  MayaController.getPagosByClienteAndProject,
);

// todos los pagos por id
router.get("/api/v1/get/pago/:id", MayaController.getPagosById);

// generar estadisitcas de pago del cliente por proyecto
router.get(
  "/api/v1/status/payment/lote/:loteId",
  MayaController.statusPaymentByLoteId,
);

// Liquidar pago
router.patch("/api/v1/pagarnota/:idPago", MayaController.PagarNota);

// rutas PDF
router.post("/api/v1/pdf", MayaController.createInvoice);
// router.get('/api/v1/invoice/:folio', MayaController.getInvoiceId)

// Routes de busqueda de niños
router.get("/api/v1/search", MayaController.findUser);

// Settings SaveData
router.post("/api/v1/settingsapp", MayaController.settingsAppSave);
router.get("/api/v1/settingsapp/get", MayaController.settingsGetData);
router.patch("/api/v1/settingsapp/dataInfo", MayaController.settingsAppPatch);

// TODO CLERAR RUTA DE PAGOS POR CLIENTE Y PROJECTO
// insertamos por query el id del cliente
router.get("/api/v1/pagos/:idProject", MayaController.getPagosByProject);

// ruta completa de cliente,
// lotes activos, pagos realizados
router.get("/api/v1/detail/client/:id", MayaController.getClienteDetailById);

// UDPATES
// update lote
router.patch("/api/v1/update/lote/:id", MayaController.updateLoteById);

// update pago
router.patch("/api/v1/update/pago/:id", MayaController.updatePagoById);

// MASIVE UPDATE CLIENTE
router.patch(
  "/api/v1/masive/update/cliente",
  MayaController.masiveUpdateCliente,
);

// morosos routes
router.get("/api/v1/morosos", MayaController.getMorosos);

// solo lotes por proyecto
router.get("/api/v1/lotes/:id", MayaController.getLotesByProject);

// editar nombre de proyecto
router.patch("/api/v1/update/proyecto/:id", MayaController.updateProyectoById);

// busqueda de ref de pagos
router.get("/api/v1/search/ref/pagos", MayaController.searchRefPagos);

/// version 2.0
router.get(
  "/api/v2/lotes/proyecto/:idProyecto",
  verifyToken,
  MayaServicesV2.getAllLotesByProyectId,
);
router.get(
  "/api/v2/pagos/:idProject",
  verifyToken,
  MayaServicesV2.getPagosByProject,
);
router.patch(
  "/api/v2/pagos/folio/:idPago",
  verifyToken,
  MayaServicesV2.updateFolioPagoById,
);
router.get(
  "/api/v2/pagos/proyecto/:idProject/cliente/:idClient",
  verifyToken,
  MayaServicesV2.getPagosByProjectAndClient,
);
router.get("/api/v2/client/search", verifyToken, MayaServicesV2.findClient);
router.get(
  "/api/v2/lotesbyclient/:idClient",
  verifyToken,
  MayaServicesV2.getLoteByClient,
);
router.get(
  "/api/v2/newClientSearch",
  verifyToken,
  MayaServicesV2.findClientNew,
);

// WEBHOOKS
//
router.post(
  "/api/v1/webhook/pagos-records",
  verifyToken,
  MayaController.pagosRecords,
);

module.exports = router;
