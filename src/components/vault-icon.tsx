export function VaultIcon({
  size = 24,
  className = "",
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-label="VaultAuth"
      className={className}
    >
      {/* outer shield */}
      <path
        d="M16 2L4 7.5v8c0 7 5.25 13.5 12 15.5 6.75-2 12-8.5 12-15.5v-8L16 2z"
        fill="oklch(0.68 0.20 264 / 15%)"
        stroke="oklch(0.68 0.20 264)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* inner shield accent */}
      <path
        d="M16 6L7 10.5v6c0 4.9 3.5 9.45 9 10.85 5.5-1.4 9-5.95 9-10.85v-6L16 6z"
        fill="oklch(0.68 0.20 264 / 8%)"
        stroke="oklch(0.68 0.20 264 / 40%)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* checkmark */}
      <path
        d="M11 16l3.5 3.5L21 12"
        stroke="oklch(0.68 0.20 264)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
