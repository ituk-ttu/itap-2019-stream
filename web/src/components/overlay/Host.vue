<template lang="pug">
  div
    lower-third(:name="$parent.info.schedule[$parent.info.active].name"
      :job="$parent.info.schedule[$parent.info.active].job"
      :from="$parent.info.schedule[$parent.info.active].from"
      :isVisible="$parent.isVisible")
</template>

<script>
  import LowerThird from './components/LowerThird.vue';

  export default {
    name: 'Host',
    components: {LowerThird}
  };
</script>
