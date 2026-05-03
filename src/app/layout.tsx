import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meeting Note Taker",
  description: "Real-time meeting transcription and AI-powered summaries",
};

// Inline script runs synchronously before React hydrates — no theme flash,
// no hydration mismatch. suppressHydrationWarning on <html> tells React to
// ignore the server/client class difference on that single element only.
const themeScript = `
(function() {
  try {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`.trim();

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {
          // biome-ignore lint/security/noDangerouslySetInnerHtml: theme-init script; value is a static string constant, no user input ever reaches it
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        }
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-50">
        {children}
      </body>
    </html>
  );
}
