export const metadata = {
  title: "Adea",
  description: "Adea - Life Companion App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
