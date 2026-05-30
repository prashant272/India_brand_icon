import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import { StaggerContainer, StaggerItem, PageHero, SectionHeading, FadeUp, NeonCard } from "../components/Motion.jsx";
import { useNavigate } from "react-router-dom";

const categoryGroups = [
  {
    group: "Business & Entrepreneurship",
    icon: "🏆",
    color: "from-amber-400 to-yellow-500",
    items: [
      { title: "Entrepreneur of the Year", desc: "Recognises a visionary entrepreneur who has demonstrated exceptional business acumen, resilience, and innovation to build a thriving enterprise that creates value for society." },
      { title: "Excellence in Business Growth & Expansion", desc: "Honours businesses that have achieved outstanding and sustained growth through strategic thinking, market diversification, and strong execution." },
      { title: "Outstanding Family Business of the Year", desc: "Celebrates family-run enterprises that have maintained legacy, adapted to modern challenges, and continue to create meaningful impact across generations." },
      { title: "Excellence in Export & Global Trade", desc: "Recognises Indian businesses that have made a significant mark in global markets through quality exports, international partnerships, and trade excellence." },
      { title: "Best Startup of the Year", desc: "Celebrates an early-stage company demonstrating remarkable innovation, scalability, and market disruption within a short span of time." },
      { title: "Excellence in Women Entrepreneurship", desc: "Honours women entrepreneurs who have broken barriers, built impactful businesses, and inspired a new generation of female leaders across India." },
      { title: "Young Entrepreneur of the Year", desc: "Recognises a young business leader under 35 who has demonstrated extraordinary vision, leadership, and business impact beyond their years." },
    ],
  },
  {
    group: "Leadership & Management",
    icon: "👑",
    color: "from-orange-400 to-red-500",
    items: [
      { title: "CEO / MD of the Year", desc: "Honours a top executive who has led their organisation to exceptional performance, cultural strength, and sustained competitive advantage." },
      { title: "Visionary Business Leader of the Year", desc: "Recognises a leader whose forward-thinking strategies and bold decisions have transformed their industry and set new benchmarks for excellence." },
      { title: "Excellence in Corporate Governance & Ethics", desc: "Celebrates organisations and leaders who demonstrate the highest standards of transparency, accountability, and ethical business conduct." },
      { title: "Outstanding HR & People Leadership", desc: "Recognises leaders and organisations that have built exemplary workplace cultures, talent development programmes, and employee-centric practices." },
      { title: "Emerging Business Leader of the Year", desc: "Honours a rising leader who has demonstrated early and measurable impact through innovation, team building, and strategic business growth." },
    ],
  },
  {
    group: "Brand & Marketing Excellence",
    icon: "💡",
    color: "from-yellow-400 to-amber-500",
    items: [
      { title: "Brand of the Year", desc: "Recognises a brand that has achieved outstanding recall, trust, and market presence through consistent quality and powerful brand communication." },
      { title: "Excellence in Digital Marketing & Social Media", desc: "Honours brands and agencies that have delivered exceptional results through innovative digital campaigns, content strategy, and social media engagement." },
      { title: "Outstanding Advertising & Creative Campaign", desc: "Celebrates campaigns that have made a significant cultural and commercial impact through creativity, storytelling, and audience connection." },
      { title: "Excellence in Customer Experience & Loyalty", desc: "Recognises businesses delivering superior customer journeys, loyalty programmes, and service standards that set them apart in the market." },
      { title: "Rising Brand of the Year", desc: "Celebrates an emerging brand that has rapidly built visibility, trust, and consumer loyalty in a competitive marketplace." },
    ],
  },
  {
    group: "Innovation & Technology",
    icon: "🚀",
    color: "from-blue-400 to-indigo-500",
    items: [
      { title: "Excellence in Business Innovation", desc: "Recognises companies that have introduced groundbreaking products, services, or business models that disrupted their sector and delivered measurable value." },
      { title: "Outstanding Tech-Driven Enterprise", desc: "Honours businesses that have leveraged technology — AI, automation, data analytics, or digital platforms — to transform operations and customer outcomes." },
      { title: "Best D2C Brand of the Year", desc: "Celebrates direct-to-consumer brands that have built strong digital-first businesses with exceptional product quality and customer engagement." },
      { title: "Excellence in E-Commerce & Digital Business", desc: "Recognises businesses that have excelled in the online marketplace through smart operations, user experience, and digital growth strategies." },
      { title: "Rising Star Company in Innovation", desc: "Celebrates an emerging company driving notable innovation and showing strong potential to become a future industry leader." },
    ],
  },
  {
    group: "Social Impact & CSR",
    icon: "🌍",
    color: "from-amber-400 to-amber-500",
    items: [
      { title: "Excellence in Corporate Social Responsibility", desc: "Honours organisations whose CSR initiatives have created a lasting and meaningful difference in communities, education, environment, or social welfare." },
      { title: "Outstanding Contribution to Sustainability & Green Business", desc: "Recognises businesses that are leading the way in eco-friendly practices, sustainable supply chains, and environmental responsibility." },
      { title: "Social Entrepreneur of the Year", desc: "Celebrates an entrepreneur whose primary mission is to address social challenges and create inclusive, lasting change through business-driven solutions." },
    ],
  },
  {
    group: "Sector-Specific Excellence",
    icon: "🔬",
    color: "from-purple-400 to-violet-500",
    items: [
      { title: "Excellence in Education & Skill Development", desc: "Recognises institutions and leaders that are shaping the future of learning through quality education, innovation, and skill-building programmes." },
      { title: "Excellence in Healthcare Business & Management", desc: "Honours hospitals, clinics, and healthcare businesses that have demonstrated outstanding management, patient care, and operational excellence." },
      { title: "Excellence in Real Estate & Infrastructure", desc: "Celebrates developers and infrastructure companies delivering quality projects, sustainable development, and significant contribution to urban growth." },
      { title: "Excellence in Manufacturing & Industry", desc: "Recognises manufacturing enterprises that have achieved excellence in quality, process innovation, export performance, and industrial leadership." },
      { title: "Excellence in Financial Services & Fintech", desc: "Honours banks, NBFCs, and fintech companies driving financial inclusion, innovation, and trust-based customer relationships across India." },
    ],
  },
];

