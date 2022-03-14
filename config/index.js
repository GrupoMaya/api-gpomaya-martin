const NODE_ENV = process.env.NODE_ENV

console.log('NODE_ENV:', NODE_ENV)

const config = {
  develop: {
    MONGO_URI: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI_DEV}`
  },
  production: {
    MONGO_URI: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}`
  }

}

module.exports = config[NODE_ENV]
