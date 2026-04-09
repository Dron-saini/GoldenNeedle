
import { useState, useEffect } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";

export default function RateAndReview() {
  const [mobile, setMobile] = useState("");
  const [tailorName, setTailorName] = useState("");
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState(0);

  const [star, setStar] = useState(0);
  const [review, setReview] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mobile.length < 10) {
      setTailorName("");
      setAvgRating(null);
      setTotalReviews(0);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `https://golden-needle-backend.vercel.app/api/tailor/find-by-mobile/${mobile}`
        );

        setTailorName(res.data.name);
        setAvgRating(res.data.avgRating);
        setTotalReviews(res.data.totalReviews);
        setError("");
      } catch {
        setTailorName("");
        setAvgRating(null);
        setTotalReviews(0);
        setError("Tailor not found");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [mobile]);

  const publishReview = async () => {
    if (!mobile || !star || !review) {
      setError("Please fill all fields");
      return;
    }

    try {
      await axios.post("https://golden-needle-backend.vercel.app/api/review", {
        mobile,
        star,
        review,
      });

      alert("Review submitted!");

      setStar(0);
      setReview("");

      const res = await axios.get(
        `https://golden-needle-backend.vercel.app/api/tailor/find-by-mobile/${mobile}`
      );

      setAvgRating(res.data.avgRating);
      setTotalReviews(res.data.totalReviews);
      setError("");
    } catch {
      setError("Error submitting review");
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center 
                 bg-cover bg-center bg-no-repeat relative px-4"
      style={{ backgroundImage: "url('/images/tailor-bg.png')" }}
    >
      {/* ✅ Overlay added */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>

      {/* ✅ Content wrapper */}
      <div className="relative z-10 w-full flex justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-[#E6D5B8] p-8">

          {/* Title */}
          <h1 className="text-3xl font-serif text-center text-black">
            Rate Tailor
          </h1>

          <p className="mt-2 text-center text-sm text-gray-600">
            Share your experience with the tailor
          </p>

          <div className="mt-6 space-y-5">

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-black">
                Mobile Number
              </label>

              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                className="w-full mt-1 rounded-lg border px-3 py-2
                focus:border-[#C9A24D] focus:ring-2 focus:ring-[#E6D5B8]
                outline-none"
              />

              {loading && (
                <p className="text-xs text-gray-500 mt-1">
                  Fetching tailor...
                </p>
              )}

              {tailorName && !loading && (
                <>
                  <p className="text-sm text-[#C9A24D] font-medium mt-1">
                    Tailor:{" "}
                    <span className="font-semibold">{tailorName}</span>
                  </p>

                  {avgRating !== null && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <FaStar
                            key={num}
                            size={16}
                            className={
                              num <= Math.round(avgRating)
                                ? "text-[#C9A24D]"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>

                      <span className="text-sm text-gray-700">
                        {avgRating} ({totalReviews} reviews)
                      </span>
                    </div>
                  )}

                  {totalReviews === 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      No reviews yet
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-black">
                Your Rating
              </label>

              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <FaStar
                    key={num}
                    size={26}
                    onClick={() => setStar(num)}
                    className={`cursor-pointer transition ${
                      num <= star
                        ? "text-[#C9A24D] scale-110"
                        : "text-gray-300"
                    } hover:scale-110`}
                  />
                ))}
              </div>

              {star > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {star} out of 5
                </p>
              )}
            </div>

            {/* Review */}
            <div>
              <label className="block text-sm font-medium text-black">
                Review
              </label>

              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your experience..."
                className="w-full mt-1 h-28 rounded-lg border px-3 py-2
                focus:border-[#C9A24D] focus:ring-2 focus:ring-[#E6D5B8]
                outline-none resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 text-center font-medium">
                {error}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={publishReview}
            disabled={!mobile || !star || !review}
            className="mt-8 w-full rounded-xl bg-black py-2.5 text-white
            hover:bg-[#C9A24D] hover:text-black transition
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Review
          </button>

          <p className="mt-6 text-center text-xs text-gray-500">
            Crafted with elegance • Tailor Platform
          </p>
        </div>
      </div>
    </main>
  );
}