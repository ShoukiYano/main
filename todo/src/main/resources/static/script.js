
document.addEventListener('DOMContentLoaded', function() {
	// URLからクエリパラメータを取得する関数が必要です
	const todoId = getQueryParam('id');
	if (!todoId) {
		fetchTodos(); // ここでリストをフェッチして表示する関数を呼び出す
	}
});

const fetchTodos = () => {
	fetch(`/api/todos`)
		.then(response => response.json())
		.then(data => {
			const todoList = document.getElementById('todo-list');
			todoList.innerHTML = '' // Clear the list.
			data.forEach(todo => {
				const todoItem = document.createElement('div');
				todoItem.classList.add('todo-item'); // CSSクラスを追加

				const todoText = document.createElement('div');
				todoText.classList.add('todo-text');
				todoText.textContent = `名前: ${todo.name}`; // テキスト部分の内容を設定

				const buttonsContainer = document.createElement('div');
				buttonsContainer.classList.add('buttons');
				const detailButton = createButton('詳細', () => showDetails(todo.id)),
					editButton = createButton('編集', () => handleEditButtonClick(todo.id), todo.id),
					deleteButton = createButton('削除', () => deleteTodo(todo.id));

				// ボタンをコンテナに追加
				buttonsContainer.appendChild(detailButton);
				buttonsContainer.appendChild(editButton);
				buttonsContainer.appendChild(deleteButton);

				// テキストとボタンコンテナをtodoItemに追加
				todoItem.appendChild(todoText);
				todoItem.appendChild(buttonsContainer);
				todoList.appendChild(todoItem);
			});

		});
}

// URLからクエリパラメータを取得する関数
function getQueryParam(param) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param);
}

const addTodo = () => {
	const nameInput = document.getElementById('name'),
		contentInput = document.getElementById('content');
	if (nameInput.value.trim() === '' && contentInput.value.trim() === '') {
		alert('名前と内容は必須です。');
	} else if (nameInput.value.trim() === '') {
		alert('名前は必須です。');
		return; // 早期リターン
	} else if (contentInput.value.trim() === '') {
		alert('内容は必須です。')
	}
	fetch('/api/todos', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name: nameInput.value,
			content: contentInput.value
		}),
	})
		.then(response => response.json())
		.then(data => {
			fetchTodos(); // Refresh the list.
			nameInput.value = ''; // Clear the input.
			content.value = ''; // Clear the input.
		});
}

/**
 * @param id ID List
 */
const showDetails = (id) => {
	window.location.href = `/todo-details.html?id=${id}`; // 詳細ページにクエリパラメータ付きでリダイレクト
}

const createButton = (text, onClick, todoId) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    button.setAttribute('data-todo-id', todoId); // これが必要です
    button.classList.add('edit-button'); // 編集ボタンにこのクラスを追加
    return button;
};


// 編集ボタンのクリックイベントを処理する関数
function handleEditButtonClick(todoId) {
    // 編集ページへのパスはプロジェクトのURL構造によります
    const editPageUrl = `/edit-todo.html?id=${todoId}`;
    checkUserPermission(todoId)
    .then(isAllowed => {
		if (isAllowed) {
			window.location.href = editPageUrl; // 編集ページへ遷移
		}else {
			alert('編集する権限がありません');
		}
	})
	.catch(error => {
		console.error('Error checking permissions:',error);
	});
    
}

const checkUserPermission = (todoId) => {
	return fetch(`/api/check-permission?todoId=${todoId}`, {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + userToken
		}
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('Permission check failed');
		}
		return response.json();
	})
	.then(data => {
		return data.isAllowed;
	})
}


// 編集ボタンのイベントリスナーを設定する
document.querySelectorAll('.edit-button').forEach(button => {
    const todoId = button.getAttribute('data-todo-id'); // ボタンからTodoのIDを取得
    button.addEventListener('click', () => handleEditButtonClick(todoId));
});

const deleteTodo = (id) => {
	fetch(`api/todos/${id}`, {
		method: 'DELETE',
	})
		.then(() => {
			fetchTodos(); // Refresh the list.
		})
}


