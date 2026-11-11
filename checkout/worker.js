// Cloudflare Worker: opretter en Stripe Checkout-betaling ud fra kurven.
//
// Priserne tages ALDRIG fra browseren. Workeren henter prices.json fra webshoppen
// og regner selv hver linje ud, så ingen kan ændre prisen i kurven.
//
// Opsætning (se checkout/OPSAETNING.md):
//   Secret:    STRIPE_SECRET_KEY   (sk_test_… til test, sk_live_… når shoppen åbner)
//   Variabler: SHOP_URL            fx https://ole-lgtm.github.io/web-pickup
//              SHIPPING_DKK        fragt under grænsen, fx 49
//              FREE_SHIPPING_DKK   grænse for fri fragt, fx 1000

const MAX_QTY = 10;

export default {
  async fetch(request, env) {
    const shop = (env.SHOP_URL || "").replace(/\/$/, "");
    const origin = request.headers.get("Origin") || "";
    const allowed = origin && (shop.startsWith(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin));
    const cors = {
      "Access-Control-Allow-Origin": allowed ? origin : shop,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    };
    const reply = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return reply({ error: "Brug POST" }, 405);
    if (!allowed) return reply({ error: "Ukendt afsender" }, 403);
    if (!env.STRIPE_SECRET_KEY || !shop) return reply({ error: "Betaling er ikke sat op endnu" }, 500);

    let body;
    try { body = await request.json(); } catch { return reply({ error: "Ugyldig forespørgsel" }, 400); }
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length || items.length > 50) return reply({ error: "Kurven er tom" }, 400);

    // Priser fra den offentliggjorte webshop (caches i 60 sek.).
    const res = await fetch(`${shop}/prices.json`, { cf: { cacheTtl: 60, cacheEverything: true } });
    if (!res.ok) return reply({ error: "Kunne ikke hente priser" }, 502);
    const prices = await res.json();

    const lines = [];
    for (const { key, qty } of items) {
      const line = priceLine(prices, String(key));
      const n = Number(qty);
      if (!line || !Number.isInteger(n) || n < 1 || n > MAX_QTY) {
        return reply({ error: "En vare i kurven findes ikke længere. Tøm kurven og prøv igen." }, 400);
      }
      lines.push({ ...line, qty: n });
    }
    const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
    // Kurven viser en anden pris end prislisten (fx lige efter en prisændring): stop hellere end at tage forkert betaling.
    if (body.total !== undefined && Number(body.total) !== total) {
      return reply({ error: "Priserne er netop blevet opdateret. Genindlæs siden og prøv igen." }, 409);
    }
    const shipping = total >= Number(env.FREE_SHIPPING_DKK || 1000) ? 0 : Number(env.SHIPPING_DKK || 0);

    // Kunden sendes tilbage til den side, de kom fra, hvis de fortryder.
    const back = typeof body.returnUrl === "string" && body.returnUrl.startsWith(shop + "/") ? body.returnUrl : `${shop}/`;
    const local = /^http:\/\/(localhost|127\.0\.0\.1)/.test(origin);
    const base = local ? origin : shop;

    const form = new URLSearchParams({
      mode: "payment",
      locale: "da",
      success_url: `${base}/tak.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: local ? `${origin}/` : back,
      "shipping_address_collection[allowed_countries][0]": "DK",
      "phone_number_collection[enabled]": "true",
      "shipping_options[0][shipping_rate_data][type]": "fixed_amount",
      "shipping_options[0][shipping_rate_data][display_name]": shipping ? "Forsendelse" : "Fri fragt",
      "shipping_options[0][shipping_rate_data][fixed_amount][amount]": String(shipping * 100),
      "shipping_options[0][shipping_rate_data][fixed_amount][currency]": "dkk",
    });
    lines.forEach((l, i) => {
      form.set(`line_items[${i}][quantity]`, String(l.qty));
      form.set(`line_items[${i}][price_data][currency]`, "dkk");
      form.set(`line_items[${i}][price_data][unit_amount]`, String(l.price * 100));
      form.set(`line_items[${i}][price_data][product_data][name]`, l.name);
      form.set(`line_items[${i}][price_data][product_data][metadata][key]`, l.key);
    });

    const stripe = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    const session = await stripe.json();
    if (!stripe.ok) return reply({ error: "Stripe afviste betalingen", detail: session.error && session.error.message }, 502);
    return reply({ url: session.url });
  },
};

// Samme regel som cartLine() i js/shop.js, men streng: ukendte valg afvises.
function priceLine(prices, key) {
  const [id, li, ci] = key.split("|");
  const p = Object.prototype.hasOwnProperty.call(prices, id) ? prices[id] : null;
  if (!p) return null;
  let name = p.name, price = p.price;
  if (p.lengths) {
    const len = p.lengths[Number(li || 0)];
    if (!len) return null;
    name += ` · ${len[0]}`;
    price = len[1];
  }
  if (p.options) {
    if (ci === undefined || ci === "") return null;
    const opt = p.options[Number(ci)];
    if (!opt) return null;
    name += ` · ${opt[0]}`;
    price += opt[1];
  }
  if (!Number.isInteger(price) || price <= 0) return null;
  return { key, name, price };
}
