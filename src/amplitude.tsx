import Script from "next/script";

type Props = {};

function Amplitude({}: Props) {
  return (
    <>
      <Script
        src="https://cdn.amplitude.com/libs/analytics-browser-2.11.1-min.js.gz"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.amplitude.com/libs/plugin-session-replay-browser-1.23.2-min.js.gz"
        strategy="beforeInteractive"
      />

      {/* For Amplitude session replay */}
      <Script
        id="amplitude-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
              window.amplitude.init('465aeba67e7cd10a5dd7e235808fa730', {"autocapture":{"elementInteractions":true}});
            `,
        }}
      />
    </>
  );
}

export default Amplitude;
