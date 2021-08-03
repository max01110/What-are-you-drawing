function lobbiesScreen() {
    createRoomInput.style('width', '15%')
    createRoomInput.style('height', '5%')
    createRoomInput.position(w/2, l*0.35)
    createRoomInput.style('line-height', '4')
    createRoomInput.style('fontSize', '18px')
    createRoomInput.style('placeholder', 'Username')

    createRoomButton.style('width', '15.4%')
    createRoomButton.style('height', '5%')
    createRoomButton.position(w/2, l*0.45)
    createRoomButton.style('color', '#fff !important')
    createRoomButton.style('background-color', '#60a3bc')
    createRoomButton.style('text-transform', 'uppercase')
    createRoomButton.style('transition', 'all 0.4s ease 0s;')
    createRoomButton.style('border-radius', '50px')
    createRoomButton.style('border', 'none')

    createRoomInput.show()
    createRoomButton.show()
    

    setGradient(0, 0, w, l, color(157, 125, 163), color(0, 158, 253), 2);
    textSize(60)
    textAlign(CENTER)
    fill(0)
    noStroke()
    text("Rooms", w/2, l*0.15);
    
    textSize(35)
    fill(200)
    text("Create Room", w/2, l*0.25);

    text("Join Room", w/2, l*0.7);


    //Logged in tab:
    fill(200, 200, 200)
    rectMode(CENTER)
    rect(0, l*0.1, 200+ (user.name.length)*12, 30, 10)
    textAlign(LEFT)
    textSize(barFont*0.7)
    fill(0)
    text("Logged in: " + user.name, 5, l*0.11);
    rectMode(CORNER)

    
    for (const i in rooms) {
        textAlign(LEFT)
        textSize(barFont)
        text(("🔹 Room " + (parseInt(i)+1).toString() + " | " + rooms[i].name + " | " + rooms[i].players + " players"), w/2 - (w/8), ((((i*0.13)+1)/2)+0.28) * l);
    }

    createRoomButton.mousePressed(()=> {
        var userData = {
            name: user.name,
            room: createRoomInput.value()
        }
        userData = JSON.stringify(userData)
        socket.emit('joinRoom', userData, (error) => {
            if (error) {
                console.log("Inside callback error")
                alert(error)   
            }

        })

       });
  
}