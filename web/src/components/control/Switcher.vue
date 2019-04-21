<template lang="pug">
  .container.switcher-container
    div.panel-wrapper
      .panel.panel-default.transition-panel
        .panel-heading.text-center Active match
        .panel-body
          .text-center
            button.btn.btn-lg(v-on:click="setActiveMatch(null)"
            v-bind:class="view.activePlayoffGroup === 0? 'btn-danger' : 'btn-info'")
              | Ei kuvata
            button.btn.btn-lg(v-for="match in matches"  v-on:click="setActiveMatch(match.id)"
            v-bind:class="match.id === view.activeMatch ? 'btn-success' : 'btn-info'")
              | {{ match.name }}
      .panel.panel-default.transition-panel
        .panel-heading.text-center Active bracker
        .panel-body
          .text-center
            button.btn.btn-lg(v-on:click="setActivePlayoffGroup(0)"
            v-bind:class="view.activePlayoffGroup === 0? 'btn-danger' : 'btn-info'")
              | Ei kuvata
            button.btn.btn-lg(v-for="group in playoffGroups"  v-on:click="setActivePlayoffGroup(group.id)"
            v-bind:class="group.id === view.activePlayoffGroup ? 'btn-success' : 'btn-info'")
              | {{ group.name }}
      .panel.panel-default.transition-panel
        .panel-heading.text-center Active group
        .panel-body
          .text-center
            button.btn.btn-lg(v-on:click="setActiveGroup(0)"
            v-bind:class="view.activeGroup === 0? 'btn-danger' : 'btn-info'")
              | Gruppi ei kuvata
            button.btn.btn-lg(v-for="group in view.groups"  v-on:click="setActiveGroup(group.id)"
            v-bind:class="group.id === view.activeGroup ? 'btn-success' : 'btn-info'")
              | {{ group.name }}
      .panel.panel-default.transition-panel
        .panel-heading.text-center Transition
        .panel-body
          .text-center
            button.btn.btn-info.btn-lg(v-for="transition in view.transitions" v-on:click="makeTransition(transition)")
              | {{ transition.name }}
      .panel.panel-default.switcher-panel
        .panel-heading.text-center Switcher
        .panel-body
          .text-center
              .overlays
                button.btn.btn-block(v-for="overlay in view.overlays"
                v-bind:class="overlay.visible ? 'btn-success' : 'btn-danger'"
                v-on:click="setOverlayVisible(overlay, !overlay.visible)")
                  | {{ overlay.name }}
</template>

<script>
  export default {
    name: 'Switcher',
    mounted: function () {
      this.$socket.emit('getAll');
    },
    data () {
      return {
        playoffGroups: [
          {name: 'Upper bracket', id: 1},
          {name: 'Lower bracket', id: 2},
          {name: 'Superfinaal', id: 3}
        ],
        matches: [
          {name: 'Lower finals', id: 'LOSER_FINAL'},
          {name: 'Upper finals', id: 'UPPER_FINAL'},
          {name: 'Final finals', id: 'FINAL'}
        ],
        view: {
          overlays: {},
          groups: [],
          activeGroup: null,
          activePlayoffGroup: 0,
          activeMatch: null
        }
      };
    },
    sockets: {
      all: function (all) {
        this.view = all;
      },
      overlays: function (overlays) {
        this.view.overlays = overlays;
        this.$forceUpdate();
      },
      groups: function (groups) {
        this.view.groups = groups;
        this.$forceUpdate();
      },
      activeGroup: function (activeGroup) {
        this.view.activeGroup = activeGroup;
        this.$forceUpdate();
      },
      activePlayoffGroup: function (activePlayoffGroup) {
        this.view.activePlayoffGroup = activePlayoffGroup;
        this.$forceUpdate();
      },
      activeMatch: function (activeMatch) {
        this.view.activeMatch = activeMatch;
        this.$forceUpdate();
      }
    },
    methods: {
      setActiveGroup: function (groupId) {
        this.$socket.emit('setActiveGroup', groupId);
      },
      setActivePlayoffGroup: function (groupId) {
        this.$socket.emit('setActivePlayoffGroup', groupId);
      },
      setActiveMatch: function (matchId) {
        this.$socket.emit('setActiveMatch', matchId);
      },
      setOverlayVisible: function (overlay, boolean) {
        this.$socket.emit('setOverlayVisible', {
          overlay: overlay.name,
          boolean: boolean
        });
      }
    }
  };
</script>

<style scoped lang="less">
  .switcher-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .switcher-panel {
    vertical-align: top;
    .view-column {
      padding: 15px;
      display: inline-block;
      vertical-align: top;
      width: 250px;
      .overlays {
        width: 100%;
        padding: 25px 25px 0;
        .btn {
          margin-bottom: 15px;
          &:last-of-type {
            margin-bottom: 0;
          }
        }
      }
    }
  }
  .transition-panel {
    .btn {
      margin: 10px;
    }
  }
</style>
