import { User } from "lucide-react";

interface ProfileHeaderProps {
  playerName: string;
}

export function ProfileHeader({ playerName }: ProfileHeaderProps) {
  const getPlayerInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl px-4 py-2 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
            {getPlayerInitials(playerName)}
          </div>
          <div>
            <p className="text-sm text-gray-600">Logged in as</p>
            <p className="text-sm font-medium text-gray-800">{playerName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}