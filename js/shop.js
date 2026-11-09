// Fælles logik: menu, produktvisning og indkøbskurv.

const fmt = new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK", maximumFractionDigits: 0 });

// ---------- Produktbillede (SVG-illustration) ----------
// Udskift med rigtige fotos ved at tilføje fx  image: "img/dv-xx-2a.jpg"  på produktet.
function productImage(p) {
  if (p.image) return `<img src="${p.image}" alt="${p.model}" loading="lazy">`;
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

function addToCart(id) {
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
  const items = Object.entries(cart).map(([id, qty]) => ({ p: PRODUCTS.find(x => x.id === id), qty })).filter(x => x.p);
  const count = items.reduce((s, x) => s + x.qty, 0);
  const total = items.reduce((s, x) => s + x.qty * x.p.price, 0);
  document.querySelectorAll(".cart-count").forEach(el => { el.textContent = count; el.hidden = count === 0; });
  const list = document.getElementById("cart-items");
  if (!list) return;
  list.innerHTML = items.length
    ? items.map(({ p, qty }) => `
      <li class="cart-item">
        <div class="cart-thumb">${productImage(p)}</div>
        <div class="cart-info">
          <strong>${p.model}</strong>
          <span>${fmt.format(p.price)}</span>
          <div class="qty">
            <button onclick="changeQty('${p.id}',-1)" aria-label="Færre">−</button>
            <span>${qty}</span>
            <button onclick="changeQty('${p.id}',1)" aria-label="Flere">+</button>
          </div>
        </div>
      </li>`).join("")
    : `<li class="cart-empty">Din kurv er tom.</li>`;
  document.getElementById("cart-total").textContent = fmt.format(total);
  document.getElementById("checkout").disabled = items.length === 0;
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
        <a href="index.html" class="logo"><span class="logo-disc"></span>Nålen &amp; Rillen</a>
        <button class="menu-toggle" aria-label="Menu" onclick="document.body.classList.toggle('menu-open')">☰</button>
        <nav class="main-nav">
          ${link("index.html", "home", "Forside")}
          <div class="dropdown">
            <span class="${page === "dynavector" || page === "nagaoka" ? "active" : ""}">Brands ▾</span>
            <div class="dropdown-menu">
              ${link("dynavector.html", "dynavector", "Dynavector")}
              ${link("nagaoka.html", "nagaoka", "Nagaoka")}
            </div>
          </div>
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
        <button id="checkout" class="btn btn-primary" onclick="alert('Kassen er ikke koblet på endnu – her skal betaling (fx Stripe, QuickPay eller MobilePay) tilsluttes.')">Gå til kassen</button>
      </div>
    </aside>
    <footer class="site-footer">
      <div class="wrap footer-inner">
        <div><strong>Nålen &amp; Rillen</strong><br>Pickupper til pladespillere</div>
        <div>Fri fragt over 1.000 kr.<br>30 dages returret</div>
        <div><a href="dynavector.html">Dynavector</a><br><a href="nagaoka.html">Nagaoka</a></div>
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
        <dt>Udgangsspænding</dt><dd>${p.output}</dd>
        <dt>Nål</dt><dd>${p.stylus}</dd>
        <dt>Nålebærer</dt><dd>${p.cantilever}</dd>
        <dt>Vægt</dt><dd>${p.weight}</dd>
      </dl>
      <div class="product-foot">
        <span class="price">${fmt.format(p.price)}</span>
        <button class="btn btn-primary" onclick="addToCart('${p.id}')">Læg i kurv</button>
      </div>
    </div>
  </article>`;
}

// ---------- Sider ----------
function renderBrandPage(key) {
  const b = BRANDS[key];
  const items = PRODUCTS.filter(p => p.brand === key);
  document.getElementById("brand-intro").innerHTML = `
    <p class="eyebrow">${b.country} · siden ${b.founded}</p>
    <h1>${b.name}</h1>
    <p class="lead">${b.tagline}</p>
    <div class="intro-text">${b.intro.map(t => `<p>${t}</p>`).join("")}</div>`;
  const grid = document.getElementById("product-grid");
  const sortSel = document.getElementById("sort");
  const draw = () => {
    const sorted = [...items];
    if (sortSel.value === "asc") sorted.sort((a, b) => a.price - b.price);
    if (sortSel.value === "desc") sorted.sort((a, b) => b.price - a.price);
    grid.innerHTML = sorted.map(productCard).join("");
  };
  sortSel.addEventListener("change", draw);
  document.getElementById("count").textContent = `${items.length} modeller`;
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

document.addEventListener("DOMContentLoaded", () => {
  renderChrome();
  const page = document.body.dataset.page;
  if (page === "home") renderHome();
  if (BRANDS[page]) renderBrandPage(page);
  renderCart();
  document.addEventListener("keydown", e => e.key === "Escape" && closeCart());
});
