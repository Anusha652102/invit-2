/* =====================================================================
   BOC Flex Corporate — Launch Invitation  (plain JavaScript, no libraries)
   Change the settings in CONFIG below. Page text lives in index.html.
   ===================================================================== */
const CONFIG = {
  // Put the video in the "video" folder and write its path, e.g. "video/commissioner-invite.mp4"
  video: "",

  // Photo behind the first screen (in place of the turning lotus), e.g. "images/hero-bg.jpg"
  heroImage: "images/hero-bg.jpg",
  // Credit line shown in the corner of the photo (leave "" to hide)
  heroCredit: "",

  // Sri Lanka time (+05:30)
  start: "2026-12-02T10:00:00+05:30",
  end:   "2026-12-02T12:00:00+05:30",

  title: "BOC Flex Corporate App Launch",
  venue: "Kandy Municipal Council Auditorium, Kandy",
  map:   "https://www.google.com/maps/search/?api=1&query=Kandy+Municipal+Council",
};

(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- guest name (from the link: #Mr-Perera or ?guest=Mr%20Perera) ---------- */
  let hash = "";
  try { hash = decodeURIComponent(location.hash.slice(1)); } catch (e) {}
  if (/^(home|video|event|countdown|message)$/i.test(hash)) hash = "";
  const guest = (new URLSearchParams(location.search).get("guest") || hash.replace(/-/g, " ")).slice(0, 60);
  if (guest) { $("dear").textContent = "Dear " + guest + ","; $("dear").hidden = false; }

  /* ---------- particles: floating flowers + gold bursts ---------- */
  const cv = $("fx"), cx = cv.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0, raf = 0;
  const petals = Array.from({ length: 22 }, () => ({
    x: Math.random(), y: Math.random(), s: Math.random() * 5 + 5,
    v: Math.random() * 0.0007 + 0.0003, a: Math.random() * 6.3, r: Math.random() * 6.3
  }));
  const sparks = [];
  const cols = ["#f2b705", "#22c9f0", "#ffd64d", "#ffffff"];
  function size() { W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr; }
  size(); addEventListener("resize", size);

  function burst(x, y, n) {
    for (let i = 0; i < n; i++) {
      const t = Math.random() * Math.PI * 2, sp = Math.random() * 7 + 2;
      sparks.push({ x: x * dpr, y: y * dpr, vx: Math.cos(t) * sp, vy: Math.sin(t) * sp - 3, life: 1, s: Math.random() * 3 + 1.5, c: cols[i % 4] });
    }
    if (!raf) loop();
  }
  function flower(p) {
    const x = (p.x + Math.sin(p.a) * 0.02) * W, y = p.y * H, s = p.s * dpr;
    cx.save(); cx.translate(x, y); cx.rotate(p.r);
    for (let k = 0; k < 5; k++) {
      cx.rotate((Math.PI * 2) / 5);
      cx.beginPath(); cx.ellipse(0, -s * 0.55, s * 0.32, s * 0.55, 0, 0, 7);
      cx.fillStyle = "rgba(255,255,255,.9)"; cx.fill();
    }
    cx.beginPath(); cx.arc(0, 0, s * 0.22, 0, 7); cx.fillStyle = "#f3c44f"; cx.fill();
    cx.restore();
  }
  function loop() {
    cx.clearRect(0, 0, W, H);
    cx.globalAlpha = 0.55;
    for (const p of petals) {
      p.y += p.v; p.a += 0.012; p.r += 0.006;
      if (p.y > 1.05) { p.y = -0.05; p.x = Math.random(); }
      flower(p);
    }
    cx.globalAlpha = 1;
    for (let i = sparks.length - 1; i >= 0; i--) {
      const b = sparks[i];
      b.x += b.vx * dpr; b.y += b.vy * dpr; b.vy += 0.14; b.life -= 0.014;
      if (b.life <= 0) { sparks.splice(i, 1); continue; }
      cx.globalAlpha = b.life; cx.fillStyle = b.c;
      cx.beginPath(); cx.arc(b.x, b.y, b.s * dpr, 0, 7); cx.fill();
    }
    cx.globalAlpha = 1;
    raf = !reduce || sparks.length ? requestAnimationFrame(loop) : 0;
  }
  loop();

  /* ---------- generated music (no audio file needed) ---------- */
  let ac = null, timer = null;
  function note(f, t, d, vol, type) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type || "sine"; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d);
  }
  function startMusic() {
    try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); } catch (e) { return; }
    stopMusic();
    const mel = [293.66, 349.23, 392, 440, 523.25, 440, 392, 349.23];
    let i = 0;
    timer = setInterval(() => {
      const t = ac.currentTime;
      note(mel[i % mel.length], t, 2, 0.04, "triangle");
      if (i % 4 === 0) note(146.83, t, 3.2, 0.03);
      i++;
    }, 700);
    $("music").classList.add("on"); $("music").setAttribute("aria-pressed", "true");
  }
  function stopMusic() {
    clearInterval(timer); timer = null;
    $("music").classList.remove("on"); $("music").setAttribute("aria-pressed", "false");
  }
  $("music").addEventListener("click", () => (timer ? stopMusic() : startMusic()));

  /* ---------- first-screen photo ---------- */
  if (CONFIG.heroImage) {
    const hp = $("heroPhoto");
    hp.style.setProperty("--photo", 'url("' + new URL(CONFIG.heroImage, document.baseURI).href + '")');
    hp.hidden = false;
    document.querySelector(".hero").classList.add("dark");
    const lotus = document.querySelector(".hero-lotus");
    if (lotus) lotus.style.display = "none";
  }
  if (CONFIG.heroCredit) { $("photoCredit").textContent = CONFIG.heroCredit; $("photoCredit").hidden = false; }

  /* ---------- reveal sections as they scroll into view ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- hero button: go to the video (and play it) ---------- */
  $("toVideo").addEventListener("click", (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 80);
    document.documentElement.classList.remove("lock");   // the rest of the page can scroll now
    $("video").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    const vid = $("vid");
    if (CONFIG.video && vid) {
      if (timer) stopMusic();
      vid.play().catch(() => {});
    }
  });

  /* ---------- scroll progress bar ---------- */
  addEventListener("scroll", () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    $("bar").style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
  }, { passive: true });

  /* ---------- video ---------- */
  if (CONFIG.video) {
    const vid = $("vid"), big = $("playBig");
    vid.src = CONFIG.video; vid.hidden = false; $("vph").remove(); big.hidden = false;
    vid.addEventListener("loadedmetadata", () => { if (vid.videoHeight > vid.videoWidth) $("vbox").classList.add("tall"); });
    vid.addEventListener("play", () => { big.hidden = true; if (timer) stopMusic(); });
    vid.addEventListener("pause", () => { if (!vid.ended) big.hidden = false; });
    big.addEventListener("click", () => vid.play().catch(() => {}));
  }

  /* ---------- map + calendar links ---------- */
  const g = (s) => new Date(s).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  $("mapBtn").href = CONFIG.map;
  $("calBtn").href = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(CONFIG.title) +
    "&dates=" + g(CONFIG.start) + "/" + g(CONFIG.end) + "&location=" + encodeURIComponent(CONFIG.venue) +
    "&details=" + encodeURIComponent("Kandy Municipal Council — official launch of the BOC Flex Corporate app.");

  /* ---------- countdown ---------- */
  const target = new Date(CONFIG.start).getTime();
  const pad = (n) => String(n).padStart(2, "0");
  function setTile(id, v) {
    const el = $(id);
    if (el.textContent === v) return;
    el.textContent = v;
    el.classList.remove("flip"); void el.offsetWidth; el.classList.add("flip");
  }
  function tick() {
    const d = target - Date.now();
    if (d <= 0) { $("tiles").hidden = true; $("done").hidden = false; return; }
    const s = Math.floor(d / 1000);
    setTile("cd", String(Math.floor(s / 86400)));
    setTile("ch", pad(Math.floor((s % 86400) / 3600)));
    setTile("cm", pad(Math.floor((s % 3600) / 60)));
    setTile("cs", pad(s % 60));
  }
  tick(); setInterval(tick, 1000);

})();
