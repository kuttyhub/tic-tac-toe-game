import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import Script from "next/script";

import "../styles/main.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Script
        id="g-script"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script id="g-analatics" strategy="lazyOnload">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
        page_path: window.location.pathname,
        });
    `}
      </Script>

      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
