const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { checkAuth } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/collab-code', { useNewUrlParser: true, useUnifiedTopology: true });

// Import routes
const authRoutes = require('./routes/auth');
const codeRoutes = require('./routes/code');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/code', checkAuth, codeRoutes);

// Real-time communication
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', (room) => {
        socket.join(room);
    });

    socket.on('codeChange', (data) => {
        socket.to(data.room).emit('codeChange', data.code);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
