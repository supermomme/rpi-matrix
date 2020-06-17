<template>
  <v-container>
    <h3>Layers</h3>
    <v-btn @click="openCreate()" small outlined>
      Create new
    </v-btn>
    <FeathersVuexFind service="layer" :query="{ $sort: { layer: -1 } }">
      <section slot-scope="{ items: layers }">
        <v-simple-table max-width="100px">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Layer</th>
                <th class="text-left">Name</th>
                <th class="text-left">Type</th>
                <th />
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="(layer, index) in layers" :key="layer._id">
                <td>{{ layer.layer }}</td>
                <td>{{ layer.name }}</td>
                <td>{{ layer.type }}</td>
                <td>
                  <v-btn @click="moveUp(layer._id)" icon small v-if="index !== 0">
                    <v-icon>mdi-arrow-up</v-icon>
                  </v-btn>
                </td>
                <td>
                  <v-btn @click="moveDown(layer._id)" icon small v-if="index !== layers.length-1">
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
      </section>
    </FeathersVuexFind>
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
    dialogComponent () {
      return DialogComponents.find(component => component.name === this.dialogName) || 'div'
    }
  },
  methods: {
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
    async moveUp (layerId) {
      const l1 = await this.$store.getters['layer/get'](layerId).clone()
      const l2 = await this.$store.getters['layer/find']({
        query: {
          layer: {
            $gt: l1.layer
          },
          $limit: 1,
          $sort: { layer: 1 }
        }
      }).data[0].clone()
      const oldl1Layer = l1.layer
      l1.layer = l2.layer
      l2.layer = oldl1Layer
      l1.save()
      l2.save()
    },
    async moveDown (layerId) {
      const l1 = await this.$store.getters['layer/get'](layerId).clone()
      const l2 = await this.$store.getters['layer/find']({
        query: {
          layer: {
            $lt: l1.layer
          },
          $limit: 1,
          $sort: { layer: -1 }
        }
      }).data[0].clone()
      const oldl1Layer = l1.layer
      l1.layer = l2.layer
      l2.layer = oldl1Layer
      l1.save()
      l2.save()
    }
  }
}
</script>
