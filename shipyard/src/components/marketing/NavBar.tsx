import { Anchor } from 'lucide-react';

export function NavBar({ onJoinClick }: { onJoinClick: () => void }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-6 pt-4">
      <nav className="flex h-[52px] w-full max-w-[1080px] items-center justify-between rounded-[14px] border border-white/[0.07] bg-[rgba(17,17,24,0.7)] pl-3.5 pr-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-[20px] backdrop-saturate-[160%]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px]" style={{ background: '#6366F1' }}>
            <Anchor size={14} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-heading text-[15px] font-semibold tracking-[-0.01em] text-[#F1F5F9]">Shipyard</span>
        </div>
        <div className="flex items-center gap-1">
          <a href="#tour" className="nav-link rounded-lg px-3.5 py-[7px] text-[13.5px] text-[#94A3B8] no-underline transition-colors">
            Product
          </a>
          <a href="#how-it-works" className="nav-link rounded-lg px-3.5 py-[7px] text-[13.5px] text-[#94A3B8] no-underline transition-colors">
            How it works
          </a>
          <button
            onClick={onJoinClick}
            className="ml-1.5 flex items-center gap-1.5 rounded-[9px] border-none px-4 py-2 text-[13.5px] font-semibold text-[#0A0A0F] transition-opacity hover:opacity-85"
            style={{ background: '#F1F5F9' }}
          >
            Join waitlist
          </button>
        </div>
      </nav>
    </div>
  );
}
