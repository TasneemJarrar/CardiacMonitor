import { fetchData, getRole } from "../../src/js/storage.js";

let allPatients = [];

export async function initPatientsList() {
  const patientsList = document.getElementById("patients-list");
  const searchInput = document.getElementById("patient-search");

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
  patientsList.innerHTML = patients.map((p) => renderPatientRow(p, role)).join("");
  if (role === "doctor") {
    document.querySelectorAll(".patient-row").forEach((row) => {
      row.addEventListener("click", () => {
        window.location.href = `/patient-details.html?id=${row.dataset.id}`;
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
          <p class="text-xs text-text-muted">Age ${p.age} · ID: ${p.id}</p>
        </div>
      </div>
    `;
  }

  if (role === "nurse") {
    return `
      <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 flex justify-between items-center">
        <div>
          <p class="font-semibold">${p.name}</p>
          <p class="text-xs text-text-muted">Age ${p.age} · ${p.gender}</p>
        </div>
        <span class="text-xs px-2 py-1 rounded-full ${statusClass}">${p.condition}</span>
      </div>
    `;
  }

  return `
    <div class="patient-row cursor-pointer hover:-translate-y-0.5 transition-all bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 flex justify-between items-center" data-id="${p.id}">
      <div>
        <p class="font-semibold">${p.name}</p>
        <p class="text-xs text-text-muted">Age ${p.age} · ${p.gender} · ${p.diagnosis}</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs text-text-muted">${p.heartRate} bpm</span>
        <span class="text-xs px-2 py-1 rounded-full ${statusClass}">${p.condition}</span>
      </div>
    </div>
  `;
}
