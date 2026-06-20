import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Factory — LinkedIn Content Studio",
  description:
    "Generate a publish-ready LinkedIn post + matching Canva visual brief from one topic.",
};

// Runs before paint to set the theme class and avoid a flash of the wrong theme.
const noFlashScript = `
(function() {
  try {
    var t = localStorage.getItem('theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Real font families (not hashed) so the Canvas image renderer can use them by name. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Montserrat:wght@500;600;800&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
