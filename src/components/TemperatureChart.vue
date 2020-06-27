<template>
  <VueApexCharts height="100%" style="width: 100%;" type="line" :options="options" :series="series"/>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'
export default {
  components: {
    VueApexCharts
  },
  data () {
    return {
      options: {
        chart: {
          toolbar: {
            show: false
          }
        },
        stroke: {
          curve: 'smooth'
        },
        tooltip: {
          marker: {
            show: false
          },
          x: {
            show: false
          },
          y: {
            formatter: (value) => { return value += '°' },
            title: {
              formatter: () => {}
            }
          }
        },
        yaxis: {
          tickAmount: 4
        },
        fill: {
          type: 'gradient',
          gradient: {
            gradientToColors: ['#d3413b'],
            type: 'vertical'
          }
        }
      }
    }
  },
  props: {
    series: Array
  }
}
</script>
