const slots = document.querySelectorAll(".time-slot");
const hiddenInput = document.getElementById("selectedTime");
const dateInput = document.getElementById("selectedDate");
const form = document.getElementById("bookingForm");
const toast = document.getElementById("toast");

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxV8fF95kT9jf4aXZ3pQHw9EkS92j2AQZQvwfRknH7NFsI-zyvzruGGg-k3OQd9rq7D6A/exec";

let bookings = {};
let isSubmitting = false;
let isAdmin = false;

// ----------------------
function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}

// ----------------------
// LOAD BOOKINGS
// ----------------------
async function loadBookings() {
    const res = await fetch(SCRIPT_URL);
    const data = await res.json();

    bookings = data.bookings || {};
    updateSlots();
}

// auto refresh (live updates)
setInterval(loadBookings, 10000);

// ----------------------
// UPDATE UI
// ----------------------
function updateSlots() {

    const selectedDate = dateInput.value;
    const booked = bookings[selectedDate] || [];

    slots.forEach(slot => {

        const time = slot.dataset.time;

        slot.classList.remove("reserved", "active");
        slot.disabled = false;

        if (booked.includes(time)) {

            slot.classList.add("reserved");

            if (isAdmin) {
                const key = `${selectedDate}__${time}`;

                slot.innerHTML = `
                    ${time} (Booked)
                    <button class="cancel-btn">Cancel</button>
                `;

                slot.querySelector(".cancel-btn").onclick = async (e) => {
                    e.stopPropagation();

                    await fetch(SCRIPT_URL, {
                        method: "POST",
                        body: JSON.stringify({
                            action: "cancel",
                            key
                        })
                    });

                    await loadBookings();
                };

            } else {
                slot.innerText = `${time} (Booked)`;
                slot.disabled = true;
            }

        } else {
            slot.innerText = time;
        }
    });
}

// ----------------------
// DATE CHANGE
// ----------------------
dateInput.addEventListener("change", () => {
    hiddenInput.value = "";
    updateSlots();
});

// ----------------------
// SLOT CLICK
// ----------------------
slots.forEach(slot => {

    slot.addEventListener("click", () => {

        if (slot.disabled) {
            showToast("⚾ Already booked");
            return;
        }

        slots.forEach(s => s.classList.remove("active"));

        slot.classList.add("active");
        hiddenInput.value = slot.dataset.time;
    });

});

// ----------------------
// ADMIN TOGGLE
// ----------------------
document.getElementById("adminToggle")?.addEventListener("click", () => {
    isAdmin = !isAdmin;
    showToast(isAdmin ? "Admin ON" : "Admin OFF");
    updateSlots();
});

// ----------------------
// SUBMIT BOOKING
// ----------------------
form.addEventListener("submit", async (e) => {

    e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;

    const date = dateInput.value;
    const time = hiddenInput.value;

    const name = form.querySelector("input[type='text']").value;
    const email = form.querySelector("input[type='email']").value;
    const phone = form.querySelector("input[type='tel']").value;
    const cage = form.querySelector("select").value;
    const notes = form.querySelector("textarea")?.value || "";

    const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
            date,
            time,
            name,
            email,
            phone,
            cage,
            notes
        })
    });

    const data = await res.json();

    showToast(data.message);

    if (data.success) {
        form.reset();
        hiddenInput.value = "";
        await loadBookings();
    }

    isSubmitting = false;
});

// ----------------------
window.addEventListener("load", loadBookings);