# Betaling med Stripe – opsætning

Webshoppen ligger på GitHub Pages, som ikke kan køre kode på en server. Derfor sker betalingen via en lille
**Cloudflare Worker** (`checkout/worker.js`):

1. Kunden trykker "Gå til kassen". Kurven sendes til Workeren.
2. Workeren henter `prices.json` fra webshoppen og regner selv priserne ud. Priser fra browseren bruges aldrig.
3. Workeren opretter en Stripe Checkout-betaling og sender kunden videre til Stripes betalingsside.
   Her vælger kunden kort, MobilePay, Apple Pay eller Google Pay og skriver sin leveringsadresse.
4. Når kunden har gennemført betalingen, kommer kunden tilbage til `tak.html`, og kurven bliver tømt.
   Ordren ses i Stripe under **Betalinger**, med varer, adresse, telefon og mail.
5. Beløbet er kun **reserveret**. I hæver det i Stripe, når I sender varen (se "Daglig drift" nederst).

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

5. Til fortrydelsesknappen (se afsnit 2b) tilføjes også:

   | Navn | Type | Værdi |
   |---|---|---|
   | `RESEND_API_KEY` | **Hemmelighed** | nøglen fra Resend (`re_…`) |
   | `MAIL_FROM` | Tekst | `Classic HiFi Fidelity <ordre@classic-hifi.dk>` |
   | `SHOP_EMAIL` | Tekst | `info@classic-hifi.dk` |

6. Kopiér Workerens adresse, fx `https://classic-hifi-checkout.<jeres-navn>.workers.dev`.

## 2b. E-mail til fortrydelser (Resend)

Siden 19. juni 2026 skal kunden kunne fortryde direkte på siden og straks få en kvittering med indhold, dato
og klokkeslæt. Workeren sender kvitteringen til kunden og en kopi til `SHOP_EMAIL` via mailtjenesten Resend
(gratis op til 3.000 mails om måneden).

1. Opret en konto på <https://resend.com>.
2. **Domains → Add domain**: tilføj `classic-hifi.dk`. Resend viser nogle DNS-poster, som skal lægges ind hos
   jeres domæneudbyder (Simply). Når de er godkendt, kan Workeren sende fra fx `ordre@classic-hifi.dk`.
3. **API Keys → Create**: kopiér nøglen og læg den i Cloudflare som `RESEND_API_KEY`.

Indtil Resend er sat op, åbner knappen kundens eget e-mailprogram med en udfyldt besked i stedet. Så skal I selv
svare med en kvittering med det samme.

## 3. Koble webshoppen på

Sæt adressen ind øverst i betalingsdelen af `js/shop.js`:

```js
const CHECKOUT_URL = "https://classic-hifi-checkout.<jeres-navn>.workers.dev";
```

## 4. Test

Læg en vare i kurven og gå til kassen. På Stripes testside kan I betale med testkortet
`4242 4242 4242 4242`, en udløbsdato i fremtiden og en vilkårlig CVC. Ordren skal derefter vises i Stripe
under **Betalinger** (i testtilstand) som **Ikke hævet**. Prøv også at hæve den.

Test fortrydelsesknappen på `fortrydelse.html` med jeres egen mail. Der skal komme en kvittering til den mail,
I skrev, og en kopi til `SHOP_EMAIL`.

## 5. Gå live

1. Gør Stripe-kontoen færdig, så den er aktiveret til rigtige betalinger.
2. Slå testtilstand fra og kopiér den rigtige hemmelige nøgle (`sk_live_…`).
3. Erstat `STRIPE_SECRET_KEY` i Cloudflare med den nye nøgle.
4. Hvis shoppen flytter til fx `shop.classic-hifi.dk`, skal `SHOP_URL` ændres til den nye adresse.

Firmaoplysninger, handelsbetingelser og fortrydelsesret er på plads på hjemmesiden.

---

## Daglig drift

**Når der kommer en ordre**
1. Send en ordrebekræftelse samme dag med skabelonen i `checkout/ordrebekraeftelse.md`, og vedhæft altid
   `docs/handelsbetingelser-og-fortrydelsesret.pdf`.

**Når I sender varen**
1. Åbn betalingen i Stripe under **Betalinger** og tryk **Hæv** (Capture). Først nu trækkes pengene.
2. Hæv senest 7 dage efter ordren. Ellers bortfalder reservationen, og kunden skal betale igen.
   Skal en vare bestilles hjem og tager længere tid, så aftal det med kunden.

**Når en kunde fortryder**
1. Bekræft med det samme på mail, hvis kvitteringen ikke er sendt automatisk.
2. Er beløbet ikke hævet endnu: annullér betalingen i Stripe. Er det hævet: **Refunder**, når varen er modtaget
   (eller kunden har vist, at den er sendt), og senest 14 dage efter fortrydelsen.

**Når betingelserne ændres**
Byg PDF'en igen, så den passer med siderne:

```sh
sh tools/build-vilkaar-pdf.sh
```

---

## Når priser ændres

`prices.json` er den prisliste, Workeren regner ud fra. Den skal bygges igen, hver gang en pris eller en
vare ændres i `js/`:

```sh
osascript -l JavaScript tools/build-prices.js "$(pwd)"
```

Hvis den ikke bliver bygget igen, kan kunden ikke betale for nye eller ændrede varer. Workeren tjekker,
at totalen i kurven passer med prislisten, og stopper betalingen, hvis de ikke stemmer overens.
