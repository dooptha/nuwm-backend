const nanoid = require('nanoid');
const MessagesHistory = require('../services/MessagesHistory');

const history = new MessagesHistory();

module.exports = function (io) {
  let onlineCounter = 0;
  const chatRoom = io.of("/flood");

  chatRoom.on('connection', function (socket) {
    onlineCounter++;
    console.info("New client:", onlineCounter, socket.id);
    chatRoom.emit('counter:update', onlineCounter);

    MessagesHistory.getLastMessages()
      .then(messages => socket.emit('messages:history', messages));

    socket.on('message:send', function (data) {
      const message = {
        id: nanoid(),
        body: data.body,
        sender: data.sender,
        date: Date.now()
      };
      history.emit('save', message);
      chatRoom.emit('message:received', message)
    });

    socket.on('disconnect', () => {
      onlineCounter--;
      socket.broadcast.emit('counter:update', onlineCounter);
    });
  });

  return io;
};