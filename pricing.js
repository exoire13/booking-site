
function showHourly() {
  document.getElementById("hourly").classList.remove("hidden");
  document.getElementById("monthly").classList.add("hidden");

  document.getElementById("hourlyBtn").classList.add("active");
  document.getElementById("monthlyBtn").classList.remove("active");
}

function showMonthly() {
  document.getElementById("monthly").classList.remove("hidden");
  document.getElementById("hourly").classList.add("hidden");

  document.getElementById("monthlyBtn").classList.add("active");
  document.getElementById("hourlyBtn").classList.remove("active");
}