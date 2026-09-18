export default function AppHeader({ links = [] }) {
  const destinations = {
    Paiements: "/paiements",
    Litiges: "/litiges",
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 sm:px-8">
      <a href="/" className="flex items-center gap-2.5">
        <img
          src="/pathfinder-logo.png"
          alt="The Pathfinder Academic"
          className="h-8 w-8 object-contain"
        />
        <span className="font-serif text-sm font-medium text-pf-purple-dark">
          The Pathfinder Academic
        </span>
      </a>

      <nav className="hidden items-center gap-5 text-sm text-gray-600 md:flex">
        {links.map((label) => (
          <a key={label} href={destinations[label] ?? "#"} className="hover:text-pf-purple-dark">
            {label}
          </a>
        ))}
        <div className="h-8 w-8 rounded-full bg-pf-purple-light" />
      </nav>
    </header>
  );
}
