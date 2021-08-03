function everyoneDraw() {
    if (mouseIsPressed) {
        if (mouseStart==false) {
            mouseStart = true;
            var objPlaceholer = {
                x: mouseX,
                y: mouseY,
                px: pmouseX,
                py: pmouseY,
                windowX: w,
                windowY: l
            }
            objPlaceholer = JSON.stringify(objPlaceholer)
            socket.emit('mouseBegin', objPlaceholer)
        }

        stroke(0);
        strokeWeight(strokeweight)
        line(mouseX, mouseY, pmouseX, pmouseY);
        mousePoint = {
            x: mouseX,
            y: mouseY,
            px: pmouseX,
            py: pmouseY,
            windowX: w,
            windowY: l
        }
        mousePoint = JSON.stringify(mousePoint);
        socket.emit('mouse', mousePoint)
    }
}