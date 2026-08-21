import { fetchData, getItem, getRole, setItem } from "../../src/js/storage.js";
import { getCurrentUser, notifyOtherUsers } from "../js/notifications.js";

let allPatients = [];
const role = getRole();

export async function initPatientsList() {
  const patientsList = document.getElementById("patients-list");
  const searchInput = document.getElementById("patient-search");
  const role = getRole();

  patientsList.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">Loading patients...</p>`;

  try {
    const originalPatients = await fetchData("./src/data/patients.json");
    allPatients = getItem("patients") || originalPatients;

    if (allPatients.length === 0) {
      patientsList.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">No patients found.</p>`;
      return;
    }

    renderPatients(allPatients);

    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.trim().toLowerCase();
      const filtered = allPatients.filter((p) =>
        p.name.toLowerCase().includes(term),
      );
      renderPatients(filtered);
    });

    if (role === "receptionist") {
      initRecAddPatientForm();
    }

    if (role === "doctor") {
      initDocAddPatientDataForm();
    }
  } catch (err) {
    console.log(err);
    patientsList.innerHTML = `
      <div class="text-status-error dark:text-status-error-dark">
        <p>Failed to load patients.</p>
        <button id="retry-btn" class="mt-2 text-sm underline">Retry</button>
      </div>
    `;
    document
      .getElementById("retry-btn")
      .addEventListener("click", initPatientsList);
  }
}

function renderPatients(patients) {
  const patientsList = document.getElementById("patients-list");
  const role = getRole();
  patientsList.innerHTML = patients
    .map((p) => renderPatientRow(p, role))
    .join("");

  document.querySelectorAll(".patient-row").forEach((row) => {
    row.addEventListener("click", () => {
      window.location.href = `./patientDetails.html?id=${row.dataset.id}`;
    });
  });
}

function renderPatientRow(p, role) {
  const statusColors = {
    Stable: "bg-status-success/15 text-status-success",
    "Needs Follow-up": "bg-status-warning/15 text-status-warning",
    Critical: "bg-status-error/15 text-status-error",
  };

  const statusClass =
    statusColors[p.condition] || statusColors["Needs Follow-up"];
  const tableHeader = document.querySelector("#patient-table-header");
  tableHeader.innerHTML = "";

  if (role === "receptionist") {
    tableHeader.innerHTML = `
    <p class="col-span-3">Patient</p>
    <p class="col-span-3">Age</p>
    <p class="col-span-3">Gender</p>
    <p class="col-span-3">Phone</p>
    `;
    return `
  <div data-id='${p.id}' class="patient-row cursor-pointer hover:bg-background dark:hover:bg-background-dark transition-all bg-surface dark:bg-surface-dark border-b last:border-0 border-border dark:border-border-dark">
  <div class="grid grid-cols-1 md:grid-cols-12 p-2 items-center text-sm border-b border-border last:border-0 dark:border-border-dark ">    
        <p class="col-span-3 font-semibold">${p.name}</p>
        <p class="col-span-3">${p.age}</p>
        <p class="col-span-3">${p.gender}</p>
        <p class="col-span-3">${p.phone}</p>
    </div>
  </div>
    `;
  }

  if (role === "nurse") {
    tableHeader.innerHTML = `
    <p class="col-span-2">Patient</p>
    <p class="col-span-2">Age</p>
    <p class="col-span-2">Gender</p>
    <p class="col-span-2">Phone</p>
    <p class="col-span-2">Blood Type</p>
    <p class="col-span-2">Condition</p>
    `;
    return `
  <div data-id='${p.id}' class="patient-row cursor-pointer hover:bg-background dark:hover:bg-background-dark transition-all bg-surface dark:bg-surface-dark border-b last:border-0 border-border dark:border-border-dark">
  <div class="grid grid-cols-1 md:grid-cols-12 p-2 items-center text-sm border-b border-border last:border-0 dark:border-border-dark ">    
        <p class="col-span-2 font-semibold">${p.name}</p>
        <p class="col-span-2">${p.age}</p>
        <p class="col-span-2">${p.gender}</p>
        <p class="col-span-2">${p.phone}</p>
        <p class="col-span-2">${p.bloodType}</p>
        <span class="col-span-2 text-xs px-2 py-1 rounded-full w-fit ${statusClass}">${p.condition}</span>
    </div>
  </div>
    `;
  }

  tableHeader.innerHTML = `
    <p class="col-span-2">Patient</p>
    <p class="col-span-2">Age</p>
    <p class="col-span-2">Gender</p>
    <p class="col-span-2">Phone</p>
    <p class="col-span-2">Blood Type</p>
    <p class="col-span-2">Condition</p>
    `;

  return `
  <div data-id='${p.id}' class="patient-row cursor-pointer hover:bg-background dark:hover:bg-background-dark transition-all bg-surface dark:bg-surface-dark border-b last:border-0 border-border dark:border-border-dark">
  <div class="grid grid-cols-1 md:grid-cols-12 p-2 items-center text-sm border-b border-border last:border-0 dark:border-border-dark ">    
        <p class="col-span-2 font-semibold">${p.name}</p>
        <p class="col-span-2">${p.age}</p>
        <p class="col-span-2">${p.gender}</p>
        <p class="col-span-2">${p.phone}</p>
        <p class="col-span-2">${p.bloodType}</p>
        <span class="col-span-2 text-xs px-2 py-1 rounded-full w-fit ${statusClass}">${p.condition}</span>
    </div>
  </div>
  `;
}

