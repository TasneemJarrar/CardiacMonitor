import { fetchData, getRole } from "../js/storage.js";
let allPatients = [];
let allAppointments = [];

export async function initReportsList() {
  const reportContent = document.querySelector("#reports-content");
  const searchInput = document.querySelector("#report-input");
  const statusFilter = document.querySelector("#condition-filter");
  const ClrBtn = document.querySelector("#clear-filters");
  const role = getRole();

  if (role !== "doctor") {
    window.location.href = "./dashboard.html";
    return;
  }

  reportContent.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">Loading reports...</p>`;

  try {
     const [patients, appointments] = await Promise.all([
      fetchData("./src/data/patients.json"),
      fetchData("./src/data/appointments.json"),
    ]);

    allPatients = patients;
    allAppointments = appointments;

    if (allPatients.length === 0) {
      reportContent.innerHTML = `<p class="text-text-muted dark:text-text-muted-dark">No patients found.</p>`;
      return;
    }

    renderReports(allPatients, allAppointments, role);

    searchInput.addEventListener("input", () =>
      applyFilters(allPatients, allAppointments, role),
    );
    statusFilter.addEventListener("change", () =>
      applyFilters(allPatients, allAppointments, role),
    );

    ClrBtn.addEventListener("click", () => {
      searchInput.value = "";
      statusFilter.value = "all";
      applyFilters(allPatients, allAppointments, role);
    });
  } catch (err) {
    console.log(err);
    reportContent.innerHTML = `
        <div class="text-status-error dark:text-status-error-dark">
          <p>Failed to load reports data.</p>
          <button id="retry-btn" class="mt-2 text-sm underline">Retry</button>
        </div>
      `;
    document
      .getElementById("retry-btn")
      .addEventListener("click", initReportsList);
  }
}

