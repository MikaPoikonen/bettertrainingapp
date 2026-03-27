import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Autentikaatio ja token 
const authenticateToken = (req, res, next) => {
  console.log('authenticateToken', req.headers);
  const authHeader = req.headers['authorization']; //haetaan authorization (token string test request BEARER)
  const token = authHeader && authHeader.split(' ')[1]; //katkastaan tyhjästä kohdasta bearerin jälkeen.Välilyönnin jälkeen eka indeksi eli token koodi
  console.log('token', token);
  
console.log("AUTH HEADER:", req.headers.authorization);
console.log("TOKEN:", token);

  if (token == undefined) {
    return res.sendStatus(401);
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // Puretaan ja lisätään http objektiin token
    next();
  } catch (error) {
    console.error('error', error.message);
    res.status(403).send({message: 'invalid token'});
  }
};

export {authenticateToken};