import { getCurrentUser, notifyOtherUsers } from "../js/notifications.js";
import { fetchData, getItem, getRole, setItem } from "../js/storage.js";

let allPatients = [];
let allAppointments = [];
let allUsers = [];
let allDoctors = [];

export async function initAppointmentsList() {
  const appointmentList = document.querySelector("#appointments-list");
  const searchInput = document.querySelector("#appointments-search");
  const statusFilter = document.querySelector("#status-filter");
  const dateFilter = document.querySelector("#date-filter");
  const ClrBtn = document.querySelector("#clear-filters");
  const role = getRole();

  appointmentList.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">Loading Appointments...</p>`;

  try {
    const [originalPatients, originalAppointments, originalUsers] =
      await Promise.all([
        fetchData("./src/data/patients.json"),
        fetchData("./src/data/appointments.json"),
        fetchData("./src/data/users.json"),
      ]);

    allPatients = getItem("patients") || originalPatients;
    allAppointments = getItem("appointments") || originalAppointments;
    allUsers = getItem("users") || originalUsers;

    allDoctors = allUsers.filter((u) => u.role === "doctor");

    if (allPatients.length === 0) {
      appointmentList.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">No patients found.</p>`;
      return;
    }

    if (allAppointments.length === 0) {
      appointmentList.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">No appointments found.</p>`;
      return;
    }

    renderAppointments(allAppointments, role);

    searchInput.addEventListener("input", () => applyFilters(role));
    statusFilter.addEventListener("change", () => applyFilters(role));
    dateFilter.addEventListener("change", () => applyFilters(role));

    ClrBtn.addEventListener("click", () => {
      searchInput.value = "";
      statusFilter.value = "all";
      dateFilter.value = "";
      applyFilters(role);
    });

    if (role === "receptionist") {
      initAppointmentForm();
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

  if (appointments.length === 0) {
    appointmentList.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">No appointments match your filters.</p>`;
    return;
  }

  appointmentList.innerHTML = appointments
    .map((a) => renderAppointmentRow(a, role))
    .join("");

  if (role === "receptionist") {
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const appointment = allAppointments.find(
          (a) => a.id === btn.dataset.id,
        );
        if (appointment) fillFormForEdit(appointment);
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        allAppointments = allAppointments.filter(
          (a) => a.id !== btn.dataset.id,
        );
        renderAppointments(allAppointments, role);
      });
    });
  } else {
    document.querySelectorAll(".appointment-patient-row").forEach((row) => {
      row.addEventListener("click", () => {
        window.location.href = `./patientDetails.html?id=${row.dataset.id}`;
      });
    });
  }
}

function renderAppointmentRow(a, role) {
  const patient = allPatients.find((p) => p.id === a.patientId);
  const patientName = patient ? patient.name : "unknown";
  const doctor = allUsers.find(
    (d) => d.id === a.doctorId && d.role === "doctor",
  );
  const doctorName = doctor ? doctor.name : "unknown";

  const statusColors = {
    Completed: "bg-status-success/15 text-status-success",
    Scheduled: "bg-status-warning/15 text-status-warning",
    Urgent: "bg-status-error/15 text-status-error",
  };
  const statusClass = statusColors[a.status] || "";

  const actionButtons =
    role === "receptionist"
      ? `
    <div class="flex gap-1 col-span-3 justify-end">
      <button class="edit-btn text-xs text-primary hover:bg-primary/10 rounded-lg p-2" data-id="${a.id}">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path fill="currentColor" d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-1 2q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z" />
</svg>
      </button>
      <button class="delete-btn text-xs text-status-error hover:bg-status-error/10 rounded-2xl p-2" data-id="${a.id}">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zm3.713-4.288Q11 16.426 11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17t.713-.288m4 0Q15 16.426 15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17t.713-.288" />
</svg>
      </button>
    </div>
  `
      : "";

  const clickableClass =
    role !== "receptionist"
      ? "appointment-patient-row cursor-pointer hover:bg-background dark:hover:bg-background-dark"
      : "";

  return `
      <div
        data-id="${a.patientId}"
        class="${clickableClass} bg-surface p-2 dark:bg-surface-dark border-b last:border-0 border-border dark:border-border-dark rounded-lg grid grid-cols-12 text-sm transition-colors">
        <div class="col-span-3 flex flex-col gap-1">
          <p class="font-semibold">${patientName}</p>
          <p class="text-xs text-text-muted dark:text-text-muted-dark">${a.reason}</p>
        </div>

        <div class="col-span-2">
          <p class="font-semibold">${doctorName}</p>
        </div>

        <div class="col-span-3 flex flex-col gap-1">
          <p class="">${a.date}</p>
          <p class="">${a.time}</p>
        </div>

        <div class="col-span-4 flex items-center justify-between">
          <p class="text-xs px-2 py-1 rounded-2xl w-fit ${statusClass}">${a.status}</p>
          ${actionButtons}
        </div>
      </div>
  `;
}

