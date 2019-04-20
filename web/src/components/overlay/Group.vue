<template lang="pug">
  .groups
    .group(v-for="group in $parent.groups"
              v-bind:class="$parent.isVisible && $parent.activeGroup === group.id ? '' : 'out'")
      h1.title
        | GRUPP
        span.group-name  {{ group.name }}
      .team(v-for="team in group.teams" v-bind:class="!team.willAdvance && group.finished ? 'loser' : ''")
        .name {{ team.name }}
        .scores
          .score(v-for="result in team.results" :class="getResultClass(result)")
        .total {{ getScore(team) }}

</template>

<script>
  export default {
    name: 'Group',
    methods: {
      getResultClass: function(result) {
        if (result === 'WIN') {
          return 'score-win';
        }
        if (result === 'LOSS') {
          return 'score-loss';
        }
        return 'score-not-played';
      },
      getScore: function (team) {
        return team.results.filter(it => it === 'WIN').length;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/less/tt-colors.less";
  @import "../../assets/less/easing.less";

  .groups {
    height: 100%;
    width: 100%;
    position: relative;
    background-image: url("../../assets/overlay/group-bg.png");
    background-size: cover;
  }
  .group {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    font-family: 'proxima_nova_altblack', sans-serif;
    transition: all 500ms @easeOutQuint;
    transition-delay: 700ms;
    &.out {
    transition-delay: 0ms;
      opacity: 0;
      transform: translateY(-100px);
    }
  }
  .title {
    font-size: 80pt;
    text-align: center;
    margin-bottom: 40px;
    color: @tt-white;
    .group-name {
      color: @tt-light-blue;
    }
  }
  .team {
    margin: 10px 0;
    height: 75px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 54px;
    .name {
      width: 700px;
      margin-left: -500px;
      box-sizing: border-box;
      line-height: 45px;
      text-align: right;
    }
    .scores {
      display: flex;
      margin: 0 60px;
      .score {
        height: 30px;
        width: 30px;
        border-radius: 30px;
        margin: 20px;
        box-shadow: 0 0 25px fade(@tt-dark-blue, 0.7);
        &.score-win {
          background-color: @tt-light-blue;
        }
        &.score-loss {
          background-color: @tt-magenta;
        }
        &.score-not-played {
          background-color: @tt-white;
        }
      }
    }
    .total {
      width: 60px;
      font-size: 64px;
    }
  }
</style>
