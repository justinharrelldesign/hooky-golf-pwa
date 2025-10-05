import { motion, AnimatePresence } from "motion/react";
import { X, Check, UserPlus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import defaultAvatarImg from "figma:asset/6ee3186278c9cc7ba61d44c3a4ce6717ab8d7e8b.png";

interface FriendRequest {
  fromUserId: string;
  fromName: string;
  fromEmail: string;
  fromProfilePhotoUrl?: string | null;
  toUserId: string;
  createdAt: string;
}

interface FriendRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: FriendRequest[];
  onAccept: (fromUserId: string) => void;
  onDeny: (fromUserId: string) => void;
}

export function FriendRequestsModal({ 
  isOpen, 
  onClose, 
  requests, 
  onAccept, 
  onDeny 
}: FriendRequestsModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-[400px]"
          >
            <div className="bg-[#cee7bd] rounded-[32px] border-2 border-[#517b34] p-6 shadow-xl max-h-[80vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="luckiest-guy text-[24px] text-[#282828]">
                  Friend Requests
                </h2>
                <button
                  onClick={onClose}
                  className="w-[32px] h-[32px] rounded-full bg-white/50 hover:bg-white/80 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-[#282828]" />
                </button>
              </div>

              {/* Requests List */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {requests.length === 0 ? (
                  <div className="text-center py-8">
                    <UserPlus className="w-12 h-12 text-[#517b34]/40 mx-auto mb-3" />
                    <p className="font-['Geologica:Regular',_sans-serif] text-[#282828]/60 text-[16px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                      No pending friend requests
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {requests.map((request) => {
                      const initials = request.fromName
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <motion.div
                          key={request.fromUserId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white rounded-[20px] p-4 border border-[#517b34]/20"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            {/* Avatar */}
                            <div className="w-[48px] h-[48px] rounded-full overflow-hidden flex-shrink-0">
                              <Avatar className="w-full h-full">
                                <AvatarImage 
                                  src={request.fromProfilePhotoUrl || defaultAvatarImg} 
                                  alt={request.fromName} 
                                />
                                <AvatarFallback className="bg-[#517b34] text-white font-['Geologica:Bold',_sans-serif] text-[18px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                            </div>

                            {/* Name and Email */}
                            <div className="flex-1 min-w-0">
                              <p className="font-['Geologica:SemiBold',_sans-serif] text-[16px] text-[#282828] truncate" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                {request.fromName}
                              </p>
                              <p className="font-['Geologica:Regular',_sans-serif] text-[14px] text-[#282828]/60 truncate" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                {request.fromEmail}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => onAccept(request.fromUserId)}
                              className="flex-1 bg-[#517b34] hover:bg-[#456628] text-white rounded-[100px] px-4 py-2.5 font-['Geologica:SemiBold',_sans-serif] text-[14px] transition-colors flex items-center justify-center gap-2"
                              style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                            >
                              <Check className="w-4 h-4" />
                              Accept
                            </button>
                            <button
                              onClick={() => onDeny(request.fromUserId)}
                              className="flex-1 bg-white hover:bg-[#f1f5f9] text-[#282828] border border-[#517b34] rounded-[100px] px-4 py-2.5 font-['Geologica:SemiBold',_sans-serif] text-[14px] transition-colors flex items-center justify-center gap-2"
                              style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                            >
                              <X className="w-4 h-4" />
                              Deny
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}