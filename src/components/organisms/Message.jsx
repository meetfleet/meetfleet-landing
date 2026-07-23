import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

// Assets live in /public/message so they are referenced by absolute URL.
const quote = '/message/quote.svg';   // handwritten "Empires No Longer Need Armies." (555 x 104)
const stamp = '/message/stamp.svg';             // monogram mark, desktop (147 x 98)
const stampMobile = '/mobilestamp.svg';         // wide stamp, mobile
const photo = '/message/image.webp';  // founders photo (901 x 634 ≈ 1.42:1)
const blurPlaceholder = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAPABQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKrobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCa0u4JI2DM4fGMKO/amG5USoxZjAVyeOQc0jKkFvbkk/OVB7Z68/yqvf8AyQyX8a7IJ1GAGyQQf0qSi22oWSMQ7zDnj931FFYMMt06sYJXCbuAGxRQI//Z';

const Message = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Real parallax: the photo travels over the scene, but the drift stays smooth and centered
  const photoY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.18, 1.08]);

  return (
    <section id="message" ref={sectionRef} className="w-full bg-white py-16 sm:py-24 lg:py-28 flex items-center">
      {/* Apple-style: centered content, symmetric responsive side margins */}
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.45fr] items-stretch gap-12 lg:gap-16">

          {/* Left — text column */}
          <div className="flex flex-col items-start justify-center">
            <img
              src={quote}
              alt="Empires No Longer Need Armies."
              className="w-[min(340px,80%)] h-auto mb-8"
            />

            <p className="text-[15px] md:text-base text-black/70 leading-relaxed font-light mb-6 max-w-md">
              Today, the most powerful forces in the world are built by the quiet, the
              underestimated, and those who were never meant to &ldquo;fit.&rdquo;
            </p>

            <p className="text-[15px] md:text-base text-black/70 leading-relaxed font-light mb-10 max-w-md">
              In a world that prizes the loud, we celebrate the thinkers. Where society
              sees a &ldquo;misfit,&rdquo; we see a founder. All it takes is the right
              environment, relentless execution, and a place where you belong.
            </p>

            {/* Mobile: wide stamp */}
            <img
              src={stampMobile}
              alt="Meetfleet stamp"
              className="lg:hidden w-full max-w-none h-auto"
            />
            {/* Desktop: original monogram mark */}
            <img
              src={stamp}
              alt="Meetfleet stamp"
              className="hidden lg:block w-[110px] h-auto"
            />
          </div>

          {/* Right — Apple-style white panel: soft shadow, hairline border,
              very thin gradient grid, photo framed inside with parallax drift */}
          <div className="relative h-full min-h-[360px] rounded-[28px] bg-white border border-black/[0.06] shadow-[0_10px_60px_rgba(0,0,0,0.10)] p-3 sm:p-4 flex overflow-hidden">
            {/* Thin gradient grid — 1px lines, faded via radial mask */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.5]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
                WebkitMaskImage:
                  'radial-gradient(ellipse at center, black 40%, transparent 85%)',
                maskImage:
                  'radial-gradient(ellipse at center, black 40%, transparent 85%)',
              }}
            />

            {/* Photo frame — fills the panel, real parallax + scale + instant blur placeholder */}
            <div className="relative z-10 w-full overflow-hidden rounded-[18px] bg-gray-100">
              {/* Instant blur placeholder while full image loads */}
              <div
                aria-hidden
                className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110 pointer-events-none opacity-80"
                style={{ backgroundImage: `url(${blurPlaceholder})` }}
              />
              <motion.img
                src={photo}
                alt="Founders at work"
                loading="eager"
                decoding="async"
                fetchpriority="high"
                style={{ y: photoY, scale: photoScale }}
                className="relative z-10 w-full h-full min-h-[336px] object-cover origin-center will-change-transform"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Message;
