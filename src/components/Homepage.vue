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
          <pie-highcharts :options="pieOptions" ref="pieChart"></pie-highcharts>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pie from '@/components/charts/Pie'
import axios from 'axios'

export default {
  components: {
    Pie
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
    getTicketStats (period) {
      axios.get(window.AppConfig.apiUrl + 'ticketstats.' + period)
      .then(response => {
        if (Object.keys(response.data).length) {
          let stats = {labels: Object.keys(response.data), datas: Object.values(response.data), colors: []}
          for (let i = 0; i < Object.keys(response.data).length; i++) {
            stats.colors.push(window.statusText[Object.keys(response.data)[i]].color)
          }
          console.log(this.ticketstats[period])
          this.ticketstats[period] = stats
        }
      })
      .catch(error => {
        console.log('Catch Error')
        console.log(error)
      })
    }
  },
  mounted () {
    this.getTicketStats('week')
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
