const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const fs = require('fs')
const clk = require('chalk')
const syncRequest = require('sync-request')
const request = require('request');
const $ = require('cheerio');

const config = JSON.parse(fs.readFileSync(__dirname + '/config/config.json'))
let data = JSON.parse(fs.readFileSync(__dirname + '/config/data.json'))
let overlays = {}
let active = null


app.use('/control', express.static(__dirname + '/../web/build/control'))
app.use('/overlay', express.static(__dirname + '/../web/build/overlay'))

io.on('connection', function (socket) {
    socket.isOverlay = false
    console.log(clk.green.underline.bold(socket.handshake.address) + clk.green(' has connected'))
    socket.on('setVisible', function (view) {
        if (visibleViews[view.viewName] !== undefined) {
            visibleViews[view.viewName] = view.visible
            io.emit('visible', visibleViews)
            console.log(clk.green('Set visibility to ' + view.visible))
        } else {
            console.log(clk.red('View not found'))
        }
    })

    socket.on('getAll', function () {
        socket.emit('all', {
            overlays: overlays,
        })
    })

    socket.on('setData', function (newValue) {
        data = newValue
        io.emit('data', data)
        console.log(clk.green('Data updated!'))
    })

    socket.on('getData', function () {
        socket.emit('data', data)
    })

    socket.on('setActive', function (newActive) {
        active = newActive
        io.emit('active', active)
    })

    socket.on('saveToFile', function () {
        fs.writeFileSync('config/data.json', JSON.stringify(data))
    })

    socket.on('overlayAvailable', function (data) {
        socket.isOverlay = true
        socket.overlay = data
        if (!overlays.hasOwnProperty(data.overlay)) {
            overlays[data.overlay] = {
                visible: false,
                name: data.overlay
            }
        }
        console.log('Connected ' + data.overlay)
        io.emit('overlays', overlays)
    })

    socket.on('setOverlayVisible', function (data) {
        try {
            overlays[data.overlay].visible = data.boolean
            io.emit('overlays', overlays)
        } catch (ex) {
            console.log('No such overlay')
        }
    })

})

app.get('/toggle/:overlay', (req, res) => {
    if (overlays.hasOwnProperty(req.params.overlay)) {
        overlays[req.params.overlay].visible = !overlays[req.params.overlay].visible
        res.send('OK!')
    } else {
        console.error('No overlay named ' + req.params.overlay)
        console.error('Available overlays: ' + overlays)
        res.send('ERR!')
    }
    io.emit('overlays', overlays)
})

http.listen(config.port, function () {
    console.log('listening on *:' + config.port)
});