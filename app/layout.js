export const metadata = {
  title: "Wooper",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      style={{
        background: "black",
      }}
    >
      <body>{children}</body>
    </html>
  );
}
