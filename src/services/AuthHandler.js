const jwt = require('jsonwebtoken');

const config = require('../../config').AUTH;

class AuthManager {
  constructor(db) {
    this.db = db;
  }

  login(username, deviceId) {
    return new Promise((resolve, reject) => {
      const user = this.db
        .get('users')
        .find({username, deviceId})
        .value();

      if (user)
        return jwt.sign({
            role: user.role, id: user.id
          }, config.SECRET, {
            expiresIn: '24h'
          }, function (err, token) {
            if (err)
              return reject(new Error("Invalid token"));
            return resolve(token);
          }
        );

      return reject(new Error("Password or Username is incorrect"))
    });
  }

  // TODO: remove duplicating of jwt.verify()
  secureRoutes(role = config.ROLES.USER) {
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

        if (!AuthManager.isAccessGranted(role, decoded.role))
          return res.status(401).send({error: 'Access denied'});

        req.user = decoded;
        req.isAlreadyAuthenticatedFor = role;

        return next();
      });
    }
  }

  static isAccessGranted(role, providedRole) {
    if (providedRole === config.ROLES.ADMIN)
      return true;
    if (providedRole === config.ROLES.MODERATOR && role === config.ROLES.MODERATOR)
      return true;
    if (providedRole === config.ROLES.USER && role === config.ROLES.USER)
      return true;

    return false;
  }

}

module.exports = AuthManager;