<template lang="pug">
  div
    .countdown
    .tte-logo
      p.tt-text TAL
      p.tt-text TECH
      p E-SPORT
    p.countdown {{ $parent.countdown }}
</template>

<script>
  export default {
    name: 'Countdown',
    props: ['info']
  };
</script>

<style lang="less" scoped>
  @import "../../assets/less/tt-colors.less";

  .tte-logo {
    font-family: 'proxima_nova_altblack', sans-serif;
    font-size: 50px;
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: @tt-white;
    p {
      margin: 0;
      line-height: 38px;
      &.tt-text {
        color: @tt-magenta;
      }
    }
  }
  .countdown {
    font-family: 'proxima_nova_altblack', sans-serif;
    font-size: 320px;
    position: absolute;
    bottom: 20px;
    right: 20px;
    color: @tt-white;
    margin: 0;
    line-height: 260px;
  }

</style>
