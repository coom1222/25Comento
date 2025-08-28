// --- 간단 상태 & 저장소 ---
const STORAGE_KEY = 'todolist.v1';
const state = {
    todos: load() // [{id, title, done, createdAt}]
};

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos)); }
function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []; }
    catch { return []; }
}

// --- DOM 참조 ---
const $form = document.getElementById('todo-form');
const $input = document.getElementById('todo-input');
const $list = document.getElementById('todo-list');
const $count = document.getElementById('count');
const $empty = document.getElementById('empty-state');
const $filters = document.querySelectorAll('.chip');
const $clearDone = document.getElementById('clear-done');
let currentFilter = 'all';

// --- 유틸 ---
const uid = () => Math.random().toString(36).slice(2, 9);
const fmt = (ts) => new Date(ts).toLocaleString();

// --- 렌더 ---
function render() {
    const filtered = state.todos.filter(t => {
        if (currentFilter === 'active') return !t.done;
        if (currentFilter === 'done') return t.done;
        return true;
    });

    $list.innerHTML = '';
    filtered.forEach(t => $list.appendChild(renderItem(t)));

    $count.textContent = `${state.todos.length}개`;
    const empty = state.todos.length === 0 || filtered.length === 0;
    $empty.hidden = !empty;
}

function renderItem(todo) {
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    if (todo.done) li.classList.add('done');

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.className = 'todo-check';
    box.checked = todo.done;
    box.setAttribute('aria-label', '완료 전환');

    const content = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = todo.title;

    const meta = document.createElement('small');
    meta.className = 'meta';
    meta.textContent = `추가: ${fmt(todo.createdAt)}`;

    content.appendChild(title);
    content.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'actions';
    const del = document.createElement('button');
    del.className = 'icon-btn danger';
    del.type = 'button';
    del.textContent = '삭제';
    del.setAttribute('aria-label', '일정 삭제');

    actions.appendChild(del);

    li.appendChild(box);
    li.appendChild(content);
    li.appendChild(actions);
    return li;
}

// --- 이벤트 ---
$form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = $input.value.trim();
    if (!title) return;
    state.todos.unshift({ id: uid(), title, done: false, createdAt: Date.now() });
    save(); render();
    $input.value = '';
    $input.focus();
});

// 이벤트 위임: 체크/삭제
$list.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const id = li.dataset.id;
    const idx = state.todos.findIndex(t => t.id === id);
    if (idx === -1) return;

    if (e.target.matches('.todo-check')) {
        state.todos[idx].done = e.target.checked;
        save(); render();
    }
    if (e.target.matches('.danger')) {
        state.todos.splice(idx, 1);
        save(); render();
    }
});

// 필터
$filters.forEach(btn => {
    btn.addEventListener('click', () => {
        $filters.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
        currentFilter = btn.dataset.filter;
        render();
    });
});

// 완료 일괄 삭제
$clearDone.addEventListener('click', () => {
    const before = state.todos.length;
    state.todos = state.todos.filter(t => !t.done);
    if (state.todos.length !== before) { save(); render(); }
});

// Enter로 추가(모바일 가상키보드 대응)
$input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.isComposing) {
        e.preventDefault();
        $form.requestSubmit();
    }
});

// 초기 렌더
render();