import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Navigation } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { InteractiveCoursesMap } from "./InteractiveCoursesMap";

interface Round {
  id: string;
  isVictory: boolean;
  course?: {
    placeId: string;
    name: string;
    address: string;
  };
  difficulty: {
    name: string;
  };
  totalHoles: number;
  completedAt: string;
}

interface CourseLocation {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
  victories: number;
  losses: number;
}

interface CoursesMapCardProps {
  rounds: Round[];
}

interface MapConfig {
  centerLat: number;
  centerLng: number;
  zoom: number;
  width: number;
  height: number;
}

export function CoursesMapCard({ rounds }: CoursesMapCardProps) {
  const [courseLocations, setCourseLocations] = useState<CourseLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<CourseLocation | null>(null);

  useEffect(() => {
    loadCourseLocations();
  }, [rounds]);

  const loadCourseLocations = async () => {
    setIsLoading(true);
    
    // Filter rounds that have course data
    const roundsWithCourses = rounds.filter(r => r.course);
    
    // Group by course placeId
    const courseMap = new Map<string, { victories: number; losses: number; course: any }>();
    
    roundsWithCourses.forEach(round => {
      if (!round.course) return;
      
      const existing = courseMap.get(round.course.placeId);
      if (existing) {
        if (round.isVictory) {
          existing.victories++;
        } else {
          existing.losses++;
        }
      } else {
        courseMap.set(round.course.placeId, {
          victories: round.isVictory ? 1 : 0,
          losses: round.isVictory ? 0 : 1,
          course: round.course
        });
      }
    });

    // Fetch locations for each unique course
    const locations: CourseLocation[] = [];
    
    for (const [placeId, data] of courseMap.entries()) {
      try {
        // Add timeout to fetch call - increased to 30 seconds to accommodate slow Google Places API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/get-course-location?placeId=${encodeURIComponent(placeId)}`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
            signal: controller.signal
          }
        );
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          console.warn(`[CoursesMapCard] Could not fetch location for ${data.course.name}: HTTP ${response.status} - ${errorText}`);
          // Skip this course but don't log as error since it won't block rendering
          continue;
        }

        const result = await response.json();
        
        if (result.location) {
          locations.push({
            placeId,
            name: data.course.name,
            lat: result.location.lat,
            lng: result.location.lng,
            victories: data.victories,
            losses: data.losses
          });
        } else if (result.error) {
          console.warn(`[CoursesMapCard] Could not get location for ${data.course.name}: ${result.error}`);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log(`[CoursesMapCard] Timeout fetching location for ${data.course.name} - skipping (this is normal for slow API responses)`);
        } else {
          console.log(`[CoursesMapCard] Failed to fetch location for ${data.course.name}:`, error);
        }
        // Continue with other courses even if one fails - this is expected behavior
      }
    }

    console.log('[CoursesMapCard] Successfully loaded locations:', locations.length);
    setCourseLocations(locations);
    setIsLoading(false);
  };

  console.log('[CoursesMapCard] Rendering - isLoading:', isLoading, 'courseLocations:', courseLocations.length);

  if (courseLocations.length === 0 && !isLoading) {
    console.log('[CoursesMapCard] Returning null - no course locations to show');
    return null; // Don't show the card if no courses have been played
  }

  return (
    <motion.div
      className="box-border content-stretch flex flex-col gap-[16px] p-[24px] rounded-[32px] mb-3 relative"
      style={{ background: 'rgba(206, 231, 189, 0.5)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
      
      {/* Header */}
      <div className="flex items-center justify-between relative">
        <h3 className="luckiest-guy text-[#282828] text-[20px]">
          Courses Played
        </h3>
        <Navigation className="w-5 h-5 text-[#517b34]" />
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[300px] rounded-[20px] overflow-hidden bg-[#e5e7eb] border-2 border-[#517b34]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f1f5f9]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#517b34]"></div>
          </div>
        ) : (
          <InteractiveCoursesMap
            courseLocations={courseLocations}
            onCourseSelect={setSelectedCourse}
            selectedCourse={selectedCourse}
          />
        )}
      </div>
    </motion.div>
  );
}
