import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface SignupFormState {
  emailid: string;
  pwd: string;
  usertype: string;
}

const INITIAL_STATE: SignupFormState = {
  emailid: "",
  pwd: "",
  usertype: "",
};
import { FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<SignupFormState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pwdRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

    if (!emailRegex.test(form.emailid)) {
      setError("Invalid email format");
      return false;
    }

    if (!pwdRegex.test(form.pwd)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number & special character",
      );
      return false;
    }

    if (!form.usertype) {
      setError("Please select user type");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const url = "https://golden-needle-backend.vercel.app/user/signup";
      await axios.post(url, form, {
        headers: { "Content-Type": "application/json" },
      });

      alert("OTP sent to your email");

      navigate("/verify-otp", {
        state: { emailid: form.emailid },
      });
    } catch (err: any) {
      alert("Signup failed");
      console.error(err);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/tailor-bg.png')" }}
    >
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-6 px-4">
        {/* LEFT SIDE - BRANDING */}
        <div className="hidden md:flex flex-col justify-center bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-lg border border-[#E6D5B8]">
          <h1 className="text-4xl font-serif font-bold text-black">
            Welcome to The Golden Needle
          </h1>

          <p className="mt-4 text-gray-700 leading-relaxed">
            Discover the perfect connection between skilled tailors and
            customers. Whether you want custom stitching or professional
            tailoring services, our platform ensures quality, trust, and
            convenience.
          </p>

          {/* WHY BETTER */}
          <div className="mt-6 space-y-3 text-sm text-gray-800">
            <p>✔ Verified Tailors & Trusted Reviews</p>
            <p>✔ Easy Profile Management</p>
            <p>✔ Seamless Communication</p>
            <p>✔ Personalized Tailoring Experience</p>
          </div>

          {/* CREATOR SECTION */}
          <div className="mt-10 flex items-center gap-4">
            <img
              src="/images/profile.png" // 🔥 put your image here
              alt="Dron Saini"
              className="w-14 h-14 rounded-full object-cover border"
            />
            <div>
              <p className="text-sm font-semibold text-black">
                Created by Dron Saini
              </p>
              <div className="flex gap-4 mt-2 text-lg items-center">
                <a
                  href="httpss://instagram.com/saini.dron"
                  target="_blank"
                  className="text-pink-600 hover:scale-110 transition"
                >
                  <FaInstagram />
                </a>

                <a
                  href="httpss://linkedin.com/in/dron-saini-667339336"
                  target="_blank"
                  className="text-blue-600 hover:scale-110 transition"
                >
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl bg-white shadow-xl border border-[#E6D5B8] p-8"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-serif font-semibold text-black">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Join our premium tailoring experience
            </p>
          </div>

          <div className="space-y-5">
            <input
              type="email"
              name="emailid"
              value={form.emailid}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full border px-3 py-2 rounded-lg"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="pwd"
                value={form.pwd}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full border px-3 py-2 rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-2"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <select
              name="usertype"
              value={form.usertype}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="">Select role</option>
              <option value="tailor">Tailor</option>
              <option value="customer">Customer</option>
            </select>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
          </div>

          <button className="mt-6 w-full bg-black text-white py-2 rounded-xl hover:bg-[#C9A24D] hover:text-black">
            Sign Up
          </button>

          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-[#C9A24D]">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
