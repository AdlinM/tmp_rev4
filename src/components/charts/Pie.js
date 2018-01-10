import { Pie } from 'vue-chartjs'

export default Pie.extend({
  name: 'pie',
  props: ['title', 'labels', 'datas'],
  mounted () {
    this.renderChart({
      labels: this.labels,
      datasets: [
        {
          label: this.title,
          backgroundColor: ['#3498DB', '#2780e3', '#3fb618', '#9954bb', '#ff7518', '#ff0039'],
          data: this.datas
        }
      ]
    }, {
      responsive: true,
      maintainAspectRatio: false,
      pieceLabel: {
        mode: 'percentage',
        precision: 1
      }
    })
  }
})
