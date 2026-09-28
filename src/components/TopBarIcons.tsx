import React from 'react';

// Globe icon matching uploaded line-art wireframe globe image
export const GlobeGridIcon: React.FC<{ className?: string; size?: number; color?: string }> = ({
  className = 'w-3.5 h-3.5',
  size = 14,
  color = '#14202e',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke={color} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Outer circle perimeter */}
        <circle cx="50" cy="50" r="46" />

        {/* Central horizontal equator */}
        <line x1="4" y1="50" x2="96" y2="50" />

        {/* Upper & lower parallels */}
        <path d="M 12.5 33 Q 50 22 87.5 33" />
        <path d="M 12.5 67 Q 50 78 87.5 67" />

        {/* Central vertical meridian */}
        <line x1="50" y1="4" x2="50" y2="96" />

        {/* Inner meridians */}
        <path d="M 50 4 C 34 4 34 96 50 96" />
        <path d="M 50 4 C 66 4 66 96 50 96" />

        {/* Outer meridians */}
        <path d="M 50 4 C 18 4 18 96 50 96" />
        <path d="M 50 4 C 82 4 82 96 50 96" />
      </g>
    </svg>
  );
};

// Outlined chat bubble icon matching uploaded dark navy blue speech bubble outline
export const ChatBubbleIcon: React.FC<{ className?: string; size?: number; color?: string }> = ({
  className = 'w-3.5 h-3.5',
  size = 13,
  color = '#14202e',
}) => {
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 100 115"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 26 8 C 15 8 7 16 7 28 L 7 68 C 7 79 14 86.5 24 88 L 19 104 C 18 106 20 107.5 21.5 106.5 L 42 88 L 74 88 C 85 88 93 80 93 68 L 93 28 C 93 16 85 8 74 8 Z"
        stroke={color}
        strokeWidth="8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

// WhatsApp icon matching uploaded image
export const WhatsAppIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-4 h-4',
  size = 16,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
};

// Email icon matching uploaded thick-bordered rounded envelope image
export const EnquiryMailIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-4 h-4',
  size = 17,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2.2"
        y="4.2"
        width="19.6"
        height="15.6"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M 3.2 6.5 L 9.8 12.4 C 11.05 13.5 12.95 13.5 14.2 12.4 L 20.8 6.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 3.8 18.2 L 8.6 13.4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M 20.2 18.2 L 15.4 13.4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
};
