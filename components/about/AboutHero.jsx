import React from "react";

function AboutHero() {
  return (
    <section className="relative h-[95vh] w-full flex items-center justify-center bg-transparent">
      {/* Dark Overlay */}
     

      {/* Content */}
      <div className="relative z-10 w-[92%] max-w-6xl rounded-3xl border border-white/15 bg-black/40 backdrop-blur-[3px] shadow-[0_20px_60px_rgba(0,0,0,0.45)] px-8 py-16 md:px-14 md:py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
          About Us
        </h1>

        <p className="max-w-5xl mx-auto text-lg md:text-xl leading-9 text-white/90">
          Smart Quick Assist is focused on providing dependable printers and
          printing supplies designed for everyday home, office, and business
          needs. Our goal is to make printer shopping simple, reliable, and
          convenient with carefully selected products built for performance
          and productivity.
        </p>

        <p className="max-w-5xl mx-auto mt-8 text-lg md:text-xl leading-9 text-white/90">
          We serve customers across the United States and Canada with a
          streamlined shopping experience, transparent information, and
          reliable customer guidance.
        </p>
      </div>
    </section>
  );
}

export default AboutHero;