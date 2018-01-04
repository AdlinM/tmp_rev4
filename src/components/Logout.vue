<template>
</template>
<script>
export default {
  mounted () {
    this.$store.dispatch('logout').then((response) => {
      return this.$router.push('/login')
    })
  }
}
</script>

<style lang="sass" scoped>
</style>
