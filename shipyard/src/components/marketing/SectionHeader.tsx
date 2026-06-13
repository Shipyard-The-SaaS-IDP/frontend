import { Reveal } from './Reveal';

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  maxWidth = 520,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: 'center' | 'left';
  maxWidth?: number;
}) {
  const centered = align === 'center';
  return (
    <Reveal className={centered ? 'mx-auto mb-14 max-w-2xl text-center' : 'mb-14'}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#818CF8]">{eyebrow}</p>
      <h2 className="font-heading text-[clamp(28px,3.6vw,44px)] font-bold leading-[1.1] tracking-[-0.03em] text-[#F1F5F9]">
        {title}
      </h2>
      {description && (
        <p
          className="mt-4 text-base leading-relaxed text-[#64748B]"
          style={{ maxWidth, margin: centered ? '16px auto 0' : '16px 0 0' }}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