function applyFilters(role) {
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

  renderAppointments(filtered, role);
}

function initAppointmentForm() {
  const formDiv = document.querySelector("#add-appointment-form");
  const form = document.querySelector("#appointment-form");
  const cancelBtn = document.querySelector("#appt-cancel-btn");
  const patientSelect = document.querySelector("#appt-patient-select");
  const doctorSelect = document.querySelector("#appt-doctor-select");
  const formTitle = document.querySelector("#appointment-form-title");
  const editIdInput = document.querySelector("#appointment-edit-id");

  if (!formDiv || !form) return;

  patientSelect.innerHTML =
    `<option value="" disabled selected>Select Patient</option>` +
    allPatients
      .map((p) => `<option value="${p.id}">${p.name}</option>`)
      .join("");

  doctorSelect.innerHTML =
    `<option value="" disabled selected>Select Doctor</option>` +
    allDoctors
      .map((d) => `<option value="${d.id}">${d.name}</option>`)
      .join("");

  formDiv.classList.remove("hidden");
  cancelBtn.addEventListener("click", () => {
    resetAppointmentForm();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const editId = editIdInput.value;
    const patientId = patientSelect.value;
    const doctorId = doctorSelect.value;
    const date = document.querySelector("#appt-date").value;
    const time = document.querySelector("#appt-time").value;
    const status = document.querySelector("#appt-status").value;
    const reason = document.querySelector("#appt-reason").value.trim();

    if (!patientId || !doctorId || !date || !time || !reason) {
      showAppointmentMessage("Please fill in all fields.", "error");
      return;
    }

    if (editId) {
      const appointment = allAppointments.find((a) => a.id === editId);
      if (appointment) {
        appointment.patientId = patientId;
        appointment.doctorId = doctorId;
        appointment.date = date;
        appointment.time = time;
        appointment.status = status;
        appointment.reason = reason;
        showAppointmentMessage("Appointment updated.", "success");
      }
    } else {
      const newAppointment = {
        id: String(Date.now()),
        patientId,
        doctorId,
        date,
        time,
        status,
        reason,
      };
      allAppointments.push(newAppointment);
      setItem("appointments", allAppointments);
      const currentUser = getCurrentUser(role);
      notifyOtherUsers(
        `A new appointments was successfully added by ${role}`,
        currentUser.id,
      );

      showAppointmentMessage("Appointment added.", "success");
    }

    resetAppointmentForm();
    renderAppointments(allAppointments, "receptionist");
  });

  window._formRefs = { formTitle, editIdInput, patientSelect, doctorSelect };
}

function resetAppointmentForm() {
  const form = document.querySelector("#appointment-form");
  const formTitle = document.querySelector("#appointment-form-title");
  const editIdInput = document.querySelector("#appointment-edit-id");
  const message = document.querySelector("#appointment-form-message");

  form.reset();
  editIdInput.value = "";
  formTitle.textContent = "New Appointment";
  message.classList.add("hidden");
}

function fillFormForEdit(appointment) {
  document.querySelector("#appointment-form-title").textContent =
    "Edit Appointment";
  document.querySelector("#appointment-edit-id").value = appointment.id;
  document.querySelector("#appt-patient-select").value = appointment.patientId;
  document.querySelector("#appt-doctor-select").value = appointment.doctorId;
  document.querySelector("#appt-date").value = appointment.date;
  document.querySelector("#appt-time").value = appointment.time;
  document.querySelector("#appt-status").value = appointment.status;
  document.querySelector("#appt-reason").value = appointment.reason;
  document
    .querySelector("#add-appointment-form")
    .scrollIntoView({ behavior: "smooth" });
}

function showAppointmentMessage(text, type) {
  const message = document.querySelector("#appointment-form-message");
  message.textContent = text;
  message.className =
    type === "success"
      ? "text-xs mt-2 text-status-success"
      : "text-xs mt-2 text-status-error";
}
