<template>
  <v-main>
    <v-col lg=4 md=6 offset-md=3 offset-lg=4>
      <v-row class="mb-1 pa-2">
        <v-card height="50vh" width="100%" class="rounded-lg">
          <v-col class="pa-0 pb-4 justify-center" style="height: 100%;" v-if="forecast.length > 0">
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
          <v-progress-circular v-else indeterminate />
        </v-card>
      </v-row>
      <v-row>
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
      temperatureUnit: 'Fahrenheit'
    }
  },
  computed: {
    tempOverTime () {
      var activeDayTemp = this.forecast[this.activeDay].temp
      var formattedTempData = [{
        data: [
          { x: 'morning', y: this.formatTemperature(activeDayTemp['morn']) },
          { x: 'midday', y: this.formatTemperature(activeDayTemp['day']) },
          { x: 'evening', y: this.formatTemperature(activeDayTemp['eve']) },
          { x: 'night', y: this.formatTemperature(activeDayTemp['night']) }
        ]
      }]
      return formattedTempData
    }
  },
  methods: {
    getForecastData () {
      var url = 'https://api.openweathermap.org/data/2.5/onecall'
      var key = process.env.VUE_APP_OPENWEATHERMAP_APIKEY
      console.log(key)
      var params = {
        lat: '42.281378',
        lon: '-83.747261',
        exclude: 'current,minutely,hourly',
        appid: key
      }

      axios.get(url, { params: params }).then(response => {
        this.parseForecastData(response.data)
      }).catch(error => console.log(error))
    },
    parseForecastData (data) {
      this.forecast = data.daily.slice(0, 5)
    },
    formatTemperature(value) {
      // Takes a kelvin value and converts to either Celsius or Fahrenheit depending on unit selection
      value -= 273.15
      if (this.temperatureUnit == 'Fahrenheit') {
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