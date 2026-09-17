export default function AuthLayout({ headline, points, testimonial, children }) {
  return (
    <div className="grid min-h-screen font-sans md:grid-cols-2">
      <div className="relative hidden flex-col overflow-hidden bg-pf-purple-dark px-10 py-11 md:flex">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster=""
            className="h-full w-full object-cover motion-reduce:hidden"
          >
            <source src="/mainvideo1.mp4" type="video/mp4" />
          </video>
          {/* Overlay plat (pas de degrade) pour garder le texte lisible sur la video */}
          <div className="absolute inset-0 bg-pf-purple-dark/60 " />
        </div>

        <a href="/" className="relative z-10 flex items-center gap-2.5">
          <img
            src="/pathfinder-logo.png"
            alt="The Pathfinder Academic"
            className="h-7 w-7 object-contain rounded"
          />
          <span className="font-serif text-sm font-medium text-white">
            The Pathfinder Academic
          </span>
        </a>

        <div className="relative z-10 flex max-w-[340px] flex-1 flex-col justify-center">
          <p className="mb-7 font-serif text-[26px] font-medium leading-snug text-white">
            {headline}
          </p>

          {/* Bordure pointillee plutot qu'un degrade bricole pour simuler des tirets */}
          <ul className="flex flex-col gap-5 border-l-2 border-dashed border-white/35 pl-4">
            {points.map((point, i) => (
              <li key={point} className="flex gap-3.5">
                <span
                  className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                    i === 0 ? "bg-pf-gold" : "bg-white/40"
                  }`}
                />
                <p className="text-[13px] leading-relaxed text-purple-100">{point}</p>
              </li>
            ))}
          </ul>
        </div>

        {testimonial && (
          <div className="relative z-10 border-t border-white/15 pt-4">
            <p className="text-xs text-purple-200">“{testimonial.quote}”</p>
            <p className="mt-1 text-[11px] text-purple-300">— {testimonial.author}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center px-6 py-11 sm:px-12">
        {/* Logo visible uniquement sur mobile, ou le panneau gauche est masque */}
        <div className="mb-6 flex items-center gap-2 md:hidden">
          <img
            src="/pathfinder-logo.png"
            alt="The Pathfinder Academic"
            className="h-7 w-7 object-contain"
          />
          <span className="font-serif text-sm font-medium text-pf-purple-dark">
            The Pathfinder Academic
          </span>
        </div>

        <div className="">{children}</div>
      </div>
    </div>
  );
}