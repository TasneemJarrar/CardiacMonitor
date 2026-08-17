import { initDoctorDashboard } from "../features/dashboardDoctor.js";
import { renderHeader } from "../features/header.js";
import { initPatientsList } from "../features/patientList.js";
import { initRoleSelect } from "../features/roleSelect.js";
import { renderSidebar } from "../features/sideBar.js";
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
  renderSidebar()

  const role = getRole();
  if (role === 'doctor') {
    initDoctorDashboard();
  }

}

if (page === 'patients') {
  await renderHeader();
  renderSidebar();
  bindThemeToggle();
  initPatientsList();
}
