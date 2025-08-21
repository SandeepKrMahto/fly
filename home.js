/* --------- Flynoo — upgraded home.js (no API keys, responsive, touch-friendly) --------- */
/* Put this file as home.js and include with `defer` */

/* Helpers */
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

/* ---------- SIDEBAR ---------- */
const menuBtn = $("#menuBtn");
const sidebar = $("#sidebar");
const closeSidebar = $("#closeSidebar");

if(menuBtn && sidebar){
  menuBtn.addEventListener("click", (e) => {
    sidebar.classList.add("open");
    sidebar.setAttribute("aria-hidden","false");
  });
}
if(closeSidebar){
  closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("open");
    sidebar.setAttribute("aria-hidden","true");
  });
}
/* click outside closes */
document.addEventListener("click", (e) => {
  if(!sidebar.contains(e.target) && !menuBtn.contains(e.target)){
    sidebar.classList.remove("open");
    sidebar.setAttribute("aria-hidden","true");
  }
});

/* ---------- SLIDER (hero/main banner) ---------- */
let currentSlide = 0;
const slides = $$(".slide");
const prevBtn = $("#prevSlide");
const nextBtn = $("#nextSlide");
const dotsWrap = $("#sliderDots");
let autoSlideTimer = null;

function renderDots(){
  if(!dotsWrap) return;
  dotsWrap.innerHTML = "";
  slides.forEach((s,i)=>{
    const b = document.createElement("button");
    b.setAttribute("aria-label", `Go to slide ${i+1}`);
    if(i===0) b.classList.add("active");
    b.addEventListener("click", ()=> gotoSlide(i));
    dotsWrap.appendChild(b);
  });
}
function gotoSlide(i){
  currentSlide = i;
  slides.forEach((sl,idx)=> sl.classList.toggle("active", idx===i));
  if(dotsWrap){
    Array.from(dotsWrap.children).forEach((d,idx)=> d.classList.toggle("active", idx===i));
  }
}
function nextSlide(){
  currentSlide = (currentSlide + 1) % slides.length;
  gotoSlide(currentSlide);
}
function prevSlide(){
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  gotoSlide(currentSlide);
}
renderDots();
if(prevBtn) prevBtn.addEventListener("click", prevSlide);
if(nextBtn) nextBtn.addEventListener("click", nextSlide);

/* Auto-slide with pause on hover/focus */
const sliderEl = $("#slider");
function startAuto(){
  stopAuto();
  autoSlideTimer = setInterval(nextSlide, 4200);
}
function stopAuto(){
  if(autoSlideTimer) { clearInterval(autoSlideTimer); autoSlideTimer = null; }
}
if(sliderEl){
  sliderEl.addEventListener("mouseenter", stopAuto);
  sliderEl.addEventListener("mouseleave", startAuto);
  sliderEl.addEventListener("focusin", stopAuto);
  sliderEl.addEventListener("focusout", startAuto);
  // touch support
  let touchStartX = 0;
  sliderEl.addEventListener("touchstart", (e)=> { touchStartX = e.touches[0].clientX; stopAuto(); }, {passive:true});
  sliderEl.addEventListener("touchend", (e)=> {
    const dx = (e.changedTouches[0].clientX - touchStartX);
    if(Math.abs(dx) > 30){
      if(dx < 0) nextSlide(); else prevSlide();
    }
    startAuto();
  }, {passive:true});
}
startAuto();

/* ---------- FAQ toggle ---------- */
$$(".faq-q").forEach(btn => {
  btn.addEventListener("click", () => {
    const a = btn.nextElementSibling;
    if(!a) return;
    a.classList.toggle("hidden");
    btn.setAttribute("aria-expanded", String(!a.classList.contains("hidden")));
  });
});

/* ---------- SEARCH (placeholder safe-handler) ---------- */
const searchBtn = $("#searchBtn");
const searchInput = $("#searchInput");
const resultsSection = $("#searchResults");
const resultsContent = $("#resultsContent");
const closeResults = $("#closeResults");

if(searchBtn){
  searchBtn.addEventListener("click", async () => {
    const q = (searchInput?.value || "").trim();
    if(!q){ alert("Please enter something to search."); return; }
    if(resultsSection){
      resultsSection.classList.remove("hidden");
      resultsSection.setAttribute("aria-hidden","false");
    }
    if(resultsContent) resultsContent.innerHTML = "<p style='color:var(--muted)'>Searching…</p>";
    try{
      await new Promise(r=>setTimeout(r, 600));
      if(resultsContent) resultsContent.innerHTML = `<p><strong>Results for:</strong> ${escapeHtml(q)}</p>
        <ul style="color:var(--muted);margin-top:8px">
          <li>Top attractions</li>
          <li>Best time to visit</li>
          <li>Sample 1-day itinerary</li>
        </ul>`;
    } catch(err){
      if(resultsContent) resultsContent.innerHTML = `<p style="color:tomato">Error: ${err.message}</p>`;
    }
  });
}
if(closeResults){
  closeResults.addEventListener("click", ()=> {
    if(resultsSection) {
      resultsSection.classList.add("hidden");
      resultsSection.setAttribute("aria-hidden","true");
    }
  });
}
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ---------- Popup behaviour (shows every visit) ---------- */
const popupEl = $("#updatePopup");
const popupClose = $("#popupClose");
const cutBtn = $("#cutImageBtn");
const popupImage = $("#popupImage");

window.addEventListener("load", ()=> {
  setTimeout(()=> {
    if(popupEl){
      popupEl.style.display = "flex";
      popupEl.setAttribute("aria-hidden","false");
    }
  }, 500);
});
if(popupClose) popupClose.addEventListener("click", ()=> {
  if(popupEl){ popupEl.style.display = "none"; popupEl.setAttribute("aria-hidden","true"); }
});
if(cutBtn && popupImage){
  cutBtn.addEventListener("click", ()=> {
    popupImage.style.display = "none";
    cutBtn.textContent = "Image cut";
    cutBtn.disabled = true;
  });
}

