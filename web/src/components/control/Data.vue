<template lang="pug">
  .container
    .panel.panel-default
      .panel-heading Countdown (seconds)
      .panel-body
        .row
          .col-xs-9
            .form-group
              input.form-control(v-model="countdownLength" :disabled="data.countdown.running")
          .col-xs-3
              button.btn.btn-primary.btn-block(v-if="!data.countdown.running" @click="startCountdown()")
                | Start countdown
              button.btn.btn-danger.btn-block(v-else @click="stopCountdown()")
                | Stop countdown
    .panel.panel-default
      .panel-heading Casters
      .panel-body
        .row
          .col-xs-6
            .form-group
              label.control-label IGN
              input.form-control(v-model="data.casters.left.name")
            .form-group
              label.control-label Info
              input.form-control(v-model="data.casters.left.nick")
          .col-xs-6
            .form-group
              label.control-label IGN
              input.form-control(v-model="data.casters.right.name")
          .col-xs-6
            .form-group
              label.control-label Info
              input.form-control(v-model="data.casters.right.nick")
    .panel.panel-default
      .panel-heading Team text
      .panel-body
        .form-group
          input.form-control(v-model="data.teams.text")
    .row
      .col-xs-12.col-sm-5
        .panel.panel-default
          .panel-heading Left Team
          .panel-body
            .form-group
              select.form-control(v-model="data.teams.left")
                option(v-bind:value="nullTeam") NULL
                option(v-for="team in teams" v-bind:value="team") {{team.name}}
      .col-xs-12.col-sm-2
        button.btn.btn-primary.btn-block.btn-lg(v-on:click="swapTeams()") Swap
        button.btn.btn-default.btn-block.btn-sm(v-on:click="updateTeams()") Update list
      .col-xs-12.col-sm-5
        .panel.panel-default
          .panel-heading Right Team
          .panel-body
            .form-group
              select.form-control(v-model="data.teams.right")
                option(v-bind:value="nullTeam") NULL
                option(v-for="team in teams" v-bind:value="team") {{team.name}}
    .maps.row
      .map(v-for="map in maps")
        .panel.panel-default
          .panel-heading Map {{ map }}
          .panel-body
            .form-group
              label.control-label Map name
              select.map-button.form-control(v-model="data.maps[map - 1].map")
                option(value="UNKNOWN") UNKNOWN
                option(v-for="map in availableMaps" v-bind:value="map") {{ map }}
              //button.map-button.btn.btn-lg(v-bind:class="isFocused(0) ? 'btn-success' : 'btn-danger'",
              //v-on:click="isFocused(0) ? focus(null) : focus(0)") Focus
              label.control-label Who selected?
              select.map-button.form-control(v-model="data.maps[map - 1].selectedBy")
                option(value="left") Left
                option(value="right") Right
              label.control-label Text
              input.form-control.map-button(v-model="data.maps[map - 1].text")
    .form-group
      button.btn.btn-success.btn-lg(v-on:click="saveData()") SAVE
      button.btn.btn-danger.btn-lg(v-on:click="reset()") RESET
</template>

<script>
  export default {
    name: 'Data',
    mounted: function () {
      this.$socket.emit('getData');
      this.$socket.emit('getTeams');
    },
    data () {
      return {
        maps: [1, 2, 3, 4, 5],
        availableMaps: ['Cache', 'Dust2', 'Inferno', 'Mirage', 'Nuke', 'Overpass', 'Train'],
        data: null,
        dataBackup: null,
        countdownLength: 0,
        countdownInterval: null,
        teams: [],
        nullTeam: {
          'id': '???',
          'name': '???',
          'logo': null
        }
      };
    },
    sockets: {
      data: function (data) {
        this.data = data;
        this.dataBackup = { ...data };
        if(data.countdown.running && this.countdownInterval == null) {
          this.startInterval();
        }
        if(!data.countdown.running && this.countdownInterval != null) {
          this.stopInterval();
        }
        this.countdownLength = Math.floor(Math.max(0, data.countdown.targetTimestamp - Date.now()) / 1000);
      },
      teams: function (teams) {
        this.teams = teams;
        this.$forceUpdate();
      }
    },
    methods: {
      saveData: function (scene) {
        this.$socket.emit('setData', this.data);
        this.dataBackup = { ...this.data };
      },
      reset: function () {
        this.$socket.emit('getData');
      },
      updateTeams: function () {
        this.$socket.emit('getTeams');
      },
      swapTeams: function () {
        let temp = this.data.teams.left;
        this.data.teams.right = this.data.teams.left;
        this.data.teams.left = temp;
      },
      startCountdown: function () {
          const countdown = {
              running: true,
              targetTimestamp: Date.now() + this.countdownLength * 1000
          };
          this.startInterval();
          this.data.countdown = countdown;
          this.dataBackup.countdown = countdown;
          this.$socket.emit('setData', this.dataBackup);
      },
      startInterval: function() {
        this.countdownInterval = setInterval(() => {
          this.countdownLength = Math.floor(Math.max(0, this.data.countdown.targetTimestamp - Date.now()) / 1000);
          if (this.countdownLength === 0) {
            this.stopCountdown();
          }
        }, 1000);
      },
      stopCountdown: function () {
        const countdown = {
          running: false,
          targetTimestamp: Date.now() + this.countdownLength * 1000
        };
        this.stopInterval();
        this.data.countdown = countdown;
        this.dataBackup.countdown = countdown;
        this.$socket.emit('setData', this.dataBackup);
      },
      stopInterval: function () {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    }
  };
</script>

<style scoped lang="less">
  .container {
    padding-top: 20px;
    height: 100%;
  }
  .maps {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    flex-wrap: wrap;
  }
  .map {
    margin: 10px 15px;
    min-width: 300px;
    flex-grow: 1;
  }
</style>
