import { fetchData } from "../../src/js/storage.js";

function getVitalCondition(p) {
  if (p.condition === 'Critical') return 'critical';
  const systolic = parseInt(p.bloodPressure.split('/')[0], 10);
  if (systolic >= 140) return 'Needs Follow-up';
  if (systolic < 90) return 'Needs Follow-up'; 
  return 'normal';
}

export async function initDoctorDashboard() {
  const main = document.getElementById("dashboard-content");
  if (!main) {
    console.error(
      'initDoctorDashboard: no element with id="dashboard-content" found on the page.',
    );
    return;
  }

  main.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">Loading dashboard...</p>`;

  try {
    const [patients, appointments] = await Promise.all([
      fetchData("/src/data/patients.json"),
      fetchData("/src/data/appointments.json"),
    ]);

    if (patients.length === 0) {
      main.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">No patients found.</p>`;
      return;
    }

    const totalPatients = patients.length;
    const criticalPatients = patients.filter((p) => p.condition === "Critical");
    const needsFollowUp = patients.filter(
      (p) => p.condition === "Needs Follow-up" || p.condition === "Critical",
    );
    const upcomingAppointments = appointments.filter(
      (a) => a.status !== "Completed",
    );

    const isLowBloodPressure = (bloodPressure) => {
      const [systolic, diastolic] = bloodPressure.split("/").map(Number);
      return systolic < 90 || diastolic < 60;
    };

    main.innerHTML = `
    <h1 class="text-2xl font-semibold mb-6">Doctor Dashboard</h1>

    <div class="grid grid-cols-3 gap-4 mb-6">

    <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-5">
    <p class="text-3xl font-semibold">${totalPatients}</p>
    <p class="text-xs text-text-muted mt-1">Total Patients</p>
    </div>

    <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-5">
    <p class="text-3xl font-semibold">${needsFollowUp.length}</p>
    <p class="text-xs text-text-muted mt-1">Needs Follow-up</p>
    </div>

    <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-5">
    <p class="text-3xl font-semibold">${upcomingAppointments.length}</p>
    <p class="text-xs text-text-muted mt-1">Upcoming Appointments</p>
    </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">

    <div class="md:col-span-8 col-span-12">
      ${
        criticalPatients.length > 0
          ? 
        `<div class="bg-gradient-hero dark:bg-gradient-hero-dark rounded-2xl p-5 text-white mb-6">
          <h3 class="font-semibold text-lg">${criticalPatients.length} Patient(s) Need Immediate Attention</h3>
          <p class="text-sm text-white/80 mt-1">${criticalPatients.map((p) => p.name).join(", ")}</p>
        </div>
      `
          : ""
      }
        <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-5">
          <h3 class="font-semibold mb-3">Recent Vital Readings</h3>
          <div class="flex flex-col gap-1">
            ${patients
              .map((p) => {
                const condition = getVitalCondition(p);
                const isAbnormal = condition !== "normal";
                const conditionStyles = {
                  normal: {
                    style: "bg-status-success/10 text-status-success",
                    icon: "bg-status-success/10 text-status-success",
                    label: "Normal",
                  },
                  "Needs Follow-up": {
                    style: "bg-status-warning/10 text-status-warning",
                    icon: "bg-status-warning/10 text-status-warning",
                    label: "Needs Follow-up",
                  },
                  critical: {
                    style: "bg-status-error/10 text-status-error",
                    icon: "bg-status-error/10 text-status-error",
                    label: "Critical",
                  },
                };
                const s = conditionStyles[condition];
                return `
                <a href="#" class="flex items-center justify-between gap-4 p-3 rounded-xl transition-colors ${
                  isAbnormal
                    ? "bg-status-error/5 dark:bg-status-error/10"
                    : "hover:bg-background dark:hover:bg-background-dark"
                }">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${s.icon}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 12h4l3 8 4-16 3 8h4" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-sm">${p.name}</p>
                      <p class="text-xs text-text-muted dark:text-text-muted-dark">${p.diagnosis}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-4">
                    <p class="text-sm font-semibold ${isAbnormal ? "text-status-" + (condition === "critical" ? "error" : "warning") : "text-text-primary dark:text-text-primary-dark"}">
                      ${p.bloodPressure} <span class="text-xs font-normal text-text-muted">mmHg</span>
                    </p>
                    <span class="text-xs px-2.5 py-1 rounded-full font-medium ${s.style}">${s.label}</span>
                  </div>
                </a>
                `;
              })
              .join("")}
          </div>
        </div>
      </div>


        <div class="md:col-span-4 col-span-12 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-5">
          <div class="flex justify-between mb-3">
            <h3 class="font-semibold">Upcoming Appointments</h3>
            <a href="#" class="text-xs text-primary hover:underline transition-all duration-300 ease-in-out">View All</a>
          </div>

          <div class="flex flex-col gap-2">
            ${upcomingAppointments
              .map((a) => {
                const patient = patients.find((p) => p.id === a.patientId);
                return `
                <a href="#" class="flex justify-between items-center w-full p-3 border border-border dark:border-border-dark rounded-xl hover:-translate-y-0.5 hover:border-primary/40 dark:hover:border-primary-light/40 hover:shadow-sm transition-all duration-200 ease-in-out">
                  <div>
                    <p class="text-sm font-medium">${patient ? patient.name : "Unknown"}</p>
                    <p class="text-xs text-text-muted dark:text-text-muted-dark">${a.reason}</p>
                  </div>
                  <div class="flex flex-col items-end gap-1">
                    <span class="text-text-muted dark:text-text-muted-dark text-xs">${a.date}</span>
                    <span class="text-text-muted dark:text-text-muted-dark text-xs flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                          <path d="M10 2h4m-2 12l3-3" />
                          <circle cx="12" cy="14" r="8" />
                        </g>
                      </svg>
                      ${a.time}
                    </span>
                  </div>
                </a>
                `;
              })
              .join("")}
          </div>
        </div>

      </div>
    `;
  } catch (err) {
    console.error(err);
    main.innerHTML = `
      <div class="text-status-error dark:text-status-error-dark">
        <p>Failed to load dashboard data.</p>
        <button id="retry-btn" class="mt-2 text-sm underline">Retry</button>
      </div>
    `;
    document
      .getElementById("retry-btn")
      .addEventListener("click", initDoctorDashboard);
  }
}
