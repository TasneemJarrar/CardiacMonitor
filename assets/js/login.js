const modebtn = document.querySelector(".mode-toggle");
const modeicon = document.querySelector(".mode-icon");
const html = document.documentElement;

//dark mode
if (localStorage.getItem("theme") ==="dark") {
  html.classList.add("dark");
  modeicon.classList.replace("fa-moon", "fa-sun");
}

modebtn.addEventListener("click", () => {
  html.classList.toggle("dark");

  if (html.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    modeicon.classList.replace("fa-moon", "fa-sun");
  } else {
    localStorage.setItem("theme", "light");
    modeicon.classList.replace("fa-sun", "fa-moon");
  }
});


// const VIEWS = {
//   chooseRole: ".dashboradView",
//   students: ".studentsView",
//   courses: ".coursesView",
//   enroll: ".enrollmentView",
//   search: ".searchView",
//   profile: ".profileView",
// };

// //switch views
// const switchViews = (view) => {
//   Object.values(VIEWS).forEach((sel) =>
//     document.querySelector(sel).classList.add("hidden"),
//   );
//   document.querySelector(VIEWS[view]).classList.remove("hidden");
//   document.querySelectorAll(".nav-btn, .nav-btn-mobile").forEach((btn) => {
//     const active = btn.dataset.view === view;
//     btn.classList.toggle("bg-violet-500", active);
//     btn.classList.toggle("text-white", active);
//   });
//   if (view === "home") updateDashboard();
// };

// document.querySelectorAll(".nav-btn, .nav-btn-mobile").forEach((btn) => {
//   btn.addEventListener("click", () => {
//     const view = btn.dataset.view;
//     switchViews(view);
//   });
// });