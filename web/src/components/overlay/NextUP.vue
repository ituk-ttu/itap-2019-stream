<template lang="pug">
  div
    .upper-third(v-bind:class="$parent.isVisible ? '' : 'out'")
      .color-bar
        img(src="../../assets/ituk.symbol.colored.svg")

      .caster-name-container
        .caster-name-text-container

          .nextList
            li(v-for="n in $parent.info.activeBlock")
              .upper-line
                .time {{$parent.info.schedule[n].when}}
                .nextListName {{$parent.info.schedule[n].name}}
              p.nextListJob {{$parent.info.schedule[n].job}} | {{$parent.info.schedule[n].from}}
      p.next Järgmisena
</template>

<script>
    export default {
      name: 'nextUP',
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
  /*@import "../../assets/less/style.less";*/

  /* COLOR */

  .upper-third {
    background-color: @tt-white;
    .next {
      color: @tt-ityk-red;
    }
    .color-bar {
      background-color: @tt-ityk-red;
    }
    .caster-name-container {
      /*background-color: transparent;*/
      .caster-name-text-container {
        .caster-name {
          color: @tt-black;
        }
        .nextList {
          color: @tt-black;
        }

        .nextListJob {
          color: @tt-ityk-red;
        }
        .caster-nick {
          color: @tt-black;
        }
      }
    }
  }

  .upper-third {
    .caster-name-container {
      transform: translateX(0);
      transition-duration: 2s;
      transition-delay: 0ms;
      transition-timing-function:@easeOutSine;
    }
    &.out {
      .caster-name-container {
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
    height: 100vh;
    left: 0;
    text-align: left;
    z-index: -998;

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
    .next {
      text-transform: uppercase;
      font-family: 'Raleway ExtraBold', sans-serif;
      position: absolute;
      margin: 0;
      left: 115px;
      top: 100px;
      font-size: 90px;
    }
    .caster-name-container {
      z-index: -998;
      height: 100%;
      width: 1840px;
      padding: 0 60px 0 30px;

      .nextList {
        font-family: 'Raleway', sans-serif;
        position: absolute;
        margin: 0;
        left: 225px;
        top: 50%;
        transform: translateY(-50%);
        list-style-type: none;
      }
      .nextListName {
        text-transform: uppercase;
        font-family: "Poppins", sans-serif;
        font-weight: 500;
        font-size: 100px;
        margin-top: 20px;
        position: absolute;
        left: 280px;
        white-space: nowrap;
      }
      .nextListJob {
        font-family: 'Raleway Medium', sans-serif;
        font-size: 48px;
        margin-left: 280px;
        margin-top: -30px;
        white-space: nowrap;
        overflow: hidden;
      }
      .time {
        text-transform: uppercase;
        font-family: "Poppins", sans-serif;
        font-weight: 400;
        font-size: 100px;
        margin-top: 20px;
      }
      .upper-line {
        display: flex;
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
      z-index: 2147483647;
    }
    .nortal {
      position: absolute;
      bottom: 11px;
      right: 0px;
      z-index: 2147483647;
      height: 196px;
    }
  }

</style>
