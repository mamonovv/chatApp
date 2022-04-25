const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./assets/utils/messages')
const {userJoin, getCurrentUser} = require('./assets/utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

//Set static folder
app.use(express.static(path.join(__dirname, 'assets')))

const botName = 'ChatCord BOT'

//Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room)

        //Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'))

        //Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has join to chat`));

        //Runs when client disconnects
        socket.on('disconnect', () => {
            io.emit('message', formatMessage(botName, `${user.username} has left from chat}`))
        })
    })

    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

