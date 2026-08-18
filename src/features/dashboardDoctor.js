import { fetchData, getRole } from "../../src/js/storage.js";

export async function initDoctorDashboard() {
  const dashboardContent = document.querySelector("#dashboard-content");
  const role = getRole();
  dashboardContent.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">Loading dashboard...</p>`;

  try {
    const [patients, appointments, users] = await Promise.all([
      fetchData("/src/data/patients.json"),
      fetchData("/src/data/appointments.json"),
      fetchData("/src/data/users.json"),
    ]);

    if (patients.length === 0) {
      dashboardContent.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">No patients found.</p>`;
      return;
    }

    const doctor = users.find((user) => user.role === role);
    console.log(doctor);
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    const totalPatients = patients.length;
    const criticalPatients = patients.filter((p) => p.condition === "Critical");
    const needsFollowUp = patients.filter(
      (p) => p.condition === "Needs Follow-up" || p.condition === "Critical",
    );
    const upcomingAppointments = appointments.filter(
      (a) => a.status !== "Completed",
    );

    dashboardContent.innerHTML = `
      <div
        class="relative overflow-hidden bg-gradient-hero-dark rounded-lg px-8 py-9 mb-6 text-white">
        <div
          class="absolute hidden right-14 top-1/2 -translate-y-1/2 w-24 h-24 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm md:flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="text-text-primary-dark dark:text-text-primary" width="48"
            height="48" viewBox="0 0 512 512">
            <path fill="currentColor"
              d="M432 272a48.09 48.09 0 0 0-45.25 32h-39.22l-28.35-85.06a16 16 0 0 0-30.56.66l-44.51 155.76l-52.33-314a16 16 0 0 0-31.3-1.25L99.51 304H48a16 16 0 0 0 0 32h64a16 16 0 0 0 15.52-12.12l45.34-181.37l51.36 308.12A16 16 0 0 0 239.1 464h.91a16 16 0 0 0 15.37-11.6l49.8-174.28l15.64 46.94A16 16 0 0 0 336 336h50.75A48 48 0 1 0 432 272" />
          </svg>
        </div>

        <div class="">
          <p class="text-sm font-bold tracking-[0.14em] text-blue-300 uppercase mb-7">
            ${formattedDate}
          </p>
          <h1 id="welcomeUser-name" class="text-4xl md:text-5xl font-light tracking-tight mb-4">
            Good morning, Dr. ${doctor.name}
          </h1>
          <p class="text-base md:text-lg text-blue-100">
            Here is the clinical overview for your cardiac patients.
          </p>
        </div>

      </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

    <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg p-5 flex gap-4 items-center">
    <div class="w-14 h-14 bg-status-success/10 text-status-success rounded-2xl flex justify-center items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
    <g fill="currentColor">
		<path fill-rule="evenodd" d="M9 1.25a4.75 4.75 0 1 0 0 9.5a4.75 4.75 0 0 0 0-9.5M5.75 6a3.25 3.25 0 1 1 6.5 0a3.25 3.25 0 0 1-6.5 0" clip-rule="evenodd" />
		<path d="M15 2.25a.75.75 0 0 0 0 1.5a2.25 2.25 0 0 1 0 4.5a.75.75 0 0 0 0 1.5a3.75 3.75 0 1 0 0-7.5" />
		<path fill-rule="evenodd" d="M3.678 13.52c1.4-.8 3.283-1.27 5.322-1.27s3.922.47 5.322 1.27c1.378.788 2.428 1.99 2.428 3.48s-1.05 2.692-2.428 3.48c-1.4.8-3.283 1.27-5.322 1.27s-3.922-.47-5.322-1.27C2.3 19.692 1.25 18.49 1.25 17s1.05-2.692 2.428-3.48m.744 1.303C3.267 15.483 2.75 16.28 2.75 17s.517 1.517 1.672 2.177C5.556 19.825 7.173 20.25 9 20.25s3.444-.425 4.578-1.073c1.155-.66 1.672-1.458 1.672-2.177s-.517-1.517-1.672-2.177C12.444 14.175 10.827 13.75 9 13.75s-3.444.425-4.578 1.073" clip-rule="evenodd" />
		<path d="M18.16 13.267a.75.75 0 0 0-.32 1.466c.792.173 1.425.472 1.843.814s.567.677.567.953c0 .25-.12.545-.453.854c-.335.311-.85.598-1.513.798a.75.75 0 1 0 .432 1.437c.823-.248 1.558-.631 2.102-1.136c.546-.507.932-1.174.932-1.953c0-.865-.474-1.588-1.117-2.114c-.644-.527-1.51-.908-2.472-1.119" />
    </g>
    </svg>
    </div>
    <div>
    <p class="text-3xl font-semibold">${totalPatients}</p>
    <p class="text-xs font-medium mt-1">Total Patients</p>
    </div>
    </div>

    <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg p-5 flex gap-4 items-center">
    <div class="w-14 h-14 bg-status-warning/10 text-status-warning rounded-2xl flex justify-center items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
	<path fill="currentColor" d="M7 7h3v3h12V7h3v8h2V7c0-1.1-.9-2-2-2h-3V4c0-1.1-.9-2-2-2h-8c-1.1 0-2 .9-2 2v1H7c-1.1 0-2 .9-2 2v21c0 1.1.9 2 2 2h4v-2H7zm5-3h8v4h-8zm12.414 14L23 19.414L25.586 22H18c-2.206 0-4 1.794-4 4s1.794 4 4 4h2v-2h-2c-1.102 0-2-.897-2-2s.898-2 2-2h7.586L23 26.586L24.414 28l5-5z" />
</svg>
    </div>
    <div>
    <p class="text-3xl font-semibold">${needsFollowUp.length}</p>
    <p class="text-xs font-medium  mt-1">Needs Follow-up</p>
    </div>
    </div>

    <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg p-5 flex gap-4 items-center">
    <div class="w-14 h-14 bg-status-error/10 text-status-error rounded-2xl flex justify-center items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
	<g fill="currentColor">
		<path d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V8C11.25 7.58579 11.5858 7.25 12 7.25Z" />
		<path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" />
		<path fill-rule="evenodd" d="M8.2944 4.47643C9.36631 3.11493 10.5018 2.25 12 2.25C13.4981 2.25 14.6336 3.11493 15.7056 4.47643C16.7598 5.81544 17.8769 7.79622 19.3063 10.3305L19.7418 11.1027C20.9234 13.1976 21.8566 14.8523 22.3468 16.1804C22.8478 17.5376 22.9668 18.7699 22.209 19.8569C21.4736 20.9118 20.2466 21.3434 18.6991 21.5471C17.1576 21.75 15.0845 21.75 12.4248 21.75H11.5752C8.91552 21.75 6.84239 21.75 5.30082 21.5471C3.75331 21.3434 2.52637 20.9118 1.79099 19.8569C1.03318 18.7699 1.15218 17.5376 1.65314 16.1804C2.14334 14.8523 3.07658 13.1977 4.25818 11.1027L4.69361 10.3307C6.123 7.79629 7.24019 5.81547 8.2944 4.47643ZM9.47297 5.40432C8.49896 6.64148 7.43704 8.51988 5.96495 11.1299L5.60129 11.7747C4.37507 13.9488 3.50368 15.4986 3.06034 16.6998C2.6227 17.8855 2.68338 18.5141 3.02148 18.9991C3.38202 19.5163 4.05873 19.8706 5.49659 20.0599C6.92858 20.2484 8.9026 20.25 11.6363 20.25H12.3636C15.0974 20.25 17.0714 20.2484 18.5034 20.0599C19.9412 19.8706 20.6179 19.5163 20.9785 18.9991C21.3166 18.5141 21.3773 17.8855 20.9396 16.6998C20.4963 15.4986 19.6249 13.9488 18.3987 11.7747L18.035 11.1299C16.5629 8.51987 15.501 6.64148 14.527 5.40431C13.562 4.17865 12.8126 3.75 12 3.75C11.1874 3.75 10.4379 4.17865 9.47297 5.40432Z" clip-rule="evenodd" />
	</g>
</svg>
    </div>
    <div>
    <p class="text-3xl font-semibold">${criticalPatients.length}</p>
    <p class="text-xs font-medium mt-1">Critical</p>
    </div>
    </div>

    <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg p-5 flex gap-4 items-center">
    <div class="w-14 h-14 bg-status-info/10 text-status-info rounded-2xl flex justify-center items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
	<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
		<path d="M16 2v4M8 2v4m13 7v-1c0-3.771 0-5.657-1.172-6.828S16.771 4 13 4h-2C7.229 4 5.343 4 4.172 5.172S3 8.229 3 12v2c0 3.771 0 5.657 1.172 6.828S7.229 22 11 22M3 10h18" />
		<path d="M13 19.5s1.348.507 2 2.5c0 0 3.177-5 6-6" />
	</g>
</svg>
    </div>
    <div>
    <p class="text-3xl font-semibold">${upcomingAppointments.length}</p>
    <p class="text-xs font-medium mt-1">Upcoming Appointments</p>
    </div>
    </div>

    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">

    <div class="md:col-span-8 col-span-12">
      ${
        criticalPatients.length > 0
          ? `<div class="bg-gradient-hero-dark rounded-2xl p-5 text-white mb-6">
          <h3 class="font-semibold text-lg">${criticalPatients.length} Patient(s) Need Immediate Attention</h3>
          ${criticalPatients.map((p) => `
          <a href="/patientDetails.html?id=${p.id}" class="text-sm text-white/80 mt-1">${p.name}</a>`
          ).join(", ")}
        </div>
      `
          : ""
      }
        <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-5">
          <h3 class="font-semibold mb-3">Recent Vital Readings</h3>
          <div class="flex flex-col gap-1">
            ${patients
              .map((p) => {
                const condition = p.condition;
                const isStable = condition !== "Stable";
                const conditionStyles = {
                  Stable: {
                    style: "bg-status-success/10 text-status-success",
                    icon: "bg-status-success/10 text-status-success",
                    label: "Stable",
                  },
                  "Needs Follow-up": {
                    style: "bg-status-warning/10 text-status-warning",
                    icon: "bg-status-warning/10 text-status-warning",
                    label: "Needs Follow-up",
                  },
                  Critical: {
                    style: "bg-status-error/10 text-status-error",
                    icon: "bg-status-error/10 text-status-error",
                    label: "Critical",
                  },
                };
                const s = conditionStyles[condition];
                return `
                <div data-id='${p.id}' class="vital-patient-row flex items-center justify-between gap-4 p-3 rounded-xl transition-colors ${
                  isStable
                    ? "bg-status-error/5 dark:bg-status-error/10"
                    : "hover:bg-background dark:hover:bg-background-dark"
                }">
                  <div data-id='${p.id}' class="vital-patient-row flex items-center gap-3">
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
                    <p class="text-sm font-semibold ${isStable ? "text-status-" + (condition === "critical" ? "error" : "warning") : "text-text-primary dark:text-text-primary-dark"}">
                      ${p.bloodPressure} <span class="text-xs font-Stable text-text-muted">mmHg</span>
                    </p>
                    <span class="text-xs px-2.5 py-1 rounded-full font-medium ${s.style}">${s.label}</span>
                  </div>
                </div>
                `;
              })
              .join("")}
          </div>
        </div>
      </div>


        <div class="md:col-span-4 col-span-12 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-5">
          <div class="flex justify-between mb-3">
            <h3 class="font-semibold">Upcoming Appointments</h3>
            <a href="./patientList.html" class="text-xs text-primary hover:underline transition-all duration-300 ease-in-out">View All</a>
          </div>

          <div class="flex flex-col gap-2">
            ${upcomingAppointments
              .map((a) => {
                const patient = patients.find((p) => p.id === a.patientId);
                return `
                <div data-id='${a.patientId}' class="appointment-patient-row flex justify-between items-center w-full p-3 border border-border dark:border-border-dark rounded-xl hover:-translate-y-0.5 hover:border-primary/40 dark:hover:border-primary-light/40 hover:shadow-sm transition-all duration-200 ease-in-out">
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
                </div>
                `;
              })
              .join("")}
          </div>
        </div>

      </div>
    `;

    document.querySelectorAll(".vital-patient-row").forEach((row) => {
      row.addEventListener("click", () => {
        window.location.href = `./patientDetails.html?id=${row.dataset.id}`;
      });
    });

    document.querySelectorAll(".appointment-patient-row").forEach((row) => {
      row.addEventListener("click", () => {
        window.location.href = `./patientDetails.html?id=${row.dataset.id}`;
      });
    });
  } catch (err) {
    console.error(err);
    dashboardContent.innerHTML = `
      <div class="text-status-error dark:text-status-error-dark">
        <p>Failed to load dashboard data.</p>
        <button id="retry-btn" class="mt-2 text-sm underline">Retry</button>
      </div>
    `;
    document
      .querySelector("retry-btn")
      .addEventListener("click", initDoctorDashboard);
  }
}
