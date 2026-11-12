// Fælles logik: menu, produktvisning og indkøbskurv.

const fmt = new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK", maximumFractionDigits: 0 });

// ---------- Produktbillede (SVG-illustration) ----------
// Udskift med rigtige fotos ved at tilføje fx  image: "img/dv-xx-2a.jpg"  på produktet.
function productImage(p) {
  if (p.image) return `<img src="${p.image}" alt="${p.model}" loading="lazy">`;
  if (p.brand === "kabler") return `
  <svg viewBox="0 0 320 220" role="img" aria-label="${p.model}">
    <rect width="320" height="220" fill="#fff"/>
    <text x="160" y="104" text-anchor="middle" font-family="Georgia, serif" font-size="16" letter-spacing="4" fill="#888">CARDAS</text>
    <text x="160" y="128" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#aaa">Billede følger</text>
  </svg>`;
  const brand = BRANDS[p.brand].name.toUpperCase();
  const short = p.model.replace(/^(DV|Nagaoka)\s+/, "");
  return `
  <svg viewBox="0 0 320 220" role="img" aria-label="${p.model}">
    <defs>
      <linearGradient id="bg-${p.id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f4f1ea"/><stop offset="1" stop-color="#e3ddcf"/>
      </linearGradient>
      <linearGradient id="body-${p.id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${p.color}" stop-opacity=".85"/><stop offset="1" stop-color="${p.color}"/>
      </linearGradient>
    </defs>
    <rect width="320" height="220" fill="url(#bg-${p.id})"/>
    <ellipse cx="160" cy="178" rx="110" ry="10" fill="#000" opacity=".12"/>
    <rect x="72" y="52" width="176" height="16" rx="3" fill="#9a9a9a"/>
    <circle cx="112" cy="60" r="4" fill="#555"/><circle cx="208" cy="60" r="4" fill="#555"/>
    <rect x="86" y="68" width="148" height="78" rx="8" fill="url(#body-${p.id})"/>
    <rect x="86" y="68" width="148" height="6" fill="#fff" opacity=".12"/>
    <text x="160" y="100" text-anchor="middle" font-family="Georgia, serif" font-size="14" letter-spacing="3" fill="${p.accent}">${brand}</text>
    <text x="160" y="124" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="700" fill="${p.accent}">${short}</text>
    <line x1="214" y1="146" x2="258" y2="166" stroke="#b8b8b8" stroke-width="3" stroke-linecap="round"/>
    <circle cx="259" cy="167" r="2.5" fill="#6aa9ff"/>
  </svg>`;
}

// ---------- Indkøbskurv (gemmes i browseren) ----------
const CART_KEY = "pickup-shop-cart";
function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch { return {}; }
}
function saveCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
  renderCart();
}
let cart = loadCart();

// En kurvlinje har nøglen "id" eller "id|længde-nr|stik-nr" for kabler med valg.
function cartLine(key) {
  const [id, li, ci] = key.split("|");
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return null;
  const opt = p.options ? p.options.values[+ci] || p.options.values[0] : null;
  const optName = opt ? ` · ${opt[0]}` : "", optPrice = opt ? opt[1] : 0;
  if (!p.lengths) return { p, name: p.model + optName, price: p.price + optPrice };
  const len = p.lengths[+li] || p.lengths[0];
  return { p, name: `${p.model} · ${len[0]}${optName}`, price: len[1] + optPrice };
}
function defaultLength(p) {
  const i = p.lengths.findIndex(([l]) => l === "1,0 m");
  return i < 0 ? 0 : i;
}
function variantKey(id) {
  const len = document.getElementById(`len-${id}`), con = document.getElementById(`con-${id}`);
  return `${id}|${len ? len.value : 0}|${con ? con.value : 0}`;
}
function chooseOption(id) {
  document.getElementById(`con-${id}`).classList.remove("needs-choice");
  updateVariantPrice(id);
}
function updateVariantPrice(id) {
  document.getElementById(`price-${id}`).textContent = fmt.format(cartLine(variantKey(id)).price);
}

function addToCart(id) {
  // Produkter med et påkrævet valg (fx high/low output) skal have valgt noget først.
  const [pid, , ci] = id.split("|");
  const p = PRODUCTS.find(x => x.id === pid);
  if (p && p.options && p.options.required && ci === "") {
    const sel = document.getElementById(`con-${pid}`);
    sel.classList.add("needs-choice");
    sel.focus();
    return;
  }
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  openCart();
}
function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart(cart);
}

