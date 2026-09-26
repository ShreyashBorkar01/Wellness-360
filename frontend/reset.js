const form = document.getElementById("resetForm");
const msg = document.getElementById("resetMsg");

function getTokenFromURL() {
  const url = new URL(window.location.href);
  return url.searchParams.get("token");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";
  const token = getTokenFromURL();
  if (!token) {
    msg.style.color = "#ef4444";
    msg.textContent = "Expired or invalid reset link.";
    return;
  }
  const password = document.getElementById("newPassword").value;
  if (!password || password.length < 6) {
    msg.style.color = "#ef4444";
    msg.textContent = "Password must be at least 6 characters.";
    return;
  }
  try {
    const res = await fetch(`http://localhost:5000/api/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (res.ok || data.message?.includes("successful")) {
      msg.style.color = "#22c55e";
      msg.textContent = "Password updated. You can close this tab and log in.";
    } else {
      msg.style.color = "#ef4444";
      msg.textContent = data.message || "Error updating password.";
    }
  } catch (err) {
    msg.style.color = "#ef4444";
    msg.textContent = "Server or network error.";
  }
});
