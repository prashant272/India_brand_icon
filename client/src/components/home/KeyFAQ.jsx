import { homeFaqs } from "../../constants/homefaq"
import { FadeUp, NeonCard, StaggerContainer, StaggerItem } from "../Motion"
export default function KeyFAQ() {
    return (
        <section className="relative overflow-hidden py-12">
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full " style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 60%)' }} />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full " style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 60%)' }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <FadeUp className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl xs:text-4xl md:text-5xl font-heading font-black mb-4 bg-gradient-to-r from-white via-amber-400 to-white bg-clip-text text-transparent drop-shadow-2xl">
                        Frequently Asked <span className="text-amber-400">Questions</span>
                    </h2>
                    <div className="w-24 sm:w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full" />
                    <p className="mt-6 text-amber-100/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                        Find essential information about nominations, eligibility, and the recognition process.
                    </p>
                </FadeUp>

                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {homeFaqs.map((item, index) => (
                        <StaggerItem key={index}>
                            <NeonCard color="amber" className="h-full !p-0">
                                <div className="group relative flex flex-col h-full p-8 text-left">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-xl font-black text-amber-400 border border-amber-500/20">
                                            Q{index + 1}
                                        </div>
                                        <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors duration-300 leading-tight">
                                            {item.q}
                                        </h3>
                                    </div>
                                    <p className="text-amber-100/60 text-base leading-relaxed font-medium group-hover:text-amber-100 transition-colors duration-300">
                                        {item.a}
                                    </p>
                                </div>
                            </NeonCard>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </section>

    )
}