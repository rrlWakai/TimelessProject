import { useState } from "react";
import Container from "./Containers";
import { AnimatePresence, motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const images = [
  { src: "/images/gallery-1.jpg", alt: "Lobby lounge" },
  { src: "/images/gallery-2.jpg", alt: "Infinity pool" },
  { src: "/images/gallery-3.jpg", alt: "Bedroom" },
  { src: "/images/gallery-4.jpg", alt: "Pool garden" },
];

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="gallery" className="gallery">
      <Container>
        <h2 className="gallery-title">GALLERY</h2>

        {/* ALBUM FRAME */}
        <div className="album">
          <div className="album-grid">
            {/* A */}
            <button className="album-cell album-a" onClick={() => setOpen(0)}>
              <motion.img
                src={images[0].src}
                alt={images[0].alt}
                className="album-img"
                initial={{ scale: 1.06 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.2, ease }}
              />
            </button>

            {/* B */}
            <button className="album-cell album-b" onClick={() => setOpen(1)}>
              <motion.img
                src={images[1].src}
                alt={images[1].alt}
                className="album-img"
                initial={{ scale: 1.06 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.2, delay: 0.05, ease }}
              />
            </button>

            {/* C (WIDE) */}
            <button className="album-cell album-c" onClick={() => setOpen(2)}>
              <motion.img
                src={images[2].src}
                alt={images[2].alt}
                className="album-img"
                initial={{ scale: 1.06 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.2, delay: 0.1, ease }}
              />
            </button>

            {/* D */}
            <button className="album-cell album-d" onClick={() => setOpen(3)}>
              <motion.img
                src={images[3].src}
                alt={images[3].alt}
                className="album-img"
                initial={{ scale: 1.06 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.2, delay: 0.15, ease }}
              />
            </button>
          </div>
        </div>
      </Container>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="lightbox"
            onClick={() => setOpen(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              className="lightbox-img"
              src={images[open].src}
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.4, ease }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
