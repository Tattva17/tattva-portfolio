export default function Artwork({
  kind,
  step = 0,
}: {
  kind: string;
  step?: number;
}) {
  return (
    <svg
      className={`project-art art-${kind}`}
      viewBox="0 0 240 160"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle className="art-backdrop" cx="120" cy="80" r="65" />
      {kind === "think" ? (
        <>
          <path d="M50 80L95 43L147 60L190 38M50 80L102 117L147 60L187 111M95 43L102 117L187 111M50 80L147 60" />
          {[
            [50, 80],
            [95, 43],
            [147, 60],
            [190, 38],
            [102, 117],
            [187, 111],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="7" className="art-node" />
          ))}
        </>
      ) : kind === "research" ? (
        <>
          <path d="M40 120H200M50 125V35" />
          <path
            d={
              step === 1
                ? "M65 95L95 55L125 83L157 47L188 65"
                : "M65 95L95 83L125 55L157 75L188 38"
            }
          />
          {[
            [65, 95],
            [95, 83],
            [125, 55],
            [157, 75],
            [188, 38],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="5" className="art-node" />
          ))}
        </>
      ) : kind === "fab" ? (
        <>
          <rect x="80" y="40" width="80" height="80" rx="10" />
          <rect x="97" y="57" width="46" height="46" rx="3" />
          {[90, 110, 130, 150].map((n) => (
            <path
              key={n}
              d={`M${n} 28v12M${n} 120v12M68 ${n - 50}h12M160 ${n - 50}h12`}
            />
          ))}
          <path d="M109 80h22M120 69v22" />
        </>
      ) : kind === "robot" || kind === "build" ? (
        <>
          <rect x="75" y="52" width="90" height="65" rx="15" />
          <path d="M120 52V34M65 76v30M175 76v30M93 117v15M147 117v15M104 98h32" />
          <circle cx="120" cy="30" r="4" />
          <circle cx="101" cy="76" r="6" />
          <circle cx="139" cy="76" r="6" />
          <circle cx="193" cy="125" r="13" />
          <path d="M180 125h26M193 112v26" />
        </>
      ) : kind === "wheelchair" ? (
        <>
          <circle cx="106" cy="43" r="10" />
          <path d="M106 54v35h36l12 29h15M106 70h35M95 82a30 30 0 1 0 40 35M160 42h35l-10-10M195 42l-10 10" />
        </>
      ) : kind === "tutoropia" ? (
        <>
          <path d="M120 52Q85 32 52 49v69q35-18 68 2 33-20 68-2V49q-33-17-68 3v68" />
          <path d="M67 65q18-6 37 2M67 82q18-6 37 2M136 67q19-8 37-2M136 84q19-8 37-2" />
        </>
      ) : (
        <>
          <g opacity={step === 2 ? 0.25 : 1}>
            <rect x="48" y="37" width="58" height="85" rx="5" />
            <path d="M62 56h29M62 69h24M62 82h29M62 95h16" />
          </g>
          <path d="M116 79h20l-6-6M136 79l-6 6" />
          <g opacity={step === 0 ? 0.3 : 1}>
            <rect x="146" y="33" width="51" height="93" rx="8" />
            <path d="M157 54h28M157 68h20M157 82h28M157 96h20" />
            <circle cx="171" cy="115" r="2" />
          </g>
        </>
      )}
      <path d="M104 150h32" strokeOpacity=".3" />
      {[0, 1, 2].map((index) => (
        <circle
          key={index}
          cx={104 + index * 16}
          cy="150"
          r="3"
          fill={step === index ? "#f39a59" : "#203744"}
          stroke={step === index ? "#f39a59" : "#627481"}
        />
      ))}
    </svg>
  );
}
