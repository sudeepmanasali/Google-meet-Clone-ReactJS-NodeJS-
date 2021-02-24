const { response } = require("express");

const express = require('express');


const app = express()

const server = require('http').Server(app)

const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');

const peerServer = ExpressPeerServer(server, {
    debug: true
  });
const { v4: uuidV4 } = require('uuid')

app.set('view engine','ejs');
app.use(express.static('public'))

app.get('/leave/leftmeeting', (req, res) => {
  res.render('leavepage')
})
  
app.get("/joiningpage",(req,res)=>{
  res.render('joinpage')
})

app.get("/",(req,res)=>{
    res.render('homePage')
})





app.get('/meeting', (req, res) => {
    res.render('room', { roomId: req.params.room })
  })
  

  io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.to(roomId).broadcast.emit('user-connected', userId);
      // messages
      socket.on('message', (message) => {
        //send message to the same room
        io.to(roomId).emit('createMessage', message)
    }); 
  
      socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId)
      })
    })
  })

server.listen(3040, ()=>{console.log("server started")})








