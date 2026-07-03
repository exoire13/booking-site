
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxV8fF95kT9jf4aXZ3pQHw9EkS92j2AQZQvwfRknH7NFsI-zyvzruGGg-k3OQd9rq7D6A/exec";

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;

  const name = form.querySelectorAll("input")[0].value;
  const email = form.querySelectorAll("input")[1].value;
  const subject = form.querySelectorAll("input")[2].value;
  const message = form.querySelector("textarea").value;

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "contact",
        name,
        email,
        subject,
        message
      })
    });

    const data = await res.json();

    if (data.success) {
      alert("Message sent successfully!");
      form.reset();
    } else {
      alert("Failed to send message.");
    }

  } catch (err) {
    alert("Error sending message.");
  }
});