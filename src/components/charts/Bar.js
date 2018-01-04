import { Bar } from 'vue-chartjs'

export default Bar.extend({
  name: 'bar',
  props: ['title', 'labels', 'datas'],
  mounted () {
    this.renderChart({
      labels: this.labels,
      datasets: [
        {
          label: this.title,
          backgroundColor: '#3498DB',
          data: this.datas
        }
      ]
    },
      {
        legend: {
          display: false
        }
      }
    )
  }
})
