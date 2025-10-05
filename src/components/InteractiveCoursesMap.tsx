import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { projectId } from "../utils/supabase/info";

interface CourseLocation {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
  victories: number;
  losses: number;
}

interface InteractiveCoursesMapProps {
  courseLocations: CourseLocation[];
  onCourseSelect: (course: CourseLocation | null) => void;
  selectedCourse: CourseLocation | null;
  accessToken: string;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps?: () => void;
  }
}

export function InteractiveCoursesMap({ 
  courseLocations, 
  onCourseSelect,
  selectedCourse,
  accessToken 
}: InteractiveCoursesMapProps) {
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Fetch API key
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        console.log("Fetching Maps API key from backend...");
        console.log("Project ID:", projectId);
        
        const url = `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/get-maps-api-key`;
        console.log("Fetch URL:", url);
        
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response error text:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Maps API key fetch response:", data);
        
        if (data.apiKey) {
          setApiKey(data.apiKey);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("API key not found in response");
        }
      } catch (error) {
        console.error("Failed to fetch Maps API key:", error);
        setError(error instanceof Error ? error.message : String(error));
      }
    };

    fetchApiKey();
  }, [accessToken]);

  // Load Google Maps script
  useEffect(() => {
    if (!apiKey) return;

    // Check if already loaded
    if (window.google && window.google.maps) {
      setGoogleMapsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Script is loading, wait for it
      const checkLoaded = setInterval(() => {
        if (window.google && window.google.maps) {
          setGoogleMapsLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => clearInterval(checkLoaded), 10000);
      return;
    }

    // Create callback
    window.initGoogleMaps = () => {
      setGoogleMapsLoaded(true);
      delete window.initGoogleMaps;
    };

    // Load script with Google's recommended loading pattern
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
      setError("Failed to load Google Maps");
    };
    document.head.appendChild(script);
  }, [apiKey]);

  // Initialize map
  useEffect(() => {
    if (!googleMapsLoaded || !mapRef.current || courseLocations.length === 0) return;

    try {
      // Calculate bounds
      const bounds = new window.google.maps.LatLngBounds();
      courseLocations.forEach(course => {
        bounds.extend({ lat: course.lat, lng: course.lng });
      });

      // Create map
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: bounds.getCenter(),
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy',
        styles: [
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      map.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
      });

      mapInstanceRef.current = map;
    } catch (error) {
      console.error("Error initializing map:", error);
      return;
    }

    // Clear existing markers
    markersRef.current.forEach(marker => {
      try {
        marker.setMap(null);
      } catch (e) {
        console.error("Error removing marker:", e);
      }
    });
    markersRef.current = [];

    // Define custom marker class
    class CustomMarker extends window.google.maps.OverlayView {
        position: any;
        div: HTMLDivElement | null = null;
        course: CourseLocation;
        isVictory: boolean;

        constructor(position: any, course: CourseLocation, isVictory: boolean) {
          super();
          this.position = position;
          this.course = course;
          this.isVictory = isVictory;
        }

        onAdd() {
          const div = document.createElement('div');
          div.style.position = 'absolute';
          div.style.cursor = 'pointer';
          div.className = 'custom-map-marker';
          
          div.innerHTML = `
            <div class="flex items-center justify-center size-[36px] rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110" 
                 style="background-color: ${this.isVictory ? '#517b34' : '#C43C3C'}">
              ${this.isVictory ? `
                <svg class="size-[18px]" viewBox="0 0 24 24" fill="none">
                  <path d="M16.5003 18.75H7.50026M16.5003 18.75C18.1571 18.75 19.5003 20.0931 19.5003 21.75H4.50026C4.50026 20.0931 5.8434 18.75 7.50026 18.75M16.5003 18.75V15.375C16.5003 14.7537 15.9966 14.25 15.3753 14.25H14.5036M7.50026 18.75V15.375C7.50026 14.7537 8.00394 14.25 8.62526 14.25H9.49689M14.5036 14.25H9.49689M14.5036 14.25C13.9563 13.3038 13.6097 12.227 13.5222 11.0777M9.49689 14.25C10.0442 13.3038 10.3908 12.227 10.4783 11.0777M5.25026 4.23636C4.26796 4.3792 3.29561 4.55275 2.33423 4.75601C2.78454 7.42349 4.99518 9.49282 7.72991 9.72775M5.25026 4.23636V4.5C5.25026 6.60778 6.21636 8.48992 7.72991 9.72775M5.25026 4.23636V2.72089C7.45568 2.41051 9.70922 2.25 12.0003 2.25C14.2913 2.25 16.5448 2.41051 18.7503 2.72089V4.23636M7.72991 9.72775C8.51748 10.3719 9.45329 10.8415 10.4783 11.0777M18.7503 4.23636V4.5C18.7503 6.60778 17.7842 8.48992 16.2706 9.72775M18.7503 4.23636C19.7326 4.3792 20.7049 4.55275 21.6663 4.75601C21.216 7.42349 19.0053 9.49282 16.2706 9.72775M16.2706 9.72775C15.483 10.3719 14.5472 10.8415 13.5222 11.0777M13.5222 11.0777C13.0331 11.1904 12.5236 11.25 12.0003 11.25C11.4769 11.25 10.9675 11.1904 10.4783 11.0777" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              ` : `
                <svg class="size-[18px]" fill="none" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              `}
            </div>
          `;
          
          div.addEventListener('click', () => {
            onCourseSelect(selectedCourse?.placeId === this.course.placeId ? null : this.course);
          });

          this.div = div;
          const panes = this.getPanes();
          panes!.overlayMouseTarget.appendChild(div);
        }

        draw() {
          const overlayProjection = this.getProjection();
          const position = overlayProjection.fromLatLngToDivPixel(
            new window.google.maps.LatLng(this.position.lat, this.position.lng)
          );

          if (this.div) {
            this.div.style.left = (position.x - 18) + 'px';
            this.div.style.top = (position.y - 18) + 'px';
          }
        }

        onRemove() {
          if (this.div) {
            this.div.parentNode?.removeChild(this.div);
            this.div = null;
          }
        }
      }

    // Add markers for each course
    try {
      courseLocations.forEach(course => {
        const isVictory = course.victories > 0;
        const marker = new CustomMarker({ lat: course.lat, lng: course.lng }, course, isVictory);
        marker.setMap(mapInstanceRef.current);
        markersRef.current.push(marker);
      });
    } catch (error) {
      console.error("Error creating markers:", error);
    }

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [googleMapsLoaded, courseLocations, selectedCourse, onCourseSelect]);

  // Update marker scale when selection changes
  useEffect(() => {
    if (!googleMapsLoaded || markersRef.current.length === 0) return;

    markersRef.current.forEach((marker, index) => {
      const course = courseLocations[index];
      if (marker.div) {
        const innerDiv = marker.div.querySelector('div');
        
        if (selectedCourse?.placeId === course.placeId) {
          innerDiv?.classList.add('scale-125');
        } else {
          innerDiv?.classList.remove('scale-125');
        }
      }
    });
  }, [selectedCourse, googleMapsLoaded, courseLocations]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f1f5f9] p-4">
        <div className="text-center">
          <p className="font-['Geologica:Regular',_sans-serif] text-[14px] text-[#64748b]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Unable to load map
          </p>
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f1f5f9]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#517b34]"></div>
      </div>
    );
  }

  return (
    <>
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Course info overlay */}
      {selectedCourse && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-3 right-3 bg-white rounded-[12px] p-3 shadow-lg border border-[#517b34] z-10"
        >
          <div className="flex flex-col gap-2">
            <p className="font-['Geologica:Bold',_sans-serif] text-[14px] text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              {selectedCourse.name}
            </p>
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center justify-center size-[20px] rounded-full bg-[#517b34] shrink-0">
                  <svg className="size-[12px]" viewBox="0 0 24 24" fill="none">
                    <path d="M16.5003 18.75H7.50026M16.5003 18.75C18.1571 18.75 19.5003 20.0931 19.5003 21.75H4.50026C4.50026 20.0931 5.8434 18.75 7.50026 18.75M16.5003 18.75V15.375C16.5003 14.7537 15.9966 14.25 15.3753 14.25H14.5036M7.50026 18.75V15.375C7.50026 14.7537 8.00394 14.25 8.62526 14.25H9.49689M14.5036 14.25H9.49689M14.5036 14.25C13.9563 13.3038 13.6097 12.227 13.5222 11.0777M9.49689 14.25C10.0442 13.3038 10.3908 12.227 10.4783 11.0777M5.25026 4.23636C4.26796 4.3792 3.29561 4.55275 2.33423 4.75601C2.78454 7.42349 4.99518 9.49282 7.72991 9.72775M5.25026 4.23636V4.5C5.25026 6.60778 6.21636 8.48992 7.72991 9.72775M5.25026 4.23636V2.72089C7.45568 2.41051 9.70922 2.25 12.0003 2.25C14.2913 2.25 16.5448 2.41051 18.7503 2.72089V4.23636M7.72991 9.72775C8.51748 10.3719 9.45329 10.8415 10.4783 11.0777M18.7503 4.23636V4.5C18.7503 6.60778 17.7842 8.48992 16.2706 9.72775M18.7503 4.23636C19.7326 4.3792 20.7049 4.55275 21.6663 4.75601C21.216 7.42349 19.0053 9.49282 16.2706 9.72775M16.2706 9.72775C15.483 10.3719 14.5472 10.8415 13.5222 11.0777M13.5222 11.0777C13.0331 11.1904 12.5236 11.25 12.0003 11.25C11.4769 11.25 10.9675 11.1904 10.4783 11.0777" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-['Geologica:Regular',_sans-serif] text-[12px] text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  {selectedCourse.victories}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center justify-center size-[20px] rounded-full bg-[#C43C3C] shrink-0">
                  <svg className="size-[12px]" fill="none" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-['Geologica:Regular',_sans-serif] text-[12px] text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  {selectedCourse.losses}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
