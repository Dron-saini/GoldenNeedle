import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function TailorProfile() {
  const { id } = useParams();
  const [tailor, setTailor] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:2007/tailor/${id}`)
      .then((res) => {
        console.log("DATA:", res.data);
        setTailor(res.data);
      })
      .catch((err) => {
        console.log("ERROR:", err);
        setTailor(null);
      });
  }, [id]);

  if (!tailor) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative p-6"
      style={{ backgroundImage: "url('/images/tailor-bg.png')" }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>
      <div className="relative z-10 max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        {/* Profile Image */}
        <img
          src={tailor.profileImage || "https://via.placeholder.com/300"}
          alt={tailor.name}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />

        {/* Name */}
        <h2 className="text-3xl font-bold mb-4">{tailor.name}</h2>

        {/* Basic Info */}
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Email:</strong> {tailor.emailid}
          </p>
          <p>
            <strong>Contact:</strong> {tailor.contact}
          </p>
          <p>
            <strong>Address:</strong> {tailor.address}
          </p>
          <p>
            <strong>City:</strong> {tailor.city}
          </p>

          <p>
            <strong>Category:</strong>{" "}
            {Array.isArray(tailor.category)
              ? tailor.category.join(", ")
              : tailor.category}
          </p>

          <p>
            <strong>Speciality:</strong>{" "}
            {Array.isArray(tailor.speciality)
              ? tailor.speciality.join(", ")
              : tailor.speciality}
          </p>

          <p>
            <strong>Website:</strong> {tailor.website}
          </p>
          <p>
            <strong>Since:</strong> {tailor.since}
          </p>
          <p>
            <strong>Work Type:</strong> {tailor.workType}
          </p>

          <p>
            <strong>Shop Address:</strong> {tailor.shopAddress}
          </p>
          <p>
            <strong>Shop City:</strong> {tailor.shopCity}
          </p>
        </div>
        {/* Rate & Review Button */}
        <div className="mt-6 text-center">
          <Link
            to="/review"
            className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Rate & Review
          </Link>
        </div>
      </div>
    </div>
  );
}
