//generic local storage functions
export function getItem(key) {
  const value = localStorage.getItem(key);
  if (value === null) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function setItem(key, value) {
  const valuetoStore = typeof value === "string" ? value : JSON.stringify(value);
  localStorage.setItem(key, valuetoStore);
}

export function removeItem(key) {
  localStorage.removeItem(key);
}


//role helper
const ROLE_KEY = "role";

export function getRole(){
  return getItem(ROLE_KEY);
}

export function setRole(role){
  return setItem(ROLE_KEY, role);
}

export function clearRole(){
  return removeItem(ROLE_KEY);
}

//fetch data
export async function fetchData(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}