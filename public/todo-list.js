document.addEventListener('DOMContentLoaded', async function(){
  const todoList = document.getElementById('todo-list');
  const addBtn = document.getElementById('add-task-btn');
  const inputBox = document.getElementById('todo-input');
  const greeting = document.querySelector('#greeting');
  const todosLeft = document.querySelector('#todos-left');
  const userIconDiv = document.querySelector("#user-icon-div")
  const dropdown = document.querySelector("#dropdown")
  const accountName = document.querySelector("#fullname-account")
  const logoutBtn = document.querySelector("#logout-btn")
  
  // Get userId from localStorage (should be set during login)
  const userId = getCookie("userId");
  const fullname = getCookie("fullname");
  greeting.innerHTML += fullname;
  accountName.innerHTML += fullname;

  //Get cookies
  function getCookie(name){
    const cookies = document.cookie.split("; ")
    let cookieVal
    cookies.forEach((cookie) => {
      // console.log(cookie.includes(name))
      if(cookie.includes(name)){
        cookieVal = cookie.replace(`${name}=`, "");
      }
    })
    return cookieVal;
  }

  //Get todos from localStorage 
  
  // Check if user is logged in
  if (!userId) {
    alert("Please log in to use the todo app");
    // Redirect to login page if needed
    window.location.href = '/index.html';
    return;
  }

  // Get authentication token
  const token = getCookie("accessToken");
  
  // Configure axios defaults for API calls
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  // Initial fetch of todos
  await fetchTodos();

  // Event listener for logging out
  logoutBtn.addEventListener('click', async() => {
    await handleLogout();
  })

  // Event listener for adding new todo
  addBtn.addEventListener('click', addNewTodo);
  
  // Allow adding todo with Enter key
  inputBox.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addNewTodo();
    }
  });

  // Allow to focus on input bar by "/"
  window.addEventListener('keypress', function(e) {
    if (e.key === '/') {
      e.preventDefault()
      inputBox.focus();
    }
  });

  userIconDiv.addEventListener('click', (e) => {
    dropdown.classList.toggle("hidden");
    dropdown.classList.toggle("flex")
  })

  // Function to log out a user.
  async function handleLogout(){
    try {
      const response = await axios.post(`https://todo-app-pp6k.onrender.com/api/v1/users/logout`, {
        withCredentials: true
      });

      if (response.data.statusCode === 200) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("userId")
        window.location.href = '/index.html'
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to logout please try again.");
    }
  }

  // Function to add a new todo
  async function addNewTodo() {
    const inputText = inputBox.value.trim();
    if (inputText === '') return;
    
    try {
      const response = await axios.post('https://todo-app-pp6k.onrender.com/api/v1/todos/add', {
        content: inputText
      }, {
        withCredentials: true
      });
      
      if (response.data.statusCode === 200) {
        // Clear input field
        inputBox.value = '';
        
        // Render the new todo
        renderTodo(response.data.data);
        fetchTodos()
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Failed to add todo. Please try again.");
    }
  }

  // Function to fetch all todos
  async function fetchTodos() {
    try {
      const response = await axios.get(`https://todo-app-pp6k.onrender.com/api/v1/todos/display/${userId}`, {
        withCredentials: true
      });
      
      // Clear existing todos
      todoList.innerHTML = '';
      
      // Check if todos exist and render them
      if (response.data.data && response.data.data.todos) {
        const todos = response.data.data.todos;
        const todosCount = response.data.data.todosCount;
        let todoMsg;
        if(todosCount === 0){
          todoMsg = "You have No Todos."
        }else{
          todoMsg = `You have ${todosCount} ${todosCount === 1 ? "todo" : "todos"} today`;
        }
        todosLeft.innerHTML = todoMsg;
        todos.forEach(todo => renderTodo(todo));
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      if(todosLeft.innerHTML === ''){
        todosLeft.innerHTML = "You have 0 todos";
      }
    }
  }

  // Function to render a single todo
  function renderTodo(todo) {
    const listItem = document.createElement('li');
    listItem.setAttribute('data-id', todo._id);
    listItem.className = `bg-white hover:bg-gray-100 dark:hover:bg-zinc-900 dark:bg-black text-black dark:text-white p-4 mb-4 rounded-xl hover:cursor-pointer flex justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`;
    
    // Apply completed class if todo is completed
    if (todo.isCompleted) {
      listItem.classList.add('completed');
    }
    
    listItem.innerHTML = `
      <span class="self-center">${todo.content}</span>
      <button class="bg-red-600 py-2 px-4 rounded-lg cursor-pointer hover:bg-red-800 transition duration-300 text-white">Delete</button>
    `;
    
    // Add click event to toggle completion status
    listItem.addEventListener('click', async function(e) {
      // Prevent toggle when clicking delete button
      if (e.target.tagName === 'BUTTON') return;
      
      try {
        const response = await axios.patch(`https://todo-app-pp6k.onrender.com/api/v1/todos/update-status/${todo._id}`, {}, {
          withCredentials: true
        });
        
        if (response.data.statusCode === 200) {
          listItem.classList.toggle('completed');
        }
      } catch (error) {
        console.error("Error updating todo status:", error);
        alert("Failed to update todo status. Please try again.");
      }
    });
    
    // Add delete event
    listItem.querySelector('button').addEventListener('click', async function(e) {
      e.stopPropagation();
      
      try {
        const response = await axios.delete(`https://todo-app-pp6k.onrender.com/api/v1/todos/delete/${todo._id}`, {
          withCredentials: true
        });
        
        if (response.data.statusCode === 200) {
          listItem.remove();
          fetchTodos();
        }
      } catch (error) {
        console.error("Error deleting todo:", error);
        alert("Failed to delete todo. Please try again.");
      }
    });
    
    // Add to the list
    todoList.appendChild(listItem);
  }
});