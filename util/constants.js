module.exports = {
  tiposPago: ["mensualidad", "saldoinicial", "acreditado", "extra"],
  getDecimalValue: (p) => {
    if (typeof p?.mensualidad != "number") {
        return parseFloat(p.mensualidad.toString());
    } else {
      return p.mensualidad;
    }
  },
};
