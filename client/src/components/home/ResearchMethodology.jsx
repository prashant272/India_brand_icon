import { FadeUp, NeonCard, StaggerContainer, StaggerItem } from "../Motion.jsx";
import { researchMethodologies } from "../../constants/researchMethodologies.js";

export default function ResearchMethodology() {
  return (
    <section className={`relative overflow-hidden py-5`}>
      {/* Glow Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/3 right-0 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-[#f59e0b]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-0 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-[#047857]/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl xs:text-4xl md:text-5xl font-heading font-black mb-4 bg-gradient-to-r from-white via-amber-400 to-white bg-clip-text text-transparent drop-shadow-2xl">
            Research <span className="text-amber-400">Methodology</span>
          </h2>
          <div className="w-24 sm:w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full" />
          <p className="mt-6 text-amber-100/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Our evaluation framework combines qualitative insights and quantitative metrics to ensure a transparent, unbiased, and credible assessment.
          </p>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
          {researchMethodologies.map((item, index) => (
            <StaggerItem key={index}>
              <NeonCard color="amber" className="h-full">
                <div className="p-10 flex flex-col h-full min-h-[320px] text-left">
                  {/* Step Number Badge */}
                  <div className="absolute top-6 left-8 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-xl border border-white/20 group-hover:scale-110 transition-transform duration-500 z-20">
                    {item.number}
                  </div>

                  <div className="space-y-6 pt-10">
                    <h3 className="text-2xl font-black bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-amber-100/60 text-base leading-relaxed font-medium group-hover:text-amber-100 transition-colors duration-300">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-auto pt-10">
                    <div className="h-1.5 w-16 bg-gradient-to-r from-amber-500/50 to-transparent rounded-full group-hover:w-full transition-all duration-700" />
                  </div>
                </div>
              </NeonCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
