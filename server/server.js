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

const playoffMatches = {
  1: {
    0: 'https://www.toornament.com/tournaments/2428500586434699264/matches/2428561371944697885/',
    1: 'https://www.toornament.com/tournaments/2428500586434699264/matches/2428561371944697888/',
    2: 'https://www.toornament.com/tournaments/2428500586434699264/matches/2428561371944697894/',
    3: 'https://www.toornament.com/tournaments/2428500586434699264/matches/2428561371944697897/',
    4: 'https://www.toornament.com/tournaments/2428500586434699264/matches/2428561371944697882/',
    5: 'https://www.toornament.com/tournaments/2428500586434699264/matches/2428561371944697891/',
    6: 'https://www.toornament.com/tournaments/2428500586434699264/matches/2428561371944697879/'
  },
  2: {
    0: 'https://www.toornament.com/tournaments/2428500586434699264/matches/2428561371944697909/',
    1: 'https://www.toornament.com/tournaments/2428500586434699264/matches/2428561371944697915/',
    2: 'https://www.toornament.com/tournaments/2428500586434699264/matches/2428561371944697906/',
    3: 'https://www.toornament.com/tournaments/2428500586434699264/matches/2428561371944697912/',
    4: 'https://www.toornament.com/tournaments/2428500586434699264/matches/2428561371944697903/',
    5: 'https://www.toornament.com/tournaments/2428500586434699264/matches/2428561371944697900/'
  },
  3: {
    0: 'https://www.toornament.com/tournaments/2428500586434699264/matches/2428561371944697876/'
  }
};

function updatePlayoffs() {
  playoffs = scrapePlayoffs();
  io.emit('playoffs', playoffs);
}

function scrapePlayoffs() {

  return Object.keys(playoffMatches).map(bracketKey => {
    const bracket = playoffMatches[bracketKey];
    return {
      id: parseInt(bracketKey),
      matches: Object.keys(bracket).map(matchKey => {
        const matchUrl = bracket[matchKey];
        return scrapeMatch(matchUrl);
      })
    };
  });
}

function scrapeMatch(matchUrl) {
  const body = syncRequest('GET', matchUrl,).getBody().toString();
  const matchContainer = $('.match.format-header > .primary', body);
  return {
    leftOpponent: getMatchOpponent(matchContainer.find('.opponent-1')),
    rightOpponent: getMatchOpponent(matchContainer.find('.opponent-2')),
    state: getMatchState(matchContainer.find('.state')),
  }

}
function getMatchOpponent(opponentElement) {
  const nameElem = opponentElement.find('.name');
  if(nameElem.hasClass('disabled')) {
    return null;
  }
  return nameElem.text();
}
function getMatchState(stateElem) {
  const resultElem = stateElem.find('.result');
  if (resultElem.length === 0) {
    return {
      state: 'NOT_PLAYED'
    };
  }
  const leftScoreElem = resultElem.find('.result-1');
  const rightScoreElem = resultElem.find('.result-2');
  const leftScore = leftScoreElem.text();
  const rightScore = rightScoreElem.text();
  if (leftScoreElem.hasClass('win')) {
    return {
      state: 'LEFT_WIN',
      leftScore,
      rightScore
    }
  }
  if (rightScoreElem.hasClass('win')) {
    return {
      state: 'RIGHT_WIN',
      leftScore,
      rightScore
    }
  }
  return {
    state: 'IN_PROGRESS',
    leftScore,
    rightScore
  }
}


updateTeams();
updateGroups();
updatePlayoffs();
setInterval(updateTeams, 60 * 1000);
setInterval(updateGroups, 60 * 1000);
setInterval(updatePlayoffs, 60 * 1000);


