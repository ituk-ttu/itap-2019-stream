<template lang="pug">
  .groups
    .group(v-for="bracket in $parent.playoffs" :class="getGroupClasses(bracket)")
      .match(v-for="(match, matchIndex) in bracket.matches" :class="'match-' + matchIndex")
        .team(:class="match.state.state === 'RIGHT_WIN' ? 'lose' : ''")
          .name {{ match.leftOpponent }}
          .score {{ match.state.leftScore }}
        .team(:class="match.state.state === 'LEFT_WIN' ? 'lose' : ''")
          .name {{ match.rightOpponent }}
          .score {{ match.state.rightScore }}

</template>

<script>

  export default {
    name: 'Playoffs',
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
      getGroupClasses: function (bracket) {
        const result = [];
        if (!this.$parent.isVisible || this.$parent.activePlayoffGroup !== bracket.id) {
          result.push('out');
        }
        result.push('group-' + bracket.id);
        return result;
      },
    },
    computed: {
      brackets: () => brackets
    }
  };
</script>

<style lang="less" scoped>
  @import "../../assets/less/tt-colors.less";
  @import "../../assets/less/easing.less";

  .groups {
    height: 100%;
    width: 100%;
    position: relative;
    background-image: url("../../assets/overlay/bracket-bg.png");
    background-size: cover;
  }
  .match {
    height: 127px;
    width: 341px;
    position: absolute;
  }
  .group {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    font-family: 'proxima_nova_altblack', sans-serif;
    color: @tt-dark-blue;
    transition: all 500ms @easeOutQuint;
    transition-delay: 700ms;
    font-size: 28px;
    &.out {
      transition-delay: 0ms;
      opacity: 0;
      transform: translateY(-100px);
    }
    .match {
      //background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      .team {
        padding: 8px 20px;
        display: flex;
        height: 55px;
        .name {
          flex-grow: 1;
        }

        &.lose {
          color: @tt-grey-1;
        }
      }
    }
    &.group-1 {
      background-image: url("../../assets/overlay/brackets/brackets-main.svg");
      .match-0 {
        top: 261px;
        left: 45px;
      }
      .match-1 {
        top: 451px;
        left: 45px;
      }
      .match-2 {
        top: 642px;
        left: 45px;
      }
      .match-3 {
        top: 833px;
        left: 45px;
      }
      .match-4 {
        top: 359px;
        left: 517px;
      }
      .match-5 {
        top: 741px;
        left: 517px;
      }
      .match-6 {
        top: 548px;
        left: 989px;
      }
    }
    &.group-2 {
      background-image: url("../../assets/overlay/brackets/brackets-loser.svg");
      .match {
        transform: scale(0.87);
      }
      .match-0 {
        top: 459px;
        left: 203px;
      }
      .match-1 {
        top: 839px;
        left: 203px;
      }
      .match-2 {
        top: 377px;
        left: 611px;
      }
      .match-3 {
        top: 757px;
        left: 611px;
      }
      .match-4 {
        top: 548px;
        left: 1019px;
      }
      .match-5 {
        top: 469px;
        left: 1427px;
      }
    }
  }

  .superFinal {
    zoom: 300%;
    .round-title {
      margin: 50px 0 0;
    }
  }
</style>
