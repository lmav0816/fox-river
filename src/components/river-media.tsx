"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { SiteContent } from "@/lib/content-schema";

// A pause that lands while play() is still loading rejects it with AbortError;
// that is not a broken video.
const playOrFail = (player: HTMLVideoElement, fail: () => void) =>
  player.play().catch((error: unknown) => {
    if (!(error instanceof DOMException && error.name === "AbortError")) fail();
  });

/**
 * The river photo, with the boat-ride video fading in over it once the section
 * scrolls into view. The video stays paused for visitors who prefer reduced
 * motion, and a button pauses it for everyone else.
 */
export function RiverMedia({ river }: { river: SiteContent["river"] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const pausedByVisitor = useRef(false);
  useEffect(() => {
    const player = video.current;
    const section = wrap.current;
    if (!river.video || failed || !player || !section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const apply = () => {
      if (visible && !reduced.matches && !pausedByVisitor.current)
        playOrFail(player, () => setFailed(true));
      else player.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        apply();
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(section);
    reduced.addEventListener("change", apply);
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", apply);
    };
  }, [river.video, failed]);
  const showVideo = river.video && !failed;
  return (
    <div ref={wrap} className="photo-wrap river-photo">
      <Image
        src={river.image.src}
        alt={river.image.alt}
        fill
        sizes="(max-width: 800px) 100vw, 50vw"
        className="photo"
      />
      {showVideo && (
        <video
          ref={video}
          src={river.video}
          className="river-video"
          data-playing={playing}
          muted
          loop
          playsInline
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
          aria-hidden="true"
        />
      )}
      {showVideo && (
        <button
          type="button"
          className="river-video-toggle"
          onClick={() => {
            const v = video.current;
            if (!v) return;
            if (v.paused) {
              pausedByVisitor.current = false;
              playOrFail(v, () => setFailed(true));
            } else {
              pausedByVisitor.current = true;
              v.pause();
            }
          }}
          aria-label={playing ? "Pause river video" : "Play river video"}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
          {playing ? "Pause" : "Play"}
        </button>
      )}
    </div>
  );
}
