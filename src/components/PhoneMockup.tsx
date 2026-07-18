type PhoneMockupProps = {
  src?: string;
  title?: string;
  className?: string;
};

export function PhoneMockup({
  src = "/app",
  title = "anga app demo",
  className = "",
}: PhoneMockupProps) {
  return (
    <div className={`phone-shell ${className}`} aria-label={title}>
      <div className="phone-highlight" />
      <div className="phone-screen">
        <div className="phone-status-bar" aria-hidden="true">
          <span className="phone-status-time">9:41</span>
          <span className="phone-dynamic-island">
            <span className="phone-island-camera" />
          </span>
          <span className="phone-status-icons">
            <span className="phone-signal">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span className="phone-wifi" />
            <span className="phone-battery">
              <span />
            </span>
          </span>
        </div>
        <iframe
          src={src}
          title={title}
          className="h-full w-full border-0 bg-background"
          loading="eager"
        />
      </div>
    </div>
  );
}
