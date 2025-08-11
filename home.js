// ========= MENU TOGGLE =========
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");

menuBtn.addEventListener("click", () => {
  sidebar.classList.add("open"); // <-- yaha .active ki jagah .open
});

closeSidebar.addEventListener("click", () => {
  sidebar.classList.remove("open"); // <-- yaha bhi .open
});

document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
    sidebar.classList.remove("open");
  }
});


// ========= IMAGE SLIDER =========
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const prevSlideBtn = document.getElementById("prevSlide");
const nextSlideBtn = document.getElementById("nextSlide");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlideFunc() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

nextSlideBtn.addEventListener("click", nextSlide);
prevSlideBtn.addEventListener("click", prevSlideFunc);

setInterval(nextSlide, 3000); // Auto-slide

// ========= FAQ TOGGLE =========
document.querySelectorAll(".faq-q").forEach((btn) => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;
    answer.classList.toggle("hidden");
  });
});

// ========= FOOTER YEAR =========
document.getElementById("year").textContent = new Date().getFullYear();

// ========= MAP SECTION (REAL MAP) =========
// HTML me map.png ko replace karke div#map dalna padega
// Example: <div id="map" style="height:400px;"></div>

// Leaflet.js initialization
if (document.getElementById("map")) {
  const map = L.map("map").setView([20.5937, 78.9629], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([28.6139, 77.2090]) // Delhi Example
    .addTo(map)
    .bindPopup("Anywhere — Just Flynoo")
    .openPopup();
}

document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value.trim();
    const resultsSection = document.getElementById('searchResults');
    const resultsContent = document.getElementById('resultsContent');

    if (!query) {
        alert("Please enter something to search.");
        return;
    }

    // Show loading
    resultsSection.classList.remove('hidden');
    resultsSection.setAttribute('aria-hidden', 'false');
    resultsContent.innerHTML = "<p>Searching... Please wait.</p>";

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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", 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo", // free ya jo bhi model use karna ho
                messages: [
                    { role: "system", content: "You are a helpful travel guide AI." },
                    { role: "user", content: `Tour and travel related info about: ${query}` }
                ]
            })
        });

        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        const aiText = data?.choices?.[0]?.message?.content || "No information found.";

        resultsContent.innerHTML = `<p>${aiText}</p>`;
    } catch (error) {
        resultsContent.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
});

// Close results button
document.getElementById('closeResults').addEventListener('click', () => {
    const resultsSection = document.getElementById('searchResults');
    resultsSection.classList.add('hidden');
    resultsSection.setAttribute('aria-hidden', 'true');
});
