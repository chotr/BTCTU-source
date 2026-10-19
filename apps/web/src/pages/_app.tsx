import type { AppProps } from "next/app";

// OpenNext needs the Pages Router manifest even though the UI itself uses the
// App Router exclusively. This compatibility entry does not add a route or
// change how existing App Router pages render.
export default function LegacyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
