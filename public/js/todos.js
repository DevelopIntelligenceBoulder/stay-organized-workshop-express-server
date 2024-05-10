const loadUsers = async () => {
    const usersResponse = await fetch("/api/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (usersResponse.ok) {
        const users = await usersResponse.json();
        users.forEach((user) => {
            const option = document.createElement("option");
            option.value = user.id;
            option.textContent = user.name;
            document.getElementById("userSelect").appendChild(option);
        });
    }
};

loadTodos = async (userid) => {
    const todosResponse = await fetch(`/api/todos/byuser/${userid}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (todosResponse.ok) {
        const todos = await todosResponse.json();
        todos.forEach((todo) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${todo.id}</td>
                <td>${todo.category}</td>
                <td>${todo.description}</td>
                <td>${todo.deadline}</td>
                <td>${todo.priority}</td>
                <td>${todo.completed}</td>
            `;
            document.getElementById("todosTable").appendChild(tr);
        });
    }
};

loadUsers();

document.getElementById("userSelect").addEventListener("change", (event) => {
    document.getElementById("todosTable").innerHTML = "";
    loadTodos(event.target.value);
});