function renderCart() {
  const items = Object.entries(cart).map(([key, qty]) => ({ key, line: cartLine(key), qty })).filter(x => x.line);
  const count = items.reduce((s, x) => s + x.qty, 0);
  const total = items.reduce((s, x) => s + x.qty * x.line.price, 0);
  document.querySelectorAll(".cart-count").forEach(el => { el.textContent = count; el.hidden = count === 0; });
  const list = document.getElementById("cart-items");
  if (!list) return;
  list.innerHTML = items.length
    ? items.map(({ key, line, qty }) => `
      <li class="cart-item">
        <div class="cart-thumb">${productImage(line.p)}</div>
        <div class="cart-info">
          <strong>${line.name}</strong>
          <span>${fmt.format(line.price)}</span>
          <div class="qty">
            <button onclick="changeQty('${key}',-1)" aria-label="Færre">−</button>
            <span>${qty}</span>
            <button onclick="changeQty('${key}',1)" aria-label="Flere">+</button>
          </div>
        </div>
      </li>`).join("")
    : `<li class="cart-empty">Din kurv er tom.</li>`;
  document.getElementById("cart-total").textContent = fmt.format(total);
  document.getElementById("checkout").disabled = items.length === 0;
}
// ---------- Betaling (Stripe Checkout via Cloudflare Worker, se checkout/) ----------
// Sæt adressen på Workeren her, når den er lagt op hos Cloudflare.
const CHECKOUT_URL = "";

async function checkout() {
  const btn = document.getElementById("checkout"), msg = document.getElementById("checkout-msg");
  const say = t => { msg.textContent = t; msg.hidden = !t; };
  if (!CHECKOUT_URL) return say("Betaling er ikke åbnet endnu. Kontakt os på info@classic-hifi.dk eller 71 90 32 71, så hjælper vi med din bestilling.");
  const items = Object.entries(cart).filter(([key]) => cartLine(key)).map(([key, qty]) => ({ key, qty }));
  if (!items.length) return;
  btn.disabled = true; btn.textContent = "Åbner betaling …"; say("");
  try {
    const res = await fetch(CHECKOUT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, total: items.reduce((s, x) => s + x.qty * cartLine(x.key).price, 0), returnUrl: location.href.split("#")[0] }),
    });
    const data = await res.json();
    if (!res.ok || !data.url) throw new Error(data.error || "Betalingen kunne ikke startes.");
    location.href = data.url;
  } catch (e) {
    say(e.message === "Failed to fetch" ? "Kunne ikke få forbindelse. Prøv igen om lidt." : e.message);
    btn.disabled = false; btn.textContent = "Gå til kassen";
  }
}

function openCart() { document.body.classList.add("cart-open"); }
function closeCart() { document.body.classList.remove("cart-open"); }

// ---------- Fælles header, kurv og footer ----------
function renderChrome() {
  const page = document.body.dataset.page;
  const link = (href, key, label) => `<a href="${href}" class="${page === key ? "active" : ""}">${label}</a>`;
  document.body.insertAdjacentHTML("afterbegin", `
    <header class="site-header">
      <div class="wrap header-inner">
        <a href="index.html" class="logo" aria-label="Classic HiFi Fidelity – forside"><span class="logo-mark"><img src="img/classic-hifi-logo.png" alt=""></span><span class="logo-text"><span class="logo-name">Classic HiFi Fidelity</span><span class="logo-sub">High End Audio · Webshop</span></span></a>
        <button class="menu-toggle" aria-label="Menu" onclick="document.body.classList.toggle('menu-open')">☰</button>
        <nav class="main-nav">
          ${link("index.html", "home", "Forside")}
          <div class="dropdown">
            <span class="${["dynavector","nagaoka","skyanalog","sumiko"].includes(page) ? "active" : ""}">Mærker ▾</span>
            <div class="dropdown-menu">
              ${link("dynavector.html", "dynavector", "Dynavector")}
              ${link("nagaoka.html", "nagaoka", "Nagaoka")}
              ${link("skyanalog.html", "skyanalog", "Skyanalog")}
              ${link("sumiko.html", "sumiko", "Sumiko")}
            </div>
          </div>
          ${link("kabler.html", "kabler", "Kabler")}
          ${link("tilbehor.html", "tilbehor", "Tilbehør")}
        </nav>
        <button class="cart-btn" onclick="openCart()" aria-label="Indkøbskurv">
          Kurv <span class="cart-count" hidden>0</span>
        </button>
      </div>
    </header>`);
  document.body.insertAdjacentHTML("beforeend", `
    <div class="cart-overlay" onclick="closeCart()"></div>
    <aside class="cart-drawer" aria-label="Indkøbskurv">
      <div class="cart-head"><h2>Indkøbskurv</h2><button onclick="closeCart()" aria-label="Luk">✕</button></div>
      <ul id="cart-items"></ul>
      <div class="cart-foot">
        <div class="cart-sum"><span>I alt inkl. moms</span><strong id="cart-total">0 kr.</strong></div>
        <button id="checkout" class="btn btn-primary" onclick="checkout()">Gå til kassen</button>
        <p id="checkout-msg" class="checkout-msg" role="alert" hidden></p>
        <p class="checkout-note">Sikker betaling med kort eller MobilePay via Stripe</p>
        <p class="checkout-terms"><strong>Fri fragt fra 1.000 kr.</strong><br>Ved køb accepterer du vores <a href="handelsbetingelser.html">handelsbetingelser</a>. Læs om <a href="fortrydelse.html">fortrydelsesret</a>.</p>
      </div>
    </aside>
    <footer class="site-footer">
      <div class="wrap footer-inner">
        <div class="company"><strong>Classic HiFi Fidelity ApS</strong><br>Nørre Alle 4, 7400 Herning<br>CVR 46685326<br><a href="tel:+4571903271">71 90 32 71</a> · <a href="mailto:info@classic-hifi.dk">info@classic-hifi.dk</a><br><span class="footer-note">Kun åbent efter forudgående aftale</span></div>
        <div>Fri fragt fra 1.000 kr.<br>14 dages fortrydelsesret<br><a href="handelsbetingelser.html">Handelsbetingelser</a><br><a href="fortrydelse.html">Fortrydelsesret · fortryd et køb</a></div>
        <div><a href="dynavector.html">Dynavector</a><br><a href="nagaoka.html">Nagaoka</a><br><a href="skyanalog.html">Skyanalog</a><br><a href="sumiko.html">Sumiko</a><br><a href="kabler.html">Kabler</a><br><a href="tilbehor.html">Tilbehør</a></div>
      </div>
    </footer>`);
}

