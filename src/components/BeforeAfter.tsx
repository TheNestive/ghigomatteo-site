"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/**
 * Comparateur avant / après : on fait glisser la poignée pour révéler
 * la retouche.
 */
export default function BeforeAfter({
  before,
  after,
  aspect = "3 / 4",
  sizes = "60vw",
}: {
  before: string;
  after: string;
  aspect?: string;
  sizes?: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(2, Math.min(98, p)));
  };

  return (
    <div
      ref={ref}
      className="relative w-full touch-none overflow-hidden rounded-md select-none md:rounded-lg"
      style={{ aspectRatio: aspect }}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      {/* Après (fond) */}
      <Image
        src={after}
        alt="Après retouche"
        fill
        sizes={sizes}
        quality={90}
        className="object-cover"
      />
      {/* Avant (clippé) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src={before}
          alt="Avant retouche"
          fill
          sizes={sizes}
          quality={90}
          className="object-cover"
        />
      </div>

      {/* Poignée */}
      <div
        className="pointer-events-none absolute inset-y-0 z-2 w-px bg-white/90"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-black/25 text-[13px] text-white backdrop-blur-sm">
          ⇄
        </span>
      </div>

      <span
        className="t-caps absolute top-3 left-3.5 z-2 text-white"
        style={{ textShadow: "0 1px 8px rgba(0,0,0,.5)" }}
      >
        Avant
      </span>
      <span
        className="t-caps absolute top-3 right-3.5 z-2 text-white"
        style={{ textShadow: "0 1px 8px rgba(0,0,0,.5)" }}
      >
        Après
      </span>
    </div>
  );
}
