import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FindTailor() {
  const [cities, setCities] = useState<string[]>([]);
  const [tailors, setTailors] = useState<any[]>([]);
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [speciality, setSpeciality] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const categoryOptions = ["Male", "Female", "Child"];
  const specialityOptions = [
    "Blouse Stitching",
    "Lehenga Stitching",
    "Suit Stitching",
    "Sherwani Stitching",
    "Alteration",
    "Kids Wear",
    "Designer Wear",
    "Wedding Wear",
  ];

  // ✅ Fetch Cities
  useEffect(() => {
    axios
      .get<{ cities: string[] }>("http://localhost:2007/tailor/tailor-filters")
      .then((res) => {
        const uniqueCities = [...new Set(res.data.cities || [])];
        setCities(uniqueCities);
      })
      .catch(() => setCities([]));
  }, []);

  // ✅ Handle checkbox toggle
  const toggleSelection = (value: string, list: string[], setList: any) => {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value));
    } else {
      setList([...list, value]);
    }
  };

  // ✅ Search API
  const handleSearch = async () => {
    try {
      setLoading(true);
      setSearched(true);

      const params: any = {};
      if (city) params.city = city;
      if (category.length) params.category = category;
      if (speciality.length) params.speciality = speciality;

      const res = await axios.get("http://localhost:2007/tailor/find-tailors", {
        params,
        paramsSerializer: (params) => {
          return Object.keys(params)
            .map((key) =>
              Array.isArray(params[key])
                ? params[key].map((v: string) => `${key}=${v}`).join("&")
                : `${key}=${params[key]}`,
            )
            .join("&");
        },
      });

      setTailors(Array.isArray(res.data) ? res.data : []);
    } catch {
      setTailors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative p-6"
      style={{ backgroundImage: "url('/images/tailor-bg.png')" }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* 🔶 FILTER PANEL */}
        <div className="w-full md:w-80 bg-white rounded-2xl shadow-xl border border-[#E6D5B8] p-6">
          <h2 className="text-xl font-serif mb-6">Find Tailors</h2>

          {/* CITY */}
          <label className="block text-sm font-medium mb-1">City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-[#C9A24D]"
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* CATEGORY */}
          <label className="block text-sm font-medium mb-2">Category</label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {categoryOptions.map((cat) => (
              <label
                key={cat}
                className={`border rounded-lg px-3 py-2 cursor-pointer text-sm ${
                  category.includes(cat)
                    ? "bg-[#C9A24D] text-black"
                    : "border-[#E6D5B8]"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={category.includes(cat)}
                  onChange={() => toggleSelection(cat, category, setCategory)}
                />
                {cat}
              </label>
            ))}
          </div>

          {/* SPECIALITY */}
          <label className="block text-sm font-medium mb-2">Speciality</label>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {specialityOptions.map((sp) => (
              <label
                key={sp}
                className={`border rounded-lg px-3 py-2 cursor-pointer text-sm ${
                  speciality.includes(sp)
                    ? "bg-[#C9A24D] text-black"
                    : "border-[#E6D5B8]"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={speciality.includes(sp)}
                  onChange={() =>
                    toggleSelection(sp, speciality, setSpeciality)
                  }
                />
                {sp}
              </label>
            ))}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-[#C9A24D] hover:text-black transition"
          >
            {loading ? "Searching..." : "Find Tailors"}
          </button>
        </div>

        {/* 🔶 RESULTS */}
        <div className="flex-1">
          {loading && (
            <p className="text-center text-gray-600">Loading tailors...</p>
          )}

          {!loading && searched && tailors.length === 0 && (
            <p className="text-center text-gray-500">No tailors found</p>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tailors.map((t) => (
              <div
                key={t._id}
                className="bg-white rounded-2xl shadow-md border border-[#E6D5B8] overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={t.profileImage || "https://via.placeholder.com/300"}
                  alt={t.name}
                  className="w-full h-44 object-cover"
                />

                <div className="p-4">
                  <h3 className="text-lg font-semibold">{t.name}</h3>

                  {/* ARRAY DISPLAY FIX */}
                  <p className="text-sm text-gray-600">
                    {Array.isArray(t.speciality)
                      ? t.speciality.join(", ")
                      : t.speciality}
                  </p>

                  <p className="text-sm text-gray-500">{t.city}</p>

                  <button
                    onClick={() => navigate(`/tailor/${t._id}`)}
                    className="mt-3 text-sm font-medium text-[#C9A24D] hover:underline"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
