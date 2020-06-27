<template>
  <v-card
    @click="toggle"
    :dark="active"
    :color="active ? 'primary' : ''"
    class="py-5 rounded-lg">
    <v-row justify="center" class="text-subtitle-2 mb-1">{{ dayInfo.dt | date }}</v-row>
    <v-row justify="center" class="text-h5 mb-1"><slot/></v-row>
    <v-row justify="center" class="text-subtitle-2">{{ dayInfo.weather[0].main }}</v-row>
  </v-card>
</template>
<script>
export default {
  props: {
    active: Boolean,
    dayInfo: Object,
    toggle: Function
  }
}
</script>