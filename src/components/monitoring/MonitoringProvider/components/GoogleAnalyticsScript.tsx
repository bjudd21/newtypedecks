/**
 * Google Analytics script component
 */

import React from 'react';
import Script from 'next/script';

interface GoogleAnalyticsScriptProps {
  onLoad: () => void;
}

export const GoogleAnalyticsScript: React.FC<GoogleAnalyticsScriptProps> = ({
  onLoad,
}) => {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
        onLoad={onLoad}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  );
};
