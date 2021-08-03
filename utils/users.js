const e = require("express")

const usersOnline = []
let rooms = []

const addUser = ({ id, username, room }) => {
    //Clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if (!username || !room) {
        return {
            error: 'Room name is required!'
        }
    }

    //Check for existing user
    const existingUser = usersOnline.find((user) => {
        return user.room === room && user.username === username
    })
    //Validate username
    if (existingUser) {
        return {
            error: 'User already joined room!'
        }
    }
    //Store user
    const user = { id, username, room }
    usersOnline.push(user)
    let placeHolder = rooms.find((r) => r.name === room);
    if (placeHolder == undefined) {
        rooms.push({name: room, players: 1})
    } else {
        placeHolder.players+=1;
    }
    return { user }
}

const removeUser = (id) => {
    const index = usersOnline.findIndex((user) => user.id === id)
    let u = getUser(id)
    let placeHolder = rooms.find((r) => r.name === u.room);
    if (placeHolder !== undefined) {
        if (placeHolder.players > 1) {
            placeHolder.players-=1
        } else if (placeHolder.players <= 1) {
            const index = rooms.findIndex((r) => r.name === u.room)
            rooms.splice(index, 1)[0]
        }
        if (index !== -1) {
            return usersOnline.splice(index, 1)[0]
        }
    }
}

const getUser = (id) => {
    return usersOnline.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const usersInRoom = []

    for (i in usersOnline) {
        if (usersOnline[i].room === room) {
            usersInRoom.push(usersOnline[i])
        }
    }
    return usersInRoom
    //return users.filter((user) => user.room === room)
}

const getRooms = () => {
    return rooms;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getRooms
}