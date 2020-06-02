const jwt = require('jsonwebtoken');
const config = require('config');

//middleware functions have access to the req and res objects
//next is a callback we run once we are done to move
//to the next piece of middleware
module.exports = function (req, res, next) {
  //Get token from header
  const token = req.header('x-auth-token');

  //check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  //Verify token
  try {
    //decode token. first param is token itself, second param is jwtsecret
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
