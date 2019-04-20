
<template lang="pug">
  div.background(:class="info.logosVisible ? 'logos-visible' : ''")
    .full-container
      p.brbText(:class="brb.visible ? '' : 'out'") {{ brb.text }}
      .tte-logo
        p.tt-text TAL
        p.tt-text TECH
        p E-SPORT
      p.countdown(:class="countdownRunning ? '' : 'out'") {{ countdownDisplay }}
</template>

<script>
  export default {
    name: 'Waiting',
    data: function() {
      return {
        countdownDisplay: "",
        targetTimestamp: 0,
        interval: null,
        countdownRunning: false
      }
    },
    computed: {
      info: function() {
        return this.$parent.info;
      },
      brb: function() {
        return this.info.brb;
      }
    },
    watch: {
      info: function(newVal, oldVal) {
        if (newVal.countdown == null) {
          return;
        }
        this.renderCountdown();
        this.targetTimestamp = newVal.countdown.targetTimestamp;
        this.countdownRunning = newVal.countdown.running;
        if (oldVal != null && oldVal.countdown != null && this.countdownRunning === oldVal.countdown.running) {
          return;
        }
        if(this.countdownRunning) {
          this.interval = setInterval(this.renderCountdown, 50);
        } else {
          clearInterval(this.interval);
        }
      }
    },
    mounted() {
      this.renderCountdown();
    },
    methods: {
      renderCountdown: function () {
        const timeRemaining = Math.floor(Math.max(0, this.targetTimestamp - Date.now()) / 1000);
        const secondsRemaining = timeRemaining % 60;
        const minutesRemaining = Math.floor(timeRemaining / 60);
        this.countdownDisplay = (minutesRemaining >= 10 ? "" + minutesRemaining : "0" + minutesRemaining) + ":" +
          (secondsRemaining >= 10 ? "" + secondsRemaining : "0" + secondsRemaining);
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "../../assets/less/tt-colors.less";
  @import "../../assets/less/easing.less";

  .brbText {
    font-family: 'proxima_nova_altbold', sans-serif;
    font-size: 92px;
    position: absolute;
    top: 20px;
    left: 20px;
    color: @tt-white;
    margin: 0;
    width: 900px;
    line-height: 110px;
    transition: all 200ms @easeOutCubic;
    transform-origin: 0 0;
    &.out {
      transition-timing-function: @easeInCubic;
      transform: scale(0.5, 0);
    }
  }
  .tte-logo {
    font-family: 'proxima_nova_altblack', sans-serif;
    font-size: 50px;
    position: absolute;
    transform-origin: 0 100%;
    bottom: 20px;
    left: 20px;
    color: @tt-white;
    transition: all 500ms @easeOutQuint;
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
    transition: all 200ms @easeOutCubic;
    &.out {
      transition-timing-function: @easeInCubic;
      transform: scale(0.5, 0);
    }
  }
  .background {
    position: relative;
    height: 100vh;
    box-sizing: content-box;
    padding-bottom: 192px;
    background-image: url("../../assets/overlay/gradient.svg");
    background-size: cover;
    clip-path: ~"polygon(100% calc(100% - 192px), 128px calc(100% - 192px), 128px calc(100% - 128px),
    64px calc(100% - 128px), 64px 100%, 0 100%, 0 0, 100% 0)";
    transition: all 500ms @easeOutQuint;
    &.logos-visible {
      margin-top: -800px;
      .tte-logo {
        transform: scale(2);
      }
    }
  }
  .full-container {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    position: relative;
  }
</style>
