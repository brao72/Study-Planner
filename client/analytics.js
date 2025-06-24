(async () => {
  const res   = await fetch('/api/analytics/weeks');
  let data    = await res.json();                           // oldest→newest
  if (data.length < 8) {                                    // pad empty weeks
    const seen = new Set(data.map(d=>d.week_start));
    for (let i=7;i>=0;i--) {
      const wk = new Date();
      wk.setDate(wk.getDate() - wk.getDay() - 7*i);         // each Sun
      const iso = wk.toISOString().split('T')[0];
      if (!seen.has(iso)) data.unshift({ week_start: iso, completed:0 });
    }
    data = data.slice(-8);
  }

  const labels = data.map(d => d.week_start);
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
        y: { beginAtZero:true, ticks:{precision:0} }
      }
    }
  });
})();
