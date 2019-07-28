const jwt = require('jsonwebtoken');

const config = require('../../config').AUTH;
const ROLES = config.ROLES;

// TODO: use certificate for encoding

function login(user) {
  return new Promise((resolve, reject) => {
    if (user)
      return jwt.sign({
          role: user.role,
          username: user.username,
          deviceId: user.deviceId,
          id: user.id
        }, config.SECRET, function (err, token) {
          if (err)
            return reject(new Error("Invalid token"));
          return resolve(token);
        }
      );

    return reject(new Error("Password or Username is incorrect"))
  });
}

// TODO: remove duplicating of jwt.verify()
function secureRoutes(role = config.ROLES.USER) {
  return (req, res, next) => {
    const token = req.cookies['x-access-token'] ||
      req.headers['x-access-token'] ||
      req.body.token ||
      req.query.token;

    if (!token)
      return res.status(403).send({error: 'No token provided.'});

    jwt.verify(token, config.SECRET, function (err, decoded) {
      if (err)
        return res.status(401).send({error: 'Failed to authenticate token.'});

      if (!isAccessGranted(role, decoded.role))
        return res.status(401).send({error: 'Access denied'});

      req.user = decoded;
      req.isAlreadyAuthenticatedFor = role;

      return next();
    });
  }
}

function isAccessGranted(minRole, providedRole) {
  if (providedRole === config.ROLES.ADMIN)
    return true;
  if (providedRole === config.ROLES.MODERATOR && minRole === config.ROLES.MODERATOR)
    return true;
  if (providedRole === config.ROLES.USER && minRole === config.ROLES.USER)
    return true;

  return false;
}

module.exports = {
  login, secureRoutes, isAccessGranted, ROLES
};