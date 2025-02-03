document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');
    const themeToggle = document.getElementById('themeToggle');
    const voiceInput = document.getElementById('voiceInput');
    const sortTasks = document.getElementById('sortTasks');
    const progressBar = document.getElementById('progress');
    const progressText = document.querySelector('.progress-text');
    const totalTasksSpan = document.getElementById('totalTasks');
    const completedTasksSpan = document.getElementById('completedTasks');

    // Load todos from localStorage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Theme Toggle
    const toggleTheme = () => {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        themeToggle.innerHTML = newTheme === 'light' ? 
            '<i class="fas fa-moon"></i>' : 
            '<i class="fas fa-sun"></i>';
    };

    // Voice Input
    const startVoiceInput = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            voiceInput.classList.add('recording');
            
            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                todoInput.value = text;
                voiceInput.classList.remove('recording');
            };

            recognition.onerror = () => {
                voiceInput.classList.remove('recording');
                alert('Voice input failed. Please try again.');
            };

            recognition.start();
        } else {
            alert('Voice input is not supported in your browser.');
        }
    };

    // Progress Tracking
    const updateProgress = () => {
        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}% Complete`;
        
        totalTasksSpan.textContent = total;
        completedTasksSpan.textContent = completed;
    };

    // Sort Tasks
    const sortTasksList = () => {
        const sortValue = sortTasks.value;
        let filteredTodos = [...todos];

        if (sortValue === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (sortValue === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }

        renderTodos(filteredTodos);
    };

    // Function to render todos
    const renderTodos = (todosToRender = todos) => {
        todoList.innerHTML = '';
        todosToRender.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <span class="todo-text">${todo.text}</span>
                <button class="complete-btn" onclick="toggleComplete(${index})">
                    ${todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
            `;
            
            todoList.appendChild(li);
        });
        updateProgress();
    };

    // Function to add new todo
    const addTodo = () => {
        const todoText = todoInput.value.trim();
        if (todoText) {
            todos.push({
                text: todoText,
                completed: false
            });
            todoInput.value = '';
            saveTodos();
            renderTodos();
        }
    };

    // Function to toggle todo completion status
    window.toggleComplete = (index) => {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos();
    };

    // Function to delete todo
    window.deleteTodo = (index) => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    };

    // Modified save function
    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
        updateProgress();
    };

    // Event listeners
    themeToggle.addEventListener('click', toggleTheme);
    voiceInput.addEventListener('click', startVoiceInput);
    sortTasks.addEventListener('change', sortTasksList);
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'light' ? 
        '<i class="fas fa-moon"></i>' : 
        '<i class="fas fa-sun"></i>';

    // Initial render
    renderTodos();
}); 