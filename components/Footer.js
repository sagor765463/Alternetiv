export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/10 p-4 text-center">
        <p> &copy; {new Date().getFullYear()} Finex Corp! All rights reserved.</p>
    </footer>
  );
}