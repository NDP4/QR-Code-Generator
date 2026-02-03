import QRCodeGenerator from "@/components/QRCodeGenerator";
import { ScanQrCode } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#fafafa] dark:bg-zinc-950 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/50 dark:bg-purple-900/20 rounded-full blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-blue-200/50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-pink-200/50 dark:bg-pink-900/20 rounded-full blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      <div className="z-10 w-full max-w-6xl flex flex-col items-center gap-8">
        <header className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl mb-2 ring-1 ring-zinc-200 dark:ring-zinc-800">
            <ScanQrCode className="w-12 h-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 stroke-[url(#gradient)]" style={{ stroke: "url(#gradient-swatch)" }} />
            {/* SVG Gradient Definition for Icon */}
            <svg width="0" height="0" className="absolute">
              <linearGradient id="gradient-swatch" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop stopColor="#7c3aed" offset="0%" />
                <stop stopColor="#2563eb" offset="100%" />
              </linearGradient>
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Artistic QR <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Generator</span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Create stunning, customized QR codes for your brand. Fully client-side, secure, and fast.
          </p>
        </header>

        <QRCodeGenerator />

        <footer className="mt-16 text-center text-sm text-zinc-500 dark:text-zinc-500">
          <p>Built with Next.js, Shadcn UI & QRCode Styling.</p>
        </footer>
      </div>
    </main>
  );
}
