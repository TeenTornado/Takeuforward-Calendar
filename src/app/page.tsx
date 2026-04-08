import Image from "next/image";
import { Calendar } from "@/components/Calendar";
import { DSADonut } from "@/components/DSADonut";
import { QuoteCard } from "@/components/QuoteCard";
import { UpcomingHolidays } from "@/components/UpcomingHolidays";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-white selection:bg-brand-red selection:text-brand-white">
      {/* Editorial Navigation */}
      <nav className="border-b border-brand-border px-4 py-4 sm:px-8 sm:py-6 md:px-12 md:py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/TakeuforwardLogo.png"
            alt="TakeUforward"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          />
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-tighter">
            TakeUForward <span className="text-brand-red">.</span>
          </h1>
        </div>
        <a
          href="https://takeuforward.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-brand-white/30 hover:text-brand-red transition-colors"
        >
          takeuforward.org
        </a>
      </nav>

      <div className="flex flex-col min-h-[calc(100vh-70px)] sm:min-h-[calc(100vh-90px)]">
        {/* Main Content Area */}
        <div className="flex-1 p-4 sm:p-6 md:p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 md:space-y-12">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
              <div className="xl:col-span-2">
                <Calendar />
              </div>
              <div className="space-y-6 sm:space-y-8 md:space-y-12">
                <QuoteCard />
                <DSADonut progress={73} />
                <UpcomingHolidays />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-brand-border px-4 sm:px-8 md:px-12 py-4 sm:py-6 flex justify-between items-center text-[10px] uppercase font-bold text-brand-white/20 tracking-widest">
        <div className="flex items-center gap-2">
          <Image
            src="/TakeuforwardLogo.png"
            alt="TUF"
            width={16}
            height={16}
            className="w-4 h-4 opacity-40"
          />
          <span>© 2026 TakeUForward V3</span>
        </div>
        <span className="hidden sm:inline">Built with Next.js</span>
      </footer>
    </main>
  );
}
