const jwt = require('jsonwebtoken')

module.exports = {

  verifyToken: (req, res, next) => {

    console.log('verifyToken', req, res, next)

    try {

      const { authorization } = req.headers
      const token = authorization.split('Bearer ')[1]
            
      jwt.verify(token, process.env.JWT_SECRET, (err, decodeToken) => {
        if (err) throw new Error('authentication error')

        req.decoded = decodeToken
        next()

      })
    } catch (error) {
      console.log(error)
      res.status(401).json({ message: 'authentication error' })
    }
  }
}
