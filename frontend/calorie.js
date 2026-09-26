document.getElementById("calorieForm").addEventListener("submit", e => {
  e.preventDefault();

  const age = +document.getElementById("age").value;
  const weight = +document.getElementById("weight").value;
  const height = +document.getElementById("height").value;
  const gender = document.getElementById("gender").value;
  const activity = +document.getElementById("activity").value;

  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const calories = Math.round(bmr * activity);
  document.getElementById("result").innerText =
    `You need around ${calories} calories/day.`;
});
