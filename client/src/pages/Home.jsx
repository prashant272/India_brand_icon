// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "swiper/css/effect-coverflow";

import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { FadeUp, NeonCard, PageHero, StaggerContainer, StaggerItem } from "../components/Motion.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useRef, useState } from "react";

import GuestCard from "../components/GuestCard.jsx";
import UpcomingAwards from "../components/UpcomingAwards.jsx";
import MediaGallery from "../components/MediaGallery.jsx";
import { fetchPreviousEditions } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

// Centralized brand background
// Centralized medical background

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const sectionRefs = useRef([]);

  const [editions, setEditions] = useState([]);
  const [editionsLoading, setEditionsLoading] = useState(true);

  useEffect(() => {
    const loadEditions = async () => {
      try {
        const res = await fetchPreviousEditions();
        setEditions(res.data || []);
      } catch (err) {
        console.error("Failed to load editions:", err);
      } finally {
        setEditionsLoading(false);
      }
    };
    loadEditions();
  }, []);



  const handleNominateClick = () => {
    navigate("/nominate");
  };

  // Key Dates Data
  const keyDates = [
    {
      title: "Mumbai Edition",
      date: "12 July 2026",
      icon: "🇮🇳",
    },

  ];

  //Event Data

  const events = [
    {
      title: "India Brand Icon Award & Conference, 2026 –Mumbai Edition",
      desc: "Honouring trailblazing entrepreneurs, innovators, and industry leaders who are redefining India's business landscape and inspiring the next generation of changemakers.",
      date: "12 July 2026",
      place: "Mumbai, India",
      highlight: "National Excellence",
    },

  ];

  const juryMembers = [
    {
      name: "Mr Rohit Sharma",
      designation: "Indian Cricketer",
      img: "jury1.png"
    },

    {
      name: "Mr. Sunil Gavaskar",
      designation: "Indian Cricket Commentator & Former Cricketer",
      img: "jury2.png"
    },

    {
      name: "Ms. Lara Dutta",
      designation: "Indian Actress & Model",
      img: "jury3.jpeg"
    },

    {
      name: "Mr. Brett Lee",
      designation: "Australian Cricketer",
      img: "jury4.png"
    },

    {
      name: "Mr. Virender Sehwag",
      designation: "Indian Cricket Commentator & Former Cricketer",
      img: "jury5.png"
    },

    {
      name: "Dr. Yoganand Shashtri",
      designation: "Former Reader, Shaheed Bhagat Singh College, Delhi",
      img: "jury6.jpeg"
    },

    {
      name: "Mr. Sandeep Patil",
      designation: "Former Indian Cricketer & Chief of the BCCI Selection Committee",
      img: "jury7.jpeg"
    },

    {
      name: "Dr. Raj Aggarwal",
      designation: "Director of AIMA-CME",
      img: "jury8.png"
    },

    {
      name: "Mr. Chetan Sharma",
      designation: "Former Indian Cricketer",
      img: "jury9.jpeg"
    },

    {
      name: "Padma Shri Dr. J. K. Singh",
      designation: "President, Cancer Care India; Former National Vice President, India Medical Association",
      img: "jury10.jpeg"
    },

    {
      name: "Mr. Arvind Sawant",
      designation: "Hon'ble Minister of Heavy Industries and Public Enterprise",
      img: "jury11.png"
    },

    {
      name: "Mr. Chetan Chouhan",
      designation: "Former Indian Cricketer & Politician",
      img: "jury12.png"
    },
    {
      name: "Mr. Jonty Rhodes",
      designation: "Former South African Cricketer",
      img: "jury13.png"
    },
    {
      name: "Mr. Sajid Khan",
      designation: "Film Director & Producer",
      img: "jury14.png"
    },
  ];
  // Previous Media Partners
  const mediaPartners = [
    // ===== Premium National & International Media =====
    {
      name: "India Today",
      tagline: "India’s Leading News & Media Network",
      logo: "../india-today.png",
    },
    {
      name: "SME Times",
      tagline: " ",
      logo: "/smeTimes.jpg",
    },

    {
      name: "IBN 7",
      tagline: "Hindi News & Current Affairs Channel",
      logo: "../Ibn7logo.jpg",
    },
    {
      name: "First India News",
      tagline: "Leading Hindi satellite television news channel ",
      logo: "../first.jpg",

    },


    // ===== Strong National Hindi News =====
    {
      name: "Bharat 24",
      tagline: "Hindi News & Current Affairs Channel",
      logo: "../bharat.jpg",
    },
    {
      name: "Doordarshan's",
      tagline: "India’s Public Service News Channel",
      logo: "../ddd.png",
    },
    {
      name: "News 1 India",
      tagline: "National Hindi News Channel",
      logo: "../new1.png",
    },
    {
      name: "News 10 India",
      tagline: "National News & Current Affairs Network",
      logo: "../news10.jpg",
    },

    // ===== Regional / Specialised Media =====
    {
      name: "Delhi Aaj Tak",
      tagline: "Regional Hindi News Network",
      logo: "../delhiaajtk.jpg",
    },

    // ===== Event & Partner Media =====



    // ===== Production & Foundation =====
    {
      name: "Xoom Studio",
      tagline: "Media Production & Event Coverage Partner",
      logo: "../xoom.jpg",
    },
    {
      logo: "../remont.jpg"
    },
  ];
  const nomineeCategories = [
    {
      title: "Entrepreneurs & Business Leaders",
      desc: "Recognising outstanding entrepreneurs and business leaders who have driven innovation, growth, and meaningful impact across industries.",
      icon: "🏆",
      color: "from-amber-50 to-amber-500",
    },
    {
      title: "SMEs & Startups",
      desc: "Honouring small and medium enterprises and startups that have demonstrated resilience, creativity, and exceptional contribution to India's economy.",
      icon: "🚀",
      color: "from-orange-50 to-orange-600",
    },
    {
      title: "Brand Innovators & Marketers",
      desc: "Celebrating individuals and organisations that have built iconic brands through innovative marketing, digital transformation, and customer-centric strategies.",
      icon: "💡",
      color: "from-yellow-50 to-yellow-500",
    },
    {
      title: "Corporate & Social Leaders",
      desc: "Recognising corporate professionals and social changemakers who have demonstrated exemplary leadership, ethical business practices, and impactful CSR initiatives.",
      icon: "🌟",
      color: "from-indigo-50 to-indigo-600",
    },
  ];
  // Upcoming awards are now fetched dynamically via the <UpcomingAwards /> component.

  const homeFaqs = [
    {
      q: "What is the India Brand Icon Award?",
      a: "The India Brand Icon Award is instituted by TIME CyberMedia Private Limited, a leading Brand Management and Business Consulting organisation based in New Delhi. It recognises the contributions of SMEs, leaders, and entrepreneurs who have strengthened India's socio-economic fabric and infrastructure.",
    },
    {
      q: "Who can apply for this award?",
      a: "The India Brand Icon Award may be bestowed upon innovators, entrepreneurs, and professionals from all walks of society who have made an impact in their respective sector. All applicant information and details are kept strictly confidential as per company regulations.",
    },
    {
      q: "What is the nomination process and are there any charges?",
      a: "Nomination is completely free of charge. Simply visit the website and fill in the nomination form, or call the helpline at +91-9821020995. Final winners who wish to attend the ceremony may select a promotional package based on their media and publicity requirements.",
    },
    {
      q: "How are the winners selected?",
      a: "Winners are selected by a jury of high-profile experts who evaluate applications across multiple parameters including client feedback, public voting, industry peer reviews, fair business practices, CSR activities, innovation, and contribution to the country's economic growth.",
    },
    {
      q: "When are the results announced?",
      a: "Award winners are sent a confirmation letter four weeks prior to the awards ceremony and are given the option to attend based on their availability. The full list of winners is disclosed on the day of the ceremony and shared across official communication channels shortly after.",
    },
    {
      q: "What are the benefits of participating?",
      a: "Participants gain an exclusive platform to promote and raise the profile of their brand before a premium audience. Benefits include national recognition, enhanced brand credibility, media exposure across partner channels, networking opportunities with industry leaders, and award certificates and trophies.",
    },
  ];

  // Responsive and premium utility variables
  const getGridCols = (len) => {
    if (len >= 4) {
      return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
    if (len === 3) {
      return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
    }
    if (len === 2) {
      return "grid-cols-1 sm:grid-cols-2";
    }
    return "grid-cols-1";
  };

  return (
    <div className="w-full text-[#f5f3f0] pt-15 sm:pt-24">
      {/* SEO H1 - Hidden */}
      <h1 className="sr-only">
        India Brand Icon Award & Conference, 2026 – India Brand Icon Award & Conference, 2026 by TIME Cyber Media Pvt Ltd
      </h1>
      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-4 mb-2 sm:mb-2">
        <div className="relative w-full rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group border border-white/10 bg-black/20 select-none">
          <img
            src="/indiabrand-icon-award.jpeg"
            alt="India Brand Icon 2026 Banner"
            className="w-full h-auto block filter brightness-[0.9] contrast-[1.02]"
          />
          {/* Subtle overlay gradients for extra depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-indigo-950/10 to-transparent opacity-80 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/30 via-transparent to-[#020617]/30 pointer-events-none" />

          {/* ===== CONTENT (Call-to-action buttons layered on bottom of banner) ===== */}
          <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 w-full flex flex-col items-center justify-center px-4 text-center">
            {/* Dock containing Nominate and Info buttons */}
            <div className="flex flex-row gap-3 sm:gap-4 w-full max-w-sm sm:max-w-md justify-center">
              <button
                onClick={() => navigate("/nominate")}
                className="flex-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 py-2 sm:py-3.5 px-4 sm:px-6 rounded-xl font-black text-slate-950 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm uppercase tracking-wider cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
              >
                Nominate Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <button
                onClick={() => navigate("/jury")}
                className="flex-1 bg-slate-950/80 backdrop-blur-md border border-white/10 hover:bg-slate-900 py-2 sm:py-3.5 px-4 sm:px-6 rounded-xl font-black text-amber-400 hover:text-white shadow-2xl transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm uppercase tracking-wider cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
              >
                More Info
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 11.054.02-.054.054 0 00-.095 0zm0 4.3v-2.6m8.25-1.95a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
      {/*. uniform background using pagehero   */}

      <div className="relative w-full">
        {/* OVERVIEW + DATES: Main theme background (use SECTION_BG to keep consistent) */}
        <section className={`relative overflow-hidden border-b border-[#f59e0b]/20 py-2`}>
          {/* Gradient Glow Background */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full mix-blend-screen animate-blob" style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 65%)' }} />
            <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] rounded-full mix-blend-screen animate-blob animation-delay-2000" style={{ background: 'radial-gradient(circle, rgba(4, 120, 87, 0.15) 0%, transparent 65%)' }} />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-16 gap-x-12">
              {/* ==== LEFT: OVERVIEW ==== */}
              <div className="flex flex-col justify-center h-full lg:pr-6 xl:pr-12 text-left">
                {/* Section Badge */}
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber-500/10  border border-amber-500/20 shadow-2xl hover:bg-amber-500/20 hover:border-amber-500/40 transition-all duration-500 group/badge mb-4 self-start">
                  <div className="relative">
                    <svg className="w-5 h-5 text-amber-400 group-hover/badge:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path d="M12 2l2.39 7.24h7.61l-6.19 4.5L16.92 22 12 17.27 7.08 22l1.11-8.26-6.19-4.5h7.61L12 2z" /></svg>
                    <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-bold tracking-wider text-amber-50 uppercase">ABOUT THE AWARDS</span>
                </div>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight text-left">
                  <span className="bg-gradient-to-r from-white via-amber-100 to-amber-400 bg-clip-text text-transparent">
                    Overview of India Brand Icon Award & Conference, 2026
                  </span>
                </h2>
                <div className="w-20 h-1.5 bg-gradient-to-r from-amber-100 via-amber-500 to-amber-700 rounded-full mb-7" />

                <div className="relative group">
                  {/* Intense Outer Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-amber-400/20 to-amber-500/30 opacity-0 group-hover:opacity-100 blur-3xl transition-all duration-1000 rounded-[2rem]" />

                  <div className="relative  rounded-[2rem] border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-700 p-8 lg:p-10 group-hover:border-amber-400/50 group-hover:bg-white/[0.03]"
                    style={{
                      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
                      boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 8px 32px 0 rgba(0, 0, 0, 0.37)"
                    }}>
                    {/* Glass Shine Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />
                    {/* SEO Paragraph - Hidden */}
                    <p className="sr-only text-left">
                      India Brand Icon Award & Conference, 2026 by TIME Cyber Media Pvt Ltd, also known as India Brand Icon
                      Awards, recognize excellence, innovation, hospitals, doctors, and india brand icon
                      leaders worldwide.
                    </p>
                    {/* Emerald Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-transparent" />
                    {/* Decorative Orb */}
                    <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-amber-500/10 to-amber-400/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
                    <div className="relative space-y-6 text-left">
                      {/* Award Name + Icon */}
                      <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-100 opacity-30 blur-lg rounded-xl" />
                          <div className="relative p-3.5 rounded-xl bg-gradient-to-br from-amber-500 via-amber-100 to-amber-700 shadow-xl">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                              <path d="M12 2l2.39 7.24h7.61l-6.19 4.5L16.92 22 12 17.27 7.08 22l1.11-8.26-6.19-4.5h7.61L12 2z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl lg:text-3xl font-black text-amber-50 leading-tight">
                            India Brand Icon Award & Conference, 2026
                          </h3>
                          <p className="text-amber-400 font-semibold mt-1 text-sm tracking-wide">
                            Achieving Excellence in India Brand Icon
                          </p>
                        </div>
                      </div>
                      <p className="text-amber-100/60 leading-relaxed text-lg font-medium text-left">
                        The <span className="font-bold text-amber-400">India Brand Icon Award & Conference, 2026</span> recognize significant contributions in the india brand icon sector.<br /><br />
                        The Awards showcase the highest academic goals and outstanding achievements through <span className="font-semibold text-amber-300">innovation, leadership, dedication,</span> and commitment towards learning.<br /><br />
                        <span className="font-semibold text-amber-300">India Brand Icon Award & Conference, 2026</span> will be a converging point of the industry's elite – a celebration and recognition of excellence, reputation, and exemplary service.
                      </p>
                      {/* Feature Pills */}
                      <div className="flex flex-wrap gap-3 pt-4">
                        {['Excellence', 'Innovation', 'Leadership'].map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 rounded-xl text-sm font-bold bg-amber-500/10 text-amber-50 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                          >{feature}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* ==== RIGHT: Key Dates ==== */}
              <div className="flex flex-col justify-center h-full lg:pl-8 xl:pl-16 space-y-8 text-left">
                <div>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight text-left">
                    <span className="bg-gradient-to-r from-amber-50 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                      Key Dates
                    </span>
                  </h2>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-amber-50 to-amber-500 rounded-full" />
                </div>
                {/* Timeline Style Cards */}
                <div className="space-y-6">
                  {keyDates.map((event, idx) => {
                    const border = idx % 2 === 0 ? 'from-[#C9A84C] to-[#E8C96D]' : 'from-[#E8C96D] to-[#F5DFA0]';
                    return (
                      <div key={idx} className="relative group"
                        style={{ animation: `fade-up 0.8s ease-out ${(idx + 1) * 120}ms both` }}>
                        <div className={`absolute -inset-1 bg-gradient-to-r ${border} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700 rounded-2xl`} />
                        <div className="relative border border-amber-500/30 shadow-xl overflow-hidden hover:bg-slate-900/20 hover:border-[#C9A84C]/40 hover:shadow-2xl hover:shadow-[#C9A84C]/10 transform hover:-translate-x-1 hover:scale-[1.02] transition-all duration-500 rounded-2xl bg-slate-900/40 ">
                          <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${border}`} />
                          <div className="p-6 flex items-center gap-5 text-left">
                            {/* Icon */}
                            <div>
                              <span className={`block w-10 h-10 rounded-xl bg-gradient-to-br ${border} flex items-center justify-center shadow-lg`}>
                                <span className="text-xl">{event.icon}</span>
                              </span>
                            </div>
                            {/* Content */}
                            <div className="flex-1 pt-1 text-left">
                              <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-amber-50 mb-1 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-amber-50 group-hover:to-white group-hover:bg-clip-text transition-all duration-500 text-left">{event.title}</h3>
                              <div className="flex items-center gap-2 text-[#C9A84C] text-sm sm:text-base text-left">
                                <svg className="w-4 h-4 text-[#E8C96D]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M8 7V3m8 4V3M3 11h18M5 5h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" /></svg>
                                <span className="font-bold">{event.date}</span>
                              </div>
                            </div>
                            {/* Checkmark */}
                            <div className="flex-shrink-0">
                              <div className="p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors duration-300">
                                <svg className="w-5 h-5 text-amber-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 13l2.25 2L15 11" /></svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* CTA Card */}
                <div className="relative group mt-8">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-50 via-amber-500 to-amber-500 opacity-20 group-hover:opacity-40 blur-xl transition-all duration-700 rounded-2xl" />
                  <div className="relative bg-amber-950/70  rounded-2xl border border-amber-500/30 shadow-2xl overflow-hidden hover:bg-amber-900/40 hover:border-amber-500/50 transition-all duration-500 p-8 text-left">
                    {/* Emerald Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-100 to-amber-500" />
                    <div className="flex items-center gap-4 mb-4 text-left">
                      <span className="text-2xl text-amber-400 animate-pulse">✨</span>
                      <h4 className="text-xl font-black text-white text-left">Don't Miss Out!</h4>
                    </div>
                    <p className="text-amber-100/70 leading-relaxed mb-6 font-medium text-left">
                      Submit your nomination before the deadline and be recognized for india brand icon excellence.
                    </p>
                    <button onClick={handleNominateClick} className="relative w-full py-4 px-6 rounded-xl font-black text-white overflow-hidden group/btn transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 bg-gradient-to-r from-amber-100 via-amber-500 to-amber-700 shadow hover:shadow-lg ">
                      <span className="relative z-10 text-lg tracking-wide">Nominate Now</span>
                      <svg className="w-5 h-5 relative z-10 group-hover/btn:rotate-12 transition-transform duration-500 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path d="M12 2l2.39 7.24h7.61l-6.19 4.5L16.92 22 12 17.27 7.08 22l1.11-8.26-6.19-4.5h7.61L12 2z" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Decorative */}
            <div className="mt-20 text-center">
              <div className="inline-flex items-center gap-2 text-[#a7f3d0]/70 text-sm">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#a7f3d0]/50" />
                <svg className="w-4 h-4 animate-pulse text-[#6ee7b7]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 2l2.39 7.24h7.61l-6.19 4.5L16.92 22 12 17.27 7.08 22l1.11-8.26-6.19-4.5h7.61L12 2z" /></svg>
                <span className="font-medium">Celebrating Excellence in India Brand Icon</span>
                <svg className="w-4 h-4 animate-pulse animation-delay-1000 text-[#6ee7b7]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 2l2.39 7.24h7.61l-6.19 4.5L16.92 22 12 17.27 7.08 22l1.11-8.26-6.19-4.5h7.61L12 2z" /></svg>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#a7f3d0]/50" />
              </div>
            </div>
          </div>
        </section>
        {/* ================= WHY India Brand Icon Award & Conference, 2026 ================= */}
        <section className={`relative overflow-hidden py-8`}>
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-0 right-1/4 w-[320px] sm:w-[420px] md:w-[500px] h-[320px] sm:h-[420px] md:h-[500px] bg-[#f59e0b]/5 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 left-1/4 w-[320px] sm:w-[420px] md:w-[500px] h-[320px] sm:h-[420px] md:h-[500px] bg-[#047857]/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
          </div>
          {/* ...rest code unchanged... */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            {/* Heading and grid as before */}
            {/* ... code unchanged ... */}
            <FadeUp className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl xs:text-4xl md:text-5xl font-heading font-black mb-2 pb-3 bg-gradient-to-r from-white via-amber-400 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Why India Brand Icon Award & Conference, 2026
              </h2>
              <div className="w-24 sm:w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full" />
              <p className="mt-6 text-amber-100/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                Gain international recognition, validate your achievements through independent jury assessment, and position your brand at the forefront of india brand icon innovation.
              </p>
            </FadeUp>
            {/* ...grid ... */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {[
                {
                  title: "National & International Recognition",
                  desc: "Gain prestigious recognition across the india brand icon industry and position your organisation among the most trusted and respected leaders.",
                  icon: "🌟",
                },
                {
                  title: "Independent Jury Validation",
                  desc: "All nominations are evaluated by an eminent and independent jury panel, ensuring credibility, transparency, and unbiased assessment.",
                  icon: "⚖️",
                },
                {
                  title: "Showcase Innovation & Impact",
                  desc: "Highlight your innovations, achievements, and measurable impact before policymakers, industry leaders, and stakeholders.",
                  icon: "💡",
                },
                {
                  title: "Strengthen Brand Authority",
                  desc: "Enhance brand reputation and reinforce trust among partners, clients, investors, and the broader india brand icon ecosystem.",
                  icon: "🏆",
                },
                {
                  title: "Benchmark Against Industry Leaders",
                  desc: "Measure your performance against industry best practices, international standards, and emerging india brand icon trends.",
                  icon: "📊",
                },
                {
                  title: "Future-Ready Positioning",
                  desc: "Demonstrate your organisation's readiness for future challenges through leadership, scalability, and sustainable growth.",
                  icon: "🚀",
                },
              ].map((item, index) => (
                <StaggerItem
                  key={index}
                  className="h-full"
                >
                  <NeonCard color="amber" className="h-full">
                    <div className="p-10 flex flex-col h-full text-left">
                      <div className="text-4xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                        {item.icon}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-2xl font-black bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent group-hover:text-amber-400 transition-colors duration-300 leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-amber-100/60 text-base leading-relaxed font-medium group-hover:text-amber-100 transition-colors duration-300">
                          {item.desc}
                        </p>
                      </div>

                      <div className="mt-auto pt-8 flex items-center gap-3">
                        <div className="h-1 w-12 bg-gradient-to-r from-amber-500/50 to-transparent rounded-full group-hover:w-20 transition-all duration-500" />
                      </div>
                    </div>
                  </NeonCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
        {/* ================= RESEARCH METHODOLOGY ================= */}
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

            {/* DATA */}
            {(() => {
              const items = [
                {
                  title: "Data Collection & Screening",
                  desc: "All nominations are collected through a structured submission process. Each entry undergoes an initial screening to ensure eligibility, completeness, and alignment with the award category.",
                  number: "01",
                },
                {
                  title: "Qualitative & Quantitative Analysis",
                  desc: "Submissions are evaluated using a balanced research framework combining qualitative insights and quantitative metrics to assess performance, innovation, and impact.",
                  number: "02",
                },
                {
                  title: "Expert Jury Evaluation",
                  desc: "An independent panel of industry experts, academicians, and subject-matter specialists reviews shortlisted entries to ensure unbiased and credible assessment.",
                  number: "03",
                },
                {
                  title: "Benchmarking & Industry Standards",
                  desc: "Each nomination is benchmarked against industry best practices, regulatory standards, and emerging international trends to measure relevance and excellence.",
                  number: "04",
                },
                {
                  title: "Score Normalisation & Validation",
                  desc: "Scores from multiple evaluators are normalised to eliminate bias and ensure consistency, fairness, and transparency across all categories.",
                  number: "05",
                },
                {
                  title: "Final Review & Approval",
                  desc: "The final results undergo an internal audit and validation process before approval, ensuring accuracy, integrity, and credibility of the award outcomes.",
                  number: "06",
                },
              ];

              return (
                <StaggerContainer className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
                  {items.map((item, index) => (
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
              );
            })()}
          </div>
        </section>
        {/* Selection Process */}
        <section className="relative overflow-hidden py-12">
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 60%)' }} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <FadeUp className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl xs:text-4xl md:text-5xl font-heading font-black mb-4 bg-gradient-to-r from-white via-amber-400 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Selection <span className="text-amber-400">Process</span>
              </h2>
              <div className="w-24 sm:w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full" />
              <p className="mt-6 text-amber-100/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                A structured and transparent evaluation framework that maintains complete impartiality and ethical standards throughout.
              </p>
            </FadeUp>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { title: "Judging Criteria", desc: "A structured evaluation framework ensures credibility, consistency, and fairness across all nominations.", icon: "📋" },
                { title: "Persistent Fairness", desc: "Each entry is reviewed independently by an eminent jury panel, maintaining complete impartiality.", icon: "⚖️" },
                { title: "Confidentiality", desc: "All nomination data and outcomes are treated with the highest level of security and confidentiality.", icon: "🔒" },
              ].map((item, index) => (
                <StaggerItem key={index} className="h-full">
                  <NeonCard color="amber" className="h-full">
                    <div className="relative flex flex-col items-start text-left h-full p-10">
                      <div className="text-5xl mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                        {item.icon}
                      </div>
                      <h3 className="text-2xl font-black bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent group-hover:text-amber-400 transition-colors duration-300 mb-4">
                        {item.title}
                      </h3>
                      <p className="text-amber-100/60 text-base leading-relaxed font-medium group-hover:text-amber-100 transition-colors duration-300">
                        {item.desc}
                      </p>
                      <div className="mt-auto pt-8">
                        <div className="h-1.5 w-12 bg-gradient-to-r from-amber-500/50 to-transparent rounded-full group-hover:w-20 transition-all duration-500" />
                      </div>
                    </div>
                  </NeonCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
        {/* WHO SHOULD NOMINATE section */}
        <section className="relative overflow-hidden py-8">
          {/* Animated Gradient Glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 60%)' }} />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
            <FadeUp className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl xs:text-4xl md:text-5xl font-heading font-black mb-4 bg-gradient-to-r from-white via-amber-400 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Who Should <span className="text-amber-400">Nominate?</span>
              </h2>
              <div className="w-24 sm:w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full" />
              <p className="mt-6 text-amber-100/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                We invite visionaries, researchers, and leading institutions to join our elite circle of india brand icon pioneers.
              </p>
            </FadeUp>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {nomineeCategories.map((item, index) => (
                <StaggerItem key={index} className="h-full">
                  <NeonCard color="amber" className="h-full">
                    <div className="relative flex flex-col items-start h-full p-8 text-left">
                      {/* Icon with Glowing Ring */}
                      <div className="relative mb-8 flex items-center justify-center">
                        <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full group-hover:bg-amber-500/40 transition-colors duration-500" />
                        <span className="relative text-5xl drop-shadow-2xl filter brightness-110">
                          {item.icon}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-black bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent group-hover:text-amber-400 transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-amber-100/60 text-sm sm:text-base leading-relaxed font-medium group-hover:text-amber-100 transition-colors duration-300">
                          {item.desc}
                        </p>
                      </div>

                      <div className="mt-auto pt-8 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <div className="h-px w-8 bg-gradient-to-r from-amber-500/50 to-transparent" />
                      </div>
                    </div>
                  </NeonCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ================= GUESTS & SPEAKERS ================= */}
        <section className="relative overflow-hidden py-12">
          <FadeUp className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl xs:text-4xl md:text-5xl font-heading font-black mb-4 bg-gradient-to-r from-white via-amber-400 to-white bg-clip-text text-transparent drop-shadow-2xl">
              Our Esteemed <span className="text-amber-400">Guests & Speakers</span>
            </h2>
            <div className="w-24 sm:w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full" />
            <p className="mt-6 text-amber-100/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              Join our network of eminent medical professionals and visionaries.
            </p>
          </FadeUp>
          <FadeUp className="max-w-7xl mx-auto px-6 pt-10">
            {(() => {
              const displayJury = juryMembers.length > 0 && juryMembers.length < 12
                ? [...juryMembers, ...juryMembers]
                : juryMembers;
              return (
                <Swiper
                  modules={[Autoplay, Pagination, EffectCoverflow]}
                  effect="coverflow"
                  grabCursor
                  centeredSlides
                  slidesPerView="auto"
                  coverflowEffect={{
                    rotate: 15,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                    slideShadows: false
                  }}
                  autoplay={{ delay: 1000, disableOnInteraction: false }}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  loop={displayJury.length > 1}
                  className="!pb-20"
                >
                  {displayJury.map((member, i) => (
                    <SwiperSlide key={i} className="!w-[320px] md:!w-[380px]">
                      <GuestCard member={member} index={i} isFeatured={true} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              );
            })()}
          </FadeUp>
        </section>

        {/* ================= MEDIA GALLERY ================= */}
        <MediaGallery />

        {/* CTA section */}
        <section className="relative overflow-hidden py-5">
          <div className="absolute inset-0 pointer-events-none -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-amber-500/10 rounded-full blur-[160px] animate-pulse" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <FadeUp>
              <h2 className="text-4xl xs:text-5xl md:text-6xl font-heading font-black mb-8 bg-gradient-to-r from-white via-amber-100 to-amber-400 bg-clip-text text-transparent leading-tight">
                Get the recognition for you and your team
              </h2>
              <div className="w-24 sm:w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full mb-10" />
              <p className="text-amber-100/70 text-xl md:text-2xl mb-12 font-medium leading-relaxed">
                Nomination Extended Deadline – <span className="text-amber-400 font-black">closing soon</span>
              </p>
              <button
                type="button"
                onClick={handleNominateClick}
                className="relative overflow-hidden group/btn rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-white font-black px-12 py-6 text-xl transition-all duration-500 hover:scale-110 hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.5)] focus:outline-none tracking-[0.1em] uppercase"
              >
                <span className="relative z-10 flex items-center justify-center gap-4">
                  Nominate Now
                  <svg className="w-7 h-7 group-hover:translate-x-3 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-1000" />
              </button>
            </FadeUp>
          </div>
        </section>

        {/* ================= KEY FAQ SNAPSHOT ================= */}
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



        {/* OUR OTHER UPCOMING AWARDS section */}
        <UpcomingAwards />

        {/* ================= MEDIA PARTNERS / COVERAGE ================= */}
        <section className="relative overflow-hidden py-2 ">
          {/* Decorative mesh gradients */}
          <div className="absolute inset-0 pointer-events-none -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-amber-500/5 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 60%)' }} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <FadeUp className="text-center mb-5 sm:mb-7">
              <h2 className="text-3xl pb-1 xs:text-4xl md:text-5xl font-heading font-black mb-4 bg-gradient-to-r from-white via-amber-400 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Our Media Partners/Coverage
              </h2>
              <div className="w-24 sm:w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full" />
              <p className="mt-6 text-amber-100/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                A strong network of national and international media partners has helped amplify our vision across the india brand icon landscape.
              </p>
            </FadeUp>

            {/* Automatic Infinite Slider */}
            <div className="overflow-hidden py-10 w-full relative pb-20">
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--base-bg)] to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--base-bg)] to-transparent z-10" />

              <div className="animate-marquee flex gap-12 items-center">
                {[...mediaPartners, ...mediaPartners].map((partner, idx) => (
                  <div key={idx} className="flex-shrink-0 group">
                    <div className="
                      relative h-32 w-32 sm:h-40 sm:w-40 rounded-[2rem]
                      bg-slate-900/40 
                      border border-amber-500/20 hover:border-amber-400/60
                      transition-all duration-500 hover:shadow-[0_20px_40px_-12px_rgba(16,185,129,0.3)]
                      flex items-center justify-center p-6
                    ">
                      {partner.logo ? (
                        <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <span className="text-amber-400 text-4xl font-black">{partner.name?.[0]}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}
