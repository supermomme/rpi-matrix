<template>
  <v-card v-if="!loading">
    <v-card-title
      class="headline"
      primary-title
    >
      {{ layerClone.name }} Settings
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
            label="Name"
            v-model="layerClone.name"
          ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-slider
              v-model="layerClone.x"
              min="0"
              max="64"
              label="X"
            ></v-slider>
          </v-col>
          <v-col cols="12">
            <v-slider
              v-model="layerClone.y"
              min="0"
              max="64"
              label="Y"
            ></v-slider>
          </v-col>

          <v-col cols="12">
            <v-slider
              v-model="layerClone.width"
              min="0"
              max="64"
              label="Width"
            ></v-slider>
          </v-col>
          <v-col cols="12">
            <v-slider
              v-model="layerClone.height"
              min="0"
              max="64"
              label="Height"
            ></v-slider>
          </v-col>

          <v-col cols="12">
            <v-slider
              v-model="layerClone.color.r"
              min="0"
              max="255"
              label="Red"
            ></v-slider>
          </v-col>
          <v-col cols="12">
            <v-slider
              v-model="layerClone.color.g"
              min="0"
              max="255"
              label="Green"
            ></v-slider>
          </v-col>
          <v-col cols="12">
            <v-slider
              v-model="layerClone.color.b"
              min="0"
              max="255"
              label="Blue"
            ></v-slider>
          </v-col>
          <v-col cols="12">
            <v-slider
              v-model="layerClone.color.a"
              min="0"
              step="0.01"
              max="1"
              label="Alpha"
            ></v-slider>
          </v-col>
        </v-row>
      </v-container>
      <pre>{{ layerClone }}</pre>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="success"
        text
        @click="save"
      >
        Save
      </v-btn>
      <v-btn
        color="error"
        text
        @click="$emit('close')"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-sheet
    v-else
    color="grey lighten-4"
    class="px-3 pt-3 pb-3"
  >
    <v-skeleton-loader
      class="mb-6"
      type="article, actions"
    ></v-skeleton-loader>
  </v-sheet>
</template>

<script>
export default {
  name: 'clockSettings',
  props: {
    layerId: {
      type: String,
      required: true
    },
    open: {
      type: Boolean,
      default: () => true
    }
  },
  data: () => ({
    layerClone: {},
    loading: true
  }),
  watch: {
    open: {
      handler: 'fetchData',
      immediate: true
    }
  },
  methods: {
    async fetchData () {
      this.loading = true
      if (!this.open) return
      try {
        if (this.layerId === 'new') {
          this.layerClone = new this.$FeathersVuex.api.Layer()
          this.layerClone.color = {
            r: 255,
            g: 255,
            b: 255,
            a: 1
          }
        } else {
          const layer = await this.$store.dispatch('layer/get', this.layerId)
          this.layerClone = layer.clone()
        }
        // await new Promise((resolve, reject) => setTimeout(resolve, 3000))
      } catch (error) {
        console.error(error)
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async save () {
      await this.layerClone.save()
      this.$emit('close')
    }
  }
}
</script>
