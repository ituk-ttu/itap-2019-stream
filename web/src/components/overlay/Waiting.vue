
<template lang="pug">
  div
    .logos
      .logo-grid(:class="logoPage === 0 ? '' : 'out'")
        sponsor-grid(:names="['ituk', 'itt', 'ye', 'arvutitark', 'lg', 'belief']" :big="true")
      .logo-grid(:class="logoPage === 1 ? '' : 'out'")
        sponsor-grid(:names="['gamdias', 'networkTomorrow', 'msi', 'obvan', 'roccat', 'speedlink']" :big="true")
      .logo-grid(:class="logoPage === 2 ? '' : 'out'")
        sponsor-grid(:names="['filmiklubi', 'thorgate', 'photopoint', 'nissan', 'xgr', 'telia']" :big="true")
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
  import SponsorGrid from "./components/sponsor/SponsorGrid";
  export default {
    name: 'Waiting',
    components: {SponsorGrid},
    data: function() {
      return {
        countdownDisplay: "",
        targetTimestamp: 0,
        interval: null,
        countdownRunning: false,
        logoPage: null,
        logoInterval: null
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
        this.logosVisibleWatch(newVal.logosVisible);
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
          this.interval = 0;
        }
      }
    },
    mounted() {
      this.renderCountdown();
    },
    methods: {
      logosVisibleWatch: function (logosVisible) {
        const self = this;
        console.log(logosVisible);
        if (logosVisible && self.logoInterval == null) {
          self.logoPage = 0;
          self.logoInterval = setInterval(() => self.logoPage = (self.logoPage + 1) % 3, 10000);
        } else if(!logosVisible && self.logoInterval != null) {
          clearInterval(self.logoInterval);
          self.logoPage = null;
          self.logoInterval = null;
        }
      },
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
      transition-delay: 200ms;
    &.logos-visible {
      transition-delay: 0ms;
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
  .logos {
    position: absolute;
    padding: 280px 20px 20px 212px;
    height: 100%;
    width: 100%;
    bottom: 0;
  }
  .logo-grid {
    position: absolute;
    height: 800px;
    bottom: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    transition: all 500ms @easeInOutQuad;
    &.out {
      opacity: 0;
    }
  }
</style>
