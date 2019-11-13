<template lang="pug">
  div
    .upper-third
      .color-bar
        img(src="../../assets/ituk.symbol.colored.svg")
      .caster-name-container
        .caster-name-text-container
          p.caster-name IT-Ametite päev
    .lower-third
      .color-bar
      .caster-name-container(v-bind:class="$parent.isVisible ? '' : 'out'")
        .caster-name-text-container
          p.caster-name {{ $parent.info.schedule[$parent.info.active].name }}
          p.caster-nick(v-if="$parent.info.schedule[$parent.info.active].job !== ''") {{$parent.info.schedule[$parent.info.active].job }} | {{ $parent.info.schedule[$parent.info.active].from }}
</template>

<script>
    export default {
      name: 'Presentation'
    };
</script>
<style lang="less" scoped>
  @import "../../assets/less/tt-colors.less";
  @import "../../assets/less/easing.less";

  /* COLOR */

  .lower-third {
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
  .caster-name-container {
    .caster-name-text-container {
      transform: translateX(0);
      transition-duration: 2s;
      transition-delay: 0ms;
      transition-timing-function:@easeOutSine;
    }
    &.out {
      .caster-name-text-container {
        transform: translateX(-100%);
        transition-duration: 2s;
        transition-delay: 0ms;
        transition-timing-function:@easeInSine;
      }
    }
  }

  .upper-third {
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
  .upper-third {
    display: block;
    position: absolute;
    top: 0;
    width: 100vw;
    height: 80px;
    left: 0;
    text-align: left;

    .color-bar img {
      width: 60px;
      height: 60px;
      z-index: 2147483647;
      float: right;
      padding: 0;
      margin-top: 10px;
      margin-right: 10px;
    }

    .color-bar {
      width: 80px;
      height: 80px;
      float: right;
    }

    .caster-name-container {
      z-index: -999;
      height: 100%;
      padding: 0 60px 0 30px;

      p {
        text-transform: uppercase;

        &.caster-name {
          font-family: 'Raleway SemiBold', sans-serif;
          margin: 0;
          font-size: 48px;
          padding: 5px 0 0 0;
        }
      }
    }
  }

  .lower-third {
    display: block;
    position: absolute;
    bottom: 0;
    width: 100vw;
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
      padding: 0 60px 0 30px;
      p {
        text-transform: uppercase;
        &.caster-name {
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
