module.exports = {
  PORT: 3000,
  HOST: "localhost",
  SCHEDULE_API_ENDPOINT: "http://calc.nuwm.edu.ua:3002/api/sched",
  SOCKET_IO_CONFIG: {
    pingInterval: 30000,
    pingTimeout: 10000
  }
};