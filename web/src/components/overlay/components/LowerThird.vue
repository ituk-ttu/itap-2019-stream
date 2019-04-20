<template lang="pug">
    .caster(:class="classes")
      .color-bar
      .caster-name-container
        .caster-name-text-container
          p.caster-name {{ name }}
          p.caster-nick &ldquo;{{ nick }}&rdquo;
</template>

<script>

  const positionClasses = {
    left: 'caster-left',
    right: 'caster-right'
  };

  const colorSchemeClasses = {
    normal: 'caster-color-normal',
    inverted: 'caster-color-inverted'
  };

  export default {
    name: 'LowerThird',
    props: ['name', 'nick', 'position', 'colorScheme', 'isVisible'],
    computed: {
      classes: function() {
        const result = [];
        if (!this.isVisible) {
          result.push('out');
        }
        result.push(positionClasses[this.position])
        result.push(colorSchemeClasses[this.colorScheme])
        return result
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "../../../assets/less/tt-colors.less";
  @import "../../../assets/less/easing.less";

  /* ANIMATIONS */

  .caster {
    &.caster-left {
      .caster-name-container {
        transform-origin: 0 50%;
      }
    }
    &.caster-right {
      .caster-name-container {
        transform-origin: 100% 50%;
      }
    }
    .color-bar {
      transition: all 300ms @easeOutBounce;
      transition-delay: 0ms;
    }
    .caster-name-container {
      transition: all 300ms @easeOutCubic;
      transition-delay: 350ms;
      .caster-name-text-container {
        transition: all 100ms @easeOutCubic;
        transition-delay: 550ms;
      }
    }
    &.out {
      .caster-name-container {
        transform: scaleX(0);
        transition-delay: 0ms;
        transition-timing-function: @easeInCubic;

        .caster-name-text-container {
          transform: scaleY(0);
          transition-delay: 0ms;
          transition-timing-function: @easeInCubic;
        }
      }

      .color-bar {
        transform: scaleY(0);
        transition-timing-function: @easeInBounce;
        transition-delay: 350ms;
      }
    }
  }

  /* COLOR */

  .caster {
    &.caster-color-normal {
      .color-bar {
        background-color: @tt-dark-blue;
      }
      .caster-name-container {
        background-color: @tt-magenta;
        .caster-name-text-container {
          .caster-name {
            color: @tt-dark-blue;
          }
          .caster-nick {
            color: @tt-white;
          }
        }
      }
    }
    &.caster-color-inverted {
      .color-bar {
        background-color: @tt-magenta;
      }
      .caster-name-container {
        background-color: @tt-dark-blue;
        .caster-name-text-container {
          .caster-name {
            color: @tt-magenta;
          }
          .caster-nick {
            color: @tt-white;
          }
        }
      }
    }
  }

  /* OTHER */

  .caster {
    display: block;
    position: absolute;
    bottom: 100px;
    height: 115px;
    .color-bar {
      width: 30px;
      height: 100%;
      z-index: 2147483647;
    }
    &.caster-left {
      left: 100px;
      text-align: left;
      .color-bar {
        float: left;
      }
    }
    &.caster-right {
      right: 100px;
      text-align: right;
      .color-bar {
        float: right;
      }
    }

    .caster-name-container {
      z-index: -999;
      height: 100%;
      display: inline-block;
      padding: 0 15px;
      p {
        text-transform: uppercase;
        &.caster-name {
          font-family: 'proxima_nova_altbold', sans-serif;
          margin: 0;
          font-size: 21pt;
          padding: 10px 10px 0;
        }
        &.caster-nick {
          font-family: 'proxima_nova_altblack', sans-serif;
          padding: 0 10px 10px;
          font-size: 36pt;
          margin: -10px 0 0;
        }
      }
    }
  }
</style>
