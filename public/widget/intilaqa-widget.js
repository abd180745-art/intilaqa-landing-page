(function() {
    // Prevent multiple initializations
    if (window.__INTILAQA_WIDGET_INIT) return;
    window.__INTILAQA_WIDGET_INIT = true;

    // Configuration
    const config = window.IntilaqaAIConfig || {};
    if (!config.licenseKey) {
        console.warn("Intilaqa AI: licenseKey is missing from window.IntilaqaAIConfig.");
    }
    
    // Inject Fonts
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Ensure marked.js is available
    function loadMarked(callback) {
        if (typeof window.marked !== 'undefined') { callback(); return; }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    function initWidget() {
        const cssContent = `/* ==========================================================================
   Intilaqa AI — Chat v5
   Design cloned from user-provided reference.
   Font: Tajawal (site font) · Brand: var(--intq-ai-primary) orange
   ========================================================================== */

:host {
	--intq-orange:      var(--intq-ai-primary);
	--intq-orange-hov:  var(--intq-ai-primary);
	--intq-orange-glow: color-mix(in srgb, var(--intq-ai-primary) 25%, transparent);
	--intq-ai-secondary: #1e3a5f; /* Default dark navy — overridden by widget-template.php inline style */
	--intq-text:        #1f2937;
	--intq-text-soft:   #4b5563;
	--intq-glass:       rgba(255,255,255,0.85);
	--intq-z-fab:       9000;
	--intq-z-overlay:   999999;
}

/* ── Utility ─────────────────────────────────────────────────────────────── */
.intq-hidden { display: none !important; }

/* ── FAB ─────────────────────────────────────────────────────────────────── */
.intq-ai-fab {
	position: fixed;
	bottom: 32px;
	right: 32px;              /* ← moved to right */
	z-index: var(--intq-z-fab);
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	padding: 10px 24px;
	border-radius: 50px;
	
	background: transparent !important; /* White bg is moved to ::after */
	border: none !important;
	color: var(--intq-ai-primary) !important; /* Orange text and icon */
	
	cursor: pointer;
	font-family: 'Tajawal', sans-serif;
	font-size: 0.95rem;
	font-weight: 700;
	white-space: nowrap;
	direction: rtl;
	box-shadow: 0 4px 14px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04);
	transition: transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s;
	
	/* Magic for spinning border */
	position: fixed; /* Keep fixed */
	overflow: hidden; /* Clips the spinning gradient to the pill shape */
}

/* Ensure content stays above the spinning background */
.intq-ai-fab svg,
.intq-ai-fab span {
	position: relative;
	z-index: 1;
}

/* The Border Gradient Layer */
.intq-ai-fab::before {
	content: '';
	position: absolute;
	top: -50%; left: -50%;
	width: 200%; height: 200%;
	background: conic-gradient(
		from 0deg, 
		var(--intq-ai-primary) 0%, 
		var(--intq-ai-secondary) 50%, 
		var(--intq-ai-primary) 100%
	);
	z-index: -2;
	transition: opacity 0.3s;
}

/* The White Pill Layer */
.intq-ai-fab::after {
	content: '';
	position: absolute;
	inset: 2px; /* This creates the 2px border thickness */
	background: #ffffff;
	border-radius: 50px;
	z-index: -1;
}

@keyframes intqFabBorderSpin {
	0%   { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.intq-ai-fab:hover  { 
	transform: translateY(-2px) scale(1.02); 
	box-shadow: 0 8px 24px var(--intq-orange-glow) !important; 
}
.intq-ai-fab:hover::before {
	animation: intqFabBorderSpin 2.5s linear infinite;
}
.intq-ai-fab:active { 
	transform: scale(0.97); 
}

/* ── Overlay / Backdrop ──────────────────────────────────────────────── */
.intq-ai-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0,0,0,0.35);
	backdrop-filter: blur(5px);
	-webkit-backdrop-filter: blur(5px);
	z-index: var(--intq-z-overlay) !important;
	display: flex !important; /* always flex, visibility via opacity */
	justify-content: flex-start; /* rtl: flex-start aligns to RIGHT edge */
	align-items: stretch;
	font-family: 'Tajawal', sans-serif;
	direction: rtl;
	/* fade backdrop */
	opacity: 1;
	pointer-events: all;
	transition: opacity 0.25s ease;
}
.intq-ai-overlay.intq-hidden {
	opacity: 0;
	pointer-events: none;
}

/* ── Modal — right-side slide panel (420px, full height) ───────────── */
.intq-ai-modal {
	background: #ffffff;
	border: none;
	border-radius: 24px 0 0 24px;
	width: 420px;
	max-width: 100vw;
	height: 100%;
	display: flex;
	flex-direction: column;
	box-shadow: -10px 0 50px rgba(0,0,0,0.18);
	position: relative;
	overflow: hidden;
	/* slide in from right */
	transform: translateX(100%);
	transition: transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.intq-ai-overlay:not(.intq-hidden) .intq-ai-modal {
	transform: translateX(0);
}

/* ── Header policy link ──────────────────────────────────────────── */
.intq-ai-policy-link {
	background: transparent;
	border: none;
	padding: 0;
	font-family: 'Tajawal', sans-serif;
	font-size: 0.72rem;
	font-weight: 500;
	color: #9ca3af;
	cursor: pointer;
	white-space: nowrap;
	text-decoration: none;
	transition: color 0.2s;
}
.intq-ai-policy-link:hover {
	color: var(--intq-orange);
}


/* ── Close button ────────────────────────────────────────────────────────── */
.intq-ai-close-btn {
	background: transparent;
	border: none;
	padding: 4px;
	color: var(--intq-text-soft);
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 10;
	transition: color 0.2s, transform 0.2s;
	line-height: 0;
	outline: none;
}
.intq-ai-close-btn:hover,
.intq-ai-close-btn:focus { 
	color: var(--intq-orange); 
	transform: scale(1.15); 
	background: transparent;
	outline: none;
	box-shadow: none;
}

/* ── Header ──────────────────────────────────────────────────────────────── */
.intq-ai-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px 20px;
	border-bottom: 1px solid rgba(0,0,0,0.05);
	flex-shrink: 0;
}
.intq-ai-title {
	font-weight: 700;
	color: var(--intq-orange);
	font-size: 1.08rem;
	font-family: 'Tajawal', sans-serif;
	display: flex;
	align-items: center;
}
/* Policy link — below welcome card */
.intq-ai-policy-link {
	background: transparent;
	border: none;
	padding: 0;
	font-family: 'Tajawal', sans-serif;
	font-size: 0.75rem;
	font-weight: 500;
	color: #9ca3af;
	cursor: pointer;
	transition: color 0.2s;
	text-decoration: none;
	outline: none;
	box-shadow: none;
}
.intq-ai-policy-link:hover,
.intq-ai-policy-link:focus,
.intq-ai-policy-link:active {
	color: var(--intq-orange);
	background: transparent !important;
	border: none !important;
	outline: none !important;
	box-shadow: none !important;
	text-decoration: none !important;
}

/* ── Response area ───────────────────────────────────────────────────────── */
#intq-ai-response-area {
	flex-grow: 1;
	padding: 22px;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 18px;
	scroll-behavior: smooth;
}
#intq-ai-response-area::-webkit-scrollbar       { width: 4px; }
#intq-ai-response-area::-webkit-scrollbar-track { background: transparent; }
#intq-ai-response-area::-webkit-scrollbar-thumb { background: var(--intq-orange-glow); border-radius: 4px; }

/* ── Welcome card ────────────────────────────────────────────────────────── */
.intq-ai-welcome-card {
	background: #ffffff;
	padding: 40px 22px;
	border-radius: 18px;
	border: 1px solid var(--intq-orange);
	box-shadow: none;
	color: var(--intq-text);
	line-height: 1.8;
	font-family: 'Tajawal', sans-serif;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
}
.intq-ai-welcome-card svg {
	margin-bottom: 12px;
	animation: intq-pop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
@keyframes intq-pop { 
	0% { transform: scale(0.5); opacity: 0; } 
	100% { transform: scale(1); opacity: 1; } 
}
.intq-ai-welcome-card h3 {
	margin: 0;
	color: var(--intq-ai-primary);
	font-size: 1.15rem;
	font-weight: 700;
}

/* ── Status stages ───────────────────────────────────────────────────────── */
.intq-ai-status {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	font-family: 'Tajawal', sans-serif;
	font-size: 0.85rem;
	color: var(--intq-text-soft);
	font-weight: 600;
	margin-bottom: 12px;
	direction: ltr;
}
.intq-ai-spinner {
	width: 16px; height: 16px;
	color: var(--intq-orange);
	flex-shrink: 0;
	animation: intq-spin 0.7s linear infinite;
}
@keyframes intq-spin { to{transform:rotate(360deg)} }

/* ── AI answer card ──────────────────────────────────────────────────────── */
.intq-ai-answer-card {
	background: transparent;
	padding: 4px;
	box-shadow: none;
	font-family: 'Tajawal', sans-serif;
	font-size: 0.97rem;
	line-height: 1.9;
	color: var(--intq-text);
	animation: intq-card-in 0.3s ease;
}
@keyframes intq-card-in { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
.intq-ai-answer-card strong { color: var(--intq-ai-primary); }

/* Removed streaming cursor per user request */

/* ── Chat history bubbles ─────────────────────────────────────────────────── */
/* User message — right-aligned orange pill */
.intq-user-bubble {
	display: flex;
	justify-content: flex-end;
	animation: intq-card-in 0.25s ease;
}
.intq-user-bubble__text {
	max-width: 78%;
	background: var(--intq-orange);
	color: #fff;
	padding: 10px 16px;
	border-radius: 18px 18px 4px 18px;
	font-family: 'Tajawal', sans-serif;
	font-size: 0.95rem;
	line-height: 1.6;
	box-shadow: 0 3px 10px var(--intq-orange-glow);
}

/* AI response — left-aligned floating text */
.intq-ai-bubble {
	background: transparent;
	padding: 4px;
	box-shadow: none;
	font-family: 'Tajawal', sans-serif;
	font-size: 0.97rem;
	line-height: 1.9;
	color: var(--intq-text);
	animation: intq-card-in 0.3s ease;
}
.intq-ai-bubble strong { color: var(--intq-ai-primary); font-weight: 700; }
.intq-ai-bubble p { margin-bottom: 8px; font-size: inherit; line-height: inherit; }
.intq-ai-bubble h1, .intq-ai-bubble h2, .intq-ai-bubble h3 { font-weight: bold; color: var(--intq-orange); margin-top: 14px; margin-bottom: 8px; }
/* Removed streaming cursor on AI bubble per user request */

/* Smart search button inside answer */
.intq-ai-answer-card .intq-open-search {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	margin-top: 14px;
	padding: 9px 20px;
	border-radius: 50px;
	border: none;
	background: var(--intq-orange);
	color: #fff;
	font-family: 'Tajawal', sans-serif;
	font-size: 0.88rem;
	font-weight: 700;
	cursor: pointer;
	box-shadow: 0 6px 18px var(--intq-orange-glow);
	transition: background 0.2s, transform 0.25s;
}
.intq-ai-answer-card .intq-open-search:hover { background:var(--intq-orange-hov); transform:scale(1.03); }

/* ── Input bar ───────────────────────────────────────────────────────────── */
.intq-ai-input-wrapper {
	padding: 16px 20px 20px;
	background: rgba(255,255,255,0.55);
	border-top: 1px solid rgba(0,0,0,0.05);
	flex-shrink: 0;
}
.intq-ai-input-container {
	position: relative;
	background: #ffffff;
	border-radius: 25px;
	box-shadow: 0 4px 12px rgba(0,0,0,0.06);
	border: 1.5px solid #e5e7eb;
	transition: border-color 0.25s, box-shadow 0.25s;
	display: block;
	overflow: hidden; /* Prevent textarea scrollbar track from breaking border radius */
}
.intq-ai-input-container:focus-within {
	border-color: var(--intq-orange);
	box-shadow: 0 4px 16px var(--intq-orange-glow);
}
#intq-ai-input {
	width: 100%;
	min-height: 110px;
	max-height: 250px;
	border: none;
	background: transparent;
	padding: 15px 20px 15px 90px; /* Padding left 90px prevents overlap with icons in RTL */
	font-size: 0.95rem;
	font-family: 'Tajawal', sans-serif;
	color: var(--intq-text);
	outline: none;
	direction: rtl;
	resize: none;
	overflow-y: auto; /* Allow scrolling if it gets too long, but hide the visual bar */
	box-sizing: border-box;
	line-height: 1.5;
	display: block;
	margin: 0;
	-webkit-appearance: none;
	appearance: none;
	box-shadow: none !important;
	scrollbar-width: none; /* Firefox: hide scrollbar */
}
#intq-ai-input::-webkit-scrollbar {
	display: none; /* Chrome/Edge/Safari: entirely hide scrollbar */
	width: 0;
}
#intq-ai-input::placeholder { color: rgba(31,41,55,0.32); }

.intq-ai-input-actions {
	position: absolute;
	bottom: 11px;
	left: 11px;
	display: flex;
	align-items: center;
	gap: 6px;
}

#intq-ai-send {
	background: var(--intq-orange);
	color: #fff;
	border: none;
	width: 38px; height: 38px;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	flex-shrink: 0;
	overflow: visible;
	transition: background 0.25s, transform 0.25s;
}
#intq-ai-send:hover  { background: var(--intq-orange-hov); transform: scale(1.08); }
#intq-ai-send:active { transform: scale(0.94); }
#intq-ai-send:disabled { background: #d1d5db; cursor: not-allowed; transform: none; }
#intq-ai-send svg { display: block; width: 18px; height: 18px; flex-shrink: 0; }

/* New question */
.intq-ai-new-wrap { text-align: center; margin-top: 10px; }
.intq-ai-new-btn {
	background: none;
	border: none;
	color: var(--intq-text-soft);
	font-family: 'Tajawal', sans-serif;
	font-size: 0.82rem;
	cursor: pointer;
	padding: 4px 10px;
	border-radius: 20px;
	transition: color 0.2s, background 0.2s;
}
.intq-ai-new-btn:hover { color: var(--intq-orange); background: rgba(230,150,5,0.07); }

/* ── Profile Toggle Button ─────────────────────────────────────────────────── */
.intq-ai-profile-toggle-btn {
	background: transparent;
	border: none;
	color: var(--intq-text-soft);
	width: 32px; height: 32px;
	border-radius: 50%;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: color 0.2s, background 0.2s, transform 0.2s;
	flex-shrink: 0;
	padding: 0;
}
.intq-ai-profile-toggle-btn:hover {
	color: var(--intq-orange);
	background: rgba(230,150,5,0.08);
	transform: rotate(30deg);
}

/* ── Profile Settings Panel ──────────────────────────────────────────────── */
.intq-ai-profile-panel {
	background: #ffffff;
	border: 1px solid rgba(45,99,166,0.1);
	border-radius: 20px;
	padding: 20px;
	margin-bottom: 16px;
	box-shadow: 0 10px 30px rgba(0,0,0,0.08);
	font-family: 'Tajawal', sans-serif;
	animation: intq-panel-up 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
@keyframes intq-panel-up {
	from { opacity: 0; transform: translateY(10px); }
	to { opacity: 1; transform: none; }
}
.intq-ai-profile-panel__header h4 {
	margin: 0 0 6px;
	font-size: 1.05rem;
	color: var(--intq-ai-primary);
	font-weight: 700;
	direction: rtl;
	text-align: right;
}
.intq-ai-profile-panel__header p {
	margin: 0 0 18px;
	font-size: 0.84rem;
	color: var(--intq-text-soft);
	direction: rtl;
	text-align: right;
}
.intq-ai-profile-group {
	display: flex;
	gap: 12px;
	margin-bottom: 12px;
}
.intq-ai-profile-group input,
.intq-ai-profile-group select {
	flex: 1;
	min-width: 0;
	padding: 12px 18px !important;
	border: 1.5px solid #e5e7eb !important;
	border-radius: 50px !important;
	font-family: 'Tajawal', sans-serif !important;
	font-size: 0.9rem !important;
	color: var(--intq-text) !important;
	background: #ffffff !important;
	direction: rtl;
	text-align: right;
	box-shadow: 0 2px 6px rgba(0,0,0,0.04) !important;
	transition: border-color 0.25s, box-shadow 0.25s;
	-webkit-appearance: none !important;
	appearance: none !important;
	outline: none !important;
}
.intq-ai-profile-group input::placeholder {
	color: rgba(31,41,55,0.35);
}
.intq-ai-profile-group input:focus,
.intq-ai-profile-group select:focus {
	outline: none !important;
	border-color: var(--intq-orange) !important;
	box-shadow: 0 0 0 3px rgba(230,150,5,0.12) !important;
	background: #ffffff !important;
}
.intq-ai-profile-panel__footer {
	margin-top: 16px;
	display: flex;
	justify-content: flex-end;
}
.intq-ai-profile-save-btn {
	background: var(--intq-orange);
	color: #fff;
	border: none;
	padding: 8px 20px;
	border-radius: 50px;
	font-family: 'Tajawal', sans-serif;
	font-weight: 700;
	font-size: 0.88rem;
	cursor: pointer;
	box-shadow: 0 4px 12px var(--intq-orange-glow);
	transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.intq-ai-profile-save-btn:hover {
	background: var(--intq-orange-hov);
	transform: translateY(-1px);
	box-shadow: 0 6px 16px var(--intq-orange-glow);
}
.intq-ai-profile-save-btn:active {
	transform: translateY(1px);
}

/* ── Mobile ──────────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
	.intq-ai-drawer {
		width: 100%;
	}
	.intq-ai-modal {
		width: 100%;
		height: 100%;
		max-height: 100vh;
		border-radius: 0;
		border-left: none;
	}
	.intq-ai-policies-tab {
		display: none; /* Hide tab on mobile to avoid overlapping content */
	}
	.intq-ai-input-wrapper { padding-bottom: 28px; }
	.intq-ai-fab { display: none !important; }
}

/* Status Animations */
.intq-ai-status-label-anim { display: inline-block; position: absolute; left: 0; white-space: nowrap; }
.intq-pulse-text { animation: intq-pulse 1.2s infinite ease-in-out; display: inline-block; }
@keyframes intq-pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
.intq-slide-in-right { animation: intq-slide-in-right 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
@keyframes intq-slide-in-right { 0% { transform: translateX(100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
.intq-slide-out-left { animation: intq-slide-out-left 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
@keyframes intq-slide-out-left { 0% { transform: translateX(0); opacity: 1; } 100% { transform: translateX(-100%); opacity: 0; } }

/* ── Feedback buttons ─────────────────────────────────────────────────────── */
.intq-feedback-wrap {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-top: 4px;
	margin-bottom: 2px;
	animation: intq-card-in 0.3s ease;
}
.intq-feedback-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	border: none;
	background: transparent !important;
	box-shadow: none !important;
	outline: none !important;
	-webkit-appearance: none;
	appearance: none;
	color: #6b7280;
	cursor: pointer;
	transition: color 0.2s, transform 0.2s;
	line-height: 0;
}
.intq-feedback-btn:hover,
.intq-feedback-btn:focus,
.intq-feedback-btn:active { background: transparent !important; box-shadow: none !important; outline: none !important; transform: scale(1.2); }
.intq-feedback-btn.intq-feedback-like:hover    { color: #16a34a; }
.intq-feedback-btn.intq-feedback-dislike:hover { color: #dc2626; }
.intq-feedback-btn.intq-feedback-copy:hover    { color: var(--intq-orange); }
.intq-feedback-btn.intq-feedback-active.intq-feedback-like    { color: #16a34a; transform: scale(1.25); }
.intq-feedback-btn.intq-feedback-active.intq-feedback-dislike { color: #dc2626; transform: scale(1.25); }
.intq-feedback-voted .intq-feedback-btn:not(.intq-feedback-active) { opacity: 0.25; pointer-events: none; }


/* -- Inline Policy Panel (inside chat modal) --------------------------------*/
.intq-policy-panel {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	animation: intq-card-in 0.25s ease;
}
.intq-policy-panel.intq-hidden { display: none !important; }
.intq-policy-panel__topbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 20px;
	border-bottom: 1px solid rgba(230,150,5,0.15);
	flex-shrink: 0;
	direction: rtl;
}
.intq-policy-panel__title {
	font-family: 'Tajawal', sans-serif;
	font-size: 1rem;
	font-weight: 700;
	color: var(--intq-orange);
}
.intq-policy-back-btn {
	display: inline-flex;
	align-items: center;
	gap: 5px;
	background: transparent;
	border: none;
	padding: 0;
	color: var(--intq-text-soft);
	font-family: 'Tajawal', sans-serif;
	font-size: 0.88rem;
	font-weight: 600;
	cursor: pointer;
	transition: color 0.2s;
	outline: none;
	box-shadow: none;
}
.intq-policy-back-btn:hover,
.intq-policy-back-btn:focus,
.intq-policy-back-btn:active {
	color: var(--intq-orange);
	background: transparent !important;
	outline: none !important;
	box-shadow: none !important;
}
.intq-policy-panel__body {
	flex-grow: 1;
	padding: 22px;
	overflow-y: auto;
	font-family: 'Tajawal', sans-serif;
	font-size: 0.95rem;
	line-height: 1.9;
	color: var(--intq-text);
	direction: rtl;
	text-align: right;
	white-space: pre-wrap;
}
.intq-policy-panel__body::-webkit-scrollbar       { width: 4px; }
.intq-policy-panel__body::-webkit-scrollbar-track { background: transparent; }
.intq-policy-panel__body::-webkit-scrollbar-thumb { background: rgba(230,150,5,0.3); border-radius: 4px; }
.intq-policy-empty { text-align: center; color: #9ca3af; padding: 60px 0; font-size: 0.9rem; }

/* ── Dark Mode ───────────────────────────────────────────────────────────── */
.intq-dark-mode .intq-ai-modal,
.intq-dark-mode .intq-policy-panel {
	background: var(--intq-ai-dark-bg);
	color: #f3f4f6;
}

.intq-dark-mode .intq-ai-header {
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.intq-dark-mode .intq-ai-close-btn,
.intq-dark-mode .intq-policy-back-btn {
	color: #9ca3af;
}

.intq-dark-mode .intq-ai-close-btn:hover,
.intq-dark-mode .intq-policy-back-btn:hover {
	color: var(--intq-orange);
}

.intq-dark-mode .intq-ai-welcome-card h3 span {
	color: #9ca3af !important;
}

.intq-dark-mode .intq-ai-input-wrapper {
	background: transparent;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.intq-dark-mode .intq-ai-input-container {
	background: rgba(255, 255, 255, 0.05);
	border-color: rgba(255, 255, 255, 0.1);
}

.intq-dark-mode #intq-ai-input {
	color: #f3f4f6;
}
}
.intq-ai-profile-panel__footer {
	margin-top: 16px;
	display: flex;
	justify-content: flex-end;
}
.intq-ai-profile-save-btn {
	background: var(--intq-orange);
	color: #fff;
	border: none;
	padding: 8px 20px;
	border-radius: 50px;
	font-family: 'Tajawal', sans-serif;
	font-weight: 700;
	font-size: 0.88rem;
	cursor: pointer;
	box-shadow: 0 4px 12px var(--intq-orange-glow);
	transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.intq-ai-profile-save-btn:hover {
	background: var(--intq-orange-hov);
	transform: translateY(-1px);
	box-shadow: 0 6px 16px var(--intq-orange-glow);
}
.intq-ai-profile-save-btn:active {
	transform: translateY(1px);
}

/* ── Mobile ──────────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
	.intq-ai-drawer {
		width: 100%;
	}
	.intq-ai-modal {
		width: 100%;
		height: 100%;
		max-height: 100vh;
		border-radius: 0;
		border-left: none;
	}
	.intq-ai-policies-tab {
		display: none; /* Hide tab on mobile to avoid overlapping content */
	}
	.intq-ai-input-wrapper { padding-bottom: 28px; }
	.intq-ai-fab { display: none !important; }
}

/* Status Animations */
.intq-ai-status-label-anim { display: inline-block; position: absolute; left: 0; white-space: nowrap; }
.intq-pulse-text { animation: intq-pulse 1.2s infinite ease-in-out; display: inline-block; }
@keyframes intq-pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
.intq-slide-in-right { animation: intq-slide-in-right 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
@keyframes intq-slide-in-right { 0% { transform: translateX(100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
.intq-slide-out-left { animation: intq-slide-out-left 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
@keyframes intq-slide-out-left { 0% { transform: translateX(0); opacity: 1; } 100% { transform: translateX(-100%); opacity: 0; } }

/* ── Feedback buttons ─────────────────────────────────────────────────────── */
.intq-feedback-wrap {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-top: 4px;
	margin-bottom: 2px;
	animation: intq-card-in 0.3s ease;
}
.intq-feedback-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	border: none;
	background: transparent !important;
	box-shadow: none !important;
	outline: none !important;
	-webkit-appearance: none;
	appearance: none;
	color: #6b7280;
	cursor: pointer;
	transition: color 0.2s, transform 0.2s;
	line-height: 0;
}
.intq-feedback-btn:hover,
.intq-feedback-btn:focus,
.intq-feedback-btn:active { background: transparent !important; box-shadow: none !important; outline: none !important; transform: scale(1.2); }
.intq-feedback-btn.intq-feedback-like:hover    { color: #16a34a; }
.intq-feedback-btn.intq-feedback-dislike:hover { color: #dc2626; }
.intq-feedback-btn.intq-feedback-copy:hover    { color: var(--intq-orange); }
.intq-feedback-btn.intq-feedback-active.intq-feedback-like    { color: #16a34a; transform: scale(1.25); }
.intq-feedback-btn.intq-feedback-active.intq-feedback-dislike { color: #dc2626; transform: scale(1.25); }
.intq-feedback-voted .intq-feedback-btn:not(.intq-feedback-active) { opacity: 0.25; pointer-events: none; }


/* -- Inline Policy Panel (inside chat modal) --------------------------------*/
.intq-policy-panel {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	animation: intq-card-in 0.25s ease;
}
.intq-policy-panel.intq-hidden { display: none !important; }
.intq-policy-panel__topbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 20px;
	border-bottom: 1px solid rgba(230,150,5,0.15);
	flex-shrink: 0;
	direction: rtl;
}
.intq-policy-panel__title {
	font-family: 'Tajawal', sans-serif;
	font-size: 1rem;
	font-weight: 700;
	color: var(--intq-orange);
}
.intq-policy-back-btn {
	display: inline-flex;
	align-items: center;
	gap: 5px;
	background: transparent;
	border: none;
	padding: 0;
	color: var(--intq-text-soft);
	font-family: 'Tajawal', sans-serif;
	font-size: 0.88rem;
	font-weight: 600;
	cursor: pointer;
	transition: color 0.2s;
	outline: none;
	box-shadow: none;
}
.intq-policy-back-btn:hover,
.intq-policy-back-btn:focus,
.intq-policy-back-btn:active {
	color: var(--intq-orange);
	background: transparent !important;
	outline: none !important;
	box-shadow: none !important;
}
.intq-policy-panel__body {
	flex-grow: 1;
	padding: 22px;
	overflow-y: auto;
	font-family: 'Tajawal', sans-serif;
	font-size: 0.95rem;
	line-height: 1.9;
	color: var(--intq-text);
	direction: rtl;
	text-align: right;
	white-space: pre-wrap;
}
.intq-policy-panel__body::-webkit-scrollbar       { width: 4px; }
.intq-policy-panel__body::-webkit-scrollbar-track { background: transparent; }
.intq-policy-panel__body::-webkit-scrollbar-thumb { background: rgba(230,150,5,0.3); border-radius: 4px; }
.intq-policy-empty { text-align: center; color: #9ca3af; padding: 60px 0; font-size: 0.9rem; }

/* ── Dark Mode ───────────────────────────────────────────────────────────── */
.intq-dark-mode .intq-ai-modal,
.intq-dark-mode .intq-policy-panel {
	background: var(--intq-ai-dark-bg);
	color: #f3f4f6;
}

.intq-dark-mode .intq-ai-header {
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.intq-dark-mode .intq-ai-close-btn,
.intq-dark-mode .intq-policy-back-btn {
	color: #9ca3af;
}

.intq-dark-mode .intq-ai-close-btn:hover,
.intq-dark-mode .intq-policy-back-btn:hover {
	color: var(--intq-orange);
}

.intq-dark-mode .intq-ai-welcome-card h3 span {
	color: #9ca3af !important;
}

.intq-dark-mode .intq-ai-input-wrapper {
	background: transparent;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.intq-dark-mode .intq-ai-input-container {
	background: rgba(255, 255, 255, 0.05);
	border-color: rgba(255, 255, 255, 0.1);
}

.intq-dark-mode #intq-ai-input {
	color: #f3f4f6;
}

.intq-dark-mode #intq-ai-input::placeholder {
	color: rgba(255, 255, 255, 0.4);
}

.intq-dark-mode .intq-ai-bubble,
.intq-dark-mode .intq-ai-answer-card,
.intq-dark-mode .intq-ai-bubble p,
.intq-dark-mode .intq-ai-bubble li,
.intq-dark-mode .intq-ai-answer-card p,
.intq-dark-mode .intq-ai-answer-card li {
	color: #e5e7eb !important;
}

.intq-dark-mode .intq-ai-bubble--user {
	color: #ffffff;
}

.intq-dark-mode .intq-policy-panel__body {
	color: #e5e7eb;
}
`;
        
        const primaryColor = config.primaryColor || '#E69605';
        const secondaryColor = config.secondaryColor || '#1e3a5f';
        const botName = config.botName || 'مستشار انطلاقة';
        const botLogoUrl = config.botLogoUrl || 'https://intilaqa-edu.com/wp-content/uploads/2025/12/intilaqa-footer.svg';
        const welcomeLine1 = config.welcomeMessage || 'مرحباً، أنا مساعد انطلاقة الذكي';
        const welcomeLine2 = config.welcomeSubMessage || 'كيف يمكنني مساعدتك اليوم؟';
        const placeholder = config.placeholder || 'اسأل المستشار...';

        const rawHtmlStr = `
<div id="intq-ai-shadow-host" style="position: fixed; z-index: 2147483647; right: 0; bottom: 0; left: 0; pointer-events: none; direction: ltr;"></div>
<template id="intq-ai-shadow-template">
<style>
  \${cssContent}
  
  :host {
    all: initial;
    pointer-events: none;
    font-family: inherit;
    --intq-ai-primary: \${primaryColor} !important;
    --intq-ai-secondary: \${secondaryColor} !important;
    --intq-ai-dark-bg: #1f2937 !important;
  }
  .intq-ai-fab, .intq-ai-overlay { pointer-events: auto; }
</style>

<!-- FAB -->
<button id="intq-ai-fab" class="intq-ai-fab" aria-label="افتح المستشار">
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" style="flex-shrink:0;">
    <path d="M76,64.05h-22.43c-.55,0-1-.45-1-1s.45-1,1-1h21.43v-8.67c0-.55.45-1,1-1s1,.45,1,1v9.67c0,.55-.45,1-1,1ZM48.21,64.05h-24.21c-.55,0-1-.45-1-1v-7.89c0-.55.45-1,1-1s1,.45,1,1v6.89h23.21c.55,0,1,.45,1,1s-.45,1-1,1ZM24,50.8c-.55,0-1-.45-1-1v-19.35c0-.55.45-1,1-1h32.11c.55,0,1,.45,1,1s-.45,1-1,1h-31.1v18.34c0,.55-.45,1-1,1ZM76,49.02c-.55,0-1-.45-1-1v-16.56h-13.54c-.55,0-1-.45-1-1s.45-1,1-1h14.54c.55,0,1,.45,1,1v17.57c0,.55-.45,1-1,1Z"/>
    <path d="M56.49,70.55h-12.6c-.55,0-1-.45-1-1s.45-1,1-1h11.6v-4.49h-11v.55c0,.55-.45,1-1,1s-1-.45-1-1v-1.55c0-.55.45-1,1-1h13c.55,0,1,.45,1,1v6.5c0,.55-.45,1-1,1Z"/>
    <path d="M67.74,60.35h-32.11c-.55,0-1-.45-1-1s.45-1,1-1h32.11c.55,0,1,.45,1,1s-.45,1-1,1ZM30.28,60.35h-2.77c-.55,0-1-.45-1-1v-25.22c0-.55.45-1,1-1h32.11c.55,0,1,.45,1,1s-.45,1-1,1h-31.1v23.21h1.76c.55,0,1,.45,1,1s-.45,1-1,1ZM72.48,59.74c-.55,0-1-.45-1-1v-23.6h-6.5c-.55,0-1-.45-1-1s.45-1,1-1h7.5c.55,0,1,.45,1,1v24.6c0,.55-.45,1-1,1Z"/>
    <path d="M43.49,44.45h-6.5c-.55,0-1-.45-1-1v-6.5c0-.55.45-1,1-1h6.5c.55,0,1,.45,1,1v6.5c0,.55-.45,1-1,1ZM37.99,42.44h4.5v-4.49h-4.5v4.49Z"/>
    <path d="M63,44.45h-6.5c-.55,0-1-.45-1-1v-6.5c0-.55.45-1,1-1h6.5c.55,0,1,.45,1,1v6.5c0,.55-.45,1-1,1ZM57.5,42.44h4.49v-4.49h-4.49v4.49Z"/>
    <path d="M49.99,57.45c-7.85,0-14.01-3.3-14.01-7.5,0-.55.45-1,1-1h.6c.55,0,1,.45,1,1,0,.35-.18.65-.45.83.88,2.38,5.42,4.66,11.84,4.66s10.75-2.17,11.78-4.49h-18.83c-.55,0-1-.45-1-1s.45-1,1-1h20.05c.55,0,1,.45,1,1,0,4.21-6.15,7.5-14.01,7.5Z"/>
  </svg>
  <span>\${botName}</span>
</button>

<!-- Overlay -->
<div id="intq-ai-overlay" class="intq-ai-overlay intq-hidden" dir="rtl">
  <div class="intq-ai-modal" role="dialog" aria-modal="true">
    <div class="intq-ai-header">
      <span class="intq-ai-title"><img src="\${botLogoUrl}" style="height: 44px; max-width: 150px; object-fit: contain;"></span>
      <button id="intq-ai-close" class="intq-ai-close-btn"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256" fill="currentColor"><path d="M224,40V216a8,8,0,0,1-16,0V40a8,8,0,0,1,16,0ZM141.66,74.34,187.31,120H32a8,8,0,0,0,0,16H187.31l-45.65,45.66a8,8,0,0,0,11.32,11.32l56-56a8,8,0,0,0,0-11.32l-56-56a8,8,0,0,0-11.32,11.32Z"/></svg></button>
    </div>
    <div id="intq-ai-response-area">
      <div class="intq-ai-welcome-card" id="intq-welcome-card">
        <svg xmlns="http://www.w3.org/2000/svg" width="84" height="84" viewBox="0 0 100 100" fill="var(--intq-ai-primary)">
          <path d="M76,64.05h-22.43c-.55,0-1-.45-1-1s.45-1,1-1h21.43v-8.67c0-.55.45-1,1-1s1,.45,1,1v9.67c0,.55-.45,1-1,1ZM48.21,64.05h-24.21c-.55,0-1-.45-1-1v-7.89c0-.55.45-1,1-1s1,.45,1,1v6.89h23.21c.55,0,1,.45,1,1s-.45,1-1,1ZM24,50.8c-.55,0-1-.45-1-1v-19.35c0-.55.45-1,1-1h32.11c.55,0,1,.45,1,1s-.45,1-1,1h-31.1v18.34c0,.55-.45,1-1,1ZM76,49.02c-.55,0-1-.45-1-1v-16.56h-13.54c-.55,0-1-.45-1-1s.45-1,1-1h14.54c.55,0,1,.45,1,1v17.57c0,.55-.45,1-1,1Z"/>
          <path d="M56.49,70.55h-12.6c-.55,0-1-.45-1-1s.45-1,1-1h11.6v-4.49h-11v.55c0,.55-.45,1-1,1s-1-.45-1-1v-1.55c0-.55.45-1,1-1h13c.55,0,1,.45,1,1v6.5c0,.55-.45,1-1,1Z"/>
          <path d="M67.74,60.35h-32.11c-.55,0-1-.45-1-1s.45-1,1-1h32.11c.55,0,1,.45,1,1s-.45,1-1,1ZM30.28,60.35h-2.77c-.55,0-1-.45-1-1v-25.22c0-.55.45-1,1-1h32.11c.55,0,1,.45,1,1s-.45,1-1,1h-31.1v23.21h1.76c.55,0,1,.45,1,1s-.45,1-1,1ZM72.48,59.74c-.55,0-1-.45-1-1v-23.6h-6.5c-.55,0-1-.45-1-1s.45-1,1-1h7.5c.55,0,1,.45,1,1v24.6c0,.55-.45,1-1,1Z"/>
          <path d="M43.49,44.45h-6.5c-.55,0-1-.45-1-1v-6.5c0-.55.45-1,1-1h6.5c.55,0,1,.45,1,1v6.5c0,.55-.45,1-1,1ZM37.99,42.44h4.5v-4.49h-4.5v4.49Z"/>
          <path d="M63,44.45h-6.5c-.55,0-1-.45-1-1v-6.5c0-.55.45-1,1-1h6.5c.55,0,1,.45,1,1v6.5c0,.55-.45,1-1,1ZM57.5,42.44h4.49v-4.49h-4.49v4.49Z"/>
          <path d="M49.99,57.45c-7.85,0-14.01-3.3-14.01-7.5,0-.55.45-1,1-1h.6c.55,0,1,.45,1,1,0,.35-.18.65-.45.83.88,2.38,5.42,4.66,11.84,4.66s10.75-2.17,11.78-4.49h-18.83c-.55,0-1-.45-1-1s.45-1,1-1h20.05c.55,0,1,.45,1,1,0,4.21-6.15,7.5-14.01,7.5Z"/>
        </svg>
        <h3 style="color: var(--intq-ai-secondary) !important; font-weight: bold !important; margin: 0; padding-top: 12px; font-size: 1.15rem; font-family: 'Tajawal', sans-serif !important; border: none; background: transparent; line-height: 1.6;">
          \${welcomeLine1}
          <span style="display: block; font-size: 0.92rem; font-weight: normal; color: #64748b; margin-top: 6px;">
            \${welcomeLine2}
          </span>
        </h3>
      </div>
      <div id="intq-ai-answer" class="intq-ai-answer-card intq-hidden" aria-live="polite"></div>
    </div>
    
    <div class="intq-ai-input-wrapper">
      <div id="intq-ai-status" class="intq-ai-status intq-hidden" aria-live="polite">
        <svg class="intq-ai-spinner" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
          <path d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"/>
        </svg>
        <span id="intq-ai-timer" class="intq-ai-timer"></span>
        <div id="intq-status-text-wrapper" style="position: relative; overflow: hidden; display: flex; align-items: center; width: 190px; height: 20px; direction: ltr; text-align: left;">
          <span id="intq-ai-status-label" class="intq-ai-status-label-anim"></span>
        </div>
      </div>
      
      <!-- Profile panel omitted for simplicity in standalone widget unless explicitly requested, or included if needed -->

      <div class="intq-ai-input-container" id="intq-input-pill">
        <textarea id="intq-ai-input" placeholder="\${placeholder}" dir="rtl" rows="1"></textarea>
        <div class="intq-ai-input-actions">
          <button id="intq-ai-send" aria-label="إرسال">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 256 256">
              <path d="M232,127.89a16,16,0,0,1-8.18,14L55.91,233.79A16.14,16.14,0,0,1,48,236a16,16,0,0,1-15.05-21.34L60.3,138.71A4,4,0,0,1,64.09,136H136a8,8,0,0,0,0-16H64.09a4,4,0,0,1-3.79-2.72L32.95,41.34A16,16,0,0,1,55.91,22.21L223.82,113.84A16,16,0,0,1,232,127.89Z"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="intq-ai-footer-bar" style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; padding:0 4px;">
        <div class="intq-ai-new-wrap" id="intq-new-wrap" style="display:none;">
          <button id="intq-ai-new" class="intq-ai-new-btn" style="display:inline-flex; align-items:center; justify-content:center; gap:6px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16">
              <polyline points="176.2 99.7 224.2 99.7 224.2 51.7"/><polyline points="79.8 156.3 31.8 156.3 31.8 204.3"/><path d="M65.8,65.8a87.9,87.9,0,0,1,124.4,0l34,33.9"/><path d="M190.2,190.2a87.9,87.9,0,0,1-124.4,0l-34-33.9"/>
            </svg>
            سؤال جديد
          </button>
        </div>
        <div class="intq-ai-branding" style="font-size: 11.5px; color: #a1a1aa; font-family: 'Inter', 'Segoe UI', sans-serif; direction: ltr; margin-right: auto;">
          Powered by <span style="color: var(--intq-orange); font-weight: 600;">Intilaqa</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
`;

        // We replace the variable placeholders in the HTML string with actual JS values
        const templateHtml = rawHtmlStr
            .replace(/\$\{cssContent\}/g, cssContent)
            .replace(/\$\{primaryColor\}/g, primaryColor)
            .replace(/\$\{secondaryColor\}/g, secondaryColor)
            .replace(/\$\{botName\}/g, botName)
            .replace(/\$\{botLogoUrl\}/g, botLogoUrl)
            .replace(/\$\{welcomeLine1\}/g, welcomeLine1)
            .replace(/\$\{welcomeLine2\}/g, welcomeLine2)
            .replace(/\$\{placeholder\}/g, placeholder);
        
        const container = document.createElement('div');
        container.innerHTML = templateHtml;
        document.body.appendChild(container);

        // Execute original logic
        /**
 * Intilaqa AI â€” Chat JS v5.1
 * - Full chat history (user bubbles + AI bubbles)
 * - Welcome card hides after first message
 * - Icons: SVG inline (no emoji)
 */

	'use strict';

	const cfg = window.IntilaqaAIConfig || {};

	const host = document.getElementById('intq-ai-shadow-host');
	const template = document.getElementById('intq-ai-shadow-template');
	if (!host || !template) return;
	
	const shadowRoot = host.shadowRoot || host.attachShadow({ mode: 'open' });
	if (shadowRoot.childNodes.length === 0) {
		shadowRoot.appendChild(template.content.cloneNode(true));
	}

	// â”€â”€ DOM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
	const fab          = shadowRoot.getElementById( 'intq-ai-fab' );
	const overlay      = shadowRoot.getElementById( 'intq-ai-overlay' );
	const closeBtn     = shadowRoot.getElementById( 'intq-ai-close' );
	const input        = shadowRoot.getElementById( 'intq-ai-input' );
	const sendBtn      = shadowRoot.getElementById( 'intq-ai-send' );
	const statusWrap   = shadowRoot.getElementById( 'intq-ai-status' );
	const statusLabel  = shadowRoot.getElementById( 'intq-ai-status-label' );
	const welcomeCard  = shadowRoot.getElementById( 'intq-welcome-card' );
	const welcomeCustWrap = shadowRoot.getElementById( 'intq-ai-welcome-customize-wrap' );
	const welcomeCustBtn  = shadowRoot.getElementById( 'intq-ai-welcome-customize-btn' );
	const newBtn       = shadowRoot.getElementById( 'intq-ai-new' );
	const newWrap      = shadowRoot.getElementById( 'intq-new-wrap' );
	const responseArea = shadowRoot.getElementById( 'intq-ai-response-area' );

	// Profile elements
	const profileToggle = shadowRoot.getElementById( 'intq-ai-profile-toggle' );
	const profilePanel  = shadowRoot.getElementById( 'intq-ai-profile-panel' );
	const profileSave   = shadowRoot.getElementById( 'intq-ai-profile-save' );
	const profName      = shadowRoot.getElementById( 'intq-profile-name' );
	const profNat       = shadowRoot.getElementById( 'intq-profile-nationality' );
	const profGpa       = shadowRoot.getElementById( 'intq-profile-gpa' );
	const profBudget    = shadowRoot.getElementById( 'intq-profile-budget' );
	const profMajor     = shadowRoot.getElementById( 'intq-profile-major' );
	const profLang      = shadowRoot.getElementById( 'intq-profile-language' );

	if ( ! fab || ! overlay ) return;

	// â”€â”€ Session â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
	// Generate a fresh session ID on every page load.
	// conversationId is stored in sessionStorage so memory persists within the tab session,
	// but resets on page refresh (new tab = new conversation).
	sessionStorage.removeItem( 'intq_ai_session' );
	localStorage.removeItem( 'intq_user_profile' );
	let sessionId = genId();
	let msgIndex  = 0; // counter for each AI response
	function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

	// â”€â”€ Open / Close â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
	function openModal() {
		overlay.classList.remove( 'intq-hidden' );
		document.body.style.overflow = 'hidden';
		requestAnimationFrame( () => input && input.focus() );
	}
	function closeModal() {
		overlay.classList.add( 'intq-hidden' );
		document.body.style.overflow = '';
		if ( profilePanel ) profilePanel.classList.add( 'intq-hidden' );
	}

	fab.addEventListener(     'click', openModal );
	closeBtn.addEventListener('click', closeModal );
	overlay.addEventListener( 'click', e => { if ( e.target === overlay ) closeModal(); } );

	// â”€â”€ Policy Link (header) â†’ Inline Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
	const policiesTab = shadowRoot.getElementById( 'intq-ai-policies-tab' );
	const policyPanel = shadowRoot.getElementById( 'intq-policy-panel' );
	const policyBody  = shadowRoot.getElementById( 'intq-policy-body' );
	const policyBack  = shadowRoot.getElementById( 'intq-policy-back' );

	function showPolicyPanel() {
		if ( ! policyPanel ) return;
		const text = ( cfg.usagePolicyText || '' ).trim();
		if ( policyBody ) {
			policyBody.innerHTML = text
				? text
				: '<p class="intq-policy-empty">لم تُحدد سياسة استخدام بعد. يرجى التواصل مع إدارة الموقع.</p>';
		}
		if ( responseArea ) responseArea.style.display = 'none';
		policyPanel.classList.remove( 'intq-hidden' );
		policyPanel.setAttribute( 'aria-hidden', 'false' );
	}

	function hidePolicyPanel() {
		if ( ! policyPanel ) return;
		policyPanel.classList.add( 'intq-hidden' );
		policyPanel.setAttribute( 'aria-hidden', 'true' );
		if ( responseArea ) responseArea.style.display = '';
	}

	if ( policiesTab ) policiesTab.addEventListener( 'click', showPolicyPanel );
	if ( policyBack )  policyBack.addEventListener(  'click', hidePolicyPanel );

	document.addEventListener( 'keydown', e => {
		if ( ( e.ctrlKey || e.metaKey ) && e.key === 'k' ) {
			e.preventDefault();
			overlay.classList.contains('intq-hidden') ? openModal() : closeModal();
		}
		if ( e.key === 'Escape' && ! overlay.classList.contains('intq-hidden') ) closeModal();
	} );

	// â”€â”€ Input â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
	input.addEventListener( 'keydown', e => { 
		if ( e.key === 'Enter' && !e.shiftKey ) { 
			e.preventDefault(); 
			submit(); 
		} 
	} );

	input.addEventListener( 'input', function() {
		this.style.height = 'auto';
		const sh = this.scrollHeight;
		this.style.height = sh + 'px';
		// Show scrollbar only if text exceeds ~180px (our max-height is 200px)
		if ( sh > 180 ) {
			this.style.overflowY = 'auto';
		} else {
			this.style.overflowY = 'hidden';
		}
	} );

	sendBtn.addEventListener( 'click', submit );

	// â”€â”€ "New question" â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
	if ( newBtn ) {
		newBtn.addEventListener( 'click', () => {
			sessionStorage.removeItem( 'intq_ai_session' );
			sessionStorage.removeItem( 'intq_conversation_id' );
			sessionId = genId();
			msgIndex  = 0; // reset counter on new chat
			// Clear history, show welcome
			clearHistory();
			welcomeCard.classList.remove( 'intq-hidden' );
			if ( welcomeCustWrap ) welcomeCustWrap.style.display = 'block';
			if ( newWrap ) newWrap.style.display = 'none';
			input.value = '';
			input.focus();
		} );
	}

	// â”€â”€ Profile Logic â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
	function loadProfile() {
		try {
			const data = JSON.parse( localStorage.getItem( 'intq_user_profile' ) );
			if ( data ) {
				if ( profName ) profName.value = data.name || '';
				if ( profNat ) profNat.value = data.nationality || '';
				if ( profGpa ) profGpa.value = data.gpa || '';
				if ( profBudget ) profBudget.value = data.budget || '';
				if ( profMajor ) profMajor.value = data.major || '';
				if ( profLang ) profLang.value = data.language || '';
			}
		} catch(e) {}
	}
	// Load immediately
	loadProfile();

	if ( profileToggle && profilePanel ) {
		profileToggle.addEventListener( 'click', () => {
			profilePanel.classList.toggle( 'intq-hidden' );
		} );
	}

	if ( welcomeCustBtn && profilePanel ) {
		welcomeCustBtn.addEventListener( 'click', () => {
			profilePanel.classList.toggle( 'intq-hidden' );
		} );
	}

	if ( profileSave ) {
		profileSave.addEventListener( 'click', () => {
			const profile = {
				name: profName ? profName.value.trim() : '',
				nationality: profNat ? profNat.value.trim() : '',
				gpa: profGpa ? profGpa.value.trim() : '',
				budget: profBudget ? profBudget.value.trim() : '',
				major: profMajor ? profMajor.value.trim() : '',
				language: profLang ? profLang.value.trim() : ''
			};
			localStorage.setItem( 'intq_user_profile', JSON.stringify( profile ) );
			
			// Flash effect on button to indicate save
			const originalText = profileSave.textContent;
			profileSave.textContent = 'تم الحفظ ✔';
			profileSave.style.background = '#10B981'; // Green
			
			setTimeout( () => {
				profileSave.textContent = originalText;
				profileSave.style.background = '';
				profilePanel.classList.add( 'intq-hidden' );
				input.focus();
			}, 800 );
		} );
	}

	// ────────────────────────────────────────────────────────────────────────────────
	/** Remove all dynamically added bubbles from the response area */
	function clearHistory() {
		responseArea.querySelectorAll( '.intq-user-bubble, .intq-ai-bubble, .intq-feedback-wrap, .intq-lead-form-card' ).forEach( el => el.remove() );
		statusWrap.classList.add( 'intq-hidden' );
		if ( welcomeCustWrap ) welcomeCustWrap.style.display = 'none';
		
		// Clear profile data to ensure fresh start
		localStorage.removeItem('intq_user_profile');
		if ( profName ) profName.value = '';
		if ( profNat ) profNat.value = '';
		if ( profGpa ) profGpa.value = '';
		if ( profBudget ) profBudget.value = '';
		if ( profMajor ) profMajor.value = '';
		if ( profLang ) profLang.value = '';
		
		conversationId = null;
		sessionStorage.removeItem('intq_conversation_id');
		chatHistory = [];
	}

	/** Append a user message bubble */
	function appendUserBubble( text ) {
		const wrap = document.createElement( 'div' );
		wrap.className = 'intq-user-bubble';
		const span = document.createElement( 'span' );
		span.className = 'intq-user-bubble__text';
		span.textContent = text; // safe: plain text
		wrap.appendChild( span );
		responseArea.appendChild( wrap );
		scrollBottom();
	}

	/** Create and append an empty AI bubble, return the inner element */
	function appendAiBubble() {
		const div = document.createElement( 'div' );
		div.className = 'intq-ai-bubble';
		responseArea.appendChild( div );
		scrollBottom();
		return div;
	}

	// ────────────────────────────────────────────────────────────────────────────────
	const timerEl = shadowRoot.getElementById( 'intq-ai-timer' );
	const statusWrapper = shadowRoot.getElementById('intq-status-text-wrapper');
	let swInterval = null;
	let startTime = 0;
	// Restore conversationId from sessionStorage so memory survives page navigation within same tab
	let conversationId = sessionStorage.getItem('intq_conversation_id');
	if (conversationId === "null" || conversationId === "undefined") conversationId = null;
	let chatHistory = [];

	function updateStatusText(newText) {
		if (!statusWrapper) {
			if (statusLabel) statusLabel.textContent = newText;
			return;
		}
		
		const currentLabels = statusWrapper.querySelectorAll('.intq-ai-status-label-anim');
		const isFirstLabel = currentLabels.length === 0;
		if (currentLabels.length > 0 && currentLabels[currentLabels.length-1].innerText === newText) {
			return;
		}

		const newLabel = document.createElement('div');
		newLabel.className = 'intq-ai-status-label-anim intq-slide-in-right';
		newLabel.innerHTML = `<span class="intq-pulse-text">${newText}</span>`;
		statusWrapper.appendChild(newLabel);

		if (!isFirstLabel) {
			const oldLabel = currentLabels[currentLabels.length-1];
			oldLabel.classList.remove('intq-slide-in-right');
			oldLabel.classList.add('intq-slide-out-left');
			setTimeout(() => {
				if(oldLabel.parentNode) oldLabel.remove();
			}, 380); // Corresponds to the 0.4s CSS animation
		}
	}

	function startStopwatch() {
		statusWrap.classList.remove( 'intq-hidden' );
		updateStatusText('AI is analyzing your request...');
		startTime = Date.now();
		if ( timerEl ) timerEl.textContent = '0.0s - ';
		
		swInterval = setInterval( () => {
			if ( timerEl ) {
				const diff = ((Date.now() - startTime) / 1000).toFixed(1);
				timerEl.textContent = `${diff}s - `;
			}
		}, 100 );
	}

	function stopStopwatch() {
		clearInterval( swInterval );
		swInterval = null;
		statusWrap.classList.add( 'intq-hidden' );
	}

	// ────────────────────────────────────────────────────────────────────────────────
	async function submit() {
		const text = input.value.trim();
		if ( ! text || sendBtn.disabled ) return;

		input.value = '';
		input.style.height = 'auto'; // Reset auto-resize
		sendBtn.disabled = true;

		// On first message: hide welcome card, show new-question button
		if ( ! welcomeCard.classList.contains('intq-hidden') ) {
			welcomeCard.classList.add( 'intq-hidden' );
		}
		if ( newWrap ) newWrap.style.display = 'block';

		// Add user bubble
		appendUserBubble( text );

		// Show loading status and start timer
		startStopwatch();

		const profileDataStr = localStorage.getItem( 'intq_user_profile' ) || '';

		const urlBase = cfg.engineUrl || 'https://intilaqa-ai.abo200004.workers.dev/';

		try {
			const response = await fetch( urlBase, {
				method: 'POST',
				cache: 'no-store',
				headers: { 
					'Content-Type': 'application/json',
					'X-Client-Key': cfg.licenseKey || ''
				},
				body: JSON.stringify( {
					message:           text,
					history:           chatHistory,
					session_id:        sessionId,
					conversation_id:   conversationId,
					userProfile:       profileDataStr,
					bot_name:          cfg.agencyName || cfg.botName || '',
					allowedCountries:  cfg.allowedCountries || ['turkey'],
					experimentalRouterModel: cfg.experimentalRouterModel,
					experimentalRouterTemperature: cfg.experimentalRouterTemperature,
					experimentalRouterReasoning: cfg.experimentalRouterReasoning,
					experimentalAnsweringModel: cfg.experimentalAnsweringModel,
					experimentalAnsweringTemperature: cfg.experimentalAnsweringTemperature,
					experimentalAnsweringReasoning: cfg.experimentalAnsweringReasoning
				} ),
			} );

			if ( ! response.ok ) {
				let errMessage = 'HTTP ' + response.status;
				try {
					const errorJson = await response.json();
					if (errorJson.error) errMessage = errorJson.error;
				} catch(e) {
					errMessage = await response.text();
				}
				throw new Error(errMessage);
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder("utf-8");
			let buffer = '';
			let shouldRenderLeadForm = false;
			let hasRenderedLeadForm = false;
			let activeAiBubbleEl = null;
			let aiStreamFullText = '';
			const capturedMsg = text;

			while ( true ) {
				const { value, done } = await reader.read();
				if ( done ) break;

				buffer += decoder.decode( value, { stream: true } );
				let lines = buffer.split('\n');
				buffer = lines.pop(); // keep the last incomplete line in buffer

				for ( let line of lines ) {
					if ( ! line.trim() ) continue;
					try {
						const event = JSON.parse(line);
						if ( event.type === 'debug' ) {
							console.log('[INTQ_DEBUG] 🛠', event.msg);
						} else if ( event.type === 'error' ) {
							console.error('[INTQ_ERROR] ❌ Full error event:', JSON.stringify(event));
						} else {
							console.log('[INTQ_DEBUG] event received:', event.type, event);
						}
						
						if ( event.type === 'ping' ) {
							console.log('[INTQ_DEBUG] ping - connection alive');
						} else if ( event.type === 'tool' ) {
							if ( event.name === 'search_university_database' ) {
								updateStatusText('Searching university programs & prices...');
							} else if ( event.name === 'search_knowledge_base' ) {
								updateStatusText('Scanning knowledge base for answers...');
							} else if ( event.name === 'get_top_universities_by_quality' ) {
								updateStatusText('Analyzing quality ratings & rankings...');
							} else if ( event.name === 'fetch_university_rankings' ) {
								updateStatusText('Fetching live university rankings...');
							} else if ( event.name === 'fallback_get_general_policies' || event.name === 'get_general_policies' ) {
								updateStatusText('Reviewing admission policies...');
							} else if ( event.name === 'show_lead_form' ) {
								updateStatusText('Analyzing student intent...');
								if ( !hasRenderedLeadForm ) {
									renderLeadFormCard( capturedMsg );
									hasRenderedLeadForm = true;
								}
							} else {
								updateStatusText('Consulting sources...');
							}
						} else if ( event.type === 'lead_form' ) {
							shouldRenderLeadForm = true;
						} else if ( event.type === 'conversation_id' ) {
						    conversationId = event.id;
							if (event.id === null) {
								sessionStorage.removeItem('intq_conversation_id');
							} else {
						    	sessionStorage.setItem('intq_conversation_id', event.id);
							}
						}
						else if ( event.type === 'chunk_start' ) {
							// NATIVE SSE STREAM: START
							stopStopwatch();
							sendBtn.disabled = false;
							
							if ( event.profile ) {
								localStorage.setItem( 'intq_user_profile', JSON.stringify( event.profile ) );
								loadProfile();
							}
							if ( shouldRenderLeadForm && !hasRenderedLeadForm ) {
								renderLeadFormCard( capturedMsg );
								hasRenderedLeadForm = true;
								shouldRenderLeadForm = false;
							}
							activeAiBubbleEl = appendAiBubble();
							activeAiBubbleEl.classList.add('is-streaming');
							aiStreamFullText = '';
						} 
						else if ( event.type === 'chunk_delta' ) {
							// NATIVE SSE STREAM: DELTA
							aiStreamFullText += (event.content || '');
							if ( activeAiBubbleEl ) {
								activeAiBubbleEl.innerHTML = buildHtml( aiStreamFullText, aiStreamFullText.includes('[TRIGGER_SMART_SEARCH]') );
								scrollBottom();
							}
						}
						else if ( event.type === 'chunk_done' ) {
							// NATIVE SSE STREAM: END
							if ( activeAiBubbleEl ) {
								activeAiBubbleEl.classList.remove('is-streaming');
								chatHistory.push({ role: 'user', content: capturedMsg });
								chatHistory.push({ role: 'assistant', content: aiStreamFullText });
								if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20); // keep last 10 turns
								activeAiBubbleEl.innerHTML = buildHtml( aiStreamFullText.replace('[TRIGGER_SMART_SEARCH]', ''), false );
								addFeedbackButtons( activeAiBubbleEl, msgIndex++, capturedMsg );
								// Log to DB
								sendLogToServer( capturedMsg, aiStreamFullText );
							}
						}
						else if ( event.type === 'chunk' ) {
							// LEGACY FALLBACK OVERRIDES: pseudo interval typing
							stopStopwatch();
							sendBtn.disabled = false;
							
							if ( event.profile ) {
								localStorage.setItem( 'intq_user_profile', JSON.stringify( event.profile ) );
								loadProfile();
							}
							if ( shouldRenderLeadForm && !hasRenderedLeadForm ) {
								renderLeadFormCard( capturedMsg );
								hasRenderedLeadForm = true;
								shouldRenderLeadForm = false;
							}

							const aiEl = appendAiBubble();
							const capturedIdx = msgIndex++;

							streamInto( aiEl, event.content || '', () => {
								addFeedbackButtons( aiEl, capturedIdx, capturedMsg );
								// Log to DB
								sendLogToServer( capturedMsg, event.content || '' );
							} );
						}
						else if ( event.type === 'error' ) {
							stopStopwatch();
							sendBtn.disabled = false;
							const bubble = appendAiBubble();
							const rawMsg = event.message || '';
							const safeMsg = (rawMsg && !rawMsg.trim().startsWith('{'))
								? rawMsg
								: 'عذراً، حدث خطأ مؤقت. يرجى إعادة المحاولة.';
							bubble.innerHTML = buildHtml( safeMsg, false );
						}
					} catch(e) {
						console.error('JSON Parse error on line:', line, e);
					}
				}
			}
			
			// Failsafe if done event didn't trigger
			stopStopwatch();
			sendBtn.disabled = false;

		} catch ( err ) {
			stopStopwatch();
			sendBtn.disabled = false;
			const bubble = appendAiBubble();
			console.error("[INTQ_ERROR]", err);
			const errMsg = err.message || 'حدث خطأ في الاتصال.';
			bubble.innerHTML = buildHtml( 'خطأ: ' + errMsg, false );
		}
	}

	// ────────────────────────────────────────────────────────────────────────────────
	function streamInto( el, full, onComplete ) {
		const hasSearch = full.includes( '[TRIGGER_SMART_SEARCH]' );
		const clean     = full.replace( '[TRIGGER_SMART_SEARCH]', '' ).trimEnd();

		el.innerHTML = '';
		el.classList.add( 'is-streaming' );

		const total = clean.length;
		const chunk = total > 800 ? 5 : total > 300 ? 2 : 1;
		const delay = total > 800 ? 6  : total > 300 ? 10 : 14;
		let i = 0;

		const tick = setInterval( () => {
			if ( i >= total ) {
				clearInterval( tick );
				el.classList.remove( 'is-streaming' );
				el.innerHTML = buildHtml( clean, hasSearch );
				scrollBottom();
				if ( typeof onComplete === 'function' ) onComplete();
				return;
			}
			el.innerHTML = buildHtml( clean.slice( 0, i + chunk ), false );
			i += chunk;
			scrollBottom();
		}, delay );
	}

	function scrollBottom() {
		if ( responseArea ) responseArea.scrollTop = responseArea.scrollHeight;
	}

	function sendLogToServer( userMsg, aiResp ) {
		const url = cfg.ajaxUrl || '/wp-admin/admin-ajax.php';
		const body = new URLSearchParams({
			action: 'intq_client_log_chat',
			nonce: cfg.logNonce || '',
			session_id: sessionId,
			user_message: userMsg,
			ai_response: aiResp.slice(0, 3000) // cap length
		});
		fetch( url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() } ).catch(e => console.error(e));
	}

	// ────────────────────────────────────────────────────────────────────────────────
	function renderLeadFormCard( lastUserMsg ) {
		const card = document.createElement('div');
		card.className = 'intq-lead-form-card';
		card.innerHTML = `
			<div class="intq-lead-header">
				<span class="intq-lead-icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="32" height="32" fill="currentColor">
					  <path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.53,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51C215.1,186.29,224,166.7,224,166.29a15.89,15.89,0,0,0,3.94-10.45V117.87l23.82-14.81A8,8,0,0,0,251.76,88.94ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.4l76.24,40.66a8,8,0,0,0,7.52,0L208,126.4v39.75C197.8,177.37,174.55,200,128,200ZM128,151.05,21.84,96,128,40.95,234.16,96Z"></path>
					</svg>
				</span>
				<div>
					<strong>تحدث مع مستشارك الآن</strong>
					<p>احجز استشارة مجانية خلال دقائق</p>
				</div>
			</div>
			<div class="intq-lead-fields">
				<input class="intq-lead-input" type="text" placeholder="الاسم الكامل" id="intq-lead-name-${Date.now()}" autocomplete="name" />
				<div style="display: flex; gap: 8px; align-items: center; width: 100%;">
					<select id="intq-lead-ccode-${Date.now()}" class="intq-lead-input" style="width: 100px; padding: 12px 6px !important; direction: ltr;">
						<option value="+966">🇸🇦 +966</option>
						<option value="+971">🇦🇪 +971</option>
						<option value="+965">🇰🇼 +965</option>
						<option value="+974">🇶🇦 +974</option>
						<option value="+968">🇴🇲 +968</option>
						<option value="+973">🇧🇭 +973</option>
						<option value="+20">🇪🇬 +20</option>
						<option value="+962">🇯🇴 +962</option>
						<option value="+961">🇱🇧 +961</option>
						<option value="+964">🇮🇶 +964</option>
						<option value="+213">🇩🇿 +213</option>
						<option value="+212">🇲🇦 +212</option>
						<option value="+216">🇹🇳 +216</option>
						<option value="+218">🇱🇾 +218</option>
						<option value="+249">🇸🇩 +249</option>
						<option value="+970">🇵🇸 +970</option>
						<option value="+967">🇾🇪 +967</option>
						<option value="+963" selected>🇸🇾 +963</option>
						<option value="+90">🇹🇷 +90</option>
						<option value="+1">🇺🇸/🇨🇦 +1</option>
						<option value="+44">🇬🇧 +44</option>
						<option value="+49">🇩🇪 +49</option>
					</select>
					<input class="intq-lead-input" style="flex: 1;" type="tel" placeholder="رقم الواتساب" id="intq-lead-phone-${Date.now()}" autocomplete="tel" dir="ltr" />
				</div>
			</div>
			<div class="intq-lead-status" style="display:none;"></div>
			<button class="intq-lead-submit-btn">إرسال وسنتواصل معك →</button>
		`;

		const nameInput   = card.querySelector('input[type="text"]');
		const ccodeInput  = card.querySelector('select');
		const phoneInput  = card.querySelector('input[type="tel"]');
		const statusDiv   = card.querySelector('.intq-lead-status');
		const submitBtn   = card.querySelector('.intq-lead-submit-btn');

		submitBtn.addEventListener('click', async () => {
			const name  = nameInput.value.trim();
			const phone = phoneInput.value.trim();
			const ccode = ccodeInput.value;

			if ( !name || !phone ) {
				statusDiv.style.display = 'block';
				statusDiv.className = 'intq-lead-status intq-lead-status--error';
				statusDiv.textContent = 'يُرجى ملء جميع الحقول.';
				return;
			}

			submitBtn.disabled = true;
			submitBtn.textContent = 'جاري الإرسال...';

			const body = new URLSearchParams({
				action:     cfg.leadAction || 'intq_ai_lead_submit',
				nonce:      cfg.leadNonce  || '',
				lead_name:  name,
				lead_phone: ccode + ' ' + phone,
				session_id: sessionId,
				context:    lastUserMsg.slice(0, 300),
			});

			try {
				const res  = await fetch( cfg.ajaxUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
				const json = await res.json();

				if ( json.success ) {
					card.innerHTML = `
						<div class="intq-lead-success">
							<span style="font-size:2rem">✅</span>
							<strong>تم الإرسال بنجاح!</strong>
							<p>سيتواصل معك مستشارنا خلال أقل من ساعة على رقم الواتسآب الذي أدخلته.</p>
						</div>`;
				} else {
					statusDiv.style.display = 'block';
					statusDiv.className = 'intq-lead-status intq-lead-status--error';
					statusDiv.textContent = json.data?.message || 'حدث خطأ، حاول مرة أخرى.';
					submitBtn.disabled = false;
					submitBtn.textContent = 'إرسال وسنتواصل معك →';
				}
			} catch(e) {
				statusDiv.style.display = 'block';
				statusDiv.className = 'intq-lead-status intq-lead-status--error';
				statusDiv.textContent = 'تعذر الاتصال بالخادم.';
				submitBtn.disabled = false;
				submitBtn.textContent = 'إرسال وسنتواصل معك →';
			}
		});

		responseArea.appendChild(card);
		scrollBottom();

		// Inject styles once
		if ( !shadowRoot.getElementById('intq-lead-styles') ) {
			const style = document.createElement('style');
			style.id = 'intq-lead-styles';
			style.textContent = `
				#intq-ai-response-area .intq-lead-form-card {
					background: #ffffff;
					border: 1px solid rgba(0,0,0,0.08);
					border-radius: 12px;
					padding: 20px;
					margin: 12px 0;
					animation: intqFadeUp 0.4s ease;
					direction: rtl;
					font-family: inherit;
					box-shadow: 0 4px 12px rgba(0,0,0,0.04);
				}
				@keyframes intqFadeUp {
					from { opacity:0; transform:translateY(12px); }
					to   { opacity:1; transform:translateY(0); }
				}
				#intq-ai-response-area .intq-lead-header {
					display: flex;
					align-items: center;
					gap: 12px;
					margin-bottom: 16px;
				}
				#intq-ai-response-area .intq-lead-icon svg { 
					color: var(--intq-ai-primary);
					display: block;
				}
				#intq-ai-response-area .intq-lead-header strong {
					display: block;
					color: var(--intq-ai-primary);
					font-size: 1rem;
					font-weight: 700;
				}
				#intq-ai-response-area .intq-lead-header p {
					margin: 2px 0 0;
					font-size: 0.85rem;
					color: #64748b;
				}
				#intq-ai-response-area .intq-lead-fields {
					display: flex;
					flex-direction: column;
					gap: 12px;
					margin-bottom: 16px;
				}
				#intq-ai-response-area .intq-lead-input {
					width: 100%;
					padding: 12px 14px !important;
					border: 1px solid #cbd5e1 !important;
					border-radius: 8px !important;
					background: #f8fafc !important;
					font-family: inherit !important;
					font-size: 0.95rem !important;
					color: #1e293b !important;
					outline: none !important;
					transition: border-color 0.2s, box-shadow 0.2s, background 0.2s !important;
					box-sizing: border-box !important;
					line-height: normal !important;
					height: auto !important;
				}
				#intq-ai-response-area .intq-lead-input:focus {
					border-color: var(--intq-ai-primary) !important;
					background: #fff !important;
					box-shadow: 0 0 0 3px var(--intq-orange-glow) !important;
				}
				#intq-ai-response-area .intq-lead-submit-btn {
					width: 100%;
					padding: 12px;
					background: var(--intq-orange);
					color: #fff;
					border: none;
					border-radius: 40px;
					font-family: inherit;
					font-size: 1rem;
					font-weight: 700;
					cursor: pointer;
					transition: background 0.2s, transform 0.1s;
					box-shadow: 0 4px 12px var(--intq-orange-glow);
				}
				#intq-ai-response-area .intq-lead-submit-btn:hover:not(:disabled) {
					background: var(--intq-orange-hov);
					transform: translateY(-1px);
					box-shadow: 0 6px 16px var(--intq-orange-glow);
				}
				#intq-ai-response-area .intq-lead-submit-btn:active:not(:disabled) {
					transform: scale(0.98);
				}
				#intq-ai-response-area .intq-lead-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
				#intq-ai-response-area .intq-lead-status { padding: 8px 12px; border-radius: 8px; font-size: 0.88rem; margin-bottom: 12px; }
				#intq-ai-response-area .intq-lead-status--error { background: rgba(239,68,68,0.08); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }
				#intq-ai-response-area .intq-lead-success { text-align: center; padding: 16px 0; }
				#intq-ai-response-area .intq-lead-success strong { display:block; margin:8px 0 4px; color: var(--intq-ai-primary); font-size:1.1rem; font-weight:700; }
				#intq-ai-response-area .intq-lead-success p { color:#64748b; font-size:0.9rem; margin:0; }
			`;
			shadowRoot.appendChild(style);
		}
	}

	// â”€â”€ Feedback buttons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
	const THUMB_UP = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 256 256" fill="currentColor"><path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"/></svg>`;
	const THUMB_DN = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 256 256" fill="currentColor"><path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z"/></svg>`;
	const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 256 256" fill="currentColor"><path d="M216,40H88a8,8,0,0,0-8,8V72H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V184h40a8,8,0,0,0,8-8V48A8,8,0,0,0,216,40Zm-56,168H48V88H160Zm48-32H176V80a8,8,0,0,0-8-8H96V56H208Z"/></svg>`;

	function addFeedbackButtons( aiEl, idx, userMsg ) {
		const wrap = document.createElement( 'div' );
		wrap.className = 'intq-feedback-wrap';
		wrap.innerHTML = `
			<button class="intq-feedback-btn intq-feedback-like" data-val="1" title="إجابة مفيدة">${THUMB_UP}</button>
			<button class="intq-feedback-btn intq-feedback-dislike" data-val="-1" title="إجابة غير مفيدة">${THUMB_DN}</button>
			<button class="intq-feedback-btn intq-feedback-copy" title="نسخ الجواب">${COPY_ICON}</button>
		`;

		wrap.querySelectorAll( '.intq-feedback-like, .intq-feedback-dislike' ).forEach( btn => {
			btn.addEventListener( 'click', function () {
				if ( wrap.classList.contains( 'intq-feedback-voted' ) ) return;
				wrap.classList.add( 'intq-feedback-voted' );
				this.classList.add( 'intq-feedback-active' );
				submitFeedback( parseInt( this.dataset.val ), idx, userMsg, aiEl.innerText );
			} );
		} );

		const copyBtn = wrap.querySelector( '.intq-feedback-copy' );
		if ( copyBtn ) {
			copyBtn.addEventListener( 'click', () => {
				navigator.clipboard.writeText( aiEl.innerText ).then( () => {
					copyBtn.innerHTML = 'âœ”';
					copyBtn.classList.add( 'intq-feedback-active' );
					setTimeout( () => {
						copyBtn.innerHTML = COPY_ICON;
						copyBtn.classList.remove( 'intq-feedback-active' );
					}, 1500 );
				} );
			} );
		}

		// Insert after the AI bubble
		aiEl.insertAdjacentElement( 'afterend', wrap );
	}

	function submitFeedback( val, idx, userMsg, aiText ) {
		const url   = cfg.ajaxUrl || '/wp-admin/admin-ajax.php';
		const body  = new URLSearchParams( {
			action:        'intq_ai_feedback',
			nonce:         cfg.nonce || '',
			feedback:      val,
			session_id:    sessionId,
			message_index: idx,
			user_message:  userMsg,
			ai_response:   aiText.slice( 0, 2000 ), // cap at 2000 chars
		} );
		fetch( url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() } );
	}

	// â”€â”€ HTML builder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
	function buildHtml( text, appendSearch ) {
		let html = text;

		if ( typeof marked !== 'undefined' ) {
			// Using marked.js for native markdown parsing
			html = marked.parse( text );
		} else {
			// Fallback regex parsing
			html = text
				.replace( /&/g,'&amp;' ).replace( /</g,'&lt;' ).replace( />/g,'&gt;' )
				.replace( /^(#{1,3})\s+(.*)$/gm, '<strong style="display:block; margin-top:8px; margin-bottom:4px; font-size:1.05em; color:var(--intq-ai-primary)">$2</strong>' )
				.replace( /\*\*(.*?)\*\*/g, '<strong>$1</strong>' )
				.replace( /\*(.*?)\*/g,     '<em>$1</em>' );

			html = html.replace( /^[\-\*]\s+(.*)$/gm, '<li>$1</li>' );
			html = html.replace( /(<li>.*?<\/li>(?:\n<li>.*?<\/li>)*)/g, '<ul style="margin: 8px 0; padding-right: 20px; list-style-type: disc;">$1</ul>' );
			html = html.replace( /\n/g, '<br>' );
			html = html.replace( /<br><ul/g, '<ul' ).replace( /<\/ul><br>/g, '</ul>' );
			html = html.replace( /(<ul.*?>)(.*?)<\/ul>/g, function(match, attrs, content) {
				return attrs + content.replace( /<br>/g, '' ) + '</ul>';
			} );
		}

		if ( appendSearch ) {
			html += '<br><button class="intilaqa-trigger-smart-search intq-open-search" style="margin-top:12px;">افتح أداة البحث للمقارنة المتقدمة</button>';
		}
		return html;
	}


    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => loadMarked(initWidget));
    } else {
        loadMarked(initWidget);
    }
})();