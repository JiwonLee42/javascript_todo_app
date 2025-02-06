const list = document.getElementById('list');
const createBtn = document.getElementById('create-btn');

let todos = [];

// 새로운 TODO 추가 이벤트 리스너
createBtn.addEventListener('click', createNewTodo);

function createNewTodo() {
    // 새로운 아이템 객체 생성
    const item = {
        id: new Date().getTime(),
        text: '',
        complete: false
    };

    // 배열의 처음에 새로운 아이템 추가
    todos.unshift(item);

    // 요소 생성 및 리스트에 추가
    const { itemEl, inputEl , editBtnEl, removeAttribute } = createTodoElement(item);
    list.prepend(itemEl);

    // 입력 활성화 및 포커스 설정
    inputEl.removeAttribute('disabled');
    inputEl.focus(); // 타이핑 가능하도록 설정
    saveToLocalStorage();
}

function createTodoElement(item) {
    const itemEl = document.createElement('div');
    itemEl.classList.add('todo-item');

    // 체크박스 생성
    const checkboxEl = document.createElement('input');
    checkboxEl.type = 'checkbox';

    // 완료된 todo 반영하도록 설정
    checkboxEl.checked = item.complete;

    if (item.complete) {
        itemEl.classList.add('complete');
    }

    checkboxEl.addEventListener('change', () => {
        item.complete = checkboxEl.checked;
        if(item.complete) {
            itemEl.classList.add('complete');
        }
        else{
            itemEl.classList.remove('complete');
        }
        saveToLocalStorage();
    })

    // 텍스트 입력 필드 생성
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.value = item.text;
    inputEl.setAttribute('disabled', '');
    inputEl.addEventListener('input', () => {
        item.text = inputEl.value;
    });

    inputEl.addEventListener('blur', () => {
        inputEl.setAttribute('disabled', '');
        saveToLocalStorage();
    });

    // 액션 버튼
    const actionsEl = document.createElement('div');
    actionsEl.classList.add('todo-actions');

    // 수정 버튼
    const editBtnEl = document.createElement('button');
    editBtnEl.classList.add('material-icons');
    editBtnEl.innerText = 'edit';
    editBtnEl.addEventListener('click', () => {
        if (inputEl.hasAttribute('disabled')) {
            inputEl.removeAttribute('disabled');
            inputEl.focus();
        } else {
            inputEl.setAttribute('disabled', '');
        }
    });

    // 수정 시 입력 가능하도록 설정
    editBtnEl.addEventListener('click', () => {
        inputEl.removeAttribute('disabled');
        inputEl.focus();
    })

    // 삭제 버튼
    const removeBtnEl = document.createElement('button');
    removeBtnEl.classList.add('material-icons','remove-btn');
    removeBtnEl.innerText = 'remove_circles';

    removeBtnEl.addEventListener('click', () => {
        todos = todos.filter(t => t.id !== item.id);
        itemEl.remove();
        // 삭제 시에도 저장되도록 설정
        saveToLocalStorage(); 
    });


    // 요소 추가
    actionsEl.appendChild(editBtnEl);
    actionsEl.appendChild(removeBtnEl);
    itemEl.appendChild(checkboxEl);
    itemEl.appendChild(inputEl);
    itemEl.appendChild(actionsEl);

    inputEl.addEventListener('input', () => {
        item.text = inputEl.value;
    })

    return { itemEl, inputEl };
}

// 로컬 스토리지에 넣기, 문자열로 넣어야 함
function saveToLocalStorage() {
   const data = JSON.stringify(todos);
   localStorage.setItem('my-todos', data);
}

// 로컬 스토리지에서 가져오기
function loadFromLocalStorage() {
   const data = localStorage.getItem('my-todos');
   if (data) {
       todos = JSON.parse(data);
   }
}

function displayTodos() {
    loadFromLocalStorage();
    for(let i = 0; i < todos.length; i++) {
        const item = todos[i];
        const { itemEl } = createTodoElement(item);
        list.appendChild(itemEl);
    }
}

displayTodos();