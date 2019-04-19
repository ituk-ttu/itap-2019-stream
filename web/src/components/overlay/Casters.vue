<template lang="pug">
  div
    .caster.caster-left(v-bind:class="$parent.isVisible ? '' : 'out'")
      .color-bar
      .caster-name-container
        p.caster-name {{ $parent.info.casters.left.name }}
        p.caster-nick &ldquo;{{ $parent.info.casters.left.nick }}&rdquo;
    .caster.caster-right(v-bind:class="$parent.isVisible ? '' : 'out'")
      .caster-name-container
        p.caster-name {{ $parent.info.casters.right.name }}
        p.caster-nick &ldquo;{{ $parent.info.casters.right.nick }}&rdquo;
      .color-bar
</template>

<script>
  export default {
    name: 'Casters',
    props: ['info']
  };
</script>

<style lang="less" scoped>
  @import "../../assets/less/tt-colors.less";

  .caster {
    display: block;
    position: absolute;
    top: 960px;
    height: 75px;
    .color-bar {
      width: 20px;
      background-color: @tt-dark-blue;
      height: 100%;
      transition: all 150ms cubic-bezier(0.33, 0.66, 1, 1);
      transition-delay: 200ms;
      z-index: 2147483647;
    }
    &.caster-left {
      text-align: left;
      .color-bar {
        float: left;
      }
    }
    &.caster-right {
      text-align: right;
      .caster-name-container {

      }
      .color-bar {
        float: right;
      }
    }
    &.out {
      .caster-name-container {
        transition-delay: 0ms;
      }
      .color-bar {
        transition-delay: 450ms;
      }
    }
    .caster-name-container {
      z-index: -999;
      height: 100%;
      background-color: @tt-magenta;
      display: inline-block;
      transition: all 900ms cubic-bezier(0.33, 0.66, 1, 1);
      transition-delay: 0ms;
      p {
        text-transform: uppercase;
        &.caster-name {
          color: @tt-dark-blue;
          font-family: 'proxima_nova_altbold', sans-serif;
          margin: 0;
          font-size: 14pt;
          padding: 10px 10px 0;
        }
        &.caster-nick {
          color: @tt-white;
          font-family: 'proxima_nova_altblack', sans-serif;
          padding: 0 10px 10px;
          font-size: 24pt;
          margin: -10px 0 0;
        }
      }
    }
    &.caster-left {
      &.out {
        .caster-name-container {
          transform: translateX(-900px);
        }
        .color-bar {
          transform: translateX(-40px);
        }
      }
      left: 0;

    }
    &.caster-right {
      &.out {
        .caster-name-container {
          transform: translateX(900px);
        }
        .color-bar {
          transform: translateX(40px);
        }
      }
      right: 0;
    }
  }
</style>
