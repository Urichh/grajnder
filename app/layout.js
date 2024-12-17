import './globals.css';
import Hearts from './hearts';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Hearts />
        <div className="hearts-container"></div>
        {children}
      </body>
    </html>
  );
}
