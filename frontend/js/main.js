// STEP: Base API URL - change to deployed URL later
const API_BASE = "http://127.0.0.1:5000/api";

// STEP: Load all users from Flask API
const loadUsers = async () => {
  try {
    const res = await fetch(`${API_BASE}/users`);
    const users = await res.json();
    const list = document.getElementById("users");
    list.innerHTML = "";
    users.forEach((user) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div><strong>${user.name}</strong><br/><span>${user.email}</span></div>
        <button onclick="deleteUser(${user.id})">Delete</button>
      `;
      list.appendChild(li);
    });
    setStatus(`Loaded ${users.length} user(s)`);
  } catch (err) {
    setStatus("Error: Backend not reachable");
  }
};

// STEP: Add a new user via POST
const addUser = async () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  if (!name || !email) return setStatus("Fill all fields");

  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  if (res.ok) {
    setStatus("User added!");
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    loadUsers();
  }
};

// STEP: Delete user by ID
const deleteUser = async (id) => {
  await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });
  setStatus(`User ${id} deleted`);
  loadUsers();
};

const setStatus = (msg) =>
  (document.getElementById("status").textContent = msg);

// STEP: Auto-load on page start
loadUsers();
