const express = require('express'); //requires express module
const socket = require('socket.io'); //requires socket.io module
var Timer = require('time-counter')
const app = express();

//Modules:
const { randomWord } = require('./utils/functions')
const { addUser, removeUser, getUser, getUsersInRoom, getRooms } = require('./utils/users')


var PORT = process.env.PORT || 3000;
const server = app.listen(PORT); //tells to host server on localhost:3000

//Playing variables:
app.use(express.static('public')); //show static files in 'public' directory
console.log('Server is running');
const io = socket(server);

//Game Variables:
var gameActive = false;
var runOnce = false;
var runOnce2 = false;
var runOnce3 = false;
var answerRunOnce = false;

let users = [];
let waitingUsers = [];
let startingCounter;
let gameCounterValue;
let answerTimerValue;

var countDownTimerStarting = new Timer({
    direction: "down",
    startValue: 20,
});

countDownTimerStarting.on('change', (y) => {
    startingCounter = y;
});


var gameTimer = new Timer({
    direction: "down",
    startValue: 10,
});

gameTimer.on('change', (y) => {
    gameCounterValue = y;
});

var answerTimer = new Timer({
    direction: "down",
    startValue: 5,
});

answerTimer.on('change', (y) => {
    answerTimerValue = y;
});

var topics = ["well", "rain", "underground", "transpiration"]
var topic = ""
var roundOn = false
var c = 0;
var blue1;
var blue2;
var red1;
var red2;
var pointString;
var points = {
    blue: 0,
    red: 0
}
var runState = true;

var mouseAndroid = 0;
var runOnceEnd = false;
var someoneGuessed = false;
var connectedUsersNames = []
var valid = true;
var s = false;
var word = ""

