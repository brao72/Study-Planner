/* ------------ DOM refs ------------ */
const taskTitle = document.getElementById('task-title');
const taskDate  = document.getElementById('task-date');
let   taskId    = 0;

/* ------------ Load tasks on page-open ------------ */
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();

  /* Make every column a drop-zone */
  document.querySelectorAll('.task-list').forEach(list => {
    list.addEventListener('dragover',  e => e.preventDefault());
    list.addEventListener('drop',      e => onDrop(e, list.id));
  });
});

/* ------------ Fetch all tasks from the API ------------ */
async function loadTasks() {
  try {
    const res   = await fetch('/api/tasks');
    const tasks = await res.json();
    tasks.forEach(t => {
      taskId = Math.max(taskId, t.id);
      renderTask(t);
    });
  } catch (err) {
    console.error(err);
    alert('Could not load tasks from server.');
  }
}

/* ------------ Add a new task ------------ */
async function addTask() {
  const title = taskTitle.value.trim();
  const date  = taskDate.value;
  if (!title || !date) return alert('Please enter both title and date');

  try {
    const res  = await fetch('/api/tasks', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ title, due_date: date })
    });
    const task = await res.json();
    renderTask(task);

    taskTitle.value = '';
    taskDate.value  = '';
  } catch (err) {
    console.error(err);
    alert('Server error while saving the task.');
  }
}

/* ------------ Render one task card ------------ */
/* ------------ Render one task card (trim time) ------------ */
function renderTask(task) {
  const card = document.createElement('div');
  card.className      = `task ${task.status}`;
  card.draggable      = true;
  card.dataset.id     = task.id;
  card.dataset.status = task.status;

  /* keep only YYYY-MM-DD */
  const due = (task.due_date || '').split('T')[0];

  card.innerHTML = `
    <span>${escapeHtml(task.title)} <small>• ${due}</small></span>
    <button class="delete" title="Delete task">&#10005;</button>
  `;

  card.addEventListener('dragstart', e =>
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: task.id }))
  );
  card.querySelector('.delete').addEventListener('click', () => deleteTask(card));

  document.getElementById(task.status).appendChild(card);
}

/* ------------ Handle drop between columns ------------ */
async function onDrop(e, newStatus) {
  e.preventDefault();
  const data = e.dataTransfer.getData('text/plain');
  if (!data) return;
  const { id } = JSON.parse(data);
  const card   = document.querySelector(`[data-id='${id}']`);
  if (!card || card.dataset.status === newStatus) return;

  /* Move in DOM */
  document.getElementById(newStatus).appendChild(card);
  card.dataset.status = newStatus;
  card.className = `task ${newStatus}`;

  /* Persist change */
  try {
    await fetch(`/api/tasks/${id}`, {
      method : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ status: newStatus })
    });
  } catch (err) {
    console.error(err);
    alert('Failed to update task status.');
  }
}

/* ------------ Delete a task ------------ */
async function deleteTask(card) {
  const id = card.dataset.id;
  try {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    card.remove();
  } catch (err) {
    console.error(err);
    alert('Failed to delete task.');
  }
}

/* ------------ Tiny helper to avoid HTML injection ------------ */
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;',
    '"':'&quot;', "'":'&#039;'
  }[c]));
}
