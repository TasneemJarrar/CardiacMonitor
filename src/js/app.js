import { initAppointmentsList } from "../features/appointmentsList.js";
import { initDoctorDashboard } from "../features/dashboardDoctor.js";
import { renderHeader } from "../features/header.js";
import { initPatientDetailes } from "../features/patientDetailes.js";
import { initPatientsList } from "../features/patientList.js";
import { initRoleSelect } from "../features/roleSelect.js";
import { bindSideBarToggle, renderSidebar } from "../features/sideBar.js";
import { initVitalsList } from "../features/vitals.js";
import { getRole } from "./storage.js";
import { bindThemeToggle, initTheme } from "./theme.js";

const page = document.body.dataset.page;

initTheme();

if (page === "role-select") {
  bindThemeToggle();
  initRoleSelect();
}

if (page === "dashboard") {
  bindThemeToggle();
  renderHeader();
  renderSidebar();
  bindSideBarToggle();

  const role = getRole();
  if (role === "doctor") {
    initDoctorDashboard();
  }
}

if (page === "patients") {
  await renderHeader();
  renderSidebar();
  bindThemeToggle();
  bindSideBarToggle();
  initPatientsList();
}

if (page === "vitals") {
  await renderHeader();
  renderSidebar();
  bindThemeToggle();
  bindSideBarToggle();
  initVitalsList();
}

if (page === "appointments") {
  await renderHeader();
  renderSidebar();
  bindThemeToggle();
  bindSideBarToggle();
  initAppointmentsList();
}

if (page === "patientDetailes") {
  await renderHeader();
  renderSidebar();
  bindThemeToggle();
  bindSideBarToggle();
  initPatientDetailes();
}
