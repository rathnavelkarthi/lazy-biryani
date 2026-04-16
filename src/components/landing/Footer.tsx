export function Footer() {
  return (
    <footer className="bg-[#333333] w-full border-t-4 border-primary py-10 sm:py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 sm:gap-8 mb-8">
          <div className="text-center sm:text-left">
            <div className="text-2xl sm:text-3xl font-black text-primary-container font-[family-name:var(--font-plus-jakarta-sans)] mb-2">
              Lazy Biryani
            </div>
            <p className="text-white/50 text-sm max-w-xs">
              Chennai&apos;s &#8377;89 biryani kit. Loved by students at Anna Univ, SRM, Sathyabama &amp; more.
            </p>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-3 text-sm uppercase tracking-widest">
            <a href="#cta" className="text-white/70 hover:text-primary-container transition-colors font-bold">
              Join Waitlist
            </a>
            <a href="#" className="text-white/70 hover:text-primary-container transition-colors font-bold">
              WhatsApp
            </a>
            <a href="#" className="text-white/70 hover:text-primary-container transition-colors font-bold">
              Shipping
            </a>
            <a href="#" className="text-white/70 hover:text-primary-container transition-colors font-bold">
              Refunds
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[2px] bg-white/10 mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white/40 text-xs sm:text-sm uppercase tracking-widest text-center sm:text-left">
            &copy; 2026 Lazy Biryani. Spicing up Chennai hostel life.
          </div>

          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="bg-white/10 hover:bg-primary-container/30 transition-colors p-2 border border-white/10"
            >
              <span className="material-symbols-outlined text-white/80 text-xl">
                photo_camera
              </span>
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="bg-white/10 hover:bg-primary-container/30 transition-colors p-2 border border-white/10"
            >
              <span className="material-symbols-outlined text-white/80 text-xl">
                tag
              </span>
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="bg-white/10 hover:bg-primary-container/30 transition-colors p-2 border border-white/10"
            >
              <span className="material-symbols-outlined text-white/80 text-xl">
                smart_display
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
