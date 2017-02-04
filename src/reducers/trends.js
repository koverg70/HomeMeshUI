/*
  Átkonvertálja az adatokat a megfelelő formátumra.
  const data = [
        {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
        {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
        {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
        {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
        {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
        {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
        {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
  ];
*/
const convertChart = (data) => {
  let chart = []
  data.forEach((d) => {
    let col = {name: d.id}
    d.sensors.forEach((s) => {
      // n, t, v
      let n = s.n + s.t
      let v = parseInt(s.v, 10) / 100
      if (v > 0) {
        col = {...col, [n]: v }
      }
    })
    chart.push(col)
  })
  console.log(chart)
  return chart
}

/*
  Letölti a napi adatokat a webről és a megadott setState függvénnyel
  visszaadja.
*/
export const loadData = (date, setState) => {
  let self = this
  let url = '/trend_data/' + date.format('YYYY/MM/[day_]DD[.json]')

  console.log('Getting trend data: ' + url)

  fetch(url)
      .then((response) => {
          if (response.status >= 400) {
              setState({ error: 'Fetch error: ' + response.status, data: [] })
              return
          }
          response.json().then(function(data) {
              setState({ error: undefined, data: convertChart(data) })
              return
          });
      })
      .catch((err) => {
        self.setState({ error: 'Fetch error: ' + err, data: [] })
        return
      });
}
