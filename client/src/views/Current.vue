<template>
  <div class="home">
    <img v-if="current" :src="current.uri" style="background: #000;">
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
    current () {
      return this.$store.getters['image/get']('current')
    }
  },
  created () {
    console.log(this)
  },
  methods: {
    async fetchData () {
      this.loading = true
      try {
        const resp = await this.$store.dispatch('image/get', 'current')
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
