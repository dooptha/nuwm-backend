module.exports = function (io) {

  io.of("/flood").on('connection', function (socket) {

    console.log("connected", socket.id);

    socket.on('message:send', function (data) {
      const message = {
        body: data.body,
        sender: data.sender,
        date: Date.now()
      };
      console.log(data);
      socket.broadcast.emit('message:received', message)
    });


    const message = {
      body: "test message",
      sender: false,
      date: Date.now()
    };

    socket.emit('message:received', message)
  });
};