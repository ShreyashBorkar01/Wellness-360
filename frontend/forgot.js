const form = document.getElementById("forgotForm");
const popup = document.getElementById("popup");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("usernameOrEmail").value.trim();
  if (!email) {
    showPopup("Please enter your email", "#ef4444");
    return;
  }
  try {
    const res = await fetch("http://localhost:5000/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (res.ok || data.message?.includes("Reset link sent")) {
      showPopup("If the email exists, a reset link has been sent!", "#22c55e");
    } else {
      showPopup(data.message || "Unknown error", "#ef4444");
    }
  } catch (err) {
    showPopup("Connection error", "#ef4444");
  }
});

function showPopup(message, color) {
  popup.textContent = message;
  popup.style.background = color;
  popup.classList.add("show");
  setTimeout(() => {
    popup.classList.remove("show");
  }, 2500);
}
