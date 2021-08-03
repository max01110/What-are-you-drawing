function waiting() {
    socket.emit('gameState', 0)
    socket.emit('connectedPlayers', () =>{ 
        runOnceDrawing = false
        setGradient(0, 0, w, l, color(157, 125, 163), color(0, 158, 253), 2);
        fill(0)
        noStroke()
        textSize(40)
        textAlign(CENTER)
        
        text("🔹 Room | " + connectedUsers[0].room, w/2, l*0.2);
        textSize(20) 
        text(("You are placed in the waiting room. Please wait for other players."), w/2, l*0.3);
        
    
        text(("Number Connected Players: " + connectedUsers.length), w/2, l*0.43);
        
        
        for (const i in connectedUsers) {
            textAlign(LEFT)
            if (connectedUsers[i].username == user.name) {
                text(("🟢 " + connectedUsers[i].username + " (you)"), w/2 - (w/10), ((i*0.13)+1)/2 * l);
            } else {
                text(("🟢 " + connectedUsers[i].username), w/2 - (w/10), ((i*0.13)+1)/2 * l);
            }
    
        }
    
        textAlign(CENTER)
        if (user.state === 1) {
            text(("Game starting soon"), w/2, l*0.8)
        } else if (user.state === 2) {
            socket.emit('timerVal', 0)
            text(("Game starting in " + countDownTimerStarting + " seconds"), w/2, l*0.8)
        } 
    })

    
    
}