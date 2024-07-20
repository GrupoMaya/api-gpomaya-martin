function NumerosaLetras(cantidad) {
  let numero = 0;
  cantidad = parseFloat(cantidad);

  if (cantidad === 0) {
    return "CERO PESOS CON 00/100 M.N.";
  } else {
    const ent = cantidad.toString().split(".");
    const arreglo = splitSper(ent[0]);
    const longitud = arreglo.length;

    switch (longitud) {
      case 1:
        numero = unidades(arreglo[0]);
        break;
      case 2:
        numero = decenas(arreglo[0], arreglo[1]);
        break;
      case 3:
        numero = centenas(arreglo[0], arreglo[1], arreglo[2]);
        break;
      case 4:
        numero = unidadesdemillar(
          arreglo[0],
          arreglo[1],
          arreglo[2],
          arreglo[3],
        );
        break;
      case 5:
        numero = decenasdemillar(
          arreglo[0],
          arreglo[1],
          arreglo[2],
          arreglo[3],
          arreglo[4],
        );
        break;
      case 6:
        numero = centenasdemillar(
          arreglo[0],
          arreglo[1],
          arreglo[2],
          arreglo[3],
          arreglo[4],
          arreglo[5],
        );
        break;
      case 7:
        numero = millones(
          arreglo[0],
          arreglo[1],
          arreglo[2],
          arreglo[3],
          arreglo[4],
          arreglo[5],
          arreglo[6],
        );
        break;
      case 8:
        numero = decenasdemillones(
          arreglo[0],
          arreglo[1],
          arreglo[2],
          arreglo[3],
          arreglo[4],
          arreglo[5],
          arreglo[6],
          arreglo[7],
        );
        break;
      case 9:
        numero = centenasdemillones(
          arreglo[0],
          arreglo[1],
          arreglo[2],
          arreglo[3],
          arreglo[4],
          arreglo[5],
          arreglo[6],
          arreglo[7],
          arreglo[8],
        );
        break;
    }

    ent[1] = isNaN(ent[1]) ? "00" : ent[1].padEnd(2, "0");

    return numero + "PESOS CON " + ent[1] + "/100 M.N.";
  }
}

function unidades(unidad) {
  const unidades = [
    "UN ",
    "DOS ",
    "TRES ",
    "CUATRO ",
    "CINCO ",
    "SEIS ",
    "SIETE ",
    "OCHO ",
    "NUEVE ",
  ];
  return unidades[unidad - 1] || "";
}

function decenas(decena, unidad) {
  const diez = [
    "ONCE ",
    "DOCE ",
    "TRECE ",
    "CATORCE ",
    "QUINCE",
    "DIECISEIS ",
    "DIECISIETE ",
    "DIECIOCHO ",
    "DIECINUEVE ",
  ];
  const decenas = [
    "DIEZ ",
    "VEINTE ",
    "TREINTA ",
    "CUARENTA ",
    "CINCUENTA ",
    "SESENTA ",
    "SETENTA ",
    "OCHENTA ",
    "NOVENTA ",
  ];

  if (+decena === 0) {
    return unidades(unidad);
  }

  if (+decena === 1 && +unidad > 0) {
    return diez[+unidad - 1];
  }

  if (+decena === 2 && +unidad > 0) {
    return "VEINTI" + unidades(unidad).toLowerCase();
  }

  if (+unidad === 0) {
    return decenas[+decena - 1];
  }

  return decenas[+decena - 1] + " Y " + unidades(unidad).toLowerCase();
}

function centenas(centena, decena, unidad) {
  const centenas = [
    "CIENTO ",
    "DOSCIENTOS ",
    "TRESCIENTOS ",
    "CUATROCIENTOS ",
    "QUINIENTOS ",
    "SEISCIENTOS ",
    "SETECIENTOS ",
    "OCHOCIENTOS ",
    "NOVECIENTOS ",
  ];

  if (+centena === 1 && +decena === 0 && +unidad === 0) {
    return "CIEN ";
  }

  if (+centena === 0) {
    return decenas(decena, unidad);
  }

  return centenas[+centena - 1] + decenas(decena, unidad).toLowerCase();
}

function unidadesdemillar(unimill, centena, decena, unidad) {
  return (
    unidades(unimill) + "MIL " + centenas(centena, decena, unidad).toLowerCase()
  );
}

function decenasdemillar(decemill, unimill, centena, decena, unidad) {
  return (
    decenas(decemill, unimill) +
    "MIL " +
    centenas(centena, decena, unidad).toLowerCase()
  );
}

function centenasdemillar(
  centenamill,
  decemill,
  unimill,
  centena,
  decena,
  unidad,
) {
  return (
    centenas(centenamill, decemill, unimill) +
    "MIL " +
    centenas(centena, decena, unidad).toLowerCase()
  );
}

function millones(
  unimill,
  centenamill,
  decemill,
  unimillar,
  centena,
  decena,
  unidad,
) {
  return (
    unidades(unimill) +
    "MILLONES " +
    centenasdemillar(
      centenamill,
      decemill,
      unimillar,
      centena,
      decena,
      unidad,
    ).toLowerCase()
  );
}

function decenasdemillones(
  decemill,
  unimill,
  centenamill,
  decemillar,
  unimillar,
  centena,
  decena,
  unidad,
) {
  return (
    decenas(decemill, unimill) +
    "MILLONES " +
    centenasdemillar(
      centenamill,
      decemillar,
      unimillar,
      centena,
      decena,
      unidad,
    ).toLowerCase()
  );
}

function centenasdemillones(
  centenamill,
  decemill,
  unimill,
  centenamillar,
  decemillar,
  unimillar,
  centena,
  decena,
  unidad,
) {
  return (
    centenas(centenamill, decemill, unimill) +
    "MILLONES " +
    centenasdemillar(
      centenamillar,
      decemillar,
      unimillar,
      centena,
      decena,
      unidad,
    ).toLowerCase()
  );
}

function splitSper(texto) {
  return texto.split("");
}

const monyIntlRef = (precio) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(precio);
};

const dateIntlRef = ({ date, locale = "es-MX", type = "all" }) => {
  const dataInteOptions = () => {
    switch (type) {
      case "numeric":
        return { year: "numeric", month: "numeric", day: "numeric" };
      case "month":
        return { month: "long" };
      case "day":
        return { day: "numeric" };
      case "hour":
        return { hour: "numeric", minute: "numeric" };
      default:
        return { year: "numeric", month: "long", day: "numeric" };
    }
  };

  const dateIntl = new Date(date);
  if (isNaN(dateIntl)) {
    return new Intl.DateTimeFormat(locale, {
      ...dataInteOptions(),
      timeZone: "UTC",
    }).format(new Date());
  } else {
    return new Intl.DateTimeFormat(locale, {
      ...dataInteOptions(),
      timeZone: "UTC",
    }).format(dateIntl);
  }
};

module.exports = {
  NumerosaLetras,
  monyIntlRef,
  dateIntlRef,
};
