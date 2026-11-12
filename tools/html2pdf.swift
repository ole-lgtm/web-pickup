import AppKit
import WebKit
let args = CommandLine.arguments
let input = URL(fileURLWithPath: args[1]), output = URL(fileURLWithPath: args[2])
class D: NSObject, WKNavigationDelegate {
  func webView(_ w: WKWebView, didFinish n: WKNavigation!) {
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
      let info = NSPrintInfo()
      info.paperSize = NSSize(width: 595.28, height: 841.89)
      info.topMargin = 40; info.bottomMargin = 40; info.leftMargin = 40; info.rightMargin = 40
      info.horizontalPagination = .fit; info.verticalPagination = .automatic
      info.jobDisposition = .save
      info.dictionary()[NSPrintInfo.AttributeKey.jobSavingURL] = output
      let op = w.printOperation(with: info)
      op.showsPrintPanel = false; op.showsProgressPanel = false
      op.view?.frame = w.bounds
      op.runModal(for: win, delegate: self, didRun: #selector(self.done), contextInfo: nil)
    }
  }
  @objc func done() { exit(0) }
}
let app = NSApplication.shared
let win = NSWindow(contentRect: NSRect(x: 0, y: 0, width: 800, height: 1000), styleMask: [.borderless], backing: .buffered, defer: false)
let web = WKWebView(frame: win.contentView!.bounds)
win.contentView!.addSubview(web)
let d = D(); web.navigationDelegate = d
web.loadFileURL(input, allowingReadAccessTo: input.deletingLastPathComponent())
DispatchQueue.main.asyncAfter(deadline: .now() + 30) { print("timeout"); exit(1) }
app.run()
