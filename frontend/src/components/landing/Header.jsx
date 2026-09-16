export default function Header() {
  const navLinks = [
    { key: "howItWorks", label: "How it works" },
    { key: "teachers", label: "Teachers" },
    { key: "exams", label: "Exams" },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sm:px-8">
      <a href="/" className="flex items-center gap-2.5">
        <img
          src="/pathfinder-logo.png"
          alt="The Pathfinder Academic"
          className="h-9 w-9 object-contain"
        />
        <span className="flex flex-col leading-tight">
          <span className="font-serif text-[15px] font-medium text-pf-purple-dark">
            The Pathfinder Academic
          </span>
          {/* Slogan de marque volontairement non traduit, comme sur le logo */}
          <span className="text-[11px] text-gray-500">
            We pave the way to your academic success
          </span>
        </span>
      </a>

      <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
        {navLinks.map(({ key, label }) => (
          <a key={key} href="#" className="hover:text-pf-purple-dark">
            {label}
          </a>
        ))}
        <a href="/login" className="text-pf-blue hover:underline">
          Login
        </a>
        <a
          href="/register"
          className="rounded-md bg-pf-purple px-4 py-2 text-white hover:bg-pf-purple-dark"
        >
          Register
        </a>
      </nav>
    </header>
  );
}