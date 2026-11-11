// Bygger prices.json ud fra produktfilerne, så betalings-Workeren kan tjekke priserne.
// Kør efter hver prisændring:  osascript -l JavaScript tools/build-prices.js "$(pwd)"
ObjC.import("Foundation");
function run(argv) {
  const root = argv[0] || ".";
  const read = f => $.NSString.stringWithContentsOfFileEncodingError(`${root}/${f}`, $.NSUTF8StringEncoding, null).js;
  const src = ["js/products.js", "js/cardas.js", "js/skyanalog.js", "js/sumiko.js"].map(read).join("\n;\n");
  const out = eval(src + `
    ;"{\\n" + PRODUCTS.map(p => JSON.stringify(p.id) + ": " + JSON.stringify(Object.assign(
      { name: p.model, price: p.price },
      p.lengths ? { lengths: p.lengths } : {},
      p.options ? { options: p.options.values } : {}))).join(",\\n") + "\\n}"`);
  $.NSString.alloc.initWithUTF8String(out + "\n").writeToFileAtomicallyEncodingError(`${root}/prices.json`, true, $.NSUTF8StringEncoding, null);
  return "prices.json: " + Object.keys(JSON.parse(out)).length + " produkter";
}
