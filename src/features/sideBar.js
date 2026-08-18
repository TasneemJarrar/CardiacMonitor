import { getRole } from "../js/storage.js";

const NAV_ITEMS = {
  dashboard: {
    text: "Dashboard",
    href: "./dashboard.html",
    page: "dashboard",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M14 9q-.425 0-.712-.288T13 8V4q0-.425.288-.712T14 3h6q.425 0 .713.288T21 4v4q0 .425-.288.713T20 9zM4 13q-.425 0-.712-.288T3 12V4q0-.425.288-.712T4 3h6q.425 0 .713.288T11 4v8q0 .425-.288.713T10 13zm10 8q-.425 0-.712-.288T13 20v-8q0-.425.288-.712T14 11h6q.425 0 .713.288T21 12v8q0 .425-.288.713T20 21zM4 21q-.425 0-.712-.288T3 20v-4q0-.425.288-.712T4 15h6q.425 0 .713.288T11 16v4q0 .425-.288.713T10 21z" /></svg>',
  },
  patients: {
    text: "Patient List",
    href: "./patientList.html",
    page: "patients",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="6" r="4" /><path stroke-linecap="round" d="M18 9C19.6569 9 21 7.88071 21 6.5C21 5.11929 19.6569 4 18 4" /><path stroke-linecap="round" d="M6 9C4.34315 9 3 7.88071 3 6.5C3 5.11929 4.34315 4 6 4" /><ellipse cx="12" cy="17" rx="6" ry="4" /><path stroke-linecap="round" d="M20 19C21.7542 18.6153 23 17.6411 23 16.5C23 15.3589 21.7542 14.3847 20 14" /><path stroke-linecap="round" d="M4 19C2.24575 18.6153 1 17.6411 1 16.5C1 15.3589 2.24575 14.3847 4 14" /></g></svg>',
  },
  vitals: {
    text: "Vital Records",
    href: "./vitals.html",
    page: "vitals",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h4l3 7l4-14l3 7h4" /></svg>',
  },
  appointments: {
    text: "Appointments",
    href: "./appointments.html",
    page: "appointments",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 4h-2V3a1 1 0 0 0-2 0v1H9V3a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7h16Zm0-9H4V7a1 1 0 0 1 1-1h2v1a1 1 0 0 0 2 0V6h6v1a1 1 0 0 0 2 0V6h2a1 1 0 0 1 1 1Z" /></svg>',
  },
};

const ROLE_NAVS = {
  doctor: ["dashboard", "patients", "vitals", "appointments"],
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
