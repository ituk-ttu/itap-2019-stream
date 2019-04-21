<template lang="pug">
  .matches
    .match(v-for="match in matches" :class="getMatchClasses(match)")
      .title {{ match.title }}
      .vs
        .vs-team.vs-team-left {{ match.leftOpponent }}
        .vs-vs {{ match.leftScore }}:{{ match.rightScore }}
        .vs-team.vs-team-right {{ match.rightOpponent }}
      .maps
        .map(v-for="map in match.maps" :class="getMapClasses(map)")
          .map-name {{ map.name }}
          .map-score-shadow-container
            .map-score-shadow
          .map-score {{ map.leftScore }}:{{ map.rightScore }}


</template>

<script>

  const matches = [
    {
      id: 'LOSER_FINAL',
      title: "Loser bracket finals",
      groupId: 2,
      matchIndex: 5
    },
    {
      id: 'WINNER_FINAL',
      title: "Winner bracket finals",
      groupId: 1,
      matchIndex: 6
    },
    {
      id: 'FINAL',
      title: "Finals",
      groupId: 3,
      matchIndex: 0
    }
  ];

  const mapClasses = {
    'Inferno': 'de-inferno',
    'Nuke': 'de-nuke',
    'Mirage': 'de-mirage',
    'Train': 'de-train',
    'Cache': 'de-cache',
    'Dust2': 'de-dust2',
    'Overpass': 'de-overpass'
  };

  export default {
    name: 'Match',
    data () {
      return {
        superFinalGroup: 3,
        titles: {
          1: {
            1: '1/8 finaal (BO1)',
            2: 'veerandfinaal (BO3)',
            3: 'poolfinaal (BO3)',
            4: 'finaal (BO3)'
          },
          2: {
            1: 'BO1',
            2: 'BO1',
            3: 'BO1',
            4: 'BO1',
            5: 'BO1',
            6: 'BO3'
          },
          3: {
            1: 'Superfinaal (BO5)'
          }
        }
      };
    },
    methods: {
      getMatchClasses: function(match) {
        const result = [];
        if (!this.$parent.isVisible || this.$parent.activeMatch !== match.id) {
          result.push('out');
        }
        return result;
      },
      getMapClasses: function(map) {
        const result = [];
        if (map.name != null) {
          result.push(mapClasses[map.name]);
        }
        if (map.status === 'NOT_PLAYED') {
          result.push('not-played');
        }
        return result;
      },
      getScores: function(match) {
        return {
          leftScore: match.maps.filter(it => it.status === 'LEFT_WIN').length,
          rightScore: match.maps.filter(it => it.status === 'RIGHT_WIN').length
        };
      }
    },
    computed: {
      matches:function () {
        return matches.map(it => {
          const group = this.$parent.playoffs.find(playoff => playoff.id === it.groupId);
          if (group == null) {
            return null;
          }
          const matchData = group.matches[it.matchIndex];
          return {
            ...it,
            ...matchData,
            ...this.getScores(matchData)
          };
        }).filter(it => it != null);
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "../../assets/less/tt-colors.less";
  @import "../../assets/less/easing.less";

  .matches {
    height: 100%;
    width: 100%;
    position: relative;
    background-image: url("../../assets/overlay/bracket-bg.png");
    background-size: cover;
  }
  .match {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    font-family: 'proxima_nova_altblack', sans-serif;
    color: @tt-white;
    transition: all 500ms @easeOutQuint;
    transition-delay: 700ms;
    font-size: 28px;
    display: flex;
    flex-direction: column;
    &.out {
      transition-delay: 0ms;
      opacity: 0;
      transform: translateY(-100px);
    }
    .title {
      text-align: center;
      padding: 20px;
      font-size: 64px;
      text-transform: uppercase;
    }
    .vs {
      display: flex;
      justify-content: center;
      font-size: 48px;
      .vs-team {
        width: 800px;
        &.vs-team-left {
          text-align: right;
        }
        &.vs-team-right {
          text-align: left;
        }
      }
      .vs-vs {
        color: @tt-light-blue;
        padding: 0 40px;
      }
    }
    .maps {
      margin: 100px 0;
      display: flex;
      justify-content: center;
      .map {
        position:relative;
        margin: 20px;
        height: 600px;
        width: 340px;
        background-color: gray;
        background-position: center center;
        background-size: cover;
        overflow: hidden;
        //box-shadow: inset 0px -20px 10px -20px fade(black, 70%);
        &.de-inferno {
          background-image: url("../../assets/overlay/maps/inferno.png");
        }
        &.de-nuke {
          background-image: url("../../assets/overlay/maps/nuke.png");
        }
        &.de-mirage {
          background-image: url("../../assets/overlay/maps/mirage.png");
        }
        &.de-train {
          background-image: url("../../assets/overlay/maps/train.png");
        }
        &.de-cache {
          background-image: url("../../assets/overlay/maps/cache.png");
        }
        &.de-dust2 {
          background-image: url("../../assets/overlay/maps/dust2.png");
        }
        &.de-overpass {
          background-image: url("../../assets/overlay/maps/overpass.png");
        }
        &.not-played {
          border-bottom: 10px solid white;
          box-shadow: inset 0px -20px 10px -20px fade(black, 70%);
          .map-score-shadow-container {
            display: none;
          }
          .map-score {
            display: none;
          }
          .map-name {
            bottom: -15px;
          }
        }
        .map-name {
          text-transform: uppercase;
          position: absolute;
          bottom: 65px;
          font-size: 42px;
          right: 20px;
          text-shadow: 0 0 10px fade(black, 70%);
          z-index: 3;
        }
        .map-score-shadow-container {
          filter: ~"drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.7))";
          height: 80px;
          width: 100%;
          bottom: 0;
          position: absolute;
        }
        .map-score-shadow {
          height: 100%;
          width: 100%;
          background-color: white;
          clip-path: ~"polygon(100% 0, 100% 80px, 0 80px, 0 60px, 20px 60px, 20px 20px, 40px 20px, 40px 0)";
        }
        .map-score {
          background-color: white;
          clip-path: ~"polygon(100% 0, 100% 80px, 0 80px, 0 60px, 20px 60px, 20px 20px, 40px 20px, 40px 0)";
          padding: 10px 20px;
          color: @tt-dark-blue;
          z-index: 5;
          text-align: right;
          font-size: 42px;
          height: 80px;
          width: 100%;
          bottom: 0;
          position: absolute;
        }
      }
    }
  }
</style>
