const port = process.env.PORT || 8000;
const express = require('express');
const socket = require('socket.io');

const server = express();

//Static files
server.use(express.static('public'));
server.use('/scripts', express.static(__dirname + '/node_modules/'));

server.get('/', function (req, res) {
    res.send('/index.html');
});


const serverInstance = server.listen(port, function () {
    console.log(`listening on *:${port}`);
});

let io = socket(serverInstance);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // Handle chat event
    socket.on('paint', function (data) {
        console.log(data);

        io.sockets.emit('paint', data);
    });

});