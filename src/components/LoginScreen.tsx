import { useState } from "react";
import { getSupabaseClient } from "../utils/supabase/client";
import svgPaths from "../imports/svg-giima14ai0";
import imgOriginal3D1Cd6004Fb64C8F8B609D5Ed046D0821 from "figma:asset/1f93bfd3dadb5b5c5776c200078549369c5b84da.png";

interface LoginScreenProps {
  onLoginSuccess: (accessToken: string, userId: string) => void;
  onSignupClick: () => void;
}

export function LoginScreen({ onLoginSuccess, onSignupClick }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        onLoginSuccess(data.session.access_token, data.user.id);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to sign in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#cee7bd] min-h-screen flex items-center justify-center px-6 py-8" data-name="iPhone 16 Plus - 30">
      {/* Centered Content Container */}
      <div className="w-full max-w-[430px] flex flex-col items-center gap-6">
        
        {/* Logo Image */}
        <div className="relative h-[111px] w-[144px]" data-name="original-3d1cd6004fb64c8f8b609d5ed046d0821 1">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="Hooky Golf Logo" className="absolute h-[142.34%] left-[-24.72%] max-w-none top-[-20.07%] w-[146.07%]" src={imgOriginal3D1Cd6004Fb64C8F8B609D5Ed046D0821} />
          </div>
        </div>

        {/* Title and Subtitle Group */}
        <div className="flex flex-col items-center gap-2">
          {/* Title */}
          <h1 className="luckiest-guy text-[#282828] text-[32px] text-center leading-[1.2]">
            Hooky Golf
          </h1>

          {/* Subtitle */}
          <p className="font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] text-[#282828] text-[18px] text-center max-w-[382px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Complete real golf challenges to sneak past office bosses to avoid getting caught!
          </p>
        </div>

        {/* Login Form Card */}
        <form onSubmit={handleLogin} className="w-full max-w-[382px] box-border content-stretch flex flex-col gap-[8px] items-center justify-center px-[16px] py-[24px] rounded-[32px] relative">
          <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
          
          {/* Welcome Back Title */}
          <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
            <h2 className="luckiest-guy leading-[24px] not-italic relative shrink-0 text-[#282828] text-[20px] text-center">Welcome back</h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-[#C43C3C]/10 border border-[#C43C3C] rounded-[16px] p-4 w-full max-w-[350px] mb-2">
              <p className="font-['Geologica:Light',_sans-serif] font-light text-[#C43C3C] text-[14px] text-center" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                {error}
              </p>
            </div>
          )}

          {/* Form Container */}
          <div className="relative shrink-0 w-full max-w-[350px]">
            {/* Email and Password Container */}
            <div className="flex flex-col gap-[15px] mb-[16px]">
              {/* Email Field */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="email" className="font-['Geologica:Light',_sans-serif] font-light leading-[normal] text-[16px] text-black" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  Email
                </label>
                <div className="box-border bg-white border-b border-[#517b34] px-[16px] py-[10px]">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="font-['Geologica:Light',_sans-serif] font-light leading-[normal] not-italic w-full text-[#517b34] text-[16px] bg-transparent border-none outline-none"
                    style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="password" className="font-['Geologica:Light',_sans-serif] font-light leading-[normal] text-[16px] text-black" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  Password
                </label>
                <div className="box-border bg-white border-b border-[#517b34] px-[16px] py-[10px]">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    required
                    className="font-['Geologica:Light',_sans-serif] font-light leading-[normal] not-italic w-full text-[#517b34] text-[16px] bg-transparent border-none outline-none"
                    style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                  />
                </div>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#517b34] box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center overflow-clip px-[39px] py-[12px] relative rounded-[100px] shrink-0 w-full hover:bg-[#456628] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-[16px]"
            >
              <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                <p className="leading-[normal] whitespace-pre">{loading ? "Signing in..." : "Sign in"}</p>
              </div>
              <div className="relative shrink-0 size-[24px]" data-name="Icon/Outline/arrow-sm-right">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <g id="Icon/Outline/arrow-sm-right">
                    <path d={svgPaths.p22f0df80} id="Icon" stroke="#FEFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </g>
                </svg>
              </div>
            </button>

            {/* Sign Up Link */}
            <div className="content-stretch flex gap-[10px] items-center justify-center w-full">
              <p className="font-['Geologica:Light',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[16px] text-black text-center" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                <span>Don't have an account? </span>
                <button
                  type="button"
                  onClick={onSignupClick}
                  className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid font-['Geologica:Bold',_sans-serif] font-bold text-[#517b34] underline hover:text-[#456628] transition-colors"
                  style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}