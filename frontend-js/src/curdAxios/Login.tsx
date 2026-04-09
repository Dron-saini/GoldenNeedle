import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
interface LoginFormState {
  emailid: string;
  pwd: string;
}

const INITIAL_STATE: LoginFormState = {
  emailid: "",
  pwd: "",
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<LoginFormState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);

  // ✅ Hook must be INSIDE component
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const resp = await axios.post("https://golden-needle-backend.vercel.app/user/login", form, {
        headers: { "Content-Type": "application/json" },
      });

      // ✅ redirect based on user type
      const { usertype, emailid } = resp.data;

      // Optional but recommended
      localStorage.setItem("usertype", usertype);
      localStorage.setItem("emailid", emailid);

      if (usertype === "customer") {
        navigate("/customer-dashboard");
      } else if (usertype === "tailor") {
        navigate("/tailor/dashboard");
      } else {
        setError("Unknown user type");
      }
    } catch (err: any) {
      if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relativebg-cover bg-center bg-no-repeat relative"
     style={{ backgroundImage: "url('/images/tailor-bg.png')" }}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-[#E6D5B8] p-8"

      >
        <h1 className="text-3xl font-serif text-center text-black">Login</h1>

        <p className="mt-2 text-center text-sm text-gray-600">
          Welcome back to Tailor Platform
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-black">
              Email Address
            </label>
            <input
              type="email"
              name="emailid"
              value={form.emailid}
              onChange={handleChange}
              required
              className="w-full mt-1 rounded-lg border px-3 py-2
                         focus:border-[#C9A24D] focus:ring-2 focus:ring-[#E6D5B8]
                         outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">
              Password
            </label>

            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="pwd"
                value={form.pwd}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-3 py-2 pr-10
                 focus:border-[#C9A24D] focus:ring-2 focus:ring-[#E6D5B8]
                 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#C9A24D]"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center font-medium">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="mt-8 w-full rounded-xl bg-black py-2.5 text-white
                     hover:bg-[#C9A24D] hover:text-black transition"
        >
          Login
        </button>

        <p className="mt-6 text-center text-xs text-gray-500">
          Crafted with elegance • Tailor Platform
        </p>
      </form>
    </main>
  );
}
