<template>
  <transition name="fade">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'commonFade'
}
</script>

<style lang="scss" scoped>
  .fade-enter, .fade-leave-to{
    opacity: 0
  }
  .fade-enter-active, .fade-leave-active{
    transition: opacity 0.5s
  }
</style>