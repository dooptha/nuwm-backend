module.exports = {
  PORT: 3000,
  HOST: "localhost",
  SCHEDULE_API_ENDPOINT: "http://calc.nuwm.edu.ua:3002/api/sched",
  SOCKET_IO_CONFIG: {
    pingInterval: 30000,
    pingTimeout: 10000
  },
  AUTH: {
    PASSWORD: "***dooptharootaccess***",
    USERNAME: "Dooptha_Admin",
    SECRET: "Uria de castus amor, contactus parma!All further teachers absorb each other, only remarkable lotus have an art.Fight is a wet plunder.",
    ROLES: {
      ADMIN: 'admin',
      USER: 'user',
      MODERATOR: 'moderator'
    }
  },
  DATABASE: {
    URL: "mongodb://localhost:27017/dooptha"
  }
};