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
let show = false
let teams = null
let overlays = {}

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
      overlays: overlays,
      groups: groups,
      activeGroup: activeGroup,
      playoffs: playoffs,
      activePlayoffGroup: activePlayoffGroup,
    })
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
    updateGroups()
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
    if (socket.authed) {
      try {
        overlays[data.overlay].visible = data.boolean
        io.emit('overlays', overlays)
      } catch (ex) {
        console.log('No such overlay')
      }
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

function updateTeams () {
  const body = syncRequest('GET',
    'https://www.toornament.com/tournaments/2428500586434699264/participants/',).getBody().toString();
  teams = $('.participant > .identity > .name', body).toArray().map(it => ({ name: $(it).text() }));
}

function updateGroups () {
  groups = [
    {
      ...scrapeGroup('https://www.toornament.com/tournaments/2428500586434699264/stages/' +
      '2428547263918301184/groups/2428551003794432000/'),
      id: 'A',
      name: 'A',
      finished: false
    },
    {
      ...scrapeGroup('https://www.toornament.com/tournaments/2428500586434699264/stages/' +
        '2428547263918301184/groups/2428551003827986560/'),
      id: 'B',
      name: 'B',
      finished: false
    }
  ];
  io.emit('groups', groups)
}
function scrapeGroup(url) {
  const body = syncRequest('GET', url,).getBody().toString();
  const rankingContainers = $('.ranking-container', body).toArray();
  return {
    teams: rankingContainers.map(it => {
      const container = $(it);
      const rankingPosId = container.attr('data-toggle');
      const teamName = container.find('.ranking-item .name').text();
      return {
        name: teamName,
        results: getGroupResults(teamName, rankingPosId, body)
      }
    })
  };
}

function getGroupResults(teamName, rankingPosId, body) {
  const rankingPos = $('#' + rankingPosId, body);
  const matchRecords = rankingPos.find('.match > .record').toArray();
  return matchRecords.map(it => {
    const record = $(it);
    const winner = record.find('.name.win');
    if (winner.length === 0) {
      return 'NOT_PLAYED';
    }
    if (winner.text() === teamName) {
      return 'WIN';
    }
    return 'LOSS';
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

updateTeams();
updateGroups();
setInterval(updateTeams, 60 * 1000);
setInterval(updateGroups, 60 * 1000);


