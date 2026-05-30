import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { PageHero, FadeUp, StaggerContainer, StaggerItem, NeonCard } from "../components/Motion.jsx";
import GuestCard from "../components/GuestCard.jsx";

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

export default function Jury() {
  return (
    <>
      <PageHero
        title="Our Esteemed Guests & Speakers"
      >
        {/* Featured Swiper Section */}
        <FadeUp className="max-w-7xl mx-auto px-6 pt-10  p">
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
            loop
            className="!pb-20"
          >
            {juryMembers.slice(0, 8).map((member, i) => (
              <SwiperSlide key={i} className="!w-[320px] md:!w-[380px]">
                <GuestCard member={member} index={i} isFeatured={true} />
              </SwiperSlide>
            ))}
          </Swiper>
        </FadeUp>

        {/* Grid Section */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-20">
            <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-white/40">
              Complete Honors List
            </span>
          </div>

          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch"
            staggerDelay={0.08}
          >
            {juryMembers.map((member, i) => (
              <StaggerItem key={i} className="h-full flex justify-center">
                <GuestCard member={member} index={i} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </PageHero>
    </>
  );
}
