import { FadeUp } from "../Motion.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import GuestCard from "../GuestCard.jsx";
import { juryMembers } from "../../constants/juryMembers.js";


export default function GuestsAndSpeakers() {
  const displayJury = juryMembers.length > 0 && juryMembers.length < 12
    ? [...juryMembers, ...juryMembers]
    : juryMembers;

  return (
    <section className="relative overflow-hidden py-12">
      <FadeUp className="text-center mb-10 sm:mb-13">
        <h2 className="text-3xl xs:text-4xl md:text-5xl font-heading font-black mb-4 bg-gradient-to-r from-white via-amber-400 to-white bg-clip-text text-transparent drop-shadow-2xl">
          Our Esteemed <span className="text-amber-400">Guests & Speakers</span>
        </h2>
        <div className="w-24 sm:w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full" />
        <p className="mt-6 text-amber-100/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
          Join our network of eminent medical professionals and visionaries.
        </p>
      </FadeUp>
      <FadeUp className="max-w-7xl mx-auto px-6 pt-10">
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
      </FadeUp>
    </section>
  );
}
