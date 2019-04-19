<template lang="pug">
  span
    .bo1-view.maps-view
      .maps
        .map(v-bind:class="$parent.isVisible ? '' : 'out'")
          p.map-name {{ $parent.info.maps[0].map }}
          img.map-img(v-bind:src="'/static/maps/' + toLowerCase($parent.info.maps[0].map) + '.png'" v-bind:class="$parent.isVisible ? '' : 'out'")
      p.teams
        span.team-left {{ $parent.info.teams.left.name }}
        span.team-separator &nbsp;VS&nbsp;
        span.team-right {{ $parent.info.teams.right.name }}
    .tte-logo
      p TAL
      p TECH
      p E-SPORT
    p.bo1-text BO1
    p.countdown {{ $parent.countdown }}
</template>

<script>
  export default {
    name: 'MapsBO1',
    methods: {
      toLowerCase: function (text) {
        return text.toLowerCase();
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "../../assets/less/tt-colors.less";

  .maps-view {
    height: 100%;
    text-align: center;
    width: 1920px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .maps {
      .map {
        transition: all 300ms cubic-bezier(0, 0.8, 1, 1);
        width: 512px;
        &.out {
          transform: translateY(900px);
        }
        .map-img {
          position: relative;
          top: 0;
          left: 0;
          width: 512px;
          height: 512px;
          border: 5px solid @tt-light-blue;
        }
        .map-name {
          font-family: 'proxima_nova_altblack', sans-serif;
          text-transform: uppercase;
          font-size: 50px;
        }
      }
    }
    .teams {
      width: 100%;
      font-family: 'proxima_nova_altblack', sans-serif;
      text-transform: uppercase;
      font-size: 80px;
      .team-separator {
        color: @tt-light-blue;
      }
    }
  }

  .tte-logo {
    font-family: 'proxima_nova_altblack', sans-serif;
    font-size: 36px;
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: @tt-white;
    p {
      margin: 0;
      line-height: 28px;
    }
  }

  .bo1-text {
    font-family: 'proxima_nova_altblack', sans-serif;
    font-size: 80px;
    position: absolute;
    top: 20px;
    left: 20px;
    color: @tt-light-blue;
    margin: 0;
    line-height: 72px;
  }

  .countdown {
    font-family: 'proxima_nova_altblack', sans-serif;
    font-size: 80px;
    position: absolute;
    top: 20px;
    right: 20px;
    color: @tt-white;
    margin: 0;
    line-height: 72px;
  }
</style>
