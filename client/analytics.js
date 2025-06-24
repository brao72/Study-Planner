(async () => {
  const res  = await fetch('/api/analytics/weeks');
  const data = await res.json();               // already 8 rows, oldest→newest

  const labels = data.map(
    d => new Date(d.week_start).toLocaleDateString('en-GB', { month:'short', day:'numeric' })
  );
  const counts = data.map(d => Number(d.completed));

  new Chart(document.getElementById('weekChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Completed tasks',
        data : counts,
        fill : false,
        tension: 0          // straight lines
      }]
    },
    options: {
      scales: {
        x: { ticks: { autoSkip:false } },   // always show 8 labels
        y: { beginAtZero:true, precision:0 }
      }
    }
  });
})();
