<template lang="pug">
  div
    .upper-third
      .color-bar
        img(src="../../assets/ituk.symbol.colored.svg")
      .caster-name-container
        .caster-name-text-container
          .brb(v-bind:class="$parent.isVisible ? '' : 'out'")
            p {{$parent.info.brb.text}}
</template>

<script>
    export default {
      name: 'BRB',
      data () {
        return {
          next: [
            { name: 'Ago Luberg' },
            { name: 'Ago Uibo' },
            { name: 'Ago Midaiganes' }
          ]
        };
      }
    };
</script>
<style lang="less" scoped>
  @import "../../assets/less/tt-colors.less";
  @import "../../assets/less/easing.less";

  /* COLOR */

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
        .brb {
          color: @tt-ityk-red;
        }
        .caster-nick {
          color: @tt-black;
        }
      }
    }
  }
  .brb {
    p {
      transform: translateX(0);
      transition-duration: 2s;
      transition-delay: 0ms;
      transition-timing-function:@easeOutSine;
    }
    &.out {
      p {
        transform: translateX(-100vw);
        transition-duration: 2s;
        transition-delay: 0ms;
        transition-timing-function:@easeInSine;
      }
    }
  }
  /* OTHER */
  .upper-third {
    display: block;
    position: absolute;
    top: 0;
    width: 100vw;
    height: 100vh;
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
    .color-bar  {
      width: 80px;
      height: 100vh;
      z-index: 2147483647;
      float: right;
    }

    .caster-name-container {
      z-index: -999;
      height: 100%;
      padding: 0 60px 0 30px;



      .brb {
        text-transform: uppercase;
        font-family: 'Raleway ExtraBold', sans-serif;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 40px;
        font-size: 200px;
        line-height: 0.95;
      }

      p {
        &.caster-name {
          font-family: 'Raleway SemiBold', sans-serif;
          margin: 0;
          font-size: 48px;
          padding: 5px 0 0 0;
        }
      }
    }
    .logo {
      position: absolute;
      bottom: 30px;
      left: 30px;
    }
    .nortal {
      position: absolute;
      bottom: 11px;
      right: 100px;
      z-index: 2147483647;
      height: 196px;
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
