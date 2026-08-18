import { getRole } from "../js/storage.js";

const NAV_ITEMS = {
  dashboard: {
    text: "Dashboard",
    href: "./dashboard.html",
    page: "dashboard",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" d="M14 9q-.425 0-.712-.288T13 8V4q0-.425.288-.712T14 3h6q.425 0 .713.288T21 4v4q0 .425-.288.713T20 9zM4 13q-.425 0-.712-.288T3 12V4q0-.425.288-.712T4 3h6q.425 0 .713.288T11 4v8q0 .425-.288.713T10 13zm10 8q-.425 0-.712-.288T13 20v-8q0-.425.288-.712T14 11h6q.425 0 .713.288T21 12v8q0 .425-.288.713T20 21zM4 21q-.425 0-.712-.288T3 20v-4q0-.425.288-.712T4 15h6q.425 0 .713.288T11 16v4q0 .425-.288.713T10 21z" /></svg>',
  },
  patients: {
    text: "Patient List",
    href: "./patientList.html",
    page: "patients",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 640 640"><path fill="currentColor" d="M320 80c57.4 0 104 46.6 104 104s-46.6 104-104 104s-104-46.6-104-104S262.6 80 320 80M96 152c39.8 0 72 32.2 72 72s-32.2 72-72 72s-72-32.2-72-72s32.2-72 72-72M0 480c0-70.7 57.3-128 128-128c12.8 0 25.2 1.9 36.9 5.4C132 394.2 112 442.8 112 496v16c0 11.4 2.4 22.2 6.7 32H32c-17.7 0-32-14.3-32-32zm521.3 64c4.3-9.8 6.7-20.6 6.7-32v-16c0-53.2-20-101.8-52.9-138.6c11.7-3.5 24.1-5.4 36.9-5.4c70.7 0 128 57.3 128 128v32c0 17.7-14.3 32-32 32zM472 224c0-39.8 32.2-72 72-72s72 32.2 72 72s-32.2 72-72 72s-72-32.2-72-72M160 496c0-88.4 71.6-160 160-160s160 71.6 160 160v16c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32z" /></svg>',
  },
  vitals: {
    text: "Vital Records",
    href: "./vitals.html",
    page: "vitals",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h4l3 7l4-14l3 7h4" /></svg>',
  },
  appointments: {
    text: "Appointments",
    href: "./appointments.html",
    page: "appointments",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" d="M2 9c0-1.886 0-2.828.586-3.414S4.114 5 6 5h12c1.886 0 2.828 0 3.414.586S22 7.114 22 9c0 .471 0 .707-.146.854C21.707 10 21.47 10 21 10H3c-.471 0-.707 0-.854-.146C2 9.707 2 9.47 2 9m0 9c0 1.886 0 2.828.586 3.414S4.114 22 6 22h12c1.886 0 2.828 0 3.414-.586S22 19.886 22 18v-5c0-.471 0-.707-.146-.854C21.707 12 21.47 12 21 12H3c-.471 0-.707 0-.854.146C2 12.293 2 12.53 2 13z" /><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7 3v3m10-3v3" /></g></svg>',
  },
  reports: {
    text: "Reports",
    href: "./reports.html",
    page: "reports",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" d="M13 9h5.5L13 3.5zM6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m1 18h2v-6H7zm4 0h2v-8h-2zm4 0h2v-4h-2z" /></svg>',
  },
};

const ROLE_NAVS = {
  doctor: ["dashboard", "patients", "vitals", "appointments", "reports"],
  nurse: ["dashboard", "patients", "vitals", "appointments"],
  receptionist: ["dashboard", "patients", "appointments"],
};

export function renderSidebar() {
  const role = getRole();
  const nav = document.querySelector(".sidebarNav");
  const currentPage = document.body.dataset.page;
  const pageNavs = ROLE_NAVS[role];

  nav.innerHTML = "";

  pageNavs.forEach((key) => {
    const item = NAV_ITEMS[key];
    const isActive = item.page === currentPage;
    const link = document.createElement("a");
    link.href = item.href;
    link.innerHTML = `
      ${item.icon}
      <span class="hidden group-hover:inline whitespace-nowrap">${item.text}</span>
    `;
    link.className = `flex gap-2 items-center p-2 rounded-lg transition-all duration-200 ease-in-out
      ${
        isActive
          ? "bg-primary/15 text-primary dark:bg-primary/25 dark:text-primary-light"
          : "text-text-secondary hover:scale-105 hover:bg-primary/10 hover:text-primary dark:text-text-secondary-dark dark:hover:bg-primary/15 dark:hover:text-primary-light"
      }
    `;

    nav.appendChild(link);
  });
}

export function bindSideBarToggle() {
  const menuBtn = document.querySelector(".menuBtn");
  const sideNav = document.querySelector("#sideNav");
  const closeBtn = document.querySelector("#closeSideNav");

  if (!menuBtn || !sideNav) return;
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      sideNav.classList.remove("hidden");
      sideNav.classList.add("flex");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      sideNav.classList.add("hidden");
    });
  }
}