//P5 Socket.io Connection------------------
io.on('connection', (socket) => {

    //Clients emits this and a user loggs in --> sends back number of connected users
    socket.on('join', (username) => {
        if (typeof username === 'string') {
            username = JSON.parse(username)
        }

        const user = {
            username: username.name,
            id: socket.id,
            points: 0,
            state: username.state,
            room: ""
        }
        users.push(user);
        connectedUsersNames = []
        for (const obj in users) {
            connectedUsersNames.push(users[obj].username)
        }

        // if (users.length < 3) {
        //     users.push(user);
        //     io.emit('numberConnected', users.length)
        //     
        //     io.emit('connectedPlayersA', connectedUsersNames.toString())
        // } else {
        //     waitingUsers.push(user)
        //     socket.emit('gameAlreadyInProgress', 0)
        // }
    })

    socket.on('joinRoom', (userInfo, callback) => {
        userInfo = JSON.parse(userInfo)
        const { error, user } = addUser({ id: socket.id, username: userInfo.name, room: userInfo.room})
    
        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('gameState', 2)


        console.log(getUsersInRoom(user.room))
        callback()
    }) 


    socket.on('getRooms', ()=>{
        socket.emit('getRooms', getRooms())
    })
    socket.on('connectedPlayers', (callback) => {
        var user = getUser(socket.id)
        var ru = getUsersInRoom(user.room)
        io.emit('connectedPlayers', ru)
        callback()
    })  





















    socket.on('gameState', () => {
        const user = getUser(socket.id)
     
        if (user != undefined) {
            const roomI = getRooms().findIndex((r) => r.name === user.room)
        
            const room = getRooms()[roomI]
        
            if (room.players >= 3) {

            
                // io.to(room).emit('event', 'message');
                // 

                if (runOnce == false) {
                    runOnce = true;
                    c = 0;
                }
                startingCounter = "0:00"
                if (startingCounter === "0:00") {
                    if (runOnce2 === false) {
                        runOnce2 = true;
                        runOnce3 = false;
                    }

                    //------------------------------------------------------------------------
                    //REFERENCE-------------
                    //0=not logged in
                    //1=logged in, lobbies room
                    //2=logged in, in room, game starting soon (countdown timer)
                    //3=logged in, guesser
                    //4=logged in, drawer
                    //5=answer screen
                    //6=final end screen
                    //-1 = test

                    //Rounds
                    var players = getUsersInRoom(room.name)
                    if (c >= players.length) {
                        console.log('end of game')
                        //End game or next round
                    } else {

                        if (roundOn == false) {
                            //Have algorithm take new topics and make sure not to take topics already used
                            word = randomWord()

    
                            runOnceGame = false;
                            roundOn = true;
                            runState = true;
                            someoneGuessed = false;
                            c++;
                        } else { 
                            if (runOnceGame == false) {
                                runOnceGame = true;
                                io.to(room.name).emit('answerWord', word)
                                answerRunOnce = false;
                                gameTimer.start();
                                                                
                                //Drawer:
                               
                                var drawer = players[c]
                                io.to(drawer.id).emit('gameState', 4)
                                //Guessers:
                                console.log(players.length)
                                for (var p=0; p<=(players.length)-1; p++) {
                                    if (players[p].id != drawer.id) {
                                        io.to(players[p].id).emit('gameState', 3)
                                    }
                                }
                            }

                            io.to(room.name).emit('gameCounter', gameCounterValue)

                            if (gameCounterValue === "0:00") {
                                if (answerRunOnce == false) {
                                    if (someoneGuessed == false) {
                                        points.red = points.red + 1;
                                        points.blue = points.blue + 1;
                                        io.emit('roundWinner', "Nobody guessed! Both gets the point")
                                    }
                                    answerRunOnce = true;
                                    roundOn = true;
                                    // runOnceGame = false;
                                    answerTimer.start()
                                        // io.emit('answerWord', topic)
                                    pointString = "Points: R: " + points.red + " B: " + points.blue + "  "
                                    io.emit('answerWord', topic)
                                        // change
                                    io.emit('points', pointString)
                                    io.emit('gameState', 5)
    
                                }
    
                                if (answerTimerValue == "0:00") {
                                    answerTimer.stop();
                                    answerTimeValue = ""
                                    roundOn = false;
    
                                }
    
    
                                io.emit('answerCounter', answerTimerValue)
                            }
                        }
                    }

                } else {
                    // io.emit('gameState', 2) //Game starting soon (start countdown timer)

                }

            } else {
                if (runState === true) {
                    // io.emit('gameState', 1)
                    startingCounter = null
                    runOnce = false
                    runOnce2 = false
                    runState = false;
                    roundOn = false;
                    c = 0;
                    runOnceEnd = false;
                }
            }
        }
    })


    socket.on('guess', (guess) => {

    })
    
    //Sends back value of starting countdown timer
    socket.on('timerVal', (a) => {
        io.emit('counterVal', startingCounter)
    })

    socket.on('nameInput', (n) => {
        s = false
        if (connectedUsersNames.length > 0) {
            for (const i in connectedUsersNames) {
                if (connectedUsersNames[i] === n) {
                    s = true
                } else {}
            }
            if (s == true) {
                socket.emit('validity', false)
            } else {
                socket.emit('validity', true)
            }
        } else {
            socket.emit('validity', true)
        }

    })

   
    //Drawing --> receives and send backs x,y coordinates for drawing
    // socket.on('mouse', (data) => {
    //     if (socket.id == blue1) {
    //         sendMouse(data, red2)
    //     } else if (socket.id == blue2) {
    //         sendMouse(data, red1)
    //     } else if (socket.id == red1) {
    //         sendMouse(data, blue2)
    //     } else if (socket.id == red2) {
    //         sendMouse(data, blue1)
    //     }

    socket.on('mouse', (data) => {
        socket.broadcast.emit('mouse', data)
    })

    socket.on('mouseBegin', (obj) => {
        socket.broadcast.emit('mouseBegin', obj)
    })

    socket.on('mouseEnded', (obj) => {
        socket.broadcast.emit('mouseEnded', obj)
    })

    socket.on('clear', () => {
        socket.broadcast.emit('clear')
    })


    //Removes the specific socket from the "users" array and sends back the new number of connected players
    socket.on("disconnect", () => {
        i = 0;
        console.log("DISCONNECTED: " + socket.id);
        removeUser(socket.id)
        users = users.filter(u => u.id !== socket.id)
        connectedUsersNames = []
        for (const obj in users) {
            connectedUsersNames.push(users[obj].username)
        }
        io.emit('connectedPlayers', connectedUsersNames)
        io.emit('numberConnected', users.length)
    });
})