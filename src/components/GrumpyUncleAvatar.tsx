import React from 'react';

export type UncleMoodLevel = -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5;

interface GrumpyUncleAvatarProps {
  mood: number; // -5 to +5
  size?: 'sm' | 'md' | 'lg';
  speechBubbleText?: string | null;
  onUncleClick?: () => void;
}

export const GrumpyUncleAvatar: React.FC<GrumpyUncleAvatarProps> = ({
  mood,
  size = 'md',
  speechBubbleText,
  onUncleClick,
}) => {
  // Clamp mood between -5 and 5
  const clampedMood = Math.max(-5, Math.min(5, Math.round(mood))) as UncleMoodLevel;

  // Determine stage
  const isSuperGrumpy = clampedMood <= -4;
  const isGrumpy = clampedMood >= -3 && clampedMood <= -1;
  const isNeutral = clampedMood === 0;
  const isHappy = clampedMood >= 1 && clampedMood <= 3;
  const isSlay = clampedMood >= 4;

  const getMoodTitle = () => {
    if (clampedMood <= -4) return 'Boiling Grumpy Uncle';
    if (clampedMood <= -2) return 'Disappointed Grumpy Uncle';
    if (clampedMood === -1) return 'Mildly Irritated Uncle';
    if (clampedMood === 0) return 'Neutral & Skeptical Uncle';
    if (clampedMood <= 2) return 'Cautiously Impressed Uncle';
    if (clampedMood <= 4) return 'Proud Smiling Uncle';
    return 'PEAK SLAY UNCLE! 🎉';
  };

  const getMoodBadgeClass = () => {
    if (clampedMood <= -3) return 'bg-red-100 text-red-800 border-red-300';
    if (clampedMood < 0) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (clampedMood === 0) return 'bg-stone-100 text-stone-700 border-stone-300';
    if (clampedMood <= 3) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    return 'bg-purple-100 text-purple-800 border-purple-300 animate-pulse';
  };

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-44 h-44',
    lg: 'w-60 h-60',
  }[size];

  return (
    <div className="flex flex-col items-center select-none relative">
      {/* Speech Bubble */}
      {speechBubbleText && (
        <div
          style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0', color: '#5C351B' }}
          className="mb-3 max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl border shadow-md text-xs sm:text-sm font-medium relative animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="flex items-start gap-2">
            <span className="text-base shrink-0">
              {isSlay ? '✨' : isHappy ? '☕' : isSuperGrumpy ? '💥' : isGrumpy ? '😤' : '🧐'}
            </span>
            <p className="leading-snug italic">"{speechBubbleText}"</p>
          </div>
          {/* Bubble tail pointing down */}
          <div
            style={{ borderTopColor: '#FAF6F3' }}
            className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 drop-shadow-[0_2px_1px_rgba(219,197,176,0.5)]"
          />
        </div>
      )}

      {/* Interactive Uncle Face Card */}
      <div
        onClick={onUncleClick}
        title="Uncle Sharma"
        className={`relative transition-transform duration-300 hover:scale-105 active:scale-95 ${sizeClasses} flex items-center justify-center`}
      >
        {/* Glow / Background aura */}
        <div
          className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 opacity-60 ${
            isSuperGrumpy
              ? 'bg-red-400'
              : isGrumpy
              ? 'bg-amber-300'
              : isNeutral
              ? 'bg-[#DAB692]/40'
              : isHappy
              ? 'bg-emerald-300'
              : 'bg-purple-300 animate-pulse'
          }`}
        />

        {/* SVG Uncle Avatar */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full relative z-10 drop-shadow-md overflow-visible"
        >
          {/* Steam when angry */}
          {(isSuperGrumpy || clampedMood <= -3) && (
            <g className="animate-bounce" opacity="0.85">
              <path
                d="M 45 45 Q 40 25 45 10 Q 50 25 45 45"
                fill="none"
                stroke="#E05252"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 155 45 Q 160 25 155 10 Q 150 25 155 45"
                fill="none"
                stroke="#E05252"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Sparkles when Slay */}
          {isSlay && (
            <g className="animate-spin" style={{ transformOrigin: '100px 100px', animationDuration: '12s' }}>
              <text x="25" y="40" fontSize="18">✨</text>
              <text x="160" y="35" fontSize="18">🎉</text>
              <text x="165" y="140" fontSize="18">🌟</text>
              <text x="20" y="135" fontSize="18">👑</text>
            </g>
          )}

          {/* Torso & Kurta */}
          <path
            d="M 40 185 Q 100 160 160 185 L 170 200 L 30 200 Z"
            fill={isSuperGrumpy ? '#9C3428' : isSlay ? '#7E4296' : '#8F5B34'}
          />
          {/* Kurta Collar */}
          <path
            d="M 85 168 L 100 188 L 115 168"
            fill="none"
            stroke="#FAF6F3"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Head Shape */}
          <ellipse
            cx="100"
            cy="105"
            rx="56"
            ry="64"
            fill={
              isSuperGrumpy
                ? '#FAD2CF'
                : isGrumpy
                ? '#FCE0C6'
                : isNeutral
                ? '#F7D6B8'
                : isHappy
                ? '#FEE0C8'
                : '#FFE3CF'
            }
            stroke="#5C351B"
            strokeWidth="3.5"
          />

          {/* Ears */}
          <ellipse cx="42" cy="105" rx="9" ry="14" fill="#F7D6B8" stroke="#5C351B" strokeWidth="3" />
          <ellipse cx="158" cy="105" rx="9" ry="14" fill="#F7D6B8" stroke="#5C351B" strokeWidth="3" />

          {/* Hair / Bald sides with grey-brown strands */}
          <path
            d="M 44 95 Q 40 60 70 50 Q 100 48 130 50 Q 160 60 156 95 Q 148 55 100 54 Q 52 55 44 95 Z"
            fill="#5C453A"
          />
          {/* Sideburns */}
          <path d="M 42 90 L 44 112 L 48 108" fill="#5C453A" />
          <path d="M 158 90 L 156 112 L 152 108" fill="#5C453A" />

          {/* Forehead Wrinkles (deeper when grumpy) */}
          <path
            d="M 80 68 Q 100 64 120 68"
            fill="none"
            stroke="#5C351B"
            strokeWidth={isSuperGrumpy ? '2.5' : '1.5'}
            strokeLinecap="round"
            opacity={isSuperGrumpy ? 0.9 : isGrumpy ? 0.7 : 0.4}
          />
          {(isGrumpy || isSuperGrumpy) && (
            <path
              d="M 84 74 Q 100 71 116 74"
              fill="none"
              stroke="#5C351B"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
          )}

          {/* Eyebrows */}
          {isSuperGrumpy && (
            <g stroke="#3D1F0E" strokeWidth="4.5" strokeLinecap="round">
              {/* Furious V-shaped brows */}
              <line x1="68" y1="80" x2="94" y2="92" />
              <line x1="132" y1="80" x2="106" y2="92" />
            </g>
          )}
          {isGrumpy && (
            <g stroke="#3D1F0E" strokeWidth="4" strokeLinecap="round">
              {/* Annoyed downward angled brows */}
              <line x1="70" y1="83" x2="93" y2="89" />
              <line x1="130" y1="83" x2="107" y2="89" />
            </g>
          )}
          {isNeutral && (
            <g stroke="#3D1F0E" strokeWidth="3.5" strokeLinecap="round">
              {/* Straight slightly skeptical brows */}
              <line x1="68" y1="85" x2="94" y2="84" />
              <line x1="106" y1="84" x2="132" y2="85" />
            </g>
          )}
          {isHappy && (
            <g stroke="#3D1F0E" strokeWidth="3.5" strokeLinecap="round">
              {/* Gently arched friendly brows */}
              <path d="M 68 86 Q 81 80 94 84" fill="none" />
              <path d="M 106 84 Q 119 80 132 86" fill="none" />
            </g>
          )}
          {isSlay && (
            <g stroke="#3D1F0E" strokeWidth="4" strokeLinecap="round">
              {/* Expressive joyous brows */}
              <path d="M 66 84 Q 80 75 94 82" fill="none" />
              <path d="M 106 82 Q 120 75 134 84" fill="none" />
            </g>
          )}

          {/* Spectacles (Wireframe Glasses) */}
          <g stroke="#4A2E1B" strokeWidth="3.5" fill="rgba(255,255,255,0.3)">
            {/* Left Glass */}
            <circle cx="81" cy="99" r="14" />
            {/* Right Glass */}
            <circle cx="119" cy="99" r="14" />
            {/* Bridge */}
            <path d="M 95 97 Q 100 94 105 97" fill="none" />
            {/* Temples */}
            <line x1="67" y1="99" x2="43" y2="98" />
            <line x1="133" y1="99" x2="157" y2="98" />
          </g>

          {/* Eyes inside glasses */}
          {isSuperGrumpy ? (
            <g fill="#3D1F0E">
              {/* Squinting angry eyes */}
              <line x1="75" y1="99" x2="87" y2="99" stroke="#3D1F0E" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="113" y1="99" x2="125" y2="99" stroke="#3D1F0E" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          ) : isSlay ? (
            <g>
              {/* Joyous crescent curved smiling eyes */}
              <path d="M 74 101 Q 81 94 88 101" fill="none" stroke="#3D1F0E" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 112 101 Q 119 94 126 101" fill="none" stroke="#3D1F0E" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          ) : (
            <g fill="#3D1F0E">
              {/* Normal / Looking pupils */}
              <circle cx="81" cy={isGrumpy ? '98' : '100'} r="4" />
              <circle cx="119" cy={isGrumpy ? '98' : '100'} r="4" />
              {/* Eye shine */}
              <circle cx="82.5" cy="98.5" r="1.5" fill="#FFFFFF" />
              <circle cx="120.5" cy="98.5" r="1.5" fill="#FFFFFF" />
            </g>
          )}

          {/* Desi Uncle Nose */}
          <path
            d="M 100 95 L 98 114 Q 100 119 106 116"
            fill="none"
            stroke="#5C351B"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Legendary Mustache! */}
          {isSuperGrumpy ? (
            /* Drooping, bristled angry mustache */
            <path
              d="M 100 125 C 90 124 72 135 60 142 C 72 132 90 128 100 129 C 110 128 128 132 140 142 C 128 135 110 124 100 125 Z"
              fill="#2E1609"
            />
          ) : isSlay ? (
            /* Curled-up proudly twirled mustache */
            <path
              d="M 100 125 C 88 123 70 125 56 116 C 68 126 88 131 100 128 C 112 131 132 126 144 116 C 130 125 112 123 100 125 Z"
              fill="#2E1609"
            />
          ) : isHappy ? (
            /* Smiling curled mustache */
            <path
              d="M 100 125 C 88 123 72 127 60 120 C 72 128 90 131 100 128 C 110 131 128 128 140 120 C 128 127 112 123 100 125 Z"
              fill="#2E1609"
            />
          ) : (
            /* Classic thick bushy mustache */
            <path
              d="M 100 124 C 88 122 72 128 62 134 C 74 130 90 129 100 129 C 110 129 126 130 138 134 C 128 128 112 122 100 124 Z"
              fill="#2E1609"
            />
          )}

          {/* Mouth below mustache */}
          {isSuperGrumpy && (
            /* Downward angry snarl / gritted teeth */
            <path
              d="M 85 145 Q 100 137 115 145"
              fill="none"
              stroke="#5C351B"
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}
          {isGrumpy && (
            /* Frown */
            <path
              d="M 88 142 Q 100 138 112 142"
              fill="none"
              stroke="#5C351B"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}
          {isNeutral && (
            /* Straight unimpressed line */
            <line x1="90" y1="139" x2="110" y2="139" stroke="#5C351B" strokeWidth="2.5" strokeLinecap="round" />
          )}
          {isHappy && (
            /* Warm gentle smile */
            <path
              d="M 88 138 Q 100 148 112 138"
              fill="none"
              stroke="#5C351B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}
          {isSlay && (
            /* Big laughing open smile */
            <path
              d="M 84 137 Q 100 156 116 137 Z"
              fill="#8F3025"
              stroke="#5C351B"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          )}

          {/* Chai Cup in Hand (Uncle's trademark!) */}
          <g transform="translate(135, 140) scale(0.65)">
            {/* Saucer */}
            <ellipse cx="28" cy="46" rx="28" ry="7" fill="#DBC5B0" stroke="#5C351B" strokeWidth="2" />
            {/* Cup */}
            <path
              d="M 8 20 L 14 42 Q 28 47 42 42 L 48 20 Z"
              fill="#FAF6F3"
              stroke="#5C351B"
              strokeWidth="2.5"
            />
            {/* Chai inside */}
            <ellipse cx="28" cy="22" rx="18" ry="5" fill="#A76839" />
            {/* Handle */}
            <path d="M 46 25 Q 56 31 44 38" fill="none" stroke="#5C351B" strokeWidth="2.5" />
            {/* Steam from tea */}
            <path
              d="M 23 15 Q 21 8 25 2"
              fill="none"
              stroke="#DBC5B0"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-pulse"
            />
            <path
              d="M 33 15 Q 35 7 31 1"
              fill="none"
              stroke="#DBC5B0"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-pulse"
            />
          </g>
        </svg>

        {/* Party Hat or Slay Shades overlay */}
        {isSlay && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
            👑
          </div>
        )}
      </div>

      {/* Mood Title & Interactive Meter Badge */}
      <div className="mt-2 text-center">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border tracking-wide shadow-xs ${getMoodBadgeClass()}`}
        >
          <span>{getMoodTitle()}</span>
          <span className="font-mono text-[10px] opacity-80">
            ({clampedMood > 0 ? `+${clampedMood}` : clampedMood})
          </span>
        </span>
      </div>
    </div>
  );
};