function initRecAddPatientForm() {
  const formDiv = document.querySelector("#add-patient-form");
  const form = document.querySelector("#rec-patient-form");
  const message = document.querySelector("#patient-form-message");

  if (!formDiv || !form) return;

  formDiv.classList.remove("hidden");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.querySelector("#patient-name").value.trim();
    const age = document.querySelector("#patient-age").value;
    const gender = document.querySelector("#patient-gender").value;
    const phone = document.querySelector("#patient-phone").value.trim();
    
    const newPatient = {
      id: String(Date.now()),
      name,
      age: Number(age),
      gender,
      phone,
      bloodType: "unknown",
      condition: "Needs Follow-up",
      diagnosis: "",
      heartRate: 0,
      bloodPressure: "0/0",
      oxygenLevel: 0,
      doctorId: "1",
    };

    allPatients.push(newPatient);
    setItem("patients", allPatients);
    const currentUser = getCurrentUser(role);
    notifyOtherUsers(
      `${name} was added as a new patient by ${role}`,
      currentUser.id,
    );
    showPatientMessage(message, `${name} added successfully.`, "success");
    form.reset();
    renderPatients(allPatients);

    setTimeout(() => {
      message.classList.add("hidden");
    }, 1200);
  });
}

function initDocAddPatientDataForm() {
  const formDiv = document.querySelector("#edit-patient-form");
  const form = document.querySelector("#doc-patient-form");
  const patientSelect = document.querySelector("#patient-select");
  const cancelBtn = document.querySelector("#cancel-btn");
  const message = document.querySelector("#edit-patient-form-message");

  if (!formDiv || !form) return;

  patientSelect.innerHTML =
    `<option value="" disabled selected>Select Patient</option>` +
    allPatients
      .map((p) => `<option value="${p.id}">${p.name}</option>`)
      .join("");

  formDiv.classList.remove("hidden");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const patientId = patientSelect.value;
    const bloodType = document.querySelector("#patient-blood-type").value;
    const condition = document.querySelector("#patient-condition").value;
    const diagnosis = document.querySelector("#patient-diagnosis").value.trim();
    const heartRate = document
      .querySelector("#patient-heart-rate")
      .value.trim();
    const bloodPressure = document
      .querySelector("#patient-blood-pressure")
      .value.trim();
    const oxygenLevel = document.querySelector("#patient-oxygen").value.trim();

    const bpPattern = /^\d{2,3}\/\d{2,3}$/;
    if (!bpPattern.test(bloodPressure)) {
      showPatientMessage(
        message,
        "Blood pressure must be something like 120/80",
        "error",
      );
      return;
    }

    const patient = allPatients.find((p) => p.id === patientId);
    if (!patient) {
      showPatientMessage(message, "Please select a valid patient.", "error");
      return;
    }

    patient.condition = condition ? condition : patient.condition;
    patient.bloodType = bloodType ? bloodType : patient.bloodType;
    patient.diagnosis = diagnosis ? diagnosis : patient.diagnosis;
    patient.heartRate = heartRate ? Number(heartRate) : patientheartRate;
    patient.bloodPressure = bloodPressure
      ? bloodPressure
      : patient.bloodPressure;
    patient.oxygenLevel = oxygenLevel
      ? Number(oxygenLevel)
      : patient.oxygenLevel;

    setItem("patients", allPatients);
    const currentUser = getCurrentUser(role);
    notifyOtherUsers(
      `${name} was updated successfully by ${role}`,
      currentUser.id,
    );

    showPatientMessage(
      message,
      `${patient.name} data edited successfully.`,
      "success",
    );
    form.reset();
    renderPatients(allPatients);

    setTimeout(() => {
      message.classList.add("hidden");
    }, 1200);
  });
}

function showPatientMessage(message, text, type) {
  message.textContent = text;
  message.className =
    type === "success"
      ? "text-xs mt-2 text-status-success"
      : "text-xs mt-2 text-status-error";
}
