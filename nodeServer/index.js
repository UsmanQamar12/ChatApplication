// Node Server which will handle socket io connections
const io = require('socket.io')(8000, {
    cors: {
        origin: "http://127.0.0.1:5501", // Allow your client origin
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

const users = {};

io.on('connection', (socket) =>{
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{
         console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, Broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', () =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
      
});