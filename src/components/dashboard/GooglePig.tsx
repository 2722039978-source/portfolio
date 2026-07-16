/**
 * Google Noto Emoji 风格猪猪 SVG
 * 内联 SVG，零外部依赖，不受 HTTPS 证书拦截影响
 */
export function GooglePig({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="pig emoji"
    >
      {/* 脸部圆形 */}
      <circle cx="64" cy="68" r="52" fill="#F8BBD0" />
      {/* 脸部渐变高光 */}
      <ellipse cx="50" cy="55" rx="30" ry="22" fill="#FCE4EC" opacity="0.6" />

      {/* 左耳 */}
      <ellipse cx="30" cy="28" rx="18" ry="22" fill="#F48FB1" transform="rotate(-15 30 28)" />
      <ellipse cx="30" cy="28" rx="12" ry="16" fill="#F8BBD0" transform="rotate(-15 30 28)" />
      {/* 右耳 */}
      <ellipse cx="98" cy="28" rx="18" ry="22" fill="#F48FB1" transform="rotate(15 98 28)" />
      <ellipse cx="98" cy="28" rx="12" ry="16" fill="#F8BBD0" transform="rotate(15 98 28)" />

      {/* 左眼 */}
      <ellipse cx="44" cy="55" rx="6" ry="7" fill="#4A2800" />
      <circle cx="46" cy="53" r="2.5" fill="white" />
      {/* 右眼 */}
      <ellipse cx="84" cy="55" rx="6" ry="7" fill="#4A2800" />
      <circle cx="86" cy="53" r="2.5" fill="white" />

      {/* 鼻子 (椭圆形猪鼻) */}
      <ellipse cx="64" cy="78" rx="22" ry="16" fill="#EC407A" />
      {/* 鼻孔 */}
      <ellipse cx="56" cy="77" rx="5" ry="6" fill="#8B234E" />
      <ellipse cx="72" cy="77" rx="5" ry="6" fill="#8B234E" />
      {/* 鼻孔高光 */}
      <ellipse cx="54" cy="75" rx="1.5" ry="2" fill="#A8325C" />
      <ellipse cx="70" cy="75" rx="1.5" ry="2" fill="#A8325C" />

      {/* 嘴巴 (微笑弧线) */}
      <path d="M 50 92 Q 64 104 78 92" stroke="#C2185B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
