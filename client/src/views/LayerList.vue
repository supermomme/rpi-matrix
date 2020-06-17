<template>
  <v-container>
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
          <tr v-for="(layer, index) in layers" :key="layer._id">
            <td>{{ layer.name }}</td>
            <td>{{ layer.type }}</td>
            <td>
              <v-btn @click="moveUp(layer, index)" icon small v-if="index !== 0">
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
            </td>
            <td>
              <v-btn @click="moveDown(layer, index)" icon small v-if="index !== layers.length-1">
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
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <component
        :is="dialogComponent"
        :layerId="dialogLayerId"
        :open="dialog"
        @close="dialog = false"
      />
    </v-dialog>
  </v-container>
</template>

<script>
const requireDialogComponents = require.context(
  '@/dialogs', false, /.\.vue/
)
const DialogComponents = requireDialogComponents.keys()
  .map(filename => requireDialogComponents(filename).default)

export default {
  name: 'LayerList',
  data: () => ({
    dialog: false,
    dialogName: null,
    dialogLayerId: null
  }),
  computed: {
    layers () {
      return this.$store.getters['layer/list']
    },
    dialogComponent () {
      return DialogComponents.find(component => component.name === this.dialogName) || 'div'
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
    openSettings (layer) {
      this.dialogLayerId = null
      this.dialogName = 'clockSettings'
      this.dialogLayerId = layer._id
      this.dialog = true
    },
    openCreate () {
      this.dialogLayerId = null
      this.dialogName = 'clockSettings'
      this.dialogLayerId = 'new'
      this.dialog = true
    },
    moveUp (layer, myIndex) {
      console.log('moveUp')
      const l1 = [...this.layers][myIndex]
      const l2 = [...this.layers][myIndex - 1]
      console.log(l1.layer, l2.layer)
      this.$store.dispatch('layer/patch', [l1._id, { layer: l2.layer }])
      console.log(l1.layer, l2.layer)
      this.$store.dispatch('layer/patch', [l2._id, { layer: l1.layer }])
      console.log(l1.layer, l2.layer)
    },
    moveDown (layer, myIndex) {
      console.log('moveDown')
    }
  }
}
</script>
