const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const fs = require('fs')
const clk = require('chalk')
const syncRequest = require('sync-request')
const request = require('request')
const OBSWebSocket = require('obs-websocket-js');

const obs = new OBSWebSocket();
const config = JSON.parse(fs.readFileSync(__dirname + '/config/config.json'))
let data = JSON.parse(fs.readFileSync(__dirname + '/config/data.json'))
let show = false
let scenes = []
let teams = null
let overlays = {}
let transitions = []
let programScene = null
let previewScene = null

let groups = null
let activeGroup = 0
let playoffs = null
let activePlayoffGroup = 0

const scoreByResult = {
  1: 3,
  2: 1,
  3: 0,
}

app.use('/control', express.static(__dirname + '/../web/build/control'))
app.use('/overlay', express.static(__dirname + '/../web/build/overlay'))

io.on('connection', function (socket) {
  socket.authed = false
  // FIXME
  socket.authed = true

  socket.isOverlay = false
  console.log(clk.green.underline.bold(socket.handshake.address) +
    clk.green(' has connected'))
  console.log(clk.green('Waiting for authentification...'))
  socket.on('authenticate', function (password) {
    if (password === config.password) {
      socket.authed = true
      console.log(clk.green('Successfully authenticated'))
      socket.emit('authenticate', true)
    } else {
      socket.authed = false
      console.log(clk.red('Failed to authenticate'))
      socket.emit('authenticate', false)
    }
  })

  socket.on('disconnect', function () {
    if (socket.isOverlay) {
      try {
        for (var i = 0; i <
        overlays[socket.overlay.scene][socket.overlay.overlay].sockets.length; i++) {
          if (overlays[socket.overlay.scene][socket.overlay.overlay].sockets[i] ===
            socket.id) {
            overlays[socket.overlay.scene][socket.overlay.overlay].sockets.splice(
              i, 1)
            console.log('overlay lost')
            break
          }
        }
      } catch (ex) {
        console.log('No such overlay')
      }
    }
  })

  socket.on('setVisible', function (view) {
    if (socket.authed) {
      if (visibleViews[view.viewName] !== undefined) {
        visibleViews[view.viewName] = view.visible
        io.emit('visible', visibleViews)
        console.log(clk.green('Set visibility to ' + view.visible))
      } else {
        console.log(clk.red('View not found'))
      }
    } else {
      console.log(clk.red('Not authed'))
    }
  })

  socket.on('getAll', function () {
    socket.emit('all', {
      program: programScene,
      preview: previewScene,
      scenes: scenes,
      transitions: transitions,
      overlays: overlays,
      groups: groups,
      activeGroup: activeGroup,
      playoffs: playoffs,
      activePlayoffGroup: activePlayoffGroup,
    })
  })

  socket.on('getVisible', function () {
    socket.emit('visible', visibleViews)
  })

  socket.on('setData', function (newValue) {
    if (socket.authed) {
      data = newValue
      io.emit('data', data)
      console.log(clk.green('Data updated!'))
    } else {
      console.log(clk.red('Not authed'))
    }
  })

  socket.on('setPreview', function (sceneName) {
    if (socket.authed) {
      console.log('Changing preview scene to: ' + sceneName)
      obs.send('SetPreviewScene', {"scene-name": sceneName})
    }
  })

  socket.on('getData', function () {
    socket.emit('data', data)
  })

  socket.on('getTeams', function () {
    socket.emit('teams', teams)
  })

  socket.on('updateTeams', function () {
    updateTeams()
    io.emit('teams', teams)
  })

  socket.on('getGroups', function () {
    socket.emit('groups', groups)
    socket.emit('activeGroup', activeGroup)
  })

  socket.on('getPlayoffs', function () {
    socket.emit('playoffs', playoffs)
    socket.emit('activePlayoffGroup', activePlayoffGroup)
  })

  socket.on('updateMatches', function () {
    updateMatches()
  })

  socket.on('setActiveGroup', function (newActiveGroup) {
    activeGroup = newActiveGroup
    io.emit('activeGroup', activeGroup)
  })

  socket.on('setActivePlayoffGroup', function (newActivePlayoffGroup) {
    activePlayoffGroup = newActivePlayoffGroup
    io.emit('activePlayoffGroup', activePlayoffGroup)
  })

  socket.on('saveToFile', function () {
    fs.writeFileSync('config/data.json', JSON.stringify(data))
  })

  socket.on('overlayAvailable', function (data) {
    socket.isOverlay = true
    socket.overlay = data
    if (!overlays.hasOwnProperty(data.scene)) {
      overlays[data.scene] = {}
    }
    if (!overlays[data.scene].hasOwnProperty(data.overlay)) {
      overlays[data.scene][data.overlay] = {
        visible: false,
        name: data.overlay,
        sockets: [],
      }
    }
    overlays[data.scene][data.overlay].sockets.push(socket.id)
    console.log('Connected ' + data.overlay + ' for ' + data.scene)
    io.emit('overlays', overlays)
  })

  socket.on('setOverlayVisible', function (data) {
    if (socket.authed) {
      try {
        overlays[data.scene][data.overlay].visible = data.boolean
        io.emit('overlays', overlays)
      } catch (ex) {
        console.log('No such overlay')
      }
    }
  })

  socket.on('transition', function (transition) {
    if (socket.authed) {
      request(
        'http://' + config.vmixIp + ':8088/api/?function=' + transition.command,
        function () {
          setTimeout(function () {
            request('http://' + config.vmixIp + ':8088/API/',
              function (error, response, body) {
                previewScene = parsePreview(body)
                programScene = parseProgram(body)
                io.emit('preview', previewScene)
                io.emit('program', programScene)
              })
          }, parseInt(transition.duration) + 50)
        })
    }
  })
})

