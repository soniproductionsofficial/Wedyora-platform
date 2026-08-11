import { useState } from "react";
import { motion } from "framer-motion";

export function FlashCard({
  front,
  back,
  accent = "cream",
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  accent?: "cream" | "dark";
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      className="perspective h-52 w-full text-left"
      aria-pressed={flipped}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={`absolute inset-0 rounded-2xl border p-5 backface-hidden ${
            accent === "dark"
              ? "bg-brand-black text-white border-white/10"
              : "bg-white border-brand-line"
          }`}
        >
          {front}
        </div>
        <div
          className="absolute inset-0 rounded-2xl border border-brand-gold/40 bg-brand-black text-white p-5 backface-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
          {back}
        </div>
      </motion.div>
    </button>
  );
}
