import { fetchData, getRole } from "../js/storage.js";

let allPatients = [];
let activefilter = "all";

export async function initVitalsList() {
  const VitalsContainer = document.querySelector("#vitals-list");
  const searchInput = document.querySelector("#vitals-search");
  const FilterBtn = document.querySelectorAll(".statusFilterBtn");
  const role = getRole();

  VitalsContainer.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">Loading Vitals...</p>`;

  try {
    allPatients = await fetchData("/src/data/patients.json");

    if (allPatients.length === 0) {
      VitalsContainer.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">No patients found.</p>`;
      return;
    }

    renderVitals(allPatients, role);

    searchInput.addEventListener("input", applyFilters);

    FilterBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        activefilter = btn.dataset.status;
        upadteStyle(btn);
        applyFilters();
      });
    });

    if (role === "nurse") {
      initAddVitalForm();
    }
  } catch (err) {
    VitalsContainer.innerHTML = `
        <div class="text-status-error dark:text-status-error-dark">
          <p>Failed to load patients vitals.</p>
          <button id="retry-btn" class="mt-2 text-sm underline">Retry</button>
        </div>
      `;
    document
      .getElementById("retry-btn")
      .addEventListener("click", initVitalsList);
  }
}

function applyFilters() {
  const term = document
    .querySelector("#vitals-search")
    .value.trim()
    .toLowerCase();

  let filtered = allPatients.filter((p) => p.name.toLowerCase().includes(term));
  if (activefilter !== "all") {
    filtered = filtered.filter((p) => p.condition === activefilter);
  }
  renderVitals(filtered);
}

function upadteStyle(activeBtn) {
  document.querySelectorAll(".statusFilterBtn").forEach((btn) => {
    btn.className =
      "statusFilterBtn p-2 text-xs font-medium border border-border dark:border-border-dark text-text-muted bg-text-muted/10 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out";
  });

  activeBtn.className =
    "statusFilterBtn p-2 text-xs font-medium border border-primary text-primary bg-primary/10 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out";
}

function renderVitals(patients, role) {
  const VitalsContainer = document.querySelector("#vitals-list");
  if (patients.length === 0) {
    VitalsContainer.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">No patients records match your filter.</p>`;
    return;
  }
  const conditionColors = {
    Stable: {
      style: "bg-status-success/15 text-status-success",
      label: "Stable",
    },
    "Needs Follow-up": {
      style: "bg-status-warning/15 text-status-warning",
      label: "Awaiting",
    },
    Critical: {
      style: "bg-status-error/15 text-status-error",
      label: "Critical",
    },
  };
  VitalsContainer.innerHTML = patients
    .map((p) => {
      const condition = p.condition;
      const c = conditionColors[condition] || conditionColors.Stable;
      return `
    <div data-id="${p.id}" class="vital-patient-row cursor-pointer grid grid-cols-12 gap-2 p-2 items-center text-sm border-b border-border last:border-0 dark:border-border-dark hover:bg-background dark:hover:bg-background-dark">
          <div class="col-span-3">
            <p class="font-medium">${p.name}</p>
            <p class="text-xs text-text-muted dark:text-text-muted-dark">ID: ${p.id}</p>
          </div>
          <p class="col-span-2">${p.heartRate}<span class="text-xs text-text-muted dark:text-text-muted-dark"> bpr</span></p>
          <p class="col-span-3">${p.bloodPressure}<span class="text-xs text-text-muted dark:text-text-muted-dark"> mm Hg</span></p>
          <p class="col-span-2">${p.oxygenLevel}<span class="text-xs text-text-muted dark:text-text-muted-dark">%</span></p>
          <div class="col-span-2"> <span class="px-2 py-1 rounded-full font-medium ${c.style}">${c.label}</span></div>

        </div>
    
    `;
    })
    .join("");

  document.querySelectorAll(".vital-patient-row").forEach((row) => {
    row.addEventListener("click", () => {
      window.location.href = `/patientDetails.html?id=${row.dataset.id}`;
    });
  });
}

function initAddVitalForm() {
  const formDiv = document.querySelector("#add-vital-form");
  const form = document.querySelector("#vital-form");
  const patientSelect = document.querySelector("#vital-patient-select");
  const cancelBtn = document.querySelector("#cancel-vital-btn");
  const message = document.querySelector("#vital-form-message");

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
    const heartRate = document.querySelector("#vital-heart-rate").value.trim();
    const bloodPressure = document
      .querySelector("#vital-blood-pressure")
      .value.trim();
    const oxygenLevel = document.querySelector("#vital-oxygen").value.trim();

    const bpPattern = /^\d{2,3}\/\d{2,3}$/;
    if (!bpPattern.test(bloodPressure)) {
      showMessage("Blood pressure must be something like 120/80", "error");
      return;
    }

    const patient = allPatients.find((p) => p.id === patientId);
    if (!patient) {
      showMessage("Please select a valid patient.", "error");
      return;
    }

    patient.heartRate = Number(heartRate);
    patient.bloodPressure = bloodPressure;
    patient.oxygenLevel = Number(oxygenLevel);

    showMessage(`Reading saved for ${patient.name}.`, "success");

    form.reset();
    renderVitals(allPatients);

    setTimeout(() => {
      formDiv.classList.add("hidden");
      showBtn.classList.remove("hidden");
      message.classList.add("hidden");
    }, 1200);
  });
}

function showMessage(text, type) {
  const message = document.querySelector("#vital-form-message");
  message.textContent = text;
  message.className =
    type === "success"
      ? "text-xs mt-2 text-status-success"
      : "text-xs mt-2 text-status-error";
}
