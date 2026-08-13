import { renderHeader } from "../features/header.js";
import { initRoleSelect } from "../features/roleSelect.js";
import { renderSidebar } from "../features/sideBar.js";
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
}
