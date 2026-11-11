# Betaling med Stripe – opsætning

Webshoppen ligger på GitHub Pages, som ikke kan køre kode på en server. Derfor sker betalingen via en lille
**Cloudflare Worker** (`checkout/worker.js`):

1. Kunden trykker "Gå til kassen". Kurven sendes til Workeren.
2. Workeren henter `prices.json` fra webshoppen og regner selv priserne ud. Priser fra browseren bruges aldrig.
3. Workeren opretter en Stripe Checkout-betaling og sender kunden videre til Stripes betalingsside.
   Her vælger kunden kort, MobilePay, Apple Pay eller Google Pay og skriver sin leveringsadresse.
4. Når betalingen er gennemført, kommer kunden tilbage til `tak.html`, og kurven bliver tømt.
   Ordren ses i Stripe under **Betalinger**, med varer, adresse, telefon og mail.

Begge tjenester er gratis at oprette. Stripe tager et gebyr pr. betaling, og Cloudflare Workers er gratis
op til 100.000 forespørgsler om dagen.

---

## 1. Stripe

1. Opret en konto på <https://dashboard.stripe.com/register> med firmaets oplysninger (CVR, bankkonto).
2. **Indstillinger → Betalingsmetoder**: slå de metoder til, I vil tilbyde, fx kort, **MobilePay**, Apple Pay og Google Pay.
3. **Indstillinger → Kunde-e-mails**: slå "Gennemførte betalinger" til, så kunden får en kvittering.
4. **Indstillinger → Virksomhed → Offentlige oplysninger**: skriv navnet, som kunden skal se på betalingssiden,
   fx *Classic HiFi Fidelity*. Upload eventuelt logoet under **Branding**.
5. Slå **Testtilstand** til (øverst til højre) og gå til **Udviklere → API-nøgler**.
   Kopiér den **hemmelige nøgle**, som starter med `sk_test_`.
   Den hemmelige nøgle må aldrig stå på hjemmesiden. Den skal kun ind i Cloudflare, som beskrevet nedenfor.

## 2. Cloudflare Worker

1. Opret en gratis konto på <https://dash.cloudflare.com/sign-up>.
2. Vælg **Workers & Pages → Opret → Worker**. Kald den fx `classic-hifi-checkout` og tryk **Implementér**.
3. Tryk **Redigér kode**, slet koden der står, indsæt hele indholdet af `checkout/worker.js`, og tryk **Implementér**.
4. Gå til Workerens **Indstillinger → Variabler og hemmeligheder** og tilføj:

   | Navn | Type | Værdi |
   |---|---|---|
   | `STRIPE_SECRET_KEY` | **Hemmelighed** | nøglen fra Stripe (`sk_test_…`) |
   | `SHOP_URL` | Tekst | `https://ole-lgtm.github.io/web-pickup` |
   | `SHIPPING_DKK` | Tekst | fragtprisen under grænsen, fx `49` |
   | `FREE_SHIPPING_DKK` | Tekst | `1000` (fri fragt fra 1.000 kr.) |

5. Kopiér Workerens adresse, fx `https://classic-hifi-checkout.<jeres-navn>.workers.dev`.

## 3. Koble webshoppen på

Sæt adressen ind øverst i betalingsdelen af `js/shop.js`:

```js
const CHECKOUT_URL = "https://classic-hifi-checkout.<jeres-navn>.workers.dev";
```

## 4. Test

Læg en vare i kurven og gå til kassen. På Stripes testside kan I betale med testkortet
`4242 4242 4242 4242`, en udløbsdato i fremtiden og en vilkårlig CVC. Ordren skal derefter vises i Stripe
under **Betalinger** (i testtilstand).

## 5. Gå live

1. Gør Stripe-kontoen færdig, så den er aktiveret til rigtige betalinger.
2. Slå testtilstand fra og kopiér den rigtige hemmelige nøgle (`sk_live_…`).
3. Erstat `STRIPE_SECRET_KEY` i Cloudflare med den nye nøgle.
4. Hvis shoppen flytter til fx `shop.classic-hifi.dk`, skal `SHOP_URL` ændres til den nye adresse.

Før shoppen åbner, skal der også være handelsbetingelser, CVR-nummer, adresse og en side om
fortrydelsesret på hjemmesiden.

---

## Når priser ændres

`prices.json` er den prisliste, Workeren regner ud fra. Den skal bygges igen, hver gang en pris eller en
vare ændres i `js/`:

```sh
osascript -l JavaScript tools/build-prices.js "$(pwd)"
```

Hvis den ikke bliver bygget igen, kan kunden ikke betale for nye eller ændrede varer. Workeren tjekker,
at totalen i kurven passer med prislisten, og stopper betalingen, hvis de ikke stemmer overens.
