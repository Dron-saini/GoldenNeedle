import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const emailid = location.state?.emailid;

  const handleVerify = async () => {
    try {
      const res = await axios.post(
        "http://localhost:2007/user/verify-otp",
        { emailid, otp }
      );

      alert(res.data.msg);
      navigate("/login");

    } catch (err: any) {
      alert(err.response?.data?.msg || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE6]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-serif text-center mb-6">
          Verify Email
        </h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg mb-4"
        />

        <button
          onClick={handleVerify}
          className="w-full bg-black text-white py-2 rounded-xl hover:bg-[#C9A24D] hover:text-black transition"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}
