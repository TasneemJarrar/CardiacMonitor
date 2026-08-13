import { clearRole, getRole } from "../js/storage.js";

const ROLES = {
  doctor: {
    text: 'Dr',
    lightClasses:'bg-role-doctor/70',
    darkClasses:'dark:bg-role-doctor-bg dark:text-role-doctor-dark'
  },
  nurse: {
    text: 'N',
    lightClasses:'bg-role-nurse/70',
    darkClasses:'dark:bg-role-nurse-bg dark:text-role-nurse-dark'
  },
  receptionist: {
    text: 'RP',
    lightClasses:'bg-role-receptionist/70',
    darkClasses:'dark:bg-role-receptionist-bg dark:text-role-receptionist-dark'
  },
};

export function renderHeader (){
  const role = getRole();

  if (!role || !ROLES[role]) {
    window.location.href = '/index.html'
    return;
  }

  const profile = document.querySelector(".roleProfile");
  profile.textContent = ROLES[role].text;
  profile.classList.add(ROLES[role].lightClasses, ROLES[role].darkClasses.split(' '));

 const logoutBtn = document.querySelector(".logoutBtn");
 logoutBtn.addEventListener('click', () =>{
  clearRole();
  window.location.href = '/index.html';
 });
}