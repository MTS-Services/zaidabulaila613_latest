import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef } from "react";

const GOOGLE_CLIENT_ID =
  process.env.DATA_CLIENT_ID ||
  "546186166762-nso036ghrvjgjlcb9po201bi22pvkniv.apps.googleusercontent.com";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.layls.com";

interface GoogleSignInButtonProps {
  buttonText?: string;
  redirectTo?: string;
}

export default function GoogleSignInButton({
  buttonText = "Sign in with Google",
  redirectTo,
}: GoogleSignInButtonProps) {
  const { login } = useAuth();
  const router = useRouter();
  const buttonDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Google Identity script
    if (!(window as any).google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = renderButton;
      document.body.appendChild(script);
    } else {
      renderButton();
    }

    function renderButton() {
      if ((window as any).google && buttonDivRef.current) {
        (window as any).google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          ux_mode: "popup",
        });
        (window as any).google.accounts.id.renderButton(buttonDivRef.current, {
          theme: "filled_blue",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
        });
      }
    }

    // eslint-disable-next-line
  }, []);

  async function handleCredentialResponse(response: any) {
    const idToken = response.credential;
    try {
      const apiResponse = await fetch(`${API_BASE_URL}/user/google-signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const result = await apiResponse.json();
      if (!apiResponse.ok)
        throw new Error(result.message || "Google sign-in failed.");
      login(result.data);
      enqueueSnackbar(result.message || "Google sign-in successful!", {
        variant: "success",
      });
      router.push(redirectTo || "/dashboard");
    } catch (error: any) {
      enqueueSnackbar(error.message || "Google sign-in error", {
        variant: "error",
      });
    }
  }

  return (
    <div className="flex flex-col items-center my-4">
      <div ref={buttonDivRef}></div>
    </div>
  );
}
