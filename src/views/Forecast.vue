<template>
  <v-main>
    <v-snackbar timeout=2000 v-model="showError" color="red lighten-3 black--text">Error: you must enter valid coordinates</v-snackbar>
    <v-col lg=4 md=6 offset-md=3 offset-lg=4 class="pt-6">
      <!-- Current day weather card -->
      <v-row class="mb-3">
        <v-text-field label="Location Coordinates" v-model="location" @keydown.enter="getForecastData()" solo single-line hide-details>
          <template v-slot:append>
            <v-progress-circular v-if="loading" indeterminate />
            <v-icon v-else @click="getForecastData()">mdi-magnify</v-icon>
          </template>
        </v-text-field>
      </v-row>
      <v-row class="mb-1">
        <v-card height="50vh" width="100%" class="rounded-lg pb-4">
          <v-col style="height: 100%;" v-if="forecast.length > 0">
            <v-row style="height: 50%;" align="center">
              <v-col cols=6>
                <v-row justify="center">{{ forecast[activeDay].dt | date }}</v-row>
                <v-row justify="center" class="text-h3">{{ formatTemperature(forecast[activeDay].temp.day) }}</v-row>
                <v-row justify="center" class="text-h6">{{ forecast[activeDay].weather[0].description }}</v-row>
                <v-row justify="center">Feels like: {{ formatTemperature(forecast[activeDay].feels_like.day) }}</v-row>
              </v-col>
              <v-col cols=3>
                <v-row justify="center" class="text-overline">High</v-row>
                <v-row justify="center">{{ formatTemperature(forecast[activeDay].temp.max) }}</v-row>
                <v-row justify="center" class="text-overline">Low</v-row>
                <v-row justify="center">{{ formatTemperature(forecast[activeDay].temp.min) }}</v-row>
              </v-col>
              <v-col cols=3>
                <v-row justify="center" class="text-overline">Sunrise</v-row>
                <v-row justify="center">{{ forecast[activeDay].sunrise | time }}</v-row>
                <v-row justify="center" class="text-overline">Sunset</v-row>
                <v-row justify="center">{{ forecast[activeDay].sunset | time }}</v-row>
              </v-col>
            </v-row>
            <v-row style="height: 50%;" justify="center">
              <TemperatureChart :series="tempOverTime"/>
            </v-row>
          </v-col>
        </v-card>
      </v-row>
      <!-- Row of daily weather cards -->
      <v-row class="px-1">
        <v-item-group style="width: 100%;" v-model="activeDay">
          <v-row>
            <v-col class="pa-2" v-for="day in forecast" :key="day.dt">
              <v-item v-slot:default="{ active, toggle }">
                <DailyForecastCard :toggle="toggle" :active="active" :dayInfo="day">
                  {{ formatTemperature(day.temp.day) }}
                </DailyForecastCard>
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
      </v-row>
      <!-- Temperature unit selector -->
      <v-row class="pa-2">
        <v-switch v-model="temperatureUnit" true-value="Fahrenheit" false-value="Celsius" hint="Temperature unit" persistent-hint :label="temperatureUnit"/>
      </v-row>
    </v-col>
  </v-main>
</template>
<script>
import axios from 'axios'
import TemperatureChart from '@/components/TemperatureChart'
import DailyForecastCard from '@/components/DailyForecastCard'

export default {
  components: {
    DailyForecastCard,
    TemperatureChart
  },
  data () {
    return {
      forecast: [],
      activeDay: 0,
      temperatureUnit: 'Fahrenheit',
      location: '42.281378, -83.747261',
      loading: false,
      showError: false
    }
  },
  computed: {
    tempOverTime () {
      var activeDayTemp = this.forecast[this.activeDay].temp
      var formattedTempData = [{
        data: [
          { x: 'morning', y: this.formatTemperature(activeDayTemp.morn) },
          { x: 'midday', y: this.formatTemperature(activeDayTemp.day) },
          { x: 'evening', y: this.formatTemperature(activeDayTemp.eve) },
          { x: 'night', y: this.formatTemperature(activeDayTemp.night) }
        ]
      }]
      return formattedTempData
    }
  },
  methods: {
    validCoordinates: val => /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/.test(val),
    getForecastData () {
      this.loading = true

      if (!this.validCoordinates(this.location)) {
        console.log('bruh')
        this.showError = true
        this.loading = false
        return
      }

      var url = 'https://api.openweathermap.org/data/2.5/onecall'
      var key = process.env.VUE_APP_OPENWEATHERMAP_APIKEY
      var params = {
        lat: this.location.split(',')[0],
        lon: this.location.split(',')[1].trim(),
        exclude: 'current,minutely,hourly',
        appid: key
      }

      axios.get(url, { params: params })
        .then(response => { this.parseForecastData(response.data) })
        .catch(error => console.log(error))
        .then(() => { this.loading = false })

    },
    parseForecastData (data) {
      this.forecast = data.daily.slice(0, 5)
    },
    formatTemperature (value) {
      // Takes a kelvin value and converts to either Celsius or Fahrenheit depending on unit selection
      value -= 273.15
      if (this.temperatureUnit === 'Fahrenheit') {
        value = (value * 1.8) + 32
      }
      return value.toFixed(1) + '°'
    }
  },
  mounted () {
    this.getForecastData()
  }
}
</script>