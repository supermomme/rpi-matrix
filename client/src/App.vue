<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-toolbar-title>RPI Matrix</v-toolbar-title>

      <v-spacer />

      <v-btn icon :to="{ name: 'LayerList' }">
        <v-icon>mdi-layers-triple</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>
