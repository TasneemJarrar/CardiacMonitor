import { clearRole, fetchData, getRole } from "../js/storage.js";

const ROLES = {
  doctor: {
    text: "Dr",
    lightClasses: "bg-role-doctor/70",
    darkClasses: "dark:bg-role-doctor-bg dark:text-role-doctor-dark",
    roleClass :"text-role-doctor"
  },
  nurse: {
    text: "N",
    lightClasses: "bg-role-nurse/70",
    darkClasses: "dark:bg-role-nurse-bg dark:text-role-nurse-dark",
    roleClass :"text-role-nurse"
  },
  receptionist: {
    text: "RP",
    lightClasses: "bg-role-receptionist/70",
    darkClasses:
      "dark:bg-role-receptionist-bg dark:text-role-receptionist-dark",
      roleClass :"text-role-receptionist"
  },
};



export async function renderHeader() {
  const role = getRole();

  if (!role || !ROLES[role]) {
    window.location.href = "./index.html";
    return;
  }

  const users = await fetchData("../../src/data/users.json");
  const currentUser = users.find((u) => u.role === role);

  const profile = document.querySelector(".roleProfile");
  profile.textContent = currentUser ? getInitials(currentUser.name) : role;
  profile.classList.add(
    ROLES[role].lightClasses,
    ROLES[role].darkClasses.split(" "),
  );

  const userName = document.querySelector("#user-name");
  const userRole = document.querySelector("#role");
  userName.textContent = currentUser ? currentUser.name : role ;
  userRole.textContent = currentUser ? currentUser.role : role;
  userRole.classList.add(ROLES[role].roleClass);

  const logoutBtn = document.querySelector(".logoutBtn");
  logoutBtn.addEventListener("click", () => {
    clearRole();
    window.location.href = "./index.html";
  });
}

function getInitials(fullName) {
  return fullName
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("");
}
