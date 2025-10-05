import { useState } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import svgPaths from "../imports/svg-uy3nkobzqw";
import imgOriginal3D1Cd6004Fb64C8F8B609D5Ed046D0821 from "figma:asset/1f93bfd3dadb5b5c5776c200078549369c5b84da.png";

interface SignupScreenProps {
  onSignupSuccess: () => void;
  onLoginClick: () => void;
}

export function SignupScreen({ onSignupSuccess, onLoginClick }: SignupScreenProps) {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, nickname }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        setLoading(false);
        return;
      }

      // Success - go to login
      onSignupSuccess();
    } catch (err) {
      console.error("Signup error:", err);
      setError("Failed to create account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#cee7bd] min-h-screen flex flex-col items-center px-4 py-8">
      {/* Logo */}
      <div className="h-[111px] w-[144px] mb-6 mt-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img 
            alt="Hooky Golf Logo" 
            className="absolute h-[142.34%] left-[-24.72%] max-w-none top-[-20.07%] w-[146.07%]" 
            src={imgOriginal3D1Cd6004Fb64C8F8B609D5Ed046D0821} 
          />
        </div>
      </div>

      {/* Title */}
      <h1 className="luckiest-guy text-[#282828] text-[32px] mb-4">
        Hooky Golf
      </h1>

      {/* Subtitle */}
      <p className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[18px] text-center w-full max-w-[382px] mb-8" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Complete real golf challenges to sneak past office bosses to avoid getting caught!
      </p>

      {/* Signup Form Card */}
      <form onSubmit={handleSignup} className="w-full max-w-[382px]">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-center justify-center px-[16px] py-[24px] rounded-[32px] relative">
          <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
          
          {/* Title */}
          <div className="content-stretch flex flex-col items-start relative shrink-0 mb-4">
            <p className="luckiest-guy not-italic relative shrink-0 text-[#282828] text-[20px] text-center w-[231px]">
              Create account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full bg-[#C43C3C]/10 border border-[#C43C3C] rounded-[16px] p-4 mb-4">
              <p className="font-['Geologica:Regular',_sans-serif] text-[#C43C3C] text-[14px] text-center" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                {error}
              </p>
            </div>
          )}

          {/* Form Fields */}
          <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full max-w-[350px]">
            {/* Email Field */}
            <div className="h-[68px] relative shrink-0 w-full">
              <div className="absolute h-[20px] left-0 top-0 w-full">
                <p className="absolute font-['Geologica:Light',_sans-serif] font-light leading-[normal] left-0 not-italic text-[#282828] text-[16px] text-nowrap top-0 whitespace-pre" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  Email
                </p>
              </div>
              <div className="absolute box-border content-stretch flex gap-[10px] items-center left-0 px-0 py-[10px] top-[28px] w-full">
                <div className="absolute bg-white left-0 top-0 w-full">
                  <div className="box-border content-stretch flex gap-[10px] items-center overflow-clip px-[16px] py-[10px] relative w-full">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="font-['Geologica:Light',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#517b34] text-[16px] text-nowrap whitespace-pre w-full bg-transparent border-none outline-none"
                      style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                    />
                  </div>
                  <div aria-hidden="true" className="absolute border-[#517b34] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Nickname Field */}
            <div className="h-[68px] relative shrink-0 w-full">
              <div className="absolute h-[20px] left-0 top-0 w-full">
                <p className="absolute font-['Geologica:Light',_sans-serif] font-light leading-[normal] left-0 not-italic text-[#282828] text-[16px] text-nowrap top-0 whitespace-pre" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  Nickname
                </p>
              </div>
              <div className="absolute box-border content-stretch flex gap-[10px] items-center left-0 px-0 py-[10px] top-[28px] w-full">
                <div className="absolute bg-white left-0 top-0 w-full">
                  <div className="box-border content-stretch flex gap-[10px] items-center overflow-clip px-[16px] py-[10px] relative w-full">
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Display name for profile"
                      required
                      maxLength={20}
                      className="font-['Geologica:Light',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#517b34] text-[16px] text-nowrap whitespace-pre w-full bg-transparent border-none outline-none"
                      style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                    />
                  </div>
                  <div aria-hidden="true" className="absolute border-[#517b34] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="h-[68px] relative shrink-0 w-full">
              <div className="absolute h-[20px] left-0 top-0 w-full">
                <p className="absolute font-['Geologica:Light',_sans-serif] font-light leading-[normal] left-0 not-italic text-[#282828] text-[16px] text-nowrap top-0 whitespace-pre" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  Password
                </p>
              </div>
              <div className="absolute box-border content-stretch flex gap-[10px] items-center left-0 px-0 py-[10px] top-[28px] w-full">
                <div className="absolute bg-white left-0 top-0 w-full">
                  <div className="box-border content-stretch flex gap-[10px] items-center overflow-clip px-[16px] py-[10px] relative w-full">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      minLength={6}
                      className="font-['Geologica:Light',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#517b34] text-[16px] text-nowrap whitespace-pre w-full bg-transparent border-none outline-none"
                      style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                    />
                  </div>
                  <div aria-hidden="true" className="absolute border-[#517b34] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Create Account Button */}
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full max-w-[350px] mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#517b34] hover:bg-[#456628] box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center overflow-clip px-[39px] py-[12px] relative rounded-[100px] shrink-0 w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                <p className="leading-[normal] whitespace-pre">
                  {loading ? "Creating account..." : "Create account"}
                </p>
              </div>
              {!loading && (
                <div className="relative shrink-0 size-[24px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <path d={svgPaths.p22f0df80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="content-stretch flex gap-[10px] h-[20px] items-center justify-center relative shrink-0 w-full max-w-[350px] mt-4">
            <p className="font-['Geologica:Light',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] text-center text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={onLoginClick}
                className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid font-['Geologica:Bold',_sans-serif] font-bold text-[#517b34] underline"
                style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}