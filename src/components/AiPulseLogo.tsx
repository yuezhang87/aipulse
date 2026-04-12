interface Props {
  size?: number;
}

export default function AiPulseLogo({ size = 32 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-label="aiPulse logo"
    >
      <defs>
        <linearGradient
          id="navPulseGrad"
          gradientUnits="userSpaceOnUse"
          x1="2"
          y1="0"
          x2="30"
          y2="0"
        >
          <stop offset="0%" stopColor="#7F77DD" />
          <stop offset="100%" stopColor="#9F9AE8" />
        </linearGradient>

        {/* Two-pass bloom: wide diffuse layer + tight halo, composited under the sharp stroke */}
        <filter id="waveGlow" x="-80%" y="-150%" width="260%" height="400%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="wide" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="tight" />
          <feMerge>
            <feMergeNode in="wide" />
            <feMergeNode in="tight" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="32" height="32" rx="7" fill="#1a1a2e" />

      {/* Pulse wave — dramatic EKG: Q dip → sharp R spike to y=5 → deep S trough → baseline */}
      <path
        d="M 2,16 L 8,16 L 10,20 L 12,6 L 14,24 L 16,16 L 30,16"
        stroke="url(#navPulseGrad)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#waveGlow)"
      />

      {/* Main 4-point sparkle */}
      <path
        d="M 24,4.5 L 24.71,7.29 L 27.5,8 L 24.71,8.71 L 24,11.5 L 23.29,8.71 L 20.5,8 L 23.29,7.29 Z"
        fill="white"
      />

      {/* Secondary smaller sparkle */}
      <path
        d="M 28,12.8 L 28.37,14.13 L 29.7,14.5 L 28.37,14.87 L 28,16.2 L 27.63,14.87 L 26.3,14.5 L 27.63,14.13 Z"
        fill="white"
        opacity="0.55"
      />
    </svg>
  );
}
