import { Reveal } from './Reveal';
import { ROW0, ROW1, ROW2, ROW3, type LogoItem } from './logos';

function LogoCard({ name, icon, bg }: LogoItem) {
  return (
    <div className="flex shrink-0 select-none items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-[18px] py-2.5">
      <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border border-white/[0.07]" style={{ background: bg }}>
        {icon}
      </div>
      <span className="whitespace-nowrap text-[13px] font-medium text-[#94A3B8]">{name}</span>
    </div>
  );
}

const maskStyle = { WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' };

export function IntegrationsMarquee() {
  return (
    <section className="py-[90px] text-center">
      <Reveal>
        <p className="mb-11 text-xs font-semibold uppercase tracking-[0.12em] text-[#334155]">
          Connects to everything you&apos;re already using
        </p>
      </Reveal>
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden" style={maskStyle}>
          <div className="animate-marquee-reverse flex flex-nowrap gap-3" style={{ animationDuration: '34s' }}>
            {[...ROW0, ...ROW0, ...ROW0, ...ROW0].map((item, i) => (
              <LogoCard key={i} {...item} />
            ))}
          </div>
        </div>
        <div className="overflow-hidden" style={maskStyle}>
          <div className="animate-marquee flex flex-nowrap gap-3">
            {[...ROW1, ...ROW1, ...ROW1, ...ROW1].map((item, i) => (
              <LogoCard key={i} {...item} />
            ))}
          </div>
        </div>
        <div className="overflow-hidden" style={maskStyle}>
          <div className="animate-marquee-reverse flex flex-nowrap gap-3">
            {[...ROW2, ...ROW2, ...ROW2, ...ROW2].map((item, i) => (
              <LogoCard key={i} {...item} />
            ))}
          </div>
        </div>
        <div className="overflow-hidden" style={maskStyle}>
          <div className="animate-marquee flex flex-nowrap gap-3" style={{ animationDuration: '30s' }}>
            {[...ROW3, ...ROW3, ...ROW3, ...ROW3].map((item, i) => (
              <LogoCard key={i} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
