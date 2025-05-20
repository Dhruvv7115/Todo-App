async function signup(){
  const email = document.querySelector("#email-signup").value
  const fullname = document.querySelector("#fullname").value
  const password = document.querySelector("#password-signup").value
  email.value = ''
  fullname.value = ''
  password.value = ''
  const response = await axios.post("http://localhost:4000/api/v1/users/signup/", {
    email,
    fullname,
    password
  });

  if(!response){
    alert("There was a problem while signing up.")
  }
  alert(`User signed up successfully: ${response.data.data.fullname}, Todo-App says Hello.`)
  console.log(response.data.data);
  
}
document.querySelector("#signup-btn").addEventListener('click', function(e){
  e.preventDefault();
  signup();
})
async function signin(){
  const email = document.querySelector("#email-signin").value
  const password = document.querySelector("#password-signin").value
  email.value = ''
  password.value = ''
  const response = await axios.post("http://localhost:4000/api/v1/users/signin/", {
    email,
    password
  });

  if(!response){
    alert("There was a problem while logging in the user.")
  }

  alert(`User logged in successfully: Welcome, ${response.data.data.user.fullname}! Todo-App says Hello 👋`)

  console.log(response.data.data);
  
}
document.querySelector("#signin-btn").addEventListener('click', function(e){
  e.preventDefault();
  signin();
});

document.querySelector("#signup-link").addEventListener('click', function(){
  document.querySelector("#signin-form").classList.add("hidden");
  document.querySelector("#signin-form").classList.remove("flex");

  document.querySelector("#signup-form").classList.remove("hidden"); 
  document.querySelector("#signup-form").classList.add("flex"); 
});
document.querySelector("#signin-link").addEventListener('click', function(){
  document.querySelector("#signup-form").classList.add("hidden");
  document.querySelector("#signup-form").classList.remove("flex");

  document.querySelector("#signin-form").classList.remove("hidden"); 
  document.querySelector("#signin-form").classList.add("flex"); 
});
document.querySelector("#signup-btn").addEventListener('click', function(){
  document.querySelector("#signup-form").classList.add("hidden");
  document.querySelector("#signup-form").classList.remove("flex");

  document.querySelector("#signin-form").classList.remove("hidden"); 
  document.querySelector("#signin-form").classList.add("flex"); 
});