<template>
  <div>
    <h3>Layers</h3>
    <v-btn @click="openCreate()" small outlined>
      Create new
    </v-btn>
    <v-simple-table max-width="100px">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Type</th>
            <th />
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="layer in layers" :key="layer._id">
            <td>{{ layer.name }}</td>
            <td>{{ layer.type }}</td>
            <td>
              <v-btn @click="moveUp(layer)" icon small>
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
            </td>
            <td>
              <v-btn @click="moveDown(layer)" icon small>
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </td>
            <td>
              <v-btn @click="openSettings(layer)" small outlined>
                Edit Settings
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  name: 'LayerList',
  computed: {
    layers () {
      return this.$store.getters['layer/list']
    }
  },
  watch: {
    $route: {
      handler: 'fetchData',
      immediate: true
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
    },
    openSettings () {
      console.log('openSettings')
    },
    openCreate () {
      console.log('openCreate')
    },
    moveUp () {
      console.log('moveUp')
    },
    moveDown () {
      console.log('moveDown')
    }
  }
}
</script>
