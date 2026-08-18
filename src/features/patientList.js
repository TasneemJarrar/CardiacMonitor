import { fetchData, getRole } from "../../src/js/storage.js";

let allPatients = [];

export async function initPatientsList() {
  const patientsList = document.getElementById("patients-list");
  const searchInput = document.getElementById("patient-search");
  const role = getRole();

  patientsList.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">Loading patients...</p>`;

  try {
    allPatients = await fetchData("/src/data/patients.json");

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

    if (role === "doctor") {
      initAddPatientForm();
    }
  } catch (err) {
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
  if (role === "doctor") {
    document.querySelectorAll(".patient-row").forEach((row) => {
      row.addEventListener("click", () => {
        window.location.href = `/patientDetails.html?id=${row.dataset.id}`;
      });
    });
  }
}

function renderPatientRow(p, role) {
  const statusColors = {
    Stable: "bg-status-success/15 text-status-success",
    "Needs Follow-up": "bg-status-warning/15 text-status-warning",
    Critical: "bg-status-error/15 text-status-error",
  };

  const statusClass = statusColors[p.condition] || "";

  if (role === "receptionist") {
    return `
      <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 flex justify-between items-center">
        <div>
          <p class="font-semibold">${p.name}</p>
          <p class="text-xs text-text-muted">Age ${p.age} - ID: ${p.id}</p>
        </div>
      </div>
    `;
  }

  if (role === "nurse") {
    return `
      <div data-id='${p.id}' class="patient-row cursor-pointer bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 flex justify-between items-center">
        <div>
          <p class="font-semibold">${p.name}</p>
          <p class="text-xs text-text-muted">Age ${p.age} - ${p.gender}</p>
        </div>
        <span class="text-xs px-2 py-1 rounded-full ${statusClass}">${p.condition}</span>
      </div>
    `;
  }

  return `
    <div data-id='${p.id}' class="patient-row cursor-pointer hover:-translate-y-0.5 transition-all bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 flex justify-between items-center">
      <div>
        <p class="font-semibold">${p.name}</p>
        <p class="text-xs text-text-muted">Age ${p.age} - ${p.gender} - ${p.diagnosis}</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs text-text-muted">${p.heartRate} bpm</span>
        <span class="text-xs px-2 py-1 rounded-full ${statusClass}">${p.condition}</span>
      </div>
    </div>
  `;
}

function initAddPatientForm() {
  const formDiv = document.querySelector("#add-patient-form");
  const form = document.querySelector("#patient-form");

  if (!formDiv || !form) return;

  formDiv.classList.remove("hidden");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.querySelector("#patient-name").value.trim();
    const age = document.querySelector("#patient-age").value;
    const gender = document.querySelector("#patient-gender").value;
    const phone = document.querySelector("#patient-phone").value.trim();
    const bloodType = document.querySelector("#patient-blood-type").value;
    const condition = document.querySelector("#patient-condition").value;
    const diagnosis = document.querySelector("#patient-diagnosis").value.trim();
    const heartRate = document.querySelector("#patient-heart-rate").value;
    const bloodPressure = document
      .querySelector("#patient-blood-pressure")
      .value.trim();
    const oxygenLevel = document.querySelector("#patient-oxygen").value;

    const bpPattern = /^\d{2,3}\/\d{2,3}$/;
    if (!bpPattern.test(bloodPressure)) {
      showPatientMessage("Blood pressure must be something like 120/80", "error");
      return;
    }

    const newPatient = {
      id: String(Date.now()),
      name,
      age: Number(age),
      gender,
      phone,
      bloodType,
      condition,
      diagnosis,
      heartRate: Number(heartRate),
      bloodPressure,
      oxygenLevel: Number(oxygenLevel),
      doctorId: "1", 
      };

    allPatients.push(newPatient);
    showPatientMessage(`${name} added successfully.`, "success");
    form.reset();
    renderPatients(allPatients);
  });
}

function showPatientMessage(text, type) {
  const message = document.querySelector("#patient-form-message");
  message.textContent = text;
  message.className =
    type === "success"
      ? "text-xs mt-2 text-status-success"
      : "text-xs mt-2 text-status-error";
}
