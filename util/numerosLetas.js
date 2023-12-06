
function NumerosaLetras (cantidad) {

  let numero = 0
  cantidad = parseFloat(cantidad)
  
  if (cantidad === '0.00' || cantidad === '0') {
    return 'CERO PESOS CON 00/100 M.N.'
  } else {
    const ent = cantidad.toString().split('.')
    const arreglo = splitSper(ent[0])
    const longitud = arreglo.length
  
    switch (longitud) {
      case 1:
        numero = unidades(arreglo[0])
        break
      case 2:
        numero = decenas(arreglo[0], arreglo[1])
        break
      case 3:
        numero = centenas(arreglo[0], arreglo[1], arreglo[2])
        break
      case 4:
        numero = unidadesdemillar(arreglo[0], arreglo[1], arreglo[2], arreglo[3])
        break
      case 5:
        numero = decenasdemillar(arreglo[0], arreglo[1], arreglo[2], arreglo[3], arreglo[4])
        break
      case 6:
        numero = centenasdemillar(arreglo[0], arreglo[1], arreglo[2], arreglo[3], arreglo[4], arreglo[5])
        break
    }
  
    ent[1] = isNaN(ent[1]) ? '00' : ent[1]
  
    return numero + 'PESOS CON ' + ent[1] + '/100 M.N'
  }
}
  
function unidades (unidad) {
  const unidades = ['UN ', 'DOS ', 'TRES ', 'CUATRO ', 'CINCO ', 'SEIS ', 'SIETE ', 'OCHO ', 'NUEVE ']
  
  return unidades[unidad - 1]
}

function decenas (decena, unidad) {
 
  const diez = ['ONCE ', 'DOCE ', 'TRECE ', 'CATORCE ', 'QUINCE', 'DIECISEIS ', 'DIECISIETE ', 'DIECIOCHO ', 'DIECINUEVE ']
  const decenas = ['DIEZ ', 'VEINTE ', 'TREINTA ', 'CUARENTA ', 'CINCUENTA ', 'SESENTA ', 'SETENTA ', 'OCHENTA ', 'NOVENTA ']
  
  if (+decena === 0 && +unidad === 0) {
    return ''
  }
  
  if (+decena === 0 && +unidad > 0) {
    return unidades(unidad)
  }
  
  if (+decena === 1) {
    if (+unidad === 0) {
      return decenas[+decena - 1]
    } else {
      return diez[+unidad - 1]
    }

  } else if (+decena === 2) {
    if (+unidad === 0) {
      return decenas[decena - 1]
    } else if (+unidad === 1) {
      const veinte = 'VEINTI' + 'UN '
      return veinte
    } else {
      const veinte = 'VEINTI' + unidades(+unidad)
      return +veinte 
    }
  } else {
  
    if (+unidad === 0) {
      return decenas[+decena - 1] + ' '
    }
    if (unidad === 1) {
      return decenas[+decena - 1] + ' Y ' + 'UNO'
    }
  
    return decenas[+decena - 1] + ' Y ' + unidades(+unidad)
  }
}
  
function centenas (centena, decena, unidad) {
  const centenas = ['CIENTO ', 'DOSCIENTOS ', 'TRESCIENTOS ', 'CUATROCIENTOS ', 'QUINIENTOS ', 'SEISCIENTOS ', 'SETECIENTOS ', 'OCHOCIENTOS ', 'NOVECIENTOS ']
  
  if (+centena === 0 && +decena === 0 && +unidad === 0) {
    return ''
  }
  if (+centena === 1 && +decena === 0 && +unidad === 0) {
    return 'CIEN '
  }
  
  if (+centena === 0 && +decena === 0 && +unidad > 0) {
    return unidades(+unidad)
  }
  
  if (+decena === 0 && +unidad === 0) {
    return centenas[centena - 1] + ''
  }
  
  if (decena === 0) {
    const numero = centenas[centena - 1] + '' + decenas(decena, unidad)
    return numero.replace(' Y ', ' ')
  }
  if (centena === 0) {
  
    return decenas(decena, unidad)
  }
   
  return centenas[centena - 1] + '' + decenas(decena, unidad)
}
  
function unidadesdemillar (unimill, centena, decena, unidad) {
  let numero = unidades(unimill) + ' MIL ' + centenas(centena, decena, unidad)
  numero = numero.replace('MIL ', 'MIL ')
  if (+unidad === 0) {
    return numero.replace(' Y ', ' ')
  } else {
    return numero
  }
}
  
function decenasdemillar (decemill, unimill, centena, decena, unidad) {
  const numero = decenas(decemill, unimill) + 'MIL' + centenas(centena, decena, unidad)
  return numero
}
  
function centenasdemillar (centenamill, decemill, unimill, centena, decena, unidad) {
  
  let numero = 0
  numero = centenas(centenamill, decemill, unimill) + 'MIL' + centenas(centena, decena, unidad)
  
  return numero
}
  
function splitSper (texto) {
  const contenido = []
  for (let i = 0; i < texto.length; i++) {
    contenido[i] = texto.substr(i, 1)
  }
  return contenido
}

const monyIntlRef = (precio) => {
  const number = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(precio)
  return number
}

const dateIntlRef = ({ date, locale = 'es-MX', type = 'all' }) => {

  /**
 * Hook de formato de fecha
 * @constructor
 * @param {string} type - numeric, month, day, hour,
 * @param {string} date - fecha en formato string
 */

  const dataInteOptions = () => {
    switch (type) {
      case 'numeric': 
        return {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'         
        }
      case 'month':
        return {
          month: 'long'
        } // 'numeric',
      case 'day':
        return {
          day: 'numeric'
        }
      case 'hour':
        return {
          hour: 'numeric',
          minute: 'numeric'
        }
      default:
        return {
          year: 'numeric',  
          month: 'long',
          day: 'numeric'
        }
    } 
  }

  const dateIntl = new Date(date)  
  if (isNaN(dateIntl)) {
    return new Intl.DateTimeFormat(locale, { ...dataInteOptions(), timeZone: 'UTC' }).format(new Date())
  } else {
    return new Intl.DateTimeFormat(locale, { ...dataInteOptions(), timeZone: 'UTC' }).format(dateIntl)
  }


}

module.exports = {
  NumerosaLetras,
  monyIntlRef,
  dateIntlRef
}
