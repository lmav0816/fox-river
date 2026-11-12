"use client";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { attractions, parkLocation, type LatLng } from "@/lib/nearby";
import { siteName } from "@/lib/site";

const pin = (label: string, park = false) =>
  `<span class="map-pin${park ? " map-pin-park" : ""}" aria-hidden="true">${label}</span>`;

/**
 * An OpenStreetMap of the park and what's around it. Leaflet and its tiles load
 * only once the map nears the screen; the attraction list works without it.
 */
export function AreaMap() {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef(new Map<string, Marker[]>());
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let cancelled = false;
    const pinsById = markers.current;
    const start = async () => {
      const L = await import("leaflet");
      if (cancelled || map.current) return;
      // iPadOS reports a desktop browser, so check for a touch Mac as well.
      const touchTablet =
        L.Browser.touch &&
        navigator.maxTouchPoints > 1 &&
        /Macintosh/.test(navigator.userAgent);
      const instance = L.map(element, {
        scrollWheelZoom: false,
        // One-finger drags scroll the page on touch devices instead of trapping it.
        dragging: !(L.Browser.mobile || touchTablet),
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(instance);
      const all: LatLng[] = [parkLocation];
      attractions.forEach((attraction, index) => {
        pinsById.set(
          attraction.id,
          attraction.pins.map((p) => {
            all.push(p.position);
            return L.marker(p.position, {
              icon: L.divIcon({
                html: pin(String(index + 1)),
                className: "",
                iconSize: [28, 28],
                iconAnchor: [14, 14],
              }),
              title: p.name,
            })
              .addTo(instance)
              .bindPopup(
                `<strong>${p.name}</strong><br>${p.note ?? attraction.distance}`,
              );
          }),
        );
      });
      instance.fitBounds(L.latLngBounds(all), { padding: [30, 30] });
      // A popup can only open once the map has a view.
      L.marker(parkLocation, {
        icon: L.divIcon({
          html: pin("★", true),
          className: "",
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        }),
        title: siteName,
        zIndexOffset: 1000,
      })
        .addTo(instance)
        .bindPopup(`<strong>${siteName}</strong><br>You are here.`, {
          autoPan: false,
        })
        .openPopup();
      map.current = instance;
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        start();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
      map.current?.remove();
      map.current = null;
      pinsById.clear();
    };
  }, []);

  const show = (id: string) => {
    setActive(id);
    const instance = map.current;
    const pins = markers.current.get(id);
    if (!instance || !pins) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    instance.closePopup();
    // Opening the popup mid-flight lets its auto-pan fight the animation.
    instance.once("moveend", () => pins[0].openPopup());
    const points = pins.map((m): LatLng => {
      const { lat, lng } = m.getLatLng();
      return [lat, lng];
    });
    instance.flyToBounds([parkLocation, ...points], {
      padding: [50, 50],
      // Far pins settle well below this; it only lets the across-the-street park access separate from our pin.
      maxZoom: 16,
      animate: !reduced,
    });
  };

  return (
    <div className="area-grid">
      <div
        ref={container}
        className="area-map"
        role="region"
        aria-label="Map of Fox River Recreation and nearby attractions"
      />
      <ol className="attraction-list">
        {attractions.map((attraction, index) => (
          <li
            key={attraction.id}
            className="attraction"
            data-active={active === attraction.id}
          >
            <span className="attraction-number" aria-hidden="true">
              {index + 1}
            </span>
            <div>
              {/* The button's hit area stretches over the whole card. */}
              <button
                type="button"
                className="attraction-name"
                aria-describedby={`${attraction.id}-detail`}
                onClick={() => show(attraction.id)}
              >
                {attraction.name}
              </button>
              <p id={`${attraction.id}-detail`}>
                <span className="attraction-distance">
                  {attraction.distance}
                </span>
                <span className="attraction-text">
                  {attraction.description}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
