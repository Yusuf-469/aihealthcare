import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'healthcare-platform-secret-key'

export function authenticateSocket(socket, next) {
  const token = socket.handshake.auth.token
  
  if (!token) {
    // Allow anonymous connections for demo
    socket.userId = `anonymous_${Date.now()}`
    return next()
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    socket.userId = decoded.userId
    next()
  } catch (error) {
    socket.userId = `anonymous_${Date.now()}`
    next()
  }
}

export function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }
  
  const token = authHeader.split(' ')[1]
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
