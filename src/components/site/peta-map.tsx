"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip, useMap } from "react-leaflet";
import { ExternalLink } from "lucide-react";
import { DbImage } from "./db-image";
import { MAP_CATEGORIES, getMapCategory } from "@/lib/map-categories";
import { cn } from "@/lib/utils";
import type { getKelurahanBoundaries, getMapPoints } from "@/lib/supabase/queries";

type MapPoint = Awaited<ReturnType<typeof getMapPoints>>[number];
type Boundary = Awaited<ReturnType<typeof getKelurahanBoundaries>>[number];

const SELF_COLOR = "#077390";
const NEIGHBOR_COLOR = "#A8926F";

/** GeoJSON [lng, lat] positions -> Leaflet [lat, lng] positions, keeping the
 * MultiPolygon > ring > point nesting structure react-leaflet's Polygon expects. */
function toLeafletPositions(geometry: unknown): L.LatLngExpression[][][] {
  const coords = (geometry as { coordinates: [number, number][][][] }).coordinates;
  return coords.map((polygon) => polygon.map((ring) => ring.map(([lng, lat]) => [lat, lng])));
}

function categoryIcon(category: string) {
  const cat = getMapCategory(category);
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 22px; height: 22px; border-radius: 9999px;
      background: ${cat.color}; border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,.35);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11],
  });
}

function FitToSelf({ boundaries }: { boundaries: Boundary[] }) {
  const map = useMap();
  useEffect(() => {
    const self = boundaries.find((b) => b.is_self);
    if (!self) return;
    const positions = toLeafletPositions(self.geometry).flat(2) as [number, number][];
    if (positions.length === 0) return;
    map.fitBounds(L.latLngBounds(positions), { padding: [24, 24] });
  }, [boundaries, map]);
  return null;
}

export function PetaMap({ points, boundaries }: { points: MapPoint[]; boundaries: Boundary[] }) {
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    () => new Set(MAP_CATEGORIES.map((c) => c.value)),
  );

  // Popup opens on hover instead of click. A short close delay bridges the
  // gap between marker and popup so moving the cursor onto the popup (e.g.
  // to click the Google Maps link) doesn't close it first.
  const markerRefs = useRef<Record<string, L.Marker | null>>({});
  const closeTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const openPopupFor = (id: string) => {
    clearTimeout(closeTimers.current[id]);
    markerRefs.current[id]?.openPopup();
  };
  const scheduleClosePopupFor = (id: string) => {
    closeTimers.current[id] = setTimeout(() => markerRefs.current[id]?.closePopup(), 200);
  };

  const toggleCategory = (value: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const visiblePoints = useMemo(
    () => points.filter((p) => activeCategories.has(p.category)),
    [points, activeCategories],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {MAP_CATEGORIES.map((cat) => {
          const active = activeCategories.has(cat.value);
          const Icon = cat.icon;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => toggleCategory(cat.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                active
                  ? "border-transparent text-white"
                  : "border-border-strong bg-surface-card text-text-muted",
              )}
              style={active ? { backgroundColor: cat.color } : undefined}
            >
              <Icon className="size-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="h-[520px] w-full overflow-hidden rounded-xl border border-border-default sm:h-[600px]">
        <MapContainer center={[-4.8376, 119.5341]} zoom={16} scrollWheelZoom className="size-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitToSelf boundaries={boundaries} />

          {boundaries.map((b) => (
            <Polygon
              key={b.id}
              positions={toLeafletPositions(b.geometry)}
              pathOptions={{
                color: b.is_self ? SELF_COLOR : NEIGHBOR_COLOR,
                weight: b.is_self ? 3 : 1.25,
                fillOpacity: b.is_self ? 0.12 : 0.03,
                dashArray: b.is_self ? undefined : "5 4",
              }}
            >
              <Tooltip
                permanent
                direction="center"
                className="!border-0 !bg-transparent !shadow-none !text-[11px] !font-semibold"
              >
                <span
                  className={b.is_self ? "text-ocean-800" : "text-text-muted"}
                  style={{ textShadow: "0 1px 2px white, 0 -1px 2px white" }}
                >
                  {b.kel_desa}
                </span>
              </Tooltip>
            </Polygon>
          ))}

          {visiblePoints.map((point) => (
            <Marker
              key={point.id}
              ref={(el) => {
                markerRefs.current[point.id] = el;
              }}
              position={[point.lat, point.lng]}
              icon={categoryIcon(point.category)}
              eventHandlers={{
                mouseover: () => openPopupFor(point.id),
                mouseout: () => scheduleClosePopupFor(point.id),
              }}
            >
              <Popup minWidth={220} maxWidth={260} autoPan={false} closeButton={false}>
                <div
                  onMouseEnter={() => clearTimeout(closeTimers.current[point.id])}
                  onMouseLeave={() => scheduleClosePopupFor(point.id)}
                  className="flex flex-col gap-2"
                >
                  <DbImage
                    src={point.photo_url}
                    alt={point.nama}
                    className="h-[120px] w-full rounded-md"
                  />
                  <div>
                    <div className="text-sm font-semibold text-text-primary">{point.nama}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-text-muted">
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: getMapCategory(point.category).color }}
                      />
                      {getMapCategory(point.category).label}
                    </div>
                  </div>
                  {point.deskripsi && (
                    <p className="m-0 text-xs leading-relaxed text-text-secondary">
                      {point.deskripsi}
                    </p>
                  )}
                  {point.map_url && (
                    <a
                      href={point.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-1 text-xs font-medium text-ocean-700 no-underline"
                    >
                      Buka di Google Maps <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
