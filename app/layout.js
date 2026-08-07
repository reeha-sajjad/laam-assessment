import "./globals.css";

export const metadata = {
  title: "LAAM | Product",
  description: "South Asian fashion, without the guesswork.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#faf8f5] text-[#1a1a1a]">
        <header className="border-b border-black/10 sticky top-0 bg-[#faf8f5]/90 backdrop-blur z-20">
          <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
            <a href="/" className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
              LAAM
            </a>
            <nav className="hidden sm:flex items-center gap-6 text-sm text-black/60">
              <span>Women</span>
              <span>Men</span>
              <span>Sale</span>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-black/10 mt-16">
          <div className="max-w-6xl mx-auto px-5 py-8 text-xs text-black/40">
            Demo build for assessment purposes — not a real storefront.
          </div>
        </footer>
      </body>
    </html>
  );
}
