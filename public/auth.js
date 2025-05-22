document.addEventListener('DOMContentLoaded', function() {
  // Form elements
  const signinForm = document.getElementById('signin-form');
  const signupForm = document.getElementById('signup-form');
  
  // Form toggle buttons
  const showSignupBtn = document.getElementById('show-signup');
  const showSigninBtn = document.getElementById('show-signin');
  
  // Result areas for feedback messages
  const signinResult = document.getElementById('signin-result');
  const signupResult = document.getElementById('signup-result');
  
  // Form toggle functionality
  showSignupBtn.addEventListener('click', function() {
    signinForm.classList.add('hidden');
    signinForm.classList.remove('flex');
    signupForm.classList.remove('hidden'); 
    signupForm.classList.add('flex');
    // Clear any previous error messages
    signinResult.innerHTML = '';
    signupResult.innerHTML = '';
  });
  
  showSigninBtn.addEventListener('click', function() {
    signupForm.classList.add('hidden');
    signupForm.classList.remove('flex');
    signinForm.classList.remove('hidden'); 
    signinForm.classList.add('flex');
    // Clear any previous error messages
    signinResult.innerHTML = '';
    signupResult.innerHTML = '';
  });
  
  // Password toggle functionality
  const togglePasswordButtons = document.querySelectorAll('.toggle-password');
  togglePasswordButtons.forEach(button => {
    button.addEventListener('click', function() {
      const input = this.closest('div').querySelector('.password');
      const type = input.getAttribute('type');
      
      // Toggle password visibility
      input.setAttribute('type', type === 'password' ? 'text' : 'password');
      
      // Toggle eye icon
      this.classList.toggle('fa-eye-slash');
      this.classList.toggle('fa-eye');
    });
  });
  
  // Form submission handling
  signinForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    await handleSignin();
  });
  
  signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    await handleSignup();
  });
  
  // Check if user is already logged in
  checkAuthStatus();
});

// Check if user is already logged in and redirect if needed
function checkAuthStatus() {
  const token = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');
  
  if (token && userId) {
    // User is already logged in, redirect to the todo app
    window.location.href = '/public/home.html';
  }
}

// Handle sign in submission
async function handleSignin() {
  const email = document.getElementById('email-signin').value.trim();
  const password = document.getElementById('password-signin').value;
  const signinResult = document.getElementById('signin-result');
  
  // Basic validation
  if (!email || !password) {
    showMessage(signinResult, 'Please enter both email and password', 'error');
    return;
  }
  
  // Show loading state
  showMessage(signinResult, 'Signing in...', 'loading');
  
  try {
    const response = await axios.post('http://localhost:4000/api/v1/users/signin', {
      email,
      password
    }, { 
      withCredentials: true 
    });
    
    if (response.status === 200) {
      // Store user data
      const userData = response.data.data;
      document.cookie = `userId=${userData.user._id}`
      document.cookie = `accessToken=${userData.accessToken}`
      document.cookie = `fullname=${userData.user.fullname}`
      
      // Show success message
      showMessage(signinResult, 'Login successful! Redirecting...', 'success');
      
      // Redirect to home page
      setTimeout(() => {
        window.location.href = '/public/home.html';
      }, 1000);
    }
  } catch (error) {
    console.error('Signin error:', error);
    
    // Handle different error scenarios
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data?.message || 'Invalid email or password';
      showMessage(signinResult, errorMessage, 'error');
    } else if (error.request) {
      // The request was made but no response was received
      showMessage(signinResult, 'No response from server. Please check your connection.', 'error');
    } else {
      // Something happened in setting up the request that triggered an Error
      showMessage(signinResult, 'Error during sign in. Please try again.', 'error');
    }
  }
}

// Handle sign up submission
async function handleSignup() {
  const fullname = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email-signup').value.trim();
  const password = document.getElementById('password-signup').value;
  const signupResult = document.getElementById('signup-result');
  
  // Basic validation
  if (!fullname || !email || !password) {
    showMessage(signupResult, 'Please fill in all fields', 'error');
    return;
  }
  
  //check if password is of 6 length
  if (password.length < 6) {
    showMessage(signupResult, 'Password must be at least 6 characters long', 'error');
    return;
  }
  
  // Show loading state
  showMessage(signupResult, 'Creating your account...', 'loading');
  
  try {
    const response = await axios.post('http://localhost:4000/api/v1/users/signup', {
      fullname,
      email,
      password
    }, { 
      withCredentials: true 
    });
    
    if (response.status === 200) {
      // Store user data
      const userData = response.data.data;
      document.cookie = `userId=${userData._id}`
      document.cookie = `accessToken=${userData.accessToken}`
      document.cookie = `fullname=${userData.fullname}`
      // localStorage.setItem('userId', userData._id);
      // localStorage.setItem('accessToken', userData.accessToken);
      // localStorage.setItem('username', userData.fullname);
      
      // Show success message
      showMessage(signupResult, 'Account created successfully! Redirecting...', 'success');
      
      // Redirect to home page
      setTimeout(() => {
        window.location.href = '/public/home.html';
      }, 1500);
    }
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle different error scenarios
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Error creating account';
      showMessage(signupResult, errorMessage, 'error');
    } else if (error.request) {
      showMessage(signupResult, 'No response from server. Please check your connection.', 'error');
    } else {
      showMessage(signupResult, 'Error during sign up. Please try again.', 'error');
    }
  }
}

// Helper function to display messages
function showMessage(element, message, type) {
  if (!element) return;
  
  let className = '';
  let icon = '';
  
  switch (type) {
    case 'success':
      className = 'text-green-600';
      icon = '<i class="fas fa-check-circle mr-1"></i>';
      break;
    case 'error':
      className = 'text-red-600';
      icon = '<i class="fas fa-exclamation-circle mr-1"></i>';
      break;
    case 'loading':
      className = 'text-blue-600';
      icon = '<i class="fas fa-spinner fa-spin mr-1"></i>';
      break;
    default:
      className = 'text-gray-600';
  }
  
  element.className = `text-center mt-3 ${className}`;
  element.innerHTML = `${icon}${message}`;
}
