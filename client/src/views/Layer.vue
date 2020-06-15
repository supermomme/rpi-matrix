<template>
  <div>
    <table style="width:100%">
      <tr>
        <th>Typ</th>
        <th>Einstellungen</th>
      </tr>
      <tr v-for="layer of layers" :key="layer._id">
        <td>{{ layer.type }}</td>
        <td><pre>{{layer}}</pre></td>
      </tr>
    </table>
    <pre>{{ layers }}</pre>
  </div>
</template>

<script>
export default {
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
  methods: {
    async fetchData () {
      this.loading = true
      try {
        console.log(await this.$store.dispatch('layer/find', { pagination: false }))
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
