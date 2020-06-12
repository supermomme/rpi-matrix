<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <canvas id="myCanvas" width="200" height="100"></canvas>
    Momme ist kuhl: <pre>{{ pixels }}</pre>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data: () => ({
    loading: true
  }),
  watch: {
    $route: {
      handler: 'fetchData',
      immediate: true
    }
  },
  computed: {
    layers () {
      return this.$store.getters['layer/list']
    }
  },
  created () {
    console.log(this)
  },
  methods: {
    async fetchData () {
      this.loading = true
      try {
        const resp = await this.$store.dispatch('layer/find')
        console.log(resp)
      } catch (error) {
        console.error(error)
        this.error = error
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
