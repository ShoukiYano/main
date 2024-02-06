// URLからクエリパラメータを取得する関数
function getQueryParam(param) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param);
}

// ページが読み込まれたときに実行
document.addEventListener('DOMContentLoaded', () => {
	const todoId = getQueryParam('id'); // URLからidを取得
	if (todoId) {
		fetch(`/api/todos/${todoId}`) // Todoの詳細を取得
			.then(response => response.json())
			.then(todo => {
				// フォームにデータを設定
				document.getElementById('name').value = todo.name;
				document.getElementById('content').value = todo.content;
			})
			.catch(error => {
				console.error('Error fetching todo details:', error);
			});
	}
});

// フォームの送信イベントを処理する
document.getElementById('edit-form').addEventListener('submit', function(event) {
    event.preventDefault(); // フォームのデフォルトの送信を防ぐ
    const todoId = getQueryParam('id'); // URLからidを取得
    const updatedName = document.getElementById('name').value;
    const updatedContent = document.getElementById('content').value;

    // ここで更新されたデータをAPIに送信する
    fetch(`/api/todos/${todoId}`, {
        method: 'PUT', // または 'POST' にすることもあります
        headers: {
            'Content-Type': 'application/json', // コンテンツタイプをJSONに設定
        },
        body: JSON.stringify({
            name: updatedName,
            content: updatedContent
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // または `response.text()` など、応答の形式に応じた処理を行います
    })
    .then(data => {
        // 更新に成功した場合の処理をここに書く
        console.log('Update successful', data);
        // 例えば、更新が成功したことをユーザーに通知したり、
        // リストページにリダイレクトするなどの処理を行います
        window.location.href = '/index.html'; // リストページに戻る
    })
    .catch(error => {
        console.error('Error updating todo:', error);
        // エラー処理をここで行う
    });
});