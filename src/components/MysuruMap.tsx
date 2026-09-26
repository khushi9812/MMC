import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MysuruProperty } from '../types/mysuru';
import { MapPin, Info, Compass, Layers, Building2 } from 'lucide-react';

interface MysuruMapProps {
  properties: MysuruProperty[];
  selectedProperty: MysuruProperty | null;
  onSelectProperty: (property: MysuruProperty) => void;
  onMapClickCoordinates?: (lat: number, lng: number) => void;
  lang?: 'en' | 'kn';
}

export const MysuruMap: React.FC<MysuruMapProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  onMapClickCoordinates,
  lang = 'en',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Mysuru city center coordinates (approx 12.2958° N, 76.6394° E)
      const map = L.map(mapContainerRef.current, {
        center: [12.305, 76.64],
        zoom: 13,
        zoomControl: true,
      });

      // OpenStreetMap Standard Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors, MCC Geographic Boundary Reference',
        maxZoom: 19,
      }).addTo(map);

      // Add a visual boundary circle indicating MCC Urban Limits (~10km radius)
      L.circle([12.305, 76.64], {
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.04,
        radius: 7500,
        weight: 1.5,
        dashArray: '4, 8',
      })
        .bindTooltip('Mysuru City Corporation (MCC) Urban Boundary (Approximate Indicative Limit)', {
          permanent: false,
          direction: 'top',
        })
        .addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Allow clicking on map to choose custom location
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (onMapClickCoordinates) {
          onMapClickCoordinates(e.latlng.lat, e.latlng.lng);
        }
      });
    }

    return () => {
      // Map cleanup if unmounting
    };
  }, []);

  // Update Markers when properties or selectedProperty changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    properties.forEach((prop) => {
      const isSelected = selectedProperty?.id === prop.id;

      // Custom HTML Marker Pin
      const iconHtml = `
        <div style="
          background-color: ${isSelected ? '#dc2626' : prop.authority === 'MUDA' ? '#059669' : '#2563eb'};
          width: ${isSelected ? '32px' : '26px'};
          height: ${isSelected ? '32px' : '26px'};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 11px;
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          ${prop.authority === 'MUDA' ? 'M' : 'C'}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: iconHtml,
        iconSize: [isSelected ? 32 : 26, isSelected ? 32 : 26],
        iconAnchor: [isSelected ? 16 : 13, isSelected ? 16 : 13],
      });

      const marker = L.marker([prop.coordinates.lat, prop.coordinates.lng], {
        icon: customIcon,
      });

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; min-width: 200px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <strong style="color: #1e3a8a; font-size: 13px;">${prop.layoutName}</strong>
            <span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">
              ${prop.authority}
            </span>
          </div>
          <div style="color: #475569; font-size: 11px; margin-bottom: 4px;">${prop.siteNumber}</div>
          <div style="color: #0f172a; font-weight: 600; font-size: 11px;">PID: ${prop.pid}</div>
          <div style="color: #64748b; font-size: 11px;">Area: ${prop.siteAreaSqFt} sq ft (${prop.siteDimensions})</div>
          <div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #64748b;">
            Khata: <strong style="color: #15803d;">${prop.khataType}</strong> • ${prop.isSynthetic ? 'Synthetic Demo' : 'User Entry'}
          </div>
        </div>
      `);

      marker.on('click', () => {
        onSelectProperty(prop);
      });

      markersGroup.addLayer(marker);
    });

    // If a property is selected, pan map to it
    if (selectedProperty && mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [selectedProperty.coordinates.lat, selectedProperty.coordinates.lng],
        15,
        { animate: true }
      );
    }
  }, [properties, selectedProperty]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col bg-white">
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200/80 max-w-sm text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="font-bold text-slate-800">
            {lang === 'kn' ? 'ಮೈಸೂರು ಮಹಾನಗರ ಜಿಐಎಸ್ ನಕ್ಷೆ' : 'Mysuru Municipal Interactive GIS Map'}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {lang === 'kn'
            ? 'ಮೈಸೂರು ನಗರ ಪಾಲಿಕೆ ಮತ್ತು ಮೂಡಾ ವಲಯಗಳ ಮಾದರಿ ಆಸ್ತಿ ಗುರುತುಗಳು'
            : 'OpenStreetMap centered on Mysuru (MCC & MUDA Local Planning Area)'}
        </p>
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200/80 text-[11px] space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
          <span className="text-slate-700 font-medium">MCC Wards (Mysuru City Corp)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
          <span className="text-slate-700 font-medium">MUDA Layouts (Urban Dev Auth)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
          <span className="text-slate-700 font-medium">Currently Selected Property</span>
        </div>
      </div>

      {/* Disclaimer Tag */}
      <div className="absolute top-3 right-3 z-[1000] bg-blue-50/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-blue-200/80 text-[11px] text-blue-900 flex items-center gap-1.5 font-medium">
        <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span>MCC Wards & MUDA Layout Boundary Points</span>
      </div>

      {/* Leaflet Mount Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
};
