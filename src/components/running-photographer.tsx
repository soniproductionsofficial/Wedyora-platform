// A small hand-drawn-style runner holding a camera up to their face,
// used purely as a decorative touch that jogs across the hero banner.
// Pure CSS animation (no JS/hooks needed) — see the "Running
// photographer" block in globals.css for the keyframes. Two leg poses
// are layered on top of each other and cross-faded to fake a running
// stride while the whole figure slides across its track.
export default function RunningPhotographer() {
  return (
    <div className="runner-track" aria-hidden="true">
      <div className="runner-figure">
        <svg
          viewBox="0 0 60 90"
          width="52"
          height="78"
          fill="none"
          stroke="white"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Back leg, frame A */}
          <g className="runner-leg-a">
            <path d="M26 55 L40 64 L48 78" />
            <path d="M22 55 L10 65 L4 63" />
          </g>
          {/* Legs, frame B (opposite stride) */}
          <g className="runner-leg-b">
            <path d="M26 55 L12 65 L6 63" />
            <path d="M22 55 L38 64 L46 78" />
          </g>

          {/* Head */}
          <circle cx="30" cy="13" r="8.5" />
          {/* Torso, leaning forward like a runner */}
          <path d="M27 21 L23 54" />
          {/* Back arm swinging behind */}
          <path d="M25 28 L38 34 L44 26" />
          {/* Front arm raising the camera up to eye level */}
          <path d="M26 26 L14 20 L9 16" />
          {/* Camera body */}
          <rect x="2" y="10" width="13" height="10" rx="1.5" />
          <circle cx="8.5" cy="15" r="3" />
        </svg>
      </div>
    </div>
  );
}