http.listen(config.port, function () {
  console.log('listening on *:' + config.port)
})

function updateTeams () {
  teams = JSON.parse(
    syncRequest('GET',
      'https://api.toornament.com/v1/tournaments/' + config.toornamentId +
      '/participants',
      {
        'headers': {
          'X-Api-Key': config.toornamentKey,
        },
      },
    ).getBody())
}

function updateMatches () {
  return request.get(
    'https://api.toornament.com/v1/tournaments/' + config.toornamentId +
    '/matches',
    {
      headers: {
        'X-Api-Key': config.toornamentKey,
      },
      json: true,
    },
    (err, res, body) => {
      if (err) {
        return console.log(err)
      }
      groups = getGroups(body)
      io.emit('groups', groups)
      playoffs = getPlayoffs(body)
      io.emit('playoffs', playoffs)
    })
}

function getGroups (matches) {
  function compute (matches) {
    let groups = {}
    for (let match of matches.filter(match => match.stage_number === 1)) {
      let groupId = match.group_number
      let group = groups[groupId]
      if (group == null) {
        group = groups[groupId] = {
          id: groupId,
          finished: true,
          teams: {},
        }
      }
      for (let opponent of match.opponents) {
        if (opponent.participant == null) {
          continue
        }
        let teamId = opponent.participant.id
        let team = group.teams[teamId]
        if (team == null) {
          team = group.teams[teamId] = {
            id: teamId,
            name: opponent.participant.name,
            score: 0,
          }
        }
        if (opponent.result in scoreByResult) {
          team.score += scoreByResult[opponent.result]
        }
        if (match.status !== 'completed') {
          group.finished = false
        }
      }
    }
    return groups
  }

  function normalize (groups) {
    let groupChars = '0ABCDEFGH'
    return Object.values(groups).sort((a, b) => a.id - b.id).map(group => ({
      id: group.id,
      name: 'Grupp ' + groupChars.charAt(group.id),
      finished: group.finished,
      teams: Object.values(group.teams).
        sort((a, b) => b.score - a.score).
        map(team => ({
          name: team.name,
          score: team.score,
        })),
    })).map(group => {
      let marked = 0
      let scoreRequired = null
      group.teams.forEach(team => {
        if (marked < 2) {
          marked++
          team.willAdvance = true
          scoreRequired = team.score
        } else {
          team.willAdvance = team.score >= scoreRequired
        }
      })
      return group
    })
  }

  return normalize(compute(matches))
}

