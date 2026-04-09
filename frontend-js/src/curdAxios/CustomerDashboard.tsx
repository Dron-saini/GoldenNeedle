import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
  const navigate = useNavigate();

  const emailid = localStorage.getItem("emailid") || "";

  return (
    <main
      className="min-h-screen flex items-center justify-center 
                 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/tailor-bg.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-xl border border-[#E6D5B8] p-10 text-center">

          {/* Welcome */}
          <h1 className="text-3xl font-serif text-black">
            Welcome 👋
          </h1>

          <p className="text-gray-600 mt-2 text-sm">
            {emailid}
          </p>

          <p className="mt-4 text-gray-500">
            What would you like to do today?
          </p>

          {/* Actions */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Profile */}
            <div
              onClick={() => navigate("/customer-profile")}
              className="cursor-pointer rounded-2xl border border-[#E6D5B8] p-6 
                         hover:shadow-lg hover:scale-[1.02] transition"
            >
              <h2 className="text-xl font-semibold text-black">
                👤 My Profile
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                View or update your personal details
              </p>
            </div>

            {/* Find Tailor */}
            <div
              onClick={() => navigate("/find-tailor")}
              className="cursor-pointer rounded-2xl border border-[#E6D5B8] p-6 
                         hover:shadow-lg hover:scale-[1.02] transition"
            >
              <h2 className="text-xl font-semibold text-black">
                🔍 Find Tailor
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Search and explore tailors near you
              </p>
            </div>

          </div>

          {/* Footer */}
          <p className="mt-10 text-xs text-gray-500">
            Crafted with elegance • Tailor Platform
          </p>

        </div>
      </div>
    </main>
  );
}
