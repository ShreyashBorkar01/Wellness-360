// login.js
const form = document.getElementById("loginForm");
const popup = document.getElementById("popup");
const forgotBtn = document.getElementById("forgotPasswordBtn"); // new button

function showPopup(message, success = true) {
  popup.textContent = message;
  popup.style.background = success ? "#22c55e" : "#ef4444"; // green or red
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2500); // hide after 2.5s
}

// ✅ Login submit handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const usernameOrEmail = document.getElementById("usernameOrEmail").value.trim();
  const password = document.getElementById("password").value;

  if (!usernameOrEmail || !password) {
    return showPopup("⚠️ Please fill all fields", false);
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameOrEmail, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "❌ Login failed");
    }

    // Save token
    localStorage.setItem("token", data.token);

    showPopup("✅ Logged in successfully!", true);

    // Redirect after short delay
    setTimeout(() => {
      window.location.href = "/homee.html"; 
    }, 1200);

  } catch (err) {
    showPopup(err.message, false);
  }
});

// ✅ Forgot Password handler
forgotBtn.addEventListener("click", async () => {
  const email = prompt("Enter your registered email:");

  if (!email) return showPopup("⚠️ Email is required", false);

  try {
    const res = await fetch("http://localhost:5000/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "❌ Failed to send reset link");

    showPopup("📩 Reset link sent to your email!", true);

  } catch (err) {
    showPopup(err.message, false);
  }
});
