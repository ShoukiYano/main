
document.addEventListener('DOMContentLoaded', function() {
	fetchTodos();
});

const fetchTodos = () => {
	fetch('/api/todos')
		.then(response => response.json())
		.then(data => {
			const todoList = document.getElementById('todo-list');
			todoList.innerHTML = '' // Clear the list.
			data.forEach(todo => {
				const todoItem = document.createElement('li');
				todoItem.textContent = `${todo.name}:${todo.content}`;
				const detailButton = createButton('詳細', () => showDetails(todo.id)),
					editButton = createButton('編集', () => editTodo(todo.id)),
					deleteButton = createButton('削除', () => deleteTodo(todo.id));
				todoItem.appendChild(detailButton);
				todoItem.appendChild(editButton);
				todoItem.appendChild(deleteButton);
				todoList.appendChild(todoItem);
			});

		});
}

const addTodo = () => {
	const nameInput = document.getElementById('name'),
		contentInput = document.getElementById('content');
		if(nameInput.value.trim() === '' && contentInput.value.trim() === '') {
			alert('名前と内容は必須です。');
		}else if (nameInput.value.trim() === '') {
			alert('名前は必須です。');
			return; // 早期リターン
		}else if (contentInput.value.trim() === '') {
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
	fetch(`/api/todos/${id}`)
		.then(response => response.json())
		.then(data => {
			alert(`名前：${data.name}\n内容：${data.content}`);
		});
}

const editTodo = (id) => {
	const newName = prompt('新しい名前を入力してください'),
		newContent = prompt('新しい内容を入力してください');
	fetch(`/api/todos/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name: newName,
			content: newContent
		}),
	})
		.then(response => response.json())
		.then(data => {
			fetchTodos(); // Refresh the list.
		});
}

const deleteTodo = (id) => {
	fetch(`api/todos/${id}`, {
		method: 'DELETE',
	})
		.then(() => {
			fetchTodos(); // Refresh the list.
		})
}

const createButton = (text, onClick) => {
	const button = document.createElement('button');
	button.textContent = text;
	button.onclick = onClick;
	return button;
}