const postNewTodo = async (event) => {
    event.preventDefault();
    const newTodoResponse = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({
            userid: document.getElementById("userid").value,
            category: document.getElementById("category").value,
            description: document.getElementById("description").value,
            deadline: document.getElementById("deadline").value,
            priority: document.getElementById("priority").value,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (newTodoResponse.ok) {
        console.log("Todo created successfully!");
        console.log(newTodoResponse.status);
        document.location.replace("/todos");
    }
};

const loadCategories = async () => {
    const categoriesResponse = await fetch("/api/categories", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (categoriesResponse.ok) {
        const categories = await categoriesResponse.json();
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            document.getElementById("category").appendChild(option);
        });
    }
};

document.getElementById("newTodo").addEventListener("submit", postNewTodo);

loadCategories();
