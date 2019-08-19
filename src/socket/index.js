const messages = require('../services/MessagesHistory');
const nanoid = require('nanoid');

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
        id: nanoid(),
        body: data.body,
        sender: data.sender,
        date: Date.now()
      };
      messages.push(message.id, message);
      chatRoom.emit('message:received', message)
    });

    socket.on('disconnect', () => {
      onlineCounter--;
      socket.broadcast.emit('counter:update', onlineCounter);
    });
  });

  return io;
};