const colorMap = {
  "Business & Entrepreneurship": "border-amber-400/30 hover:border-amber-400/60",
  "Leadership & Management": "border-orange-400/30 hover:border-orange-400/60",
  "Brand & Marketing Excellence": "border-yellow-400/30 hover:border-yellow-400/60",
  "Innovation & Technology": "border-blue-400/30 hover:border-blue-400/60",
  "Social Impact & CSR": "border-amber-400/30 hover:border-amber-400/60",
  "Sector-Specific Excellence": "border-purple-400/30 hover:border-purple-400/60",
};

export default function Categories() {
  const navigate = useNavigate();

  return (

    <PageHero
      badge="India Brand Icon Award & Conference, 2026"
      icon="🏆"
      title="India Brand Icon Award Categories"
      subtitle="Recognizing international excellence and innovation across india brand icon, leadership and technology."

    >
      {/* Category Sections */}
      <div className="max-w-6xl mx-auto px-2 sm:px-6 pb-2 space-y-0.5">
        {categoryGroups.map((group, gi) => (
          <section key={gi}>
            {/* Group heading */}
            <FadeUp className="flex items-center gap-2 mb-1">
              <span className="text-3xl">{group.icon}</span>
              <div>
                <h2 className="text-2xl md:text-3xl font-black font-serif text-white">{group.group}</h2>
                <div className={`mt-1 h-[3px] w-20 rounded-full bg-gradient-to-r ${group.color}`} />
              </div>
            </FadeUp>

            {/* Swiper for this group */}
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              loop={group.items.length > 3}
              autoplay={{ delay: 3800 + gi * 200, disableOnInteraction: false }}
              pagination={{ clickable: true, dynamicBullets: true }}
              navigation
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 18 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="!pb-12"
            >
              {group.items.map((item, ii) => (
                <SwiperSlide key={ii} className="h-auto">
                  <NeonCard color="amber" className="h-full !p-0">
                    <div className="h-full flex flex-col text-left p-6 md:p-7 min-h-[220px]">
                      {/* Category badge */}
                      <span className={`inline-block self-start px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r ${group.color} text-white mb-4 opacity-90`}>
                        {group.group}
                      </span>
                      <div className="flex items-start gap-2 mb-3">
                        <span className="text-amber-300 mt-0.5 flex-shrink-0">🏅</span>
                        <h3 className="text-base md:text-lg font-bold text-white group-hover:text-amber-100 transition-colors leading-snug">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-amber-100/65 text-sm leading-relaxed mt-auto group-hover:text-amber-100/85 text-left transition-colors">
                        {item.desc}
                      </p>
                    </div>
                  </NeonCard>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        ))}
      </div>

      {/* CTA Footer */}
      <FadeUp className="text-center py-2 bg-gradient-to-t from-amber-950/50 to-transparent border-t border-amber-500/10">
        <p className="text-amber-200/70 text-sm mb-4">All award categories are subject to jury review.</p>
        <div className="relative group w-max mx-auto">
          {/* The Glow Layer - Matches button shape exactly */}
          <div className="absolute inset-0 rounded-full bg-amber-600/50 blur-md animate-border-glow group-hover:bg-amber-400/40 transition-all" />

          {/* The Button */}
          <button
            onClick={() => navigate("/nominate")}
            className="relative z-10 btn-primary text-base px-8 py-3 rounded-full border border-amber-400/50 bg-slate-950 text-white flex items-center gap-2"
          >
            Apply for Nomination →
          </button>
        </div>



      </FadeUp>
    </PageHero>
  );
}
