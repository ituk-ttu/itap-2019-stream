<template lang="pug">
  div
    lower-third(:name="$parent.info.casters.left.name" :nick="$parent.info.casters.left.nick"
      :isVisible="$parent.isVisible" position="left" colorScheme="normal")
    lower-third(:name="$parent.info.casters.right.name" :nick="$parent.info.casters.right.nick"
      :isVisible="$parent.isVisible" position="right" colorScheme="inverted")
</template>

<script>
  import LowerThird from "./components/LowerThird.vue";

  export default {
    name: 'Casters',
    components: {LowerThird},
  };
</script>
