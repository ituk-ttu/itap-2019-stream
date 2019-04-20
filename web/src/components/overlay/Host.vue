<template lang="pug">
  div
    lower-third(:name="$parent.info.host.name" :nick="$parent.info.host.nick"
      :isVisible="$parent.isVisible" position="right" colorScheme="normal")
</template>

<script>
  import LowerThird from "./components/LowerThird.vue";

  export default {
      name: 'Host',
    components: {LowerThird},
  };
</script>
