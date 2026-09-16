/**
 * Centralized icon set — replaces emoji-as-icon usage across the app
 * with consistent, accessible SVG icons (24x24 viewBox, stroke-based).
 * Per design-system guidance: no emojis as UI icons, one consistent
 * icon set, fixed sizing via className (default w-4 h-4).
 */
const PATHS = {
  search: 'M21 21l-4.34-4.34M18 10.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z',
  briefcase: 'M20 7H4a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m-1 5h14',
  building: 'M4 21V5a1 1 0 011-1h6a1 1 0 011 1v16m-8 0h14m-6 0v-4a1 1 0 00-1-1h-2a1 1 0 00-1 1v4m8 0V9a1 1 0 00-1-1h-3M8 7h.01M8 10h.01M8 13h.01M8 16h.01',
  laptop: 'M4 5h16v10H4V5zM2 19h20',
  chartBar: 'M9 17V9m6 8V5M4 21h16M4 21V13',
  megaphone: 'M11 5.882L9 7H5a2 2 0 00-2 2v2a2 2 0 002 2h1v3l4-2v-6M11 5.882L15 4v14l-4-1.882M15 9h4m-4 3h3',
  phone: 'M6 3h8a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zM9 18h2',
  palette: 'M12 2a10 10 0 100 20 2.5 2.5 0 002.5-2.5c0-.6-.24-1.15-.63-1.55a2 2 0 111.42-3.42H17a3 3 0 003-3 10 10 0 00-8-9.53zM7.5 12a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM10 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM15 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3z',
  check: 'M5 13l4 4L19 7',
  checkCircle: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  xMark: 'M6 18L18 6M6 6l12 12',
  xCircle: 'M15 9l-6 6m0-6l6 6m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  bolt: 'M13 2L3 14h7l-1 8 10-12h-7l1-8z',
  sparkles: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z',
  clipboardList: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8h6m-6 4h6',
  dollar: 'M12 6v12m4-9c0-1.66-1.79-3-4-3s-4 1.34-4 3 1.79 3 4 3 4 1.34 4 3-1.79 3-4 3-4-1.34-4-3',
  plus: 'M12 4v16m8-8H4',
  lock: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  users: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6-4a4 4 0 11-8 0 4 4 0 018 0z',
  mail: 'M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  chat: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.5 0-2.91-.32-4.14-.9L3 20l1.05-3.16A7.94 7.94 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  frown: 'M9 15s1.5-2 3-2 3 2 3 2M9 9h.01M15 9h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  globe: 'M3 12h18M12 3a15.3 15.3 0 010 18 15.3 15.3 0 010-18zM3.6 8h16.8M3.6 16h16.8M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  mapPin: 'M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
  document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  chatBubble: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.5 0-2.91-.32-4.14-.9L3 20l1.05-3.16A7.94 7.94 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
}

export default function Icon({ name, className = 'w-4 h-4', strokeWidth = 1.8 }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}
