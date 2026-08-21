import { fetchData, getItem, getRole, setItem } from "./storage.js";

let currentUser = null;
let allUsers = [];

export async function initNotifications() {
  const notificationBtn = document.querySelector(".notificationBtn");
  if (!notificationBtn) return;

  const role = getRole();
  if (!role) return;

  allUsers = await fetchData("./src/data/users.json");
  currentUser = allUsers.find((user) => user.role === role);
  if (!currentUser) return;

  updateNotificationsBadge(currentUser.id);

  notificationBtn.addEventListener("click", () => {
    showNotifications(currentUser.id);
  });
}

function getNotifications() {
  return getItem("notifications") || [];
}

function saveNotifications(notifications) {
  setItem("notifications", notifications);
}

export function addNotification(userId, message) {
  const notifications = getNotifications();

  const newNotification = {
    id: Date.now(),
    message,
    userId,
    timestamp: new Date().toISOString(),
    read: false,
  };
  notifications.push(newNotification);
  saveNotifications(notifications);
}

function showNotifications(currentUserId) {
  const notifications = getNotifications();
  const userNotifications = notifications
    .filter((n) => n.userId === currentUserId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const oldDropdown = document.querySelector(".notifications-dropdown");
  if (oldDropdown) {
    oldDropdown.remove();
    return;
  }

  const dropdown = document.createElement("div");
  dropdown.className = "notifications-dropdown absolute top-14 right-4 w-72 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto";

  if (userNotifications.length === 0) {
    dropdown.innerHTML = `<p class="p-4 text-sm text-text-muted dark:text-text-muted-dark">No notifications yet.</p>`;
  } else {
    dropdown.innerHTML = userNotifications.map((n) => {
      const time = new Date(n.timestamp).toLocaleString();
      return `
        <div class="p-3 border-b border-border dark:border-border-dark last:border-0 text-sm">
          <p>${n.message}</p>
          <p class="text-xs text-text-muted dark:text-text-muted-dark mt-1">${time}</p>
        </div>
      `;
    }).join("");
  }

  document.querySelector(".notificationBtn").parentElement.appendChild(dropdown);

  userNotifications.forEach((n) => { n.read = true; });
  saveNotifications(notifications);
  updateNotificationsBadge(currentUserId);
}

function updateNotificationsBadge(userId) {
  const notificationBtn = document.querySelector(".notificationBtn");
  if (!notificationBtn) return;

  const notifications = getNotifications();
  const unreadCount = notifications.filter((n) => !n.read && n.userId === userId).length;

  const oldBadge = document.querySelector(".notification-badge");
  if (oldBadge) oldBadge.remove();

  if (unreadCount === 0) return;

  const badge = document.createElement("span");
  badge.className = "notification-badge absolute -top-1 -right-1 bg-status-error text-white rounded-full min-w-5 h-5 flex justify-center items-center p-1";
  badge.textContent = unreadCount;
  notificationBtn.classList.add("relative");
  notificationBtn.appendChild(badge);
}

export function notifyOtherUsers(message, currentUserId) {
  allUsers.forEach((user) => {
    if (user.id != currentUserId) {
      addNotification(user.id, message);
    }
  });
}

export function getCurrentUser(userRole) {
  return allUsers.find((user) => user.role === userRole);
}