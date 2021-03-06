<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      class="text-h5"
    >
      <v-row justify="center">Weather Forecast</v-row>
    </v-app-bar>
    <router-view/>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>
