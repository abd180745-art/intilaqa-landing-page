/**
 * Ambient Backdrop — fixed, full-viewport.
 * Clean, minimal silver background without gradients.
 */
export function AmbientBackdrop() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        backgroundColor: "#d3d3d7",
        pointerEvents: "none" as const,
      }}
    >
      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      
      {/* Cinematic noise overlay */}
      <div className="absolute inset-0 noise-overlay opacity-10" />
    </div>
  );
}
