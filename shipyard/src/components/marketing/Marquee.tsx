import { Reveal } from './Reveal';
import { ROW1, ROW2, ROW3, type LogoItem } from './logos';

function LogoCard({ name, icon }: LogoItem) {
  return (
    <div
      className="flex shrink-0 select-none items-center gap-2.5 rounded-2xl border bg-white px-6 py-3.5 grayscale opacity-55 transition-all duration-200 hover:grayscale-0 hover:opacity-100 hover:-translate-y-0.5"
      style={{ borderColor: '#EAEAEA', boxShadow: 'none' }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 26px -14px rgba(10,36,99,0.4)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">{icon}</span>
      <span className="whitespace-nowrap font-heading text-[18px] font-bold tracking-[-0.01em]" style={{ color: '#0A2463' }}>{name}</span>
    </div>
  );
}

const maskStyle = { WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' };

export function IntegrationsMarquee() {
  const rowA = [...ROW1, ...ROW2];
  const rowB = [...ROW3, ...ROW1.slice(0, 4)];

  return (
    <section id="integrations" className="border-y" style={{ background: '#FAFAFA', borderColor: '#EAEAEA' }}>
      <div className="mx-auto max-w-[1180px] px-8 pb-[30px] pt-[84px] text-center">
        <Reveal>
          <p className="mb-[14px] font-mono text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#00C9A7' }}>Integrations</p>
          <h2 className="mb-4 font-heading text-[38px] font-bold leading-[1.1] tracking-[-0.025em]" style={{ color: '#0A2463', textWrap: 'balance' }}>
            Connects to the tools you already use.
          </h2>
          <p className="mx-auto max-w-[600px] text-[17px] leading-[1.6]" style={{ color: '#6B6B6B' }}>
            GitHub, Slack, GCP, and more, all connected directly. No middleman, no extra setup.
          </p>
        </Reveal>
      </div>
      <Reveal className="pb-[84px]">
        <div className="flex flex-col gap-[18px]" style={{ WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}>
          <div className="overflow-hidden" style={maskStyle}>
            <div className="animate-marquee flex flex-nowrap gap-4" style={{ animationDuration: '44s' }}>
              {[...rowA, ...rowA, ...rowA].map((item, i) => <LogoCard key={i} {...item} />)}
            </div>
          </div>
          <div className="overflow-hidden" style={maskStyle}>
            <div className="animate-marquee-reverse flex flex-nowrap gap-4" style={{ animationDuration: '52s' }}>
              {[...rowB, ...rowB, ...rowB].map((item, i) => <LogoCard key={i} {...item} />)}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
