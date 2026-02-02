async function loadConfig() {
  const res = await fetch("./content/config.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Не найден content/config.json");
  return await res.json();
}

function el(tag, cls) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}

function setBg(node, url) {
  node.style.backgroundImage = `url("${url}")`;
}

function renderMarquee(words) {
  const track = document.getElementById("marqueeTrack");
  track.innerHTML = "";
  // Дублируем список, чтобы бегущая строка была бесконечной
  const list = [...words, ...words];
  list.forEach((w) => {
    const t = el("div", "tag");
    const d = el("span", "dot");
    const s = el("span");
    s.textContent = w;
    t.appendChild(d);
    t.appendChild(s);
    track.appendChild(t);
  });
}

function renderWork(items) {
  const grid = document.getElementById("workGrid");
  grid.innerHTML = "";

  items.forEach((it) => {
    const card = el("div", "card");

    const a = el("a");
    a.href = it.link || it.src;
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    const img = document.createElement("img");
    img.className = "media";
    img.loading = "lazy";
    img.src = it.src;
    img.alt = it.title || "work";

    a.appendChild(img);

    const cap = el("div", "card-cap");
    const left = el("b");
    left.textContent = it.title || "WORK";
    const right = el("span");
    right.textContent = it.tag || "";
    cap.appendChild(left);
    cap.appendChild(right);

    card.appendChild(a);
    card.appendChild(cap);
    grid.appendChild(card);
  });
}

function renderSteps(steps) {
  const box = document.getElementById("steps");
  box.innerHTML = "";
  steps.forEach((s) => {
    const c = el("div", "step");
    const b = el("b");
    b.textContent = s.title;
    const t = el("span");
    t.textContent = s.text;
    c.appendChild(b);
    c.appendChild(t);
    box.appendChild(c);
  });
}

function renderServices(services) {
  const box = document.getElementById("servicesTiles");
  box.innerHTML = "";
  services.forEach((s) => {
    const tile = el("div", "tile");
    const bg = el("div", "tile-bg");
    setBg(bg, s.image);
    const text = el("div", "tile-text");
    const b = el("b");
    b.textContent = s.title;
    const span = el("span");
    span.textContent = s.sub || "";
    text.appendChild(b);
    text.appendChild(span);

    tile.appendChild(bg);
    tile.appendChild(text);
    box.appendChild(tile);
  });
}

function renderTeam(team) {
  document.getElementById("teamTitle").textContent = team.title;
  const photo = document.getElementById("teamPhoto");
  setBg(photo, team.photo);

  const bullets = document.getElementById("teamBullets");
  bullets.innerHTML = "";
  team.bullets.forEach((t) => {
    const b = el("div", "bullet");
    b.textContent = t;
    bullets.appendChild(b);
  });
}

function renderContacts(c) {
  const list = document.getElementById("contactsList");
  list.innerHTML = "";

  c.items.forEach((it) => {
    const row = el("div", "contact-row");
    const label = el("span");
    label.textContent = it.label;

    let val;
    if (it.href) {
      val = el("a");
      val.href = it.href;
      val.target = "_blank";
      val.rel = "noopener noreferrer";
      val.textContent = it.value;
    } else {
      val = el("a");
      val.href = "#";
      val.textContent = it.value;
      val.onclick = (e) => e.preventDefault();
    }

    row.appendChild(label);
    row.appendChild(val);
    list.appendChild(row);
  });

  document.getElementById("contactsTiny").textContent = c.note || "";
}

function setupForm(tgUsername) {
  const form = document.getElementById("leadForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const contact = (fd.get("contact") || "").toString().trim();
    const msg = (fd.get("msg") || "").toString().trim();

    const text =
      `Заявка на видеовизитку%0A` +
      `Имя: ${encodeURIComponent(name)}%0A` +
      `Контакт: ${encodeURIComponent(contact)}%0A` +
      `Сообщение: ${encodeURIComponent(msg || "—")}`;

    const url = `https://t.me/${tgUsername}?text=${text}`;
    window.open(url, "_blank");
    form.reset();
  });
}

(async function init(){
  try{
    const cfg = await loadConfig();

    // Brand
    document.getElementById("brandName").textContent = cfg.brand.name;

    // Hero
    setBg(document.getElementById("heroMedia"), cfg.hero.image);
    document.getElementById("heroChip").textContent = cfg.hero.chip;
    document.getElementById("heroTitle").textContent = cfg.hero.title;
    document.getElementById("heroSub").textContent = cfg.hero.sub;
    document.getElementById("heroCta1").textContent = cfg.hero.cta1;
    document.getElementById("heroCta2").textContent = cfg.hero.cta2;

    // Marquee
    renderMarquee(cfg.marquee);

    // Work
    document.getElementById("workNote").textContent = cfg.work.note || "Нажми, чтобы открыть";
    renderWork(cfg.work.items);

    // Cinema
    document.getElementById("cinemaTitle").textContent = cfg.cinema.title;
    document.getElementById("cinemaText").textContent = cfg.cinema.text;

    // Steps / Services / Team / Contacts
    renderSteps(cfg.steps);
    renderServices(cfg.services);
    renderTeam(cfg.team);
    renderContacts(cfg.contacts);

    // Footer
    document.getElementById("footerText").textContent = `© ${new Date().getFullYear()} ${cfg.brand.name}`;

    // Form
    document.getElementById("formHint").textContent = cfg.form.hint || "";
    setupForm(cfg.form.telegram_username);

  }catch(err){
    console.error(err);
    alert("Ошибка загрузки конфигурации. Проверь: content/config.json");
  }
})();
