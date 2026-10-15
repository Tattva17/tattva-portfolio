/** Original, illustrative scenes. Emphasis follows the active project, not a live demo. */
export default function ChapterScene({
  chapter,
  active,
}: {
  chapter: "intelligence" | "building" | "impact" | "signal";
  active: string;
}) {
  const signal = chapter === "signal";
  return (
    <svg
      className={`chapter-scene scene-${chapter}`}
      viewBox="0 0 480 420"
      fill="none"
      aria-hidden="true"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <pattern
          id={`grid-${chapter}`}
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M32 0H0V32"
            stroke="currentColor"
            strokeOpacity=".09"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect
        x="0"
        y="0"
        width="480"
        height="420"
        fill={`url(#grid-${chapter})`}
        rx="12"
      />
      <circle className="scene-orbit" cx="240" cy="210" r="155" />
      {(signal || chapter === "intelligence") && (
        <>
          <path
            className="scene-wire"
            d="M68 126H155L195 166H268M68 294H151L197 248H268M332 207H408M240 70V125"
          />
          <g
            className={`scene-part ${active === "research" || active === "think" ? "is-emphasized" : ""}`}
          >
            <path
              d="M48 98L96 58L138 96L110 151L48 98L96 118L138 96M96 58V118"
              stroke="currentColor"
              strokeWidth="2"
            />
            {[
              [48, 98],
              [96, 58],
              [138, 96],
              [110, 151],
              [96, 118],
            ].map(([x, y]) => (
              <circle
                key={`${x}-${y}`}
                cx={x}
                cy={y}
                r="6"
                fill="currentColor"
              />
            ))}
            <path
              d="M44 326H153M50 322V242M64 303L85 278L106 290L130 253L148 265"
              stroke="currentColor"
              strokeWidth="2"
            />
          </g>
          <g
            className={`scene-part ${active === "fab" || active === "think" ? "is-emphasized" : ""}`}
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="268" y="139" width="130" height="130" rx="15" />
            <rect x="294" y="165" width="78" height="78" rx="4" />
            {[282, 308, 334, 360, 386].map((n) => (
              <path
                key={n}
                d={`M${n} 126v13M${n} 269v13M255 ${n - 130}h13M398 ${n - 130}h13`}
              />
            ))}
            <path d="M314 204h39M333 185v38" />
          </g>
        </>
      )}
      {(signal || chapter === "building") && (
        <>
          <path
            className="scene-wire"
            d={
              signal
                ? "M240 222V308H319"
                : "M78 118H179L214 153M275 253H357V314"
            }
          />
          <g
            className={`scene-part ${active === "robot" || active === "build" || signal ? "is-emphasized" : ""}`}
            transform={
              signal ? "translate(176 195) scale(.58)" : "translate(28 44)"
            }
            stroke="currentColor"
            strokeWidth="3"
          >
            <rect x="87" y="104" width="158" height="117" rx="25" />
            <path d="M166 104V70M68 142v43M264 142v43M119 221v26M213 221v26M140 192h52" />
            <circle cx="166" cy="62" r="8" />
            <circle cx="132" cy="145" r="10" />
            <circle cx="200" cy="145" r="10" />
            <path d="M286 220Q346 136 374 238" strokeDasharray="5 8" />
            <circle cx="374" cy="257" r="20" />
            <path d="M354 257h40M374 237v40" />
          </g>
          {!signal && (
            <g
              className={`scene-part sensor-part ${active === "wheelchair" ? "is-emphasized" : ""}`}
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="340" cy="90" r="16" />
              <path d="M340 109v54h40l16 38h20M340 133h39M326 154a37 37 0 1 0 36 53M296 58q-24 28 0 55M281 47q-37 39 0 77M380 54h42l-12-12M422 54l-12 12" />
            </g>
          )}
        </>
      )}
      {chapter === "impact" && (
        <>
          <path
            className="scene-wire"
            d="M150 156H213L245 188H292M240 220V277H312"
          />
          <g
            className={`scene-part ${active === "medilog" ? "is-emphasized" : ""}`}
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <rect x="52" y="73" width="98" height="142" rx="8" />
            <path d="M73 102h56M73 124h44M73 146h56M73 168h31M175 146h39l-10-10M214 146l-10 10" />
            <rect x="261" y="61" width="111" height="190" rx="19" />
            <path d="M293 85h46M281 112h71v30h-71ZM281 164h27M281 182h55M281 200h46" />
            <circle cx="316" cy="233" r="4" />
          </g>
          <g
            className={`scene-part ${active === "tutoropia" ? "is-emphasized" : ""}`}
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M94 296q31-14 62 3 31-17 62-3v68q-31-14-62 3-31-17-62-3v-68ZM156 299v68M107 317h32M173 317h31M107 333h32M173 333h31M236 333h38M274 333v-30h26" />
            <rect x="300" y="280" width="56" height="56" rx="10" />
            <rect x="370" y="320" width="56" height="56" rx="10" />
            <path d="M319 309l7 7 12-17M384 348h28M398 334v28M356 308h42v12" />
          </g>
        </>
      )}
      {signal && (
        <>
          <circle className="signal-core" cx="240" cy="205" r="24" />
          <circle cx="240" cy="205" r="8" fill="currentColor" />
          <path
            className="scene-wire"
            d="M240 181V108M216 205H160M264 205H288"
          />
        </>
      )}
    </svg>
  );
}