function getPlayoffs (matches) {
  function compute (matches) {
    let groups = {}
    for (let match of matches.filter(match => match.stage_number === 2)) {
      let group = groups[match.group_number]
      if (group == null) {
        group = groups[match.group_number] = {
          id: match.group_number,
          rounds: {},
        }
      }
      let round = group.rounds[match.round_number]
      if (round == null) {
        round = group.rounds[match.round_number] = {
          id: match.round_number,
          matches: {},
        }
      }
      round.matches[match.number] = match
    }
    return groups
  }

  function normalize (groups) {
    return Object.values(groups).sort((a, b) => a.id - b.id).map(group => ({
      id: group.id,
      rounds: Object.values(group.rounds).
        sort((a, b) => a.id - b.id).
        map(round => ({
          id: round.id,
          matches: Object.values(round.matches).
            sort((a, b) => a.id - b.id).
            map(match => ({
              finished: match.status === 'completed',
              teams: getTeams(match),
            })),
        })),
    }))

  }

  function getTeams (match) {
    return fixScore(match.opponents.map(opponent => ({
      name: opponent.participant != null ? opponent.participant.name : null,
      isLoser: opponent.result === 3,
      score: opponent.score != null ? opponent.score : 0,
      result: opponent.result,
    })))
  }

  function fixScore (teams) {
    if (teams.some(team => team.score > 10)) {
      for (let team of teams) {
        team.score = team.result === 1 ? 1 : 0
      }
    }
    return teams
  }

  return normalize(compute(matches))
}

// FIXME: Those should probably no be commented out
// updateMatches()
// setInterval(updateMatches, 10 * 1000)

function updateScenes () {
  obs.send('GetSceneList').then(res => {
    console.log(res)
    scenes = []
    res.scenes.forEach(scene => scenes.push(scene.name));
    console.log("Updated scenes! Available scenes: " + scenes);
  });
}

function sceneHasOverlay (scene, overlay) {
  overlays[scene].forEach(function (element) {
    if (element.name === overlay) {
      return true
    }
  })
  return false
}

obs.on('error', err => {
  console.error('socket error:', err);
});

obs.on('ConnectionOpened', () => {
  updateScenes()
})

obs.on('PreviewSceneChanged', event => {
  console.log("Got update! Broadcasting new preview scene: " + event['scene-name'])
  io.emit('preview', event['scene-name'])
})
obs.on('SwitchScenes', event => {
  console.log("Got update! Broadcasting new program scene: " + event['scene-name'])
  io.emit('program', event['scene-name'])
})
obs.on('TransitionBegin', event => {
  console.log("Got update! Transition " + event['name'] + " started! Transitioning form " +
    event['from-scene'] + " to " + event['to-scene'] + ", duration " +
    event['duration'] + "ms")
})
obs.on('TransitionListChanged', event => {
  updateTransitions()
})
obs.on('TransitionDurationChanged', event => {
  updateTransitions()
})

function updateTransitions () {
  obs.sendCallback('GetTransitionList', transitions => {
    console.log(transitions)
  })
}

let obsWebSocketConnectionDetails;
if (config.obs.password === '') {
  obsWebSocketConnectionDetails = { address: config.obs.ip + ':' + config.obs.port };
} else {
  obsWebSocketConnectionDetails = { address: config.obs.ip + ':' + config.obs.port, password: config.obs.password };
}
obs.connect(obsWebSocketConnectionDetails).then(() => {
  console.log('OBS connected!');
  updateTransitions()
  updateScenes()
}).catch(err => {
  console.error("Failed to connect to OBS!");
  console.error(err);
});