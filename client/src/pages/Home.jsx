import UpcomingAwards from "../components/UpcomingAwards.jsx";
import MediaGallery from "../components/MediaGallery.jsx";

import Hero from '../components/home/Hero.jsx';
import Overview from '../components/home/Overview.jsx';
import WhyIndiaBrandIcon from '../components/home/WhyIndiaBrandIcon.jsx';
import ResearchMethodology from '../components/home/ResearchMethodology.jsx';
import SelectionProcess from '../components/home/SelectionProcess.jsx';
import WhoShouldNominate from '../components/home/WhoShouldNominate.jsx';
import GuestsAndSpeakers from '../components/home/GuestsAndSpeakers.jsx';
import CTASection from '../components/home/CTASection.jsx';
import KeyFAQ from '../components/home/KeyFAQ.jsx';
import MediaPartner from '../components/home/MediaPartner.jsx';

export default function Home() {
  return (
    <div className="w-full text-[#f5f3f0] ">
      {/* SEO H1 - Hidden */}
      <h1 className="sr-only">
        India Brand Icon Award & Conference, 2026 – India Brand Icon Award & Conference, 2026 by TIME Cyber Media Pvt Ltd
      </h1>

      {/* ================= HERO ================= */}
      <Hero />
      <div className="relative w-full">
        {/* ================= OVERVIEW ================= */}
        <Overview />
        {/* ================= WHY INDIA BRAND ICON ================= */}
        <WhyIndiaBrandIcon />
        {/* ================= RESEARCH METHODOLOGY ================= */}
        <ResearchMethodology />
        {/* ================= SELECTION PROCESS ================= */}
        <SelectionProcess />
        {/* ================= WHO SHOULD NOMINATE ================= */}
        <WhoShouldNominate />
        {/* ================= GUESTS & SPEAKERS ================= */}
        <GuestsAndSpeakers />
        {/* ================= MEDIA GALLERY ================= */}
        <MediaGallery />
        {/* ================= CTA SECTION ================= */}
        <CTASection />
        {/* ================= KEY FAQ ================= */}
        <KeyFAQ />
        {/* ================= UPCOMING AWARDS ================= */}
        <UpcomingAwards />
        {/* ================= MEDIA PARTNERS ================= */}
        <MediaPartner />
      </div>
    </div>
  );
}
