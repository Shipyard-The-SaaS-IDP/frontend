function ShipyardMark() {
  return (
    <svg width={28} height={28} viewBox="0 0 72 72" fill="none">
      <rect width="72" height="72" rx="18" fill="#00E87A" />
      <path d="M53.4147 23.6177C54.6082 16.8494 48.567 10.7994 40.6885 9.41019C30.8404 7.67371 22.9238 12.2596 21.5599 19.9948C20.196 27.73 26.4077 32.8132 35.9148 36.4835C45.4219 40.1537 51.6335 45.2369 50.2696 52.9721C48.9057 60.7073 41.1596 64.3263 31.3115 62.5898C21.4634 60.8533 15.4222 54.8033 16.6157 48.035" stroke="#0A2463" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export default function OnboardingHeader({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div style={{ height: 64, borderBottom: '1px solid #EAEAEA', display: 'flex', alignItems: 'center', padding: '0 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <ShipyardMark />
        <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 17, color: '#0A2463', letterSpacing: '-0.02em' }}>Shipyard</span>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {[1, 2, 3].map((d) => (
          <span key={d} style={{ width: 26, height: 5, borderRadius: 999, background: d <= step ? '#00E87A' : '#EAEAEA' }} />
        ))}
      </div>
    </div>
  );
}
