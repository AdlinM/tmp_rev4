
import Highcharts from 'highcharts'

export let pieOptions = {
  chart: {
    type: 'pie',
    plotBackgroundColor: null,
    plotBorderWidth: null
  },
  title: {
    text: ''
  },
  series: [{
    name: 'data',
    data: []
  }],
  tooltip: {
    pointFormat: '{series.name}: <b>{point.y}</b>'
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      depth: 35,
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.y}',
        style: {
          color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
        }
      }
    }
  },
  noData: {
    attr: 'no Item display',
    position: {
      align: 'center',
      verticalAlign: 'middle',
      x: 0,
      y: 0
    }
  },
  credits: {
    enabled: false
  }
}
