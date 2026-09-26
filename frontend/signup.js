
function qs(id) {
  return document.getElementById(id);
}

const form = qs("signupForm");
const msg = qs("signupMsg");
const popup = qs("popup");

// Real API request
async function post(url, body) {
  const res = await fetch("http://localhost:5000/api/auth" + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    // Try to read error response from backend
    const err = await res.json().catch(() => ({}));
    throw new Error(err.msg || "Signup failed");
  }

  return res.json();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";

  try {
    const username = qs("username").value.trim();
    const email = qs("email").value.trim();
    const password = qs("password").value;

    if (!username || !email || !password) {
      throw new Error("All fields are required");
    }

    // Call backend API
    const { token } = await post("/signup", { username, email, password });

    // Store JWT token in localStorage
    localStorage.setItem("token", token);

    msg.style.color = "#34d399"; // green
    msg.textContent = "Account created! You can log in now.";

    popup.classList.add("show");
    setTimeout(() => popup.classList.remove("show"), 2000);

    // Clear form
    form.reset();

  } catch (err) {
    msg.style.color = "#ef4444"; // red
    msg.textContent = err.message;
  }
});