// ---------- Produktkort ----------
function productCard(p) {
  return `
  <article class="product" id="${p.id}">
    <div class="product-img">${productImage(p)}</div>
    <div class="product-body">
      <p class="product-type">${p.type}</p>
      <h3>${p.model}</h3>
      <p class="product-desc">${p.desc}</p>
      <dl class="specs">
        ${p.specs
          ? p.specs.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")
          : `<dt>Udgangsspænding</dt><dd>${p.output}</dd>
        <dt>Nål</dt><dd>${p.stylus}</dd>
        <dt>Nålebærer</dt><dd>${p.cantilever}</dd>
        ${p.force ? `<dt>Nåletryk</dt><dd>${p.force}</dd>` : ""}
        <dt>Vægt</dt><dd>${p.weight}</dd>`}
        ${p.headshellPrice && !p.options ? `<dt>Med headshell</dt><dd>${fmt.format(p.headshellPrice)}</dd>` : ""}
        ${p.spare && !p.options ? `<dt>Erstatningsnål</dt><dd>${p.spare} · ${fmt.format(p.sparePrice)}</dd>` : ""}
      </dl>
      ${p.lengths || p.options ? `
      <div class="variants${p.lengths ? "" : " single"}">
        ${p.lengths ? `<label>Længde
          <select id="len-${p.id}" onchange="updateVariantPrice('${p.id}')">
            ${p.lengths.map(([l], i) => `<option value="${i}"${i === defaultLength(p) ? " selected" : ""}>${l}</option>`).join("")}
          </select>
        </label>` : ""}
        ${p.options ? `<label>${p.options.name}
          <select id="con-${p.id}" onchange="chooseOption('${p.id}')">
            ${p.options.required ? `<option value="" selected disabled>Vælg ${p.options.name.toLowerCase()} …</option>` : ""}
            ${p.options.values.map(([c, extra], i) => `<option value="${i}">${c}${p.options.absolute ? ` – ${fmt.format(p.price + extra)}` : extra ? ` (+${fmt.format(extra)})` : ""}</option>`).join("")}
          </select>
        </label>` : ""}
      </div>` : ""}
      <div class="product-foot">
        <span class="price" id="price-${p.id}">${fmt.format(p.lengths ? p.lengths[defaultLength(p)][1] : p.price)}</span>
        <button class="btn btn-primary" onclick="addToCart(${p.lengths || p.options ? `variantKey('${p.id}')` : `'${p.id}'`})">Læg i kurv</button>
      </div>
    </div>
  </article>`;
}

