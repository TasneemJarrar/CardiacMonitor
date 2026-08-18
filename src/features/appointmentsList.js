import { fetchData, getRole } from "../js/storage.js";
let allPatients = [];
let allAppointments = [];
let allUsers = [];

export async function initAppointmentsList() {
  const appointmentList = document.querySelector("#appointments-list");
  const searchInput = document.querySelector("#appointments-search");
  const statusFilter = document.querySelector("#status-filter");
  const dateFilter = document.querySelector("#date-filter");
  const ClrBtn = document.querySelector("#clear-filters");
  const addBtn = document.querySelector("#add-appointment-btn");
  const role = getRole();

  appointmentList.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">Loading Appointments...</p>`;

  try {
    [allPatients, allAppointments, allUsers] = await Promise.all([
      fetchData("/src/data/patients.json"),
      fetchData("/src/data/appointments.json"),
      fetchData("/src/data/users.json"),
    ]);

    if (allPatients.length === 0) {
      appointmentList.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">No patients found.</p>`;
      return;
    }

    if (allAppointments.length === 0) {
      appointmentList.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">No appointments found.</p>`;
      return;
    }

    renderAppointments(allAppointments, role);

    searchInput.addEventListener("input", applyFilters);
    statusFilter.addEventListener("change", applyFilters);
    dateFilter.addEventListener("change", applyFilters);

    ClrBtn.addEventListener("click", () => {
      searchInput.value = "";
      statusFilter.value = "all";
      dateFilter.value = "";
      applyFilters();
    });

    if (role === "receptionist") {
      addBtn.classList.remove("hidden");
      addBtn.addEventListener("click", () => {
        console.alert("هون رح نفتح الـ modal لاحقًا");
      });
    }
  } catch (err) {
    appointmentList.innerHTML = `
        <div class="text-status-error dark:text-status-error-dark">
          <p>Failed to load appointments.</p>
          <button id="retry-btn" class="mt-2 text-sm underline">Retry</button>
        </div>
      `;
    document
      .getElementById("retry-btn")
      .addEventListener("click", initAppointmentsList);
  }
}

function renderAppointments(appointments, role) {
  const appointmentList = document.querySelector("#appointments-list");
  appointmentList.innerHTML = appointments
    .map((a) => renderAppointmentRow(a, role))
    .join("");

  if (role === "receptionist") {
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("تعديل موعد:", btn.dataset.id);
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("حذف موعد:", btn.dataset.id);
      });
    });
  } else {
    document.querySelectorAll(".appointment-patient-row").forEach((row) => {
      row.addEventListener("click", () => {
        window.location.href = `/patientDetails.html?id=${row.dataset.id}`;
      });
    });
  }
}

function renderAppointmentRow(a, role) {
  const patient = allPatients.find((p) => p.id === a.patientId);
  const patientName = patient ? patient.name : "unkown";
  const doctor = allUsers.find((d) => d.id === a.doctorId);
  const doctorName = doctor ? doctor.name : "unkown";

  const statusColors = {
    Completed: "bg-status-success/15 text-status-success",
    Scheduled: "bg-status-warning/15 text-status-warning",
    Urgent: "bg-status-error/15 text-status-error",
  };

  const statusClass = statusColors[a.status] || "";

   const actionButtons = role === "receptionist" ? `
    <div class="flex gap-2 col-span-3 justify-end">
      <button class="edit-btn text-xs text-primary hover:underline" data-id="${a.id}">Edit</button>
      <button class="delete-btn text-xs text-status-error hover:underline" data-id="${a.id}">Delete</button>
    </div>
  ` : "";

  const clickableClass = role !== "receptionist" ? "appointment-patient-row cursor-pointer hover:bg-background dark:hover:bg-background-dark" : "";
  
  return `
      <div
        class="bg-surface p-2 dark:bg-surface-dark border-b last:border-0 border-border dark:border-border-dark rounded-lg grid grid-cols-12 text-sm">
        <div class="col-span-3 flex flex-col gap-1">
          <p class="font-semibold">${patientName}</p>
          <p class="text-xs text-text-muted dark:text-text-muted-dark">${a.reason}</p>
        </div>

        <div class="col-span-3">
          <p class="font-semibold">${doctorName}</p>
        </div>

        <div class="col-span-3 flex flex-col gap-1">
          <p class="">${a.date}</p>
          <p class="">${a.time}</p>
        </div>

        <div class="col-span-3 flex flex-col gap-1">
          <p class="text-xs px-2 py-1 rounded-2xl w-fit ${statusClass}">${a.status}</p>
          
          <div class="flex items-center gap-4">
          ${actionButtons}
          </div>
          </div>
      </div>
  `;
}

function applyFilters() {
  const term = document
    .querySelector("#appointments-search")
    .value.trim()
    .toLowerCase();
  const status = document.querySelector("#status-filter").value;
  const date = document.querySelector("#date-filter").value;

  let filtered = allAppointments.filter((a) => {
    const patient = allPatients.find((p) => p.id === a.patientId);
    const patientName = patient ? patient.name.toLowerCase() : "";
    const matchSearch =
      patientName.includes(term) || a.reason.toLowerCase().includes(term);
    return matchSearch;
  });

  if (status !== "all") {
    filtered = filtered.filter((a) => a.status === status);
  }

  if (date) {
    filtered = filtered.filter((a) => a.date === date);
  }

  renderAppointments(filtered);
}
