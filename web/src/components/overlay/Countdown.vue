
<template lang="pug">
  div.background
    .countdown
    .tte-logo
      p.tt-text TAL
      p.tt-text TECH
      p E-SPORT
    p.countdown {{ display }}
</template>

<script>
  export default {
    name: 'Countdown',
    data: function() {
      return {
        display: "",
        targetTimestamp: 0,
        interval: null,
        running: false
      }
    },
    computed: {
      info: function() {
        return this.$parent.info
      }
    },
    watch: {
      info: function(newVal, oldVal) {
        if (newVal.countdown == null) {
          return;
        }
        console.log('Countdown watch');
        this.targetTimestamp = newVal.countdown.targetTimestamp;
        this.running = newVal.countdown.running;
        if (oldVal != null && oldVal.countdown != null && this.running === oldVal.countdown.running) {
          return;
        }
        if(this.running) {
          this.interval = setInterval(() => {
            const timeRemaining = Math.floor(Math.max(0, this.targetTimestamp - Date.now()) / 1000);
            const secondsRemaining = timeRemaining % 60;
            const minutesRemaining = Math.floor(timeRemaining / 60);
            this.display = (minutesRemaining >= 10 ? "" + minutesRemaining : "0" + minutesRemaining) + ":" +
              (secondsRemaining >= 10 ? "" + secondsRemaining : "0" + secondsRemaining);
          }, 50);
        } else {
          clearInterval(this.interval);
        }
      }
    },
    mounted() {

    }
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
  .countdown-char {

  }
  .background {
    background-image: url("../../assets/overlay/gradient.svg");
    background-size: cover;
  }

</style>
