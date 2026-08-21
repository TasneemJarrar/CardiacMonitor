import { fetchData, getItem, getRole } from "../js/storage.js";
let allPatients = [];
let allAppointments = [];

export async function initPatientDetailes() {
  const main = document.querySelector("#patientDetailes-content");
  const params = new URLSearchParams(window.location.search);
  const patientId = params.get("id");
  const role = getRole();

  main.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">Loading patient...</p>`;

  try {
    const [originalPatients, originalAppointments] = await Promise.all([
      fetchData("./src/data/patients.json"),
      fetchData("./src/data/appointments.json"),
    ]);

    allPatients = getItem("patients")|| originalPatients;
    allAppointments = getItem("appointments")|| originalAppointments;
    

    const patient = allPatients.find((p) => p.id === patientId);

    if (!patient) {
      main.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">No patient data found.</p>`;
      return;
    }

    const appointments = allAppointments.filter(
      (a) => a.patientId === patientId,
    );
    renderPatientDetails(patient, appointments, role);

  } catch (err) {
    console.log(err)
    main.innerHTML = `
        <div class="text-status-error dark:text-status-error-dark">
          <p>Failed to load patient data.</p>
          <button id="retry-btn" class="mt-2 text-sm underline">Retry</button>
        </div>
      `;
    document
      .getElementById("retry-btn")
      .addEventListener("click", initPatientDetailes);
  }
}

function renderPatientDetails(patient, appointments, role) {
  const main = document.querySelector("#patientDetailes-content");

  const statusStyles = {
    Stable: "bg-status-success/15 text-status-success",
    "Needs Follow-up": "bg-status-warning/15 text-status-warning",
    Critical: "bg-status-error/15 text-status-error",
  };
  const statusClass = statusStyles[patient.condition] || "";

  const appointmentStatusStyles = {
    Scheduled: "bg-status-info/15 text-status-info",
    Urgent: "bg-status-error/15 text-status-error",
    Completed: "bg-status-success/15 text-status-success",
  };

  const clinicalDetails =
    role === "doctor"
      ? `
    <div class="grid grid-cols-3 gap-4 mt-4">
      <div>
        <p class="text-xs text-text-muted">Diagnosis</p>
        <p class="text-sm font-medium">${patient.diagnosis}</p>
      </div>
      <div>
        <p class="text-xs text-text-muted">Phone</p>
        <p class="text-sm font-medium">${patient.phone}</p>
      </div>
      <div>
        <p class="text-xs text-text-muted">Blood Type</p>
        <p class="text-sm font-medium">${patient.bloodType}</p>
      </div>
    </div>
  `
      : "";


      const vitalsDetails =
    role === "doctor" || role === "nurse"
      ? `
    <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-5">
        <h3 class="font-semibold mb-3">Latest Vital Readings</h3>
        <div class="flex flex-col gap-2 text-sm">
          <div class="flex justify-between">
          <span class="text-text-muted">Heart Rate</span>
          <span class="font-medium">${patient.heartRate} bpm</span>
          </div>
          <div class="flex justify-between">
          <span class="text-text-muted">Blood Pressure</span>
          <span class="font-medium">${patient.bloodPressure} mmHg</span>
          </div>
          <div class="flex justify-between">
          <span class="text-text-muted">Oxygen Level</span>
          <span class="font-medium">${patient.oxygenLevel}%</span>
          </div>
        </div>
      </div>
  `
      : "";

  main.innerHTML = `
    <a href="./patientList.html" class="text-sm text-primary hover:underline mb-4 inline-block">← Back to Patients</a>

    <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-6 mb-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-semibold">${patient.name}</h1>
        </div>
        <span class="text-xs px-3 py-1 rounded-full font-medium ${statusClass}">${patient.condition}</span>
    </div>
    <div class="grid grid-cols-3 gap-4 mt-4">
      <div>
        <p class="text-xs text-text-muted">Age</p>
        <p class="text-sm font-medium">${patient.age}</p>
      </div>
      <div>
        <p class="text-xs text-text-muted">Gender</p>
        <p class="text-sm font-medium">${patient.gender}</p>
      </div>
      <div>
        <p class="text-xs text-text-muted">Phone Number</p>
        <p class="text-sm font-medium">${patient.phone}</p>
      </div>
    </div>
      ${clinicalDetails}
    </div>

    <div class="grid ${vitalsDetails?"md:grid-cols-2":"md:grid-cols-1"} gap-4 mb-6">
      ${vitalsDetails}

      <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-5">
        <h3 class="font-semibold mb-3">Appointments</h3>
        ${
          appointments.length === 0
            ? `<p class="text-sm text-text-muted dark:text-text-muted-dark">No appointments for this patient.</p>`
            : `<div class="flex flex-col gap-2">
              ${appointments
                .map(
                  (a) => `
                <div class="flex justify-between items-center text-sm py-2 border-b border-border dark:border-border-dark last:border-0">
                  <div>
                  <p>${a.reason}</p>
                  <p class="text-xs text-text-muted">${a.date} - ${a.time}</p>
                </div>
                <span class="text-xs px-2 py-1 rounded-full ${appointmentStatusStyles[a.status] || ""}">${a.status}</span>
                </div>
              `,
                )
                .join("")}
            </div>`
        }
      </div>
    </div>
  `;
}
