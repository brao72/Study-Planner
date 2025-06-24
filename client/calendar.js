const calEl      = document.getElementById('calendar');
const monthLabel = document.getElementById('monthLabel');
const yearSel    = document.getElementById('yearSelect');
const modal      = document.getElementById('modal');
const modalDate  = document.getElementById('modalDate');
const taskList   = document.getElementById('taskList');
document.getElementById('closeModal').onclick = () => modal.classList.add('hidden');

document.getElementById('prevMonth').onclick = () => changeMonth(-1);
document.getElementById('nextMonth').onclick = () => changeMonth( 1);
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  changeMonth(-1);
  if (e.key === 'ArrowRight') changeMonth( 1);
});

let tasksByDay = {};
let current    = new Date();          // currently displayed month

/* ---------- build year dropdown ---------- */
(function initYearList(){
  const thisYear = new Date().getFullYear();
  for (let y=thisYear-10; y<=thisYear+10; y++){
    yearSel.add(new Option(y, y, y===thisYear, y===thisYear));
  }
  yearSel.onchange = () => {
    current.setFullYear(+yearSel.value);
    drawCalendar();
  };
})();

/* ---------- fetch tasks then draw first view ---------- */
(async () => {
  const res  = await fetch('/api/tasks');
  const all  = await res.json();
  all.forEach(t => {
    const day = (t.due_date||'').split('T')[0];
    (tasksByDay[day] ??= []).push(t);
  });
  drawCalendar();
})();

/* ---------- month navigation ---------- */
function changeMonth(n){
  current.setMonth(current.getMonth() + n);
  drawCalendar();
}

/* ---------- draw one month ---------- */
function drawCalendar() {
  monthLabel.textContent = current.toLocaleString('default',{month:'long'}) +
                           ' ' + current.getFullYear();
  yearSel.value = current.getFullYear();
  calEl.innerHTML = '';

  const first = new Date(current.getFullYear(), current.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());     // Sunday grid start

  for (let i=0;i<42;i++){
    const date = new Date(start); date.setDate(start.getDate()+i);
    const iso  = date.toISOString().split('T')[0];

    const cell = document.createElement('div');
    cell.className = 'day';
    if (date.getMonth() !== current.getMonth()) cell.classList.add('dim');
    if (iso === new Date().toISOString().split('T')[0]) cell.classList.add('today');

    const dots = tasksByDay[iso]?.length
               ? `<div class="dots">${'•'.repeat(tasksByDay[iso].length)}</div>` : '';

    cell.innerHTML = `<span>${date.getDate()}</span>${dots}`;
    cell.onclick = () => openModal(iso);
    calEl.appendChild(cell);
  }
}

/* ---------- modal ---------- */
function openModal(iso){
  const list = tasksByDay[iso] || [];
  modalDate.textContent = iso;
  taskList.innerHTML = list.length
    ? list.map(t=>`<li>${escape(t.title)} (${t.status})</li>`).join('')
    : '<li>No tasks due</li>';
  modal.classList.remove('hidden');
}
function escape(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
