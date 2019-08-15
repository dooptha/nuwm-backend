const History = require('../services/HistoryQueue');
const messages = new History(50);

module.exports = function (io) {
  let onlineCounter = 0;
  const chatRoom = io.of("/flood");

  chatRoom.on('connection', function (socket) {
    onlineCounter++;
    console.info("New client:", onlineCounter, socket.id);
    chatRoom.emit('counter:update', onlineCounter);
    socket.emit('messages:history', messages.get());

    socket.on('message:send', function (data) {
      const message = {
        body: data.body,
        sender: data.sender,
        date: Date.now()
      };
      messages.push(message);
      socket.broadcast.emit('message:received', message)
    });

    socket.on('disconnect', () => {
      onlineCounter--;
      socket.broadcast.emit('counter:update', onlineCounter);
    });
  });

  return io;
};