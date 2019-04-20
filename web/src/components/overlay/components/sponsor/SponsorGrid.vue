<template lang="pug">
  .row
    sponsor.column(:class="sizeClasses" :name="name" v-for="name in names" :key="name")
</template>
<script>
  import Sponsor from './Sponsor';

  export default {
    name: 'SponsorGrid',
    components: { Sponsor },
    props: {
      names: Array,
      big: Boolean
    },
    computed: {
      sizeClasses: function() {
        return this.big ? 'col-xs-4' : 'col-xs-3';
      }
    }
  };
</script>
<style>


</style>
