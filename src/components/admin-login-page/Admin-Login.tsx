"use client";
import React from "react";
import { FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import { BiDish } from "react-icons/bi";
import { useState } from "react";
import { toast } from "sonner";
import { REGEX_PASSWORD_VALIDATION } from "@/const/password-schema";
import { handleAdminLogin } from "../../actions/login-actions";
import { useRouter } from "next/navigation";

const AdminLogin = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [inputsError, setInputsError] = useState({
    usernameError: "",
    passwordError: "",
  });

  // handle change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "username") {
      setUserName(e.target.value);
      if (inputsError.usernameError)
        setInputsError((prev) => ({ ...prev, userName: "" }));
    } else if (e.target.id === "password") {
      setPassword(e.target.value);
      if (inputsError.passwordError)
        setInputsError((prev) => ({ ...prev, password: "" }));
    }
  };

  // handle form submission

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // inputs validation will be done while the form submission as the below

    const errors = {
      usernameError:
        userName.trim().length < 5
          ? "Please enter a valid username (min 5 chars)"
          : "",
      passwordError: !REGEX_PASSWORD_VALIDATION.test(password)
        ? "Please enter a valid password"
        : "",
    };

    setInputsError(errors);

    if (inputsError.usernameError || inputsError.passwordError) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setFormSubmitting(true);
      const result = await handleAdminLogin(userName, password);
      if (
        result?.success &&
        result?.data &&
        result?.data.user &&
        result?.data?.session?.access_token
      ) {
        toast.success("Login successful");
        router.replace("/admin/a7fK29xP");
        router.refresh();
      } else {
        toast.error(result?.error || "Failed to login");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to login");
      }
    } finally {
      setFormSubmitting(false);
      setUserName("");
      setPassword("");
    }
  };

  return (
    <div className="bg-[#001529] min-h-screen text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#002140] border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-md">
        {/* header  */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-amber-500/10 to-amber-600/20 border border-amber-500/20 flex items-center justify-center text-[#d4af37] shadow-lg shadow-amber-950/20 mb-4 animate-pulse">
            <BiDish size={30} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Welcome Back, Chef!
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 max-w-70">
            Log in to manage your digital menu, active orders, and restaurant
            operations.
          </p>
        </div>

        {/* form */}
        <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="text-[11px] font-bold text-slate-400 mb-2 tracking-wider uppercase"
            >
              Username / Email
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#d4af37] transition-colors">
                <FiUser size={16} />
              </span>
              <input
                onChange={(e) => handleChange(e)}
                value={userName}
                type="text"
                id="username"
                placeholder="Enter your admin username"
                className="w-full bg-[#001529] border border-slate-700/80 rounded-xl py-3.5 pl-11 pr-4 text-xs text-slate-200 placeholder:text-slate-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 outline-none transition-all"
              />
            </div>
            {inputsError.usernameError && (
              <p className="text-red-500 text-xs mt-2!">
                {inputsError.usernameError}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="password"
                className="text-[11px] font-bold text-slate-400 tracking-wider uppercase"
              >
                Password
              </label>

              <button
                type="button"
                className="text-[11px] font-medium text-amber-500/80 hover:text-amber-400 transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#d4af37] transition-colors">
                <FiLock size={16} />
              </span>
              <input
                onChange={(e) => handleChange(e)}
                value={password}
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full bg-[#001529] border border-slate-700/80 rounded-xl py-3.5 pl-11 pr-4 text-xs text-slate-200 placeholder:text-slate-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 outline-none transition-all tracking-widest"
              />
            </div>

            {inputsError.passwordError && (
              <p className="text-red-500 text-xs mt-2!">
                {inputsError.passwordError}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              className="w-3.5 h-3.5 accent-amber-500 rounded border-slate-700 bg-[#001529] cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="text-[11px] text-slate-400 cursor-pointer select-none font-medium"
            >
              Keep me logged in on this device
            </label>
          </div>

          <button
            type="submit"
            disabled={formSubmitting}
            className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black py-4 px-4 rounded-xl cursor-pointer transition-all shadow-xl shadow-amber-950/10 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
          >
            {formSubmitting
              ? "Checking credentials..."
              : "Sign In to Dashboard"}{" "}
            <FiArrowRight size={14} />
          </button>
        </form>

        {/* footer and customer support */}
        <div className="text-center mt-8 pt-4 border-t border-slate-800/60">
          <p className="text-[10px] text-slate-500">
            Protected by enterprise-grade encryption.
          </p>
          <p className="text-[10px] text-slate-500">
            if any support is required, please contact{" "}
            <a
              href="mailto:ahmed.raaft250@gmail.com"
              className="text-amber-500"
            >
              ahmed.raaft250@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
