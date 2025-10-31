import svgPaths from "../imports/svg-nkoddeamr7";
import svgPathsPhoto from "../imports/svg-bk88mkw4sj";

interface BottomNavProps {
  activeTab?: 'home' | 'history' | 'profile';
  onStartRound: () => void;
  onHomeClick?: () => void;
  onHistoryClick?: () => void;
  onProfileClick?: () => void;
}

function HeroiconsOutlineHome({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-outline/home">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-outline/home">
          <path d={svgPaths.p11460780} id="Vector" stroke={isActive ? "#282828" : "#517B34"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function HeroiconsOutlinePhoto({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-outline/photo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-outline/photo">
          <path d={svgPathsPhoto.p2d4a6600} id="Vector" stroke={isActive ? "#282828" : "#517B34"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function HeroiconsOutlineUserCircle({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-outline/user-circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-outline/user-circle">
          <path d={svgPaths.p22e17a00} id="Vector" stroke={isActive ? "#282828" : "#517B34"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function HeroiconsOutlineFlag() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-outline/flag">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-outline/flag">
          <path d={svgPaths.p127ccb80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

export function BottomNav({ activeTab = 'home', onStartRound, onHomeClick, onHistoryClick, onProfileClick }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.15)] z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[24px] items-center justify-center px-[16px] py-[12px] relative size-full max-w-[600px]">
          {/* Home Button */}
          <button
            onClick={onHomeClick}
            className="content-stretch flex gap-[10px] items-center justify-center relative rounded-[100px] shrink-0 size-[40px] transition-all hover:scale-105 active:scale-95"
            style={{ background: activeTab === 'home' ? '#cee7bd' : 'transparent' }}
            aria-label="Home"
          >
            <div aria-hidden="true" className="absolute border border-[#cee7bd] border-solid inset-0 pointer-events-none rounded-[100px]" />
            <HeroiconsOutlineHome isActive={activeTab === 'home'} />
          </button>

          {/* History Button */}
          <button
            onClick={onHistoryClick}
            className="content-stretch flex gap-[10px] items-center justify-center relative rounded-[100px] shrink-0 size-[40px] transition-all hover:scale-105 active:scale-95"
            style={{ background: activeTab === 'history' ? '#cee7bd' : 'transparent' }}
            aria-label="History"
          >
            <div aria-hidden="true" className="absolute border border-[#cee7bd] border-solid inset-0 pointer-events-none rounded-[100px]" />
            <HeroiconsOutlinePhoto isActive={activeTab === 'history'} />
          </button>

          {/* Profile Button */}
          <button
            onClick={onProfileClick}
            className="content-stretch flex gap-[10px] items-center justify-center relative rounded-[100px] shrink-0 size-[40px] transition-all hover:scale-105 active:scale-95"
            style={{ background: activeTab === 'profile' ? '#cee7bd' : 'transparent' }}
            aria-label="Profile"
          >
            <div aria-hidden="true" className="absolute border border-[#cee7bd] border-solid inset-0 pointer-events-none rounded-[100px]" />
            <HeroiconsOutlineUserCircle isActive={activeTab === 'profile'} />
          </button>

          {/* Start Round Button */}
          <button
            onClick={onStartRound}
            className="basis-0 bg-[#517b34] grow min-h-px min-w-px relative rounded-[8px] shrink-0 transition-all hover:bg-[#456628] active:scale-95"
          >
            <div className="flex flex-row items-center justify-center size-full">
              <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[8px] relative w-full">
                <HeroiconsOutlineFlag />
                <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  <p className="leading-[normal] whitespace-pre">Start round</p>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