function renderReports(patients, allAppointments, role) {
  const reportContent = document.querySelector("#reports-content");
  const reportStates = document.querySelector("#reports-states");
  const reportSearch = document.querySelector("#report-search");

  const totalPatients = allPatients.length;
  const criticalPatients = allPatients.filter(
    (p) => p.condition === "Critical",
  );
  const stable = allPatients.filter((p) => p.condition === "Stable");
  const needsFollowUp = allPatients.filter(
    (p) => p.condition === "Needs Follow-up",
  );
  const upcomingAppointments = allAppointments.filter(
    (a) => a.status !== "Completed",
  );
  const avgHeartRate = Math.round(
    allPatients.reduce((sum, p) => sum + p.heartRate, 0) / totalPatients,
  );
  const avgOxygen = Math.round(
    allPatients.reduce((sum, p) => sum + p.oxygenLevel, 0) / totalPatients,
  );
  const completedAppointments = allAppointments.filter(
    (a) => a.status === "Completed",
  );

  const urgentAppointments = allAppointments.filter(
    (a) => a.status === "Urgent",
  );

  const statusColors = {
    Stable: "bg-status-success/15 text-status-success",
    "Needs Follow-up": "bg-status-warning/15 text-status-warning",
    Critical: "bg-status-error/15 text-status-error",
  };

  reportStates.innerHTML = `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

    <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg p-5 flex gap-4 items-center">
    <div class="w-14 h-14 bg-background-dark-end/10 dark:bg-background-dark-end/30  rounded-2xl flex justify-center items-center">
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
    <div class="w-14 h-14 bg-status-success/10 text-status-success  rounded-2xl flex justify-center items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024">
	<path fill="currentColor" d="M512 64L128 192v384c0 212.1 171.9 384 384 384s384-171.9 384-384V192zm312 512c0 172.3-139.7 312-312 312S200 748.3 200 576V246l312-110l312 110z" />
	<path fill="currentColor" d="M378.4 475.1a35.91 35.91 0 0 0-50.9 0a35.91 35.91 0 0 0 0 50.9l129.4 129.4l2.1 2.1a33.98 33.98 0 0 0 48.1 0L730.6 434a33.98 33.98 0 0 0 0-48.1l-2.8-2.8a33.98 33.98 0 0 0-48.1 0L483 579.7z" />
</svg>
    </div>
    <div>
    <p class="text-3xl font-semibold">${stable.length}</p>
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
    <div class="w-14 h-14 bg-status-error/10 text-status-error rounded-2xl flex justify-center items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 14 14">
	<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
		<path d="M.88 4C1.514 1.595 4.324-.102 7 3.183c3.02-3.705 6.208-1.073 6.25 1.765c0 4.225-5.055 7.693-6.25 7.693c-.715 0-2.81-1.24-4.379-3.141" />
		<path d="M9.5 6.5H8l-1.5 2l-2-3.5L3 7H.562" />
	</g>
</svg>
    </div>
    <div>
    <p class="text-3xl font-semibold">${avgHeartRate} bpm</p>
    <p class="text-xs font-medium mt-1">Average Heart Rate</p>
    </div>
    </div>


    <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg p-5 flex gap-4 items-center">
    <div class="w-14 h-14 bg-status-info/10 text-status-info rounded-2xl flex justify-center items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
	<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
		<path d="M21 3.6v16.8a.6.6 0 0 1-.6.6H3.6a.6.6 0 0 1-.6-.6V3.6a.6.6 0 0 1 .6-.6h16.8a.6.6 0 0 1 .6.6" />
		<path d="M12.2 8h-.4A1.8 1.8 0 0 0 10 9.8v4.4a1.8 1.8 0 0 0 1.8 1.8h.4a1.8 1.8 0 0 0 1.8-1.8V9.8A1.8 1.8 0 0 0 12.2 8" />
	</g>
</svg>
    </div>
    <div>
    <p class="text-3xl font-semibold">${avgOxygen}%</p>
    <p class="text-xs font-medium mt-1">Average Oxygen</p>
    </div>
    </div>


    <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg p-5 flex gap-4 items-center">
    <div class="w-14 h-14 bg-background-dark-end/10 dark:bg-background-dark-end/30 rounded-2xl flex justify-center items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48">
	<g fill="none" stroke="currentColor" stroke-width="4">
		<circle cx="24" cy="11" r="7" stroke-linecap="round" stroke-linejoin="round" />
		<path stroke-linecap="round" stroke-linejoin="round" d="M4 41c0-8.837 8.059-16 18-16" />
		<circle cx="34" cy="34" r="9" />
		<path stroke-linecap="round" stroke-linejoin="round" d="M33 31v4h4" />
	</g>
</svg>
    </div>
    <div>
    <p class="text-3xl font-semibold">${allAppointments.length}</p>
    <p class="text-xs font-medium mt-1">Total Appointments</p>
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
    

    <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg p-5 flex gap-4 items-center">
    <div class="w-14 h-14 bg-status-success/10 text-status-success rounded-2xl flex justify-center items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 2048 2048">
	<path fill="currentColor" d="m1491 595l90 90l-749 749l-365-365l90-90l275 275zM1024 0q141 0 272 36t245 103t207 160t160 208t103 245t37 272q0 141-36 272t-103 245t-160 207t-208 160t-245 103t-272 37q-141 0-272-36t-245-103t-207-160t-160-208t-103-244t-37-273q0-141 36-272t103-245t160-207t208-160T751 37t273-37m0 1920q123 0 237-32t214-90t182-141t140-181t91-214t32-238q0-123-32-237t-90-214t-141-182t-181-140t-214-91t-238-32q-123 0-237 32t-214 90t-182 141t-140 181t-91 214t-32 238q0 123 32 237t90 214t141 182t181 140t214 91t238 32" />
</svg>
    </div>
    <div>
    <p class="text-3xl font-semibold">${completedAppointments.length}</p>
    <p class="text-xs font-medium mt-1">Completed Appointments</p>
    </div>
    </div>


    <div class="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg p-5 flex gap-4 items-center">
    <div class="w-14 h-14 bg-status-error/10 text-status-error rounded-2xl flex justify-center items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
	<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16v-4a4 4 0 0 1 8 0v4M3 12h1m8-9v1m8 8h1M5.6 5.6l.7.7m12.1-.7l-.7.7M6 17a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z" />
</svg>
    </div>
    <div>
    <p class="text-3xl font-semibold">${urgentAppointments.length}</p>
    <p class="text-xs font-medium mt-1">Urgent Appointments</p>
    </div>
    </div>

    </div>

    `;

  reportContent.innerHTML = `
    <div class="bg-surface dark:bg-surface-dark p-2 border border-border dark:border-border-dark rounded-lg">
        <div
          class="grid grid-cols-12 p-2 items-center text-sm border-b border-border last:border-0 dark:border-border-dark ">
          <p class="col-span-3">Patient</p>
          <p class="col-span-2">Heart Rate</p>
          <p class="col-span-3">Blood Presure</p>
          <p class="col-span-2">Oxygen Level</p>
          <p class="col-span-2">status</p>
        </div>

    ${patients
      .map((p) => {
        const statusClass = statusColors[p.condition] || "";
        return `
    <div data-id='${p.id}' class="patient-row cursor-pointer hover:bg-background dark:hover:bg-background-dark transition-all bg-surface dark:bg-surface-dark border-b last:border-0 border-border dark:border-border-dark p-4 grid grid-cols-12 items-center ">
        <p class="font-semibold col-span-3">${p.name}</p>
        <span class="col-span-2">${p.heartRate} bpm</span>
        <span class="col-span-3">${p.bloodPressure} mmHg</span>
        <span class="col-span-2">${p.oxygenLevel}%</span>
        <span class="text-xs col-span-2 px-2 py-1 rounded-full w-fit ${statusClass}">${p.condition}</span>
    </div>
  `;
      })
      .join("")}
    </div>
    
    `;

  document.querySelectorAll(".patient-row").forEach((row) => {
    row.addEventListener("click", () => {
      window.location.href = `./patientDetails.html?id=${row.dataset.id}`;
    });
  });
}

function applyFilters(allPatients, allAppointments, role) {
  const term = document
    .querySelector("#report-input")
    .value.trim()
    .toLowerCase();
  const activefilter = document.querySelector("#condition-filter").value;

  let filtered = allPatients.filter((p) => p.name.toLowerCase().includes(term));
  if ( activefilter !== "all") {
    filtered = filtered.filter(
      (p) => ( p.condition === activefilter)
    );
  }

  renderReports(filtered, allAppointments, role);
}
