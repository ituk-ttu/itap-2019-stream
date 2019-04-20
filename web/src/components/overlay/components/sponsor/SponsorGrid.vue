<template lang="pug">
  .sponsor-container
    sponsor.sponsor-item(:class="sizeClasses" :name="name" v-for="name in names" :key="name")
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
      sizeClasses: function () {
        return this.big ? 'item-big' : 'item-small';
      }
    }
  };
</script>
<style lang="less" scoped>
  .sponsor-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .sponsor-item {
    padding: 30px;
    flex-shrink: 0;
    &.item-big {
      width: 30%;
      display: flex;
      height: 340px;
      align-items: center;
    }
    &.item-small {
      width: 16.6%;
    }
  }

</style>
