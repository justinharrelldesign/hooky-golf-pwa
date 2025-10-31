import { useState, useMemo, useCallback } from "react";
import svgPaths from "../imports/svg-8k9vx43pj3";

interface Player {
  id: string;
  name: string;
  avatarUrl?: string;
  isCurrentUser?: boolean;
  friendId?: string;
}

interface Team {
  id: string;
  name: string;
  playerIds: string[];
}

interface TeamManagementSectionProps {
  players: Player[];
  teams: Team[];
  onTeamsChange: (teams: Team[]) => void;
  gameMode: 'free-for-all' | 'teams';
  onGameModeChange: (mode: 'free-for-all' | 'teams') => void;
}

function IconOutlinePlusCircle() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon/Outline/plus-circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Outline/plus-circle">
          <path d={svgPaths.p1c26fc00} id="Icon" stroke="var(--stroke-0, #517B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function HeroiconsOutlineXCircle() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-outline/x-circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-outline/x-circle">
          <path d={svgPaths.p77e1200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function HeroiconsSolidChevronDown() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-solid/chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-solid/chevron-down">
          <path clipRule="evenodd" d={svgPaths.p1426a500} fill="var(--fill-0, #517B34)" fillRule="evenodd" id="Vector 335 (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

export function TeamManagementSection({ 
  players, 
  teams, 
  onTeamsChange, 
  gameMode, 
  onGameModeChange 
}: TeamManagementSectionProps) {
  const [expandedTeamDropdown, setExpandedTeamDropdown] = useState<string | null>(null);

  const addTeam = () => {
    const newTeamNumber = teams.length + 1;
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: `Team ${newTeamNumber}`,
      playerIds: []
    };
    onTeamsChange([...teams, newTeam]);
  };

  const removeTeam = (teamId: string) => {
    onTeamsChange(teams.filter(t => t.id !== teamId));
  };

  const updateTeamName = (teamId: string, name: string) => {
    onTeamsChange(teams.map(t => 
      t.id === teamId ? { ...t, name } : t
    ));
  };

  const addPlayerToTeam = (teamId: string, playerId: string) => {
    // Remove player from all other teams first
    const updatedTeams = teams.map(t => ({
      ...t,
      playerIds: t.playerIds.filter(pid => pid !== playerId)
    }));
    
    // Add player to selected team
    onTeamsChange(updatedTeams.map(t => 
      t.id === teamId 
        ? { ...t, playerIds: [...t.playerIds, playerId] }
        : t
    ));
    
    setExpandedTeamDropdown(null);
  };

  const removePlayerFromTeam = (teamId: string, playerId: string) => {
    onTeamsChange(teams.map(t => 
      t.id === teamId 
        ? { ...t, playerIds: t.playerIds.filter(pid => pid !== playerId) }
        : t
    ));
  };

  const getAvailablePlayersForTeam = useCallback((teamId: string) => {
    const assignedPlayerIds = new Set(
      teams.flatMap(t => t.playerIds)
    );
    
    // Include all players with names (including party leader) who aren't already on a team
    return players.filter(p => {
      const hasName = p.name && p.name.trim() !== "";
      const notAssigned = !assignedPlayerIds.has(p.id);
      return hasName && notAssigned;
    });
  }, [players, teams]);

  const getPlayerById = useCallback((playerId: string) => {
    return players.find(p => p.id === playerId);
  }, [players]);

  // Check if there are any unassigned players with names
  const hasUnassignedPlayers = useMemo(() => {
    const assignedPlayerIds = new Set(teams.flatMap(t => t.playerIds));
    return players.some(p => {
      const hasName = p.name && p.name.trim() !== "";
      const notAssigned = !assignedPlayerIds.has(p.id);
      return hasName && notAssigned;
    });
  }, [players, teams]);

  return (
    <div className="w-full flex flex-col items-center relative">
      {/* Title */}
      <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic text-[#282828] text-[12px] text-center uppercase w-[334px] mb-[16px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Teams or free-for-all?
      </p>

      {/* Mode Toggle */}
      <div className="h-[42px] rounded-[100px] w-[382px] relative">
        <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[100px]" />
        
        {/* Free-for-all button */}
        <div 
          className={`absolute box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[39px] py-[12px] rounded-[100px] top-0 translate-x-[-50%] w-[191px] cursor-pointer transition-colors ${gameMode === 'free-for-all' ? 'bg-[#517b34]' : ''}`}
          style={{ left: "calc(50% - 95.5px)" }}
          onClick={() => onGameModeChange('free-for-all')}
        >
          <p className={`font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre ${gameMode === 'free-for-all' ? 'text-white' : 'text-[#282828]'}`} style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Free-for-all
          </p>
        </div>
        
        {/* Team(s) button */}
        <div 
          className={`absolute box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[39px] py-[12px] rounded-[100px] top-0 translate-x-[-50%] w-[191px] cursor-pointer transition-colors ${gameMode === 'teams' ? 'bg-[#517b34]' : ''}`}
          style={{ left: "calc(50% + 95.5px)" }}
          onClick={() => onGameModeChange('teams')}
        >
          <p className={`font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre ${gameMode === 'teams' ? 'text-white' : 'text-[#282828]'}`} style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Team(s)
          </p>
        </div>
      </div>

      {/* Teams Section - Only show when in team mode */}
      {gameMode === 'teams' && (
        <>
          <div className="flex flex-col gap-[16px] mt-[16px]">
            {teams.map((team, teamIndex) => (
              <div 
                key={team.id}
                className="box-border content-stretch flex flex-col gap-[12px] items-center justify-center px-[16px] py-[24px] rounded-[32px] w-[382px] relative z-[100]"
              >
              <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
              
              {/* Team Name - editable */}
              <div className="relative w-[232px]">
                <input
                  value={team.name}
                  onChange={(e) => updateTeamName(team.id, e.target.value)}
                  className="text-[20px] text-center w-full bg-transparent border-none outline-none"
                  style={{
                    fontFamily: "'Luckiest Guy', cursive, system-ui, sans-serif",
                    fontWeight: 400,
                    fontStyle: 'normal',
                    lineHeight: '24px',
                    color: '#282828'
                  }}
                  placeholder={`Team ${teamIndex + 1}`}
                />
              </div>

              {/* Players in team */}
              <div className="flex flex-col gap-[12px] w-[350px]">
                {team.playerIds.map((playerId) => {
                  const player = getPlayerById(playerId);
                  if (!player) return null;
                  
                  return (
                    <div key={playerId} className="relative bg-[#517b34] rounded-[100px] w-[350px]">
                      <div className="box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[inherit] w-[350px]">
                        <div className="basis-0 box-border content-stretch flex gap-[10px] grow items-center min-h-px min-w-px px-0 py-[2px] relative shrink-0">
                          <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                            <p className="leading-[normal] whitespace-pre">{player.name}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removePlayerFromTeam(team.id, playerId)}
                          className="cursor-pointer hover:opacity-70 transition-opacity"
                          aria-label={`Remove ${player.name} from team`}
                        >
                          <HeroiconsOutlineXCircle />
                        </button>
                      </div>
                      <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[100px]" />
                    </div>
                  );
                })}

                {/* Add player to team dropdown - only show if there are unassigned players */}
                {hasUnassignedPlayers && (
                  <div className="relative w-[350px]">
                    <div className="relative bg-[#cee7bd] rounded-[100px] w-[350px]">
                      <div 
                        className="box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[inherit] w-[350px] cursor-pointer"
                        onClick={() => setExpandedTeamDropdown(expandedTeamDropdown === team.id ? null : team.id)}
                      >
                        <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0">
                          <div className="absolute left-0 size-[24px] top-0">
                            <IconOutlinePlusCircle />
                          </div>
                          <div className="absolute flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] left-[34px] not-italic text-[#517b34] text-[16px] text-nowrap top-[22px] translate-y-[-100%]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                            <p className="leading-[normal] whitespace-pre">Add player to team</p>
                          </div>
                        </div>
                        <HeroiconsSolidChevronDown />
                      </div>
                      <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[100px]" />
                    </div>

                    {/* Dropdown menu - now positioned relative to outer container */}
                    {expandedTeamDropdown === team.id && (() => {
                      const availablePlayers = getAvailablePlayersForTeam(team.id);
                      return (
                        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-[16px] border border-[#517b34] shadow-lg overflow-hidden z-[9999]">
                          {availablePlayers.length === 0 ? (
                            <div className="px-[16px] py-[12px] text-center">
                              <p className="font-['Geologica:Regular',_sans-serif] text-[14px] text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                No available players
                              </p>
                            </div>
                          ) : (
                            availablePlayers.map((player) => (
                              <div
                                key={player.id}
                                className="px-[16px] py-[12px] hover:bg-[#cee7bd] cursor-pointer transition-colors"
                                onClick={() => addPlayerToTeam(team.id, player.id)}
                              >
                                <p className="font-['Geologica:Regular',_sans-serif] text-[16px] text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                  {player.name}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
            ))}
          </div>

          {/* Add team button - only show if there are unassigned players */}
          {hasUnassignedPlayers && (
            <div 
              className="relative bg-[#cee7bd] rounded-[100px] w-[382px] cursor-pointer hover:bg-[#b8d1a7] transition-colors mt-[16px]"
              onClick={addTeam}
            >
              <div className="box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[39px] py-[12px] relative rounded-[inherit] w-[382px]">
                <IconOutlinePlusCircle />
                <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[#517b34] text-[16px] text-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  <p className="leading-[normal] whitespace-pre">Add team</p>
                </div>
              </div>
              <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[100px]" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
