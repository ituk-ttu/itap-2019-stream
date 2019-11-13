<template lang="pug">
  .container
    .panel.panel-default
      .panel-heading Waiting screen
      .panel-body
        .row
          .col-xs-12
            label.control-label Waiting screen text
        .row
          .col-xs-9
            .form-group
              input.form-control(v-model="data.brb.text")
          .col-xs-3
            .form-group
              button.btn.btn-primary.btn-block(@click="updateBrb")
                | Update
    .row
      .col-xs-12
        .panel.panel-default
          .panel-heading Esineja
          .panel-body
            .row
              .col-xs-6
                label.control-label Vali esineja
              .col-xs-6
                label.control-label Kuvatav esineja
            .row
              .col-xs-6
                select(v-model="data.active")
                  option(v-for="person in data.schedule" v-bind:value="person.id") {{person.name}}
              .col-xs-6
                .form-group
                  input.form-control(v-model="data.schedule[showingActive].name" :disabled="true")
    .row
      .col-xs-12
        .panel.panel-default
          .panel-heading Plokk
          .panel-body
            .row
              .col-xs-6
                label.control-label Vali plokk
              .col-xs-6
                label.control-label Kuvatav plokk
            .row
              .col-xs-6
                select(v-model="data.activeBlock")
                  option(v-for="block in data.blocks" v-bind:value="block") {{block}}
              .col-xs-6
                .form-group
                  input.form-control(v-model="showingActiveBlock" :disabled="true")
    .row
      .col-xs-12
        .panel.panel-default.switcher-panel
          .panel-heading.text-center Switcher
            .panel-body
              .text-center
                .overlays
                  button.btn.btn-block(v-for="overlay in view.overlays"
                    v-bind:class="overlay.visible ? 'btn-success' : 'btn-danger'"
                    v-on:click="setOverlayVisible(overlay, !overlay.visible)")
                    | {{ overlay.name }}
    .form-group
      button.btn.btn-success.btn-lg(v-on:click="saveData()") SAVE
      button.btn.btn-danger.btn-lg(v-on:click="reset()") RESET
</template>

<script>
    export default {
      name: 'Data',
      mounted: function () {
        this.$socket.emit('getData');
        this.$socket.emit('getAll');
      },
      data () {
        return {
          data: {
            brb: {
              text: 'Oleme peagi tagasi',
              visible: false
            },
            schedule: [
              {
                id: 0,
                name: 'null person'
              }
            ],
            blocks: [],
            active: 0,
            activeBlock: 0
          },
          showingActive: 0,
          showingActiveBlock: [],
          dataBackup: null,
          view: {
            overlays: {}
          }
        };
      },
      sockets: {
        data: function (data) {
          this.data = data;
          this.showingActive = data.active;
          this.showingActiveBlock = data.activeBlock;
          this.dataBackup = {...data};
        },
        all: function (all) {
          this.view = all;
        },
        overlays: function (overlays) {
          this.view.overlays = overlays;
          this.$forceUpdate();
        }
      },
      methods: {
        saveData: function () {
          this.$socket.emit('setData', this.data);
          this.dataBackup = {...this.data};
        },
        reset: function () {
          this.$socket.emit('getData');
        },
        updateBrb: function () {
          this.saveBrb();
        },
        showBrb: function () {
          this.data.brb.visible = true;
          this.saveBrb();
        },
        hideBrb: function () {
          this.data.brb.visible = false;
          this.saveBrb();
        },
        saveBrb: function () {
          this.dataBackup.brb = this.data.brb;
          this.$socket.emit('setData', this.dataBackup);
        },
        setOverlayVisible: function (overlay, boolean) {
          this.$socket.emit('setOverlayVisible', {
            overlay: overlay.name,
            boolean: boolean
          });
        }
      }
    };
</script>

<style scoped lang="less">
  .container {
    padding-top: 20px;
    height: 100%;
  }

  select {
    height: 39px;
    color: #2B3E50;
    width: 100%;
  }
</style>
