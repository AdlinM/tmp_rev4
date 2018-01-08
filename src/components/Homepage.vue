<template>
  <div class="container-fluid">
    <div class="block">
      <ol class="breadcrumb">
        <li class="breadcrumb-item active">Dashboard</li>
      </ol>
      <div id="dasboard" class="row">
        <div class="col-sm-5">
          <h3 class="text-center">Pie Chart</h3>
          <pie v-if="ticketstats.week !== null" :labels="ticketstats.week.labels" :datas="ticketstats.week.datas" :backgroundColors="ticketstats.week.colors"/>
        </div>
        <div class="col-sm-offset-2 col-sm-5">
          <h3 class="text-center">High Chart</h3>
          <vue-highcharts :options="pieOptions"></vue-highcharts>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pie from '@/components/charts/Pie'
import VueHighcharts from 'vue2-highcharts'
import axios from 'axios'

export let initial = {
  chart: {
    type: 'spline'
  },
  title: {
    text: 'Monthly Average Temperature'
  },
  subtitle: {
    text: 'Source: WorldClimate.com'
  },
  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yAxis: {
    title: {
      text: 'Temperature'
    },
    labels: {
      formatter: function () {
        return this.value + '°'
      }
    }
  },
  tooltip: {
    crosshairs: true,
    shared: true
  },
  credits: {
    enabled: false
  },
  plotOptions: {
    spline: {
      marker: {
        radius: 4,
        lineColor: '#666666',
        lineWidth: 1
      }
    }
  },
  series: []
}

export default {
  components: {
    Pie,
    VueHighcharts
  },
  data () {
    return {
      msg: 'this is homepage',
      setInterval: null,
      ticketstats: {
        week: null
      },
      options: this.initial,
      pieOptions: null
    }
  },
  methods: {
    getChartData (period) {
      axios.get(window.AppConfig.apiUrl + 'ticketstats.' + period)
      .then(response => {
        console.log('Get In Chart')
        console.log(response)
        if (Object.keys(response.data).length) {
          let stats = {labels: Object.keys(response.data), datas: Object.values(response.data), colors: []}
          for (let i = 0; i < Object.keys(response.data).length; i++) {
            stats.colors.push(window.statusText[Object.keys(response.data)[i]].color)
          }
          this.ticketstats[period] = stats
        }
      })
      .catch(error => {
        console.log('Catch Error')
        console.log(error)
      })
    },
    getHighChartData (period) {
      axios.get(window.AppConfig.apiUrl + 'ticketstats.' + period)
      .then(response => {
        console.log('Get In Highchart')
        console.log(response)
        if (Object.keys(response.data).length) {
          console.log('set data Highchart')
          this.pieOptions = {
            chart: {
              type: 'pie',
              options3d: {
                enabled: true,
                alpha: 45
              }
            },
            title: {
              text: 'Title test'
            },
            subtitle: {
              text: 'subtitle text'
            },
            plotOptions: {
              pie: {
                innerSize: 100,
                depth: 45
              }
            },
            series: [{
              name: 'test amount',
              data: response.data
            }]
          }
        }
      })
      .catch(error => {
        console.log('Catch Error Highchart')
        console.log(error)
      })
    }
  },
  mounted () {
    this.getChartData('month')
    this.getHighChartData('month')
  },
  destroyed () {
    clearInterval(this.setInterval)
  }
}
</script>

<style lang="sass" scoped>
  #dasboard
    margin-top: 20px
  h3
    margin-top: 0
</style>
