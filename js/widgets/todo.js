import { escHtml, storageGet, storageSet } from '../utils.js';

const STORAGE_KEY = 'omniTodos';

const getTodos  = ()        => storageGet(STORAGE_KEY, []);
const saveTodos = (todos)   => storageSet(STORAGE_KEY, todos);

function render() {
  const listEl  = document.getElementById('todo-list');
  const statsEl = document.getElementById('todo-stats');
  if (!listEl) return;

  const todos = getTodos();
  const done  = todos.filter(t => t.done).length;

  if (!todos.length) {
    listEl.innerHTML = '<p class="widget-muted" style="padding:4px 0;">No tasks yet. Add one above!</p>';
    if (statsEl) statsEl.textContent = '';
    return;
  }

  listEl.innerHTML = todos.map((t, i) => `
    <div class="todo-item ${t.done ? 'done' : ''}">
      <button class="todo-check" onclick="toggleTodo(${i})">${t.done ? '✓' : ''}</button>
      <span class="todo-text">${escHtml(t.text)}</span>
      <button class="todo-del" onclick="deleteTodo(${i})" title="Remove">×</button>
    </div>`).join('');

  if (statsEl) statsEl.textContent = `${done}/${todos.length} done`;
}

window.addTodo = function () {
  const input = document.getElementById('todo-input');
  const text  = input?.value.trim();
  if (!text) return;
  const todos = getTodos();
  todos.push({ text, done: false });
  saveTodos(todos);
  if (input) input.value = '';
  render();
};

window.toggleTodo = function (i) {
  const todos = getTodos();
  todos[i].done = !todos[i].done;
  saveTodos(todos);
  render();
};

window.deleteTodo = function (i) {
  const todos = getTodos();
  todos.splice(i, 1);
  saveTodos(todos);
  render();
};

export function init() {
  const list  = document.getElementById('todo-list');
  const input = document.getElementById('todo-input');
  if (!list) return;
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') window.addTodo(); });
  render();
}
