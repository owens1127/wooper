export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
