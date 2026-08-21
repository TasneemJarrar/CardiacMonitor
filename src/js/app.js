import { initAppointmentsList } from "../features/appointmentsList.js";
import { initDoctorDashboard } from "../features/dashboardDoctor.js";
import { initNurseDashboard } from "../features/dashboardNurse.js";
import { initReceptionistDashboard } from "../features/dashboardReceptionist.js";
import { renderHeader } from "../features/header.js";
import { initPatientDetailes } from "../features/patientDetailes.js";
import { initPatientsList } from "../features/patientList.js";
import { initReportsList } from "../features/reportsList.js";
import { initRoleSelect } from "../features/roleSelect.js";
import { bindSideBarToggle, renderSidebar } from "../features/sideBar.js";
import { initVitalsList } from "../features/vitals.js";
import { initNotifications } from "./notifications.js";
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
  await renderHeader();
  renderSidebar();
  bindSideBarToggle();
  initNotifications();

  const role = getRole();
  if (role === "doctor") {
    initDoctorDashboard();
  }

  if (role === "nurse") {
    initNurseDashboard();
  }

  if (role === "receptionist") {
    initReceptionistDashboard();
    
  }
}

if (page === "patients") {
  await renderHeader();
  renderSidebar();
  bindThemeToggle();
  bindSideBarToggle();
  initPatientsList();
  initNotifications();

}

if (page === "vitals") {
  await renderHeader();
  renderSidebar();
  bindThemeToggle();
  bindSideBarToggle();
  initVitalsList();
  initNotifications();
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
  initNotifications();
}

if (page === "reports") {
  await renderHeader();
  renderSidebar();
  bindThemeToggle();
  bindSideBarToggle();
  initReportsList();
  initNotifications();
}
