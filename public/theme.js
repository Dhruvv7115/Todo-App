//icons
const sunIcon = document.querySelector("#sun");
const moonIcon = document.querySelector("#moon");

//theme vars
const userTheme = localStorage.getItem("theme")
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

//icon toggling
const iconToggle = () => {
  moonIcon.classList.toggle("hidden")
  sunIcon.classList.toggle("hidden")
}

//initial theme-check
const themeCheck = () => {
  console.log(userTheme === "dark" || !userTheme && systemTheme)
  if(userTheme === "dark"|| (!userTheme && systemTheme)){
    document.documentElement.classList.add("dark");
    moonIcon.classList.add("hidden");
    return;
  }
  // document.documentElement.classList.remove("dark");
  sunIcon.classList.add("hidden")
}

//manual theme
const themeSwitch = () => {
  iconToggle();
  if(document.documentElement.classList.contains("dark")){
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    return;
  }
  document.documentElement.classList.add("dark");
  localStorage.setItem("theme", "dark");
}

//call theme switch on clicking buttons
const themeIcons = document.querySelectorAll(".theme-icon");
themeIcons.forEach(themeIcon => {
  themeIcon.addEventListener('click', function(){
    themeSwitch();
  })
})

//invoke theme check on intial load
themeCheck();