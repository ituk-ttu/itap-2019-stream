<template lang="pug">
  router-view.overlay-wrapper
</template>

<script>
  export default {
    name: 'Overlay',
    data () {
      return {
        overlays: {},
        info: null
      };
    },
    mounted: function () {
      this.$socket.emit('getData');
      this.$socket.emit('overlayAvailable', {
        overlay: this.$route.name
      });
    },
    sockets: {
      overlays: function (overlays) {
        this.overlays = overlays;
      },
      data: function (data) {
        this.info = data;
      }
    },
    computed: {
      isVisible: function () {
        return this.overlays.hasOwnProperty(this.$route.name) &&
          this.overlays[this.$route.name].visible;
      }
    }
  };
</script>

<style>
  html, body, #app, .overlay-wrapper {
    width: 1920px;
    height: 1080px;
  }
  body {
    overflow: hidden;
  }
</style>
