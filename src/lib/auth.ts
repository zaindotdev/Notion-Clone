import { supabase } from "./supabase";
import { SignInFunction, SignUpFunction } from "./types/types";

// signUpHandler
export const signUp = async ({ email, name, password }: SignUpFunction) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/verify`,
      },
    });

    if (error) {
      throw new Error(error.message); // Ensure errors are properly thrown
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Sign up failed: ${error.message}`);
    }
    throw new Error(
      "An unexpected error occurred during sign-up. Please try again later."
    );
  }
};

// signInHandler
export const signIn = async ({ email, password }: SignInFunction) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Sign-in failed: ${error.message}`);
    }
    throw new Error(
      "An unexpected error occurred during sign-in. Please try again later."
    );
  }
};

// signOutHandler
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Sign-out failed: ${error.message}`);
    }
    throw new Error(
      "An unexpected error occurred during sign-out. Please try again later."
    );
  }
};

// email resend
export const resendEmail = async () => {
  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) {
      throw new Error("Unable to fetch session. Please try again later.");
    }

    if (sessionData.session?.user.email_confirmed_at) {
      throw new Error("Your email is already confirmed. You can log in now.");
    }

    const email = sessionData.session?.user.email;
    if (!email) {
      throw new Error(
        "We could not retrieve your email. Please try logging in again."
      );
    }

    const { error, data } = await supabase.auth.resend({
      email: email,
      type: "signup",
      options: {
        emailRedirectTo: `${window.location.origin}/verify`,
      },
    });

    if (error) {
      throw new Error(
        "Failed to resend the verification email. Please try again."
      );
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};
