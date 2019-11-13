<template lang="pug">
    .caster(:class="classes")
      .color-bar
      .caster-name-container
        .caster-name-text-container
          p.caster-name {{ name }}
          p.caster-nick(v-if="job !== ''") {{ job }} | {{ from }}
</template>

<script>
  export default {
    name: 'LowerThird',
    props: ['name', 'job', 'from', 'isVisible'],
    computed: {
      classes: function () {
        const result = [];
        if (!this.isVisible) {
          result.push('out');
        }
        return result;
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "../../../assets/less/tt-colors.less";
  @import "../../../assets/less/easing.less";

  /* ANIMATIONS */

  .caster {
    .color-bar {
      transform: translateX(0);
      transition-duration: 2s;
      transition-delay: 0ms;
      transition-timing-function:@easeOutSine;
    }
    .caster-name-container {
      transform: translateX(0);
      transition-duration: 2s;
      transition-delay: 0ms;
      transition-timing-function:@easeOutSine;
    }
    &.out {
      .caster-name-container {
        transform: translateX(-960px);
        transition-duration: 2s;
        transition-delay: 0ms;
        transition-timing-function:@easeInSine;
      }

      .color-bar {
        transform: translateX(-960px);
        transition-delay: 0ms;
        transition-duration: 2s;
        transition-timing-function: @easeInSine;
      }
    }
  }

  /* COLOR */

  .caster {
      .color-bar {
        background-color: @tt-ityk-red;
      }
      .caster-name-container {
        background-color: @tt-white;
        .caster-name-text-container {
          .caster-name {
            color: @tt-black;
          }
          .caster-nick {
            color: @tt-black;
          }
        }
      }
  }

  /* OTHER */

  .caster {
    display: block;
    position: absolute;
    bottom: 0;
    height: 161px;
    left: 0;
    text-align: left;
    .color-bar {
      width: 80px;
      height: 100%;
      z-index: 2147483647;
      float: right;
    }

    .caster-name-container {
      z-index: -999;
      height: 100%;
      display: inline-block;
      padding: 0 60px 0 30px;
      p {
        &.caster-name {
          text-transform: uppercase;
          font-family: 'Raleway SemiBold', sans-serif;
          margin: 0;
          font-size: 60px;
          padding: 15px 0 0 0;
        }
        &.caster-nick {
          font-family: 'Raleway', sans-serif;
          margin: -10px 0 0 0;
          font-size: 36px;
        }
      }
    }
  }
</style>
