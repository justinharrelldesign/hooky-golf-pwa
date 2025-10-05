import { useState, useEffect } from "react";
import { X, Search, MapPin, Loader2 } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface Course {
  placeId: string;
  name: string;
  address: string;
}

interface CourseSearchModalProps {
  selectedCourse: Course | null;
  onSelectCourse: (course: Course | null) => void;
  onClose: () => void;
}

export function CourseSearchModal({ selectedCourse, onSelectCourse, onClose }: CourseSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchCourses(searchQuery);
      } else {
        setCourses([]);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const searchCourses = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/search-courses?query=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      console.log("Course search response:", data);
      
      if (data.apiAvailable === false) {
        setApiAvailable(false);
        setCourses([]);
      } else {
        setApiAvailable(true);
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error("Course search error:", error);
      setCourses([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCourse = (course: Course) => {
    onSelectCourse(course);
    onClose();
  };

  const handleClearCourse = () => {
    onSelectCourse(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[24px] w-full max-w-[420px] max-h-[600px] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e5e7eb]">
          <h2 className="font-['Geologica:Bold',_sans-serif] text-[20px] text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Select Golf Course
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f3f4f6] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#6b7280]" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-[#e5e7eb]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a golf course..."
              className="w-full pl-10 pr-4 py-3 border border-[#d1d5db] rounded-[12px] font-['Geologica:Regular',_sans-serif] text-[16px] focus:outline-none focus:ring-2 focus:ring-[#517b34] focus:border-transparent"
              style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
              autoFocus
            />
          </div>
          
          {!apiAvailable && (
            <div className="mt-3 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-[8px]">
              <p className="font-['Geologica:Regular',_sans-serif] text-[14px] text-[#991b1b]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                Course search is currently unavailable. The API key may not be configured.
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-[#517b34] animate-spin" />
            </div>
          ) : courses.length > 0 ? (
            <div className="space-y-2">
              {courses.map((course) => (
                <button
                  key={course.placeId}
                  onClick={() => handleSelectCourse(course)}
                  className={`w-full text-left p-4 rounded-[12px] border transition-all hover:border-[#517b34] hover:bg-[#f0f9ff] ${
                    selectedCourse?.placeId === course.placeId
                      ? "border-[#517b34] bg-[#f0f9ff]"
                      : "border-[#e5e7eb]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#517b34] mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-['Geologica:Bold',_sans-serif] text-[16px] text-[#282828] truncate" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {course.name}
                      </p>
                      <p className="font-['Geologica:Regular',_sans-serif] text-[14px] text-[#6b7280] mt-1 line-clamp-2" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {course.address}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.trim().length >= 2 && !isSearching ? (
            <div className="text-center py-8">
              <p className="font-['Geologica:Regular',_sans-serif] text-[16px] text-[#6b7280]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                No courses found
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="font-['Geologica:Regular',_sans-serif] text-[16px] text-[#6b7280]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                Type to search for golf courses
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {selectedCourse && (
          <div className="p-6 border-t border-[#e5e7eb]">
            <button
              onClick={handleClearCourse}
              className="w-full py-3 px-4 rounded-[12px] border border-[#d1d5db] font-['Geologica:Regular',_sans-serif] text-[16px] text-[#6b7280] hover:bg-[#f9fafb] transition-colors"
              style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
            >
              Clear selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
