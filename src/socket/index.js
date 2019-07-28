module.exports = function (io) {
  let onlineCounter = 0;
  const chatRoom = io.of("/flood");

  chatRoom.on('connection', function (socket) {
    onlineCounter++;
    console.info("New client:", onlineCounter, socket.id);
    socket.emit('counter:update', onlineCounter);

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

    socket.emit('message:received', message);

    socket.on('disconnect', () => {
      onlineCounter--;
      socket.broadcast.emit('counter:update', onlineCounter);
    });
  });

  return io;
};