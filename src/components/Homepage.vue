<template>
  <div class="container-fluid">
    <div class="block">
      <ol class="breadcrumb">
        <li class="breadcrumb-item active">Dashboard</li>
      </ol>
      <div id="dasboard" class="row">
        <div class="col-sm-5">
          <h3 class="text-center">Pie Chart</h3>
          <pie v-if="ticketstats.month !== null" :labels="ticketstats.month.labels" :datas="ticketstats.month.datas" :backgroundColors="ticketstats.month.colors"/>
        </div>
        <div class="col-sm-offset-2 col-sm-5">
          <h3 class="text-center">High Chart</h3>
          <vue-highcharts v-if="pieOptions.series.data !== []" :options="pieOptions"></vue-highcharts>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pie from '@/components/charts/Pie'
import VueHighcharts from 'vue2-highcharts'
import * as initData from '@/components/charts/HighchartInit'

import axios from 'axios'

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
        month: null
      },
      pieOptions: null
    }
  },
  methods: {
    getChartData (period) {
      axios.get(window.AppConfig.apiUrl + 'ticketstats.' + period)
      .then(response => {
        if (Object.keys(response.data).length) {
          let stats = {
            labels: Object.keys(response.data),
            datas: Object.values(response.data),
            colors: []
          }
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
        if (Object.keys(response.data).length) {
          let dataChart = []
          Object.keys(response.data).forEach(function (key) {
            dataChart.push([key, parseInt(response.data[key])])
          })
          let opt = initData.pieOptions
          opt.series = [{
            name: 'data',
            data: dataChart
          }]
          this.pieOptions = opt
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
    setInterval(
      function () {
        this.getHighChartData('week')
      },
      5000
    )
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
