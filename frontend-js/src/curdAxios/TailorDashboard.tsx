import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function TailorDashboard() {
  const [tailor, setTailor] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("emailid");

    // ✅ STEP 1: Prevent null email API call
    if (!email) {
      console.log("No email found. Redirecting to login...");
      navigate("/login"); // change if your login route differs
      return;
    }

    // ✅ STEP 2: Safe API call
    axios
      .get(`https://golden-needle-backend.vercel.app/tailor/profile/${email}`)
      .then((res) => {
  console.log("API RESPONSE:", res.data);

  // ❌ No profile exists → redirect to profile form
  if (!res.data) {
    navigate("/tailor-profile");
    return;
  }

  // ✅ Profile exists
  setTailor(res.data);
})
      .catch((err) => {
        console.log("Dashboard error:", err);
      });
  }, [navigate]);

  // ✅ STEP 3: Better loading state
  if (!tailor) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center 
                 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/tailor-bg.png')" }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-md mx-auto bg-white shadow-xl rounded-2xl p-8 text-center">
        
        {/* IMAGE */}
        <img
          src={tailor.profileImage || "httpss://via.placeholder.com/100"}
          alt={tailor.name}
          className="w-24 h-24 rounded-full mx-auto object-cover mb-4 border"
        />

        {/* NAME */}
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome, {tailor.name || "Tailor"} 👋
        </h2>

        <p className="text-gray-500 mt-1 mb-6">
          Manage your profile & reviews
        </p>

        {/* BUTTONS */}
        <div className="space-y-3">

          {/* VIEW PROFILE */}
          <Link
            to={`/tailor/${tailor._id}`}
            className="block bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            View Profile
          </Link>

          {/* EDIT PROFILE */}
          <Link
            to="/tailor-profile"
            onClick={() => {
              localStorage.setItem("emailid", tailor.emailid);
              localStorage.setItem("tailorId", tailor._id);
            }}
            className="block bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Edit Profile
          </Link>

        </div>

        <div className="mt-6 text-sm text-gray-400">
          Joined since {tailor.since || "N/A"}
        </div>
      </div>
    </div>
  );
}