// ---------- Sider ----------
function renderBrandPage(key) {
  const b = BRANDS[key];
  const items = PRODUCTS.filter(p => p.brand === key);
  document.getElementById("brand-intro").innerHTML = `
    <p class="eyebrow">${b.eyebrow || `${b.country} · siden ${b.founded}`}</p>
    <h1>${b.name}</h1>
    <p class="lead">${b.tagline}</p>
    <div class="intro-text">${b.intro.map(t => `<p>${t}</p>`).join("")}</div>`;
  const grid = document.getElementById("product-grid");
  const sortSel = document.getElementById("sort");
  const sortList = list => {
    const sorted = [...list];
    if (sortSel.value === "asc") sorted.sort((a, b) => a.price - b.price);
    if (sortSel.value === "desc") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  };
  const slug = g => "g-" + g.toLowerCase().replace(/[^a-zæøå]+/g, "-");
  if (b.groups) {
    grid.classList.add("grouped");
    document.getElementById("brand-intro").insertAdjacentHTML("beforeend",
      `<nav class="group-nav">${b.groups.map(g => `<a href="#${slug(g)}">${g}</a>`).join("")}</nav>`);
  }
  const draw = () => {
    grid.innerHTML = b.groups
      ? b.groups.map(g => `
        <section class="group" id="${slug(g)}">
          <h3 class="group-title">${g}</h3>
          <div class="grid">${sortList(items.filter(p => p.group === g)).map(productCard).join("")}</div>
        </section>`).join("")
      : sortList(items).map(productCard).join("");
  };
  sortSel.addEventListener("change", draw);
  document.getElementById("count").textContent = `${items.length} ${b.unit || "modeller"}`;
  draw();
  if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
}

function renderHome() {
  const featured = ["dv-xx-2a", "dv-20x2a", "ng-mp-110", "ng-mp-500"].map(id => PRODUCTS.find(p => p.id === id));
  document.getElementById("featured").innerHTML = featured.map(p => `
    <a class="mini" href="${p.brand}.html#${p.id}">
      <div class="product-img">${productImage(p)}</div>
      <div class="mini-body"><strong>${p.model}</strong><span>${fmt.format(p.price)}</span></div>
    </a>`).join("");
}

// ---------- Fortrydelsesfunktion (fortrydelse.html) ----------
// Trin 1: kunden udfylder felterne. Trin 2: kunden bekræfter, og meddelelsen sendes til info@classic-hifi.dk.
function setupWithdrawForm() {
  const form = document.getElementById("withdraw-form"), box = document.getElementById("withdraw-confirm");
  if (!form) return;
  const esc = t => t.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  form.addEventListener("submit", e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const varer = d.varer.trim() || "Alle varer i ordren";
    const text = `Jeg meddeler herved, at jeg ønsker at gøre fortrydelsesretten gældende for følgende køb:\n\nOrdre: ${d.ordre}\nVarer: ${varer}\nNavn: ${d.navn}\nE-mail: ${d.email}\nDato: ${new Date().toLocaleDateString("da-DK")}`;
    const mail = `mailto:info@classic-hifi.dk?subject=${encodeURIComponent("Fortrydelse af køb – ordre " + d.ordre)}&body=${encodeURIComponent(text)}`;
    box.innerHTML = `<p><strong>Bekræft at du vil fortryde købet</strong></p>
      <p>Ordre ${esc(d.ordre)} · ${esc(varer)}<br>${esc(d.navn)} · ${esc(d.email)}</p>
      <a class="btn btn-primary" id="withdraw-send" href="${mail}">Bekræft fortrydelse</a>
      <button class="btn" type="button" onclick="this.parentElement.hidden = true">Ret oplysninger</button>`;
    box.hidden = false;
    form.hidden = true;
    document.getElementById("withdraw-send").addEventListener("click", () => {
      box.innerHTML = `<p><strong>Dit e-mailprogram åbner nu med din fortrydelse.</strong> Tryk send i e-mailen. Når vi har modtaget den, bekræfter vi din fortrydelse på e-mail.</p>
        <p>Åbnede der ikke en e-mail? Så send teksten herunder til <a href="mailto:info@classic-hifi.dk">info@classic-hifi.dk</a>.</p>
        <pre style="white-space:pre-wrap;font:inherit;background:#fff;padding:12px;border-radius:6px">${esc(text)}</pre>`;
    });
    box.querySelector("button").addEventListener("click", () => { form.hidden = false; });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderChrome();
  const page = document.body.dataset.page;
  if (page === "home") renderHome();
  if (BRANDS[page]) renderBrandPage(page);
  if (page === "tak") { cart = {}; saveCart(cart); }
  setupWithdrawForm();
  renderCart();
  // Tilbage fra Stripe med browserens tilbage-knap: nulstil knappen.
  window.addEventListener("pageshow", () => { const b = document.getElementById("checkout"); if (b) b.textContent = "Gå til kassen"; renderCart(); });
  document.addEventListener("keydown", e => e.key === "Escape" && closeCart());
});