/* ---------- Footer year ---------- */
const yearEl = document.getElementById("year");
if(yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- MAP (Leaflet) ---------- */
function initMap(){
  if(typeof L === "undefined" || !document.getElementById("map")) return;
  try{
    const map = L.map("map").setView([20.5937,78.9629], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.marker([28.6139,77.2090]).addTo(map).bindPopup("Anywhere — Just Flynoo");
  } catch(e){
    console.warn("Map init failed", e);
  }
}
window.addEventListener("load", ()=> setTimeout(initMap, 300));

/* ---------- Accessibility ESC ---------- */
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape"){
    if(popupEl && popupEl.style.display !== "none") { popupEl.style.display = "none"; popupEl.setAttribute("aria-hidden","true"); }
    if(sidebar && sidebar.classList.contains("open")) { sidebar.classList.remove("open"); sidebar.setAttribute("aria-hidden","true"); }
    if(resultsSection && !resultsSection.classList.contains("hidden")) { resultsSection.classList.add("hidden"); resultsSection.setAttribute("aria-hidden","true"); }
  }
});

/* ---------- HERO BACKGROUND SLIDESHOW ---------- */
const heroEl = document.querySelector(".hero");
const heroImages = ["bg1.jpg","bg2.jpg","bg3.jpg","bg4.jpg","bg5.jpg","bg6.jpg","bg7.jpg","bg8.jpg","bg9.jpg","bg10.jpg"];
let heroIndex = 0;
function changeHeroBg() {
  heroEl.style.backgroundImage = `url('${heroImages[heroIndex]}')`;
  heroIndex = (heroIndex + 1) % heroImages.length;
}
if (heroEl) {
  changeHeroBg();
  setInterval(changeHeroBg, 5000);
}

/* ---------- NEW GEMS SLIDER ---------- */
const gemsTrack = $("#gemsTrack");
const gemsPrev = $(".gems-slider .prev");
const gemsNext = $(".gems-slider .next");
if(gemsTrack && gemsPrev && gemsNext){
  let gemIndex = 0;
  const gemCards = gemsTrack.children;
  const cardWidth = gemCards[0].offsetWidth + 20; 
  let autoGemTimer = null;

  function updateGems(){
    gemsTrack.style.transform = `translateX(-${gemIndex * cardWidth}px)`;
  }
  function nextGem(){
    if(gemIndex < gemCards.length - 1){ gemIndex++; } else { gemIndex = 0; }
    updateGems();
  }
  function prevGem(){
    if(gemIndex > 0){ gemIndex--; } else { gemIndex = gemCards.length - 1; }
    updateGems();
  }
  gemsNext.addEventListener("click", nextGem);
  gemsPrev.addEventListener("click", prevGem);

  // auto slide
  function startGemAuto(){
    stopGemAuto();
    autoGemTimer = setInterval(nextGem, 1000);
  }
  function stopGemAuto(){
    if(autoGemTimer){ clearInterval(autoGemTimer); autoGemTimer = null; }
  }

  // hover pause
  gemsTrack.parentElement.addEventListener("mouseenter", stopGemAuto);
  gemsTrack.parentElement.addEventListener("mouseleave", startGemAuto);

  // touch swipe
  let touchStartX = 0;
  gemsTrack.addEventListener("touchstart", (e)=>{ touchStartX = e.touches[0].clientX; stopGemAuto(); }, {passive:true});
  gemsTrack.addEventListener("touchend", (e)=>{
    const dx = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(dx) > 30){
      if(dx < 0) nextGem(); else prevGem();
    }
    startGemAuto();
  }, {passive:true});

  startGemAuto();
}
/* ---------- SHOP SLIDER ---------- */
const shopTrack = $("#shopTrack");
const shopPrev = $(".shop-slider .prev");
const shopNext = $(".shop-slider .next");

if(shopTrack && shopPrev && shopNext){
  let shopIndex = 0;
  const shopCards = shopTrack.children;
  const shopCardWidth = shopCards[0].offsetWidth + 20; 
  let autoShopTimer = null;

  function updateShop(){
    shopTrack.style.transform = `translateX(-${shopIndex * shopCardWidth}px)`;
  }
  function nextShop(){
    if(shopIndex < shopCards.length - 1){ shopIndex++; } else { shopIndex = 0; }
    updateShop();
  }
  function prevShop(){
    if(shopIndex > 0){ shopIndex--; } else { shopIndex = shopCards.length - 1; }
    updateShop();
  }
  shopNext.addEventListener("click", nextShop);
  shopPrev.addEventListener("click", prevShop);

  // auto slide
  function startShopAuto(){
    stopShopAuto();
    autoShopTimer = setInterval(nextShop, 1000);
  }
  function stopShopAuto(){
    if(autoShopTimer){ clearInterval(autoShopTimer); autoShopTimer = null; }
  }

  // hover pause
  shopTrack.parentElement.addEventListener("mouseenter", stopShopAuto);
  shopTrack.parentElement.addEventListener("mouseleave", startShopAuto);

  // touch swipe
  let touchStartX = 0;
  shopTrack.addEventListener("touchstart", (e)=>{ touchStartX = e.touches[0].clientX; stopShopAuto(); }, {passive:true});
  shopTrack.addEventListener("touchend", (e)=>{
    const dx = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(dx) > 30){
      if(dx < 0) nextShop(); else prevShop();
    }
    startShopAuto();
  }, {passive:true});

  startShopAuto();
}
