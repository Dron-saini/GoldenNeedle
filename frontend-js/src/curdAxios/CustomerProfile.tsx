import { useState } from "react";
import axios from "axios";

interface CustomerProfileForm {
  emailid: string;
  name: string;
  address: string;
  city: string;
  state: string;
  gender: string;
  profilepic: File | null;
}

const INITIAL_STATE: CustomerProfileForm = {
  emailid: "",
  name: "",
  address: "",
  city: "",
  state: "",
  gender: "",
  profilepic: null,
};

export default function CustomerProfile() {
  const [form, setForm] = useState<CustomerProfileForm>(INITIAL_STATE);
  const [preview, setPreview] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(true);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(prev => ({ ...prev, profilepic: file }));
    setPreview(URL.createObjectURL(file));
  }

  async function doSearch() {
    try {
      const resp = await axios.post(
        "https://golden-needle-backend.vercel.app/custprofile/find",
        { emailid: form.emailid }
      );

      setForm({
        emailid: resp.data.emailid,
        name: resp.data.name || "",
        address: resp.data.address || "",
        city: resp.data.city || "",
        state: resp.data.state || "",
        gender: resp.data.gender || "",
        profilepic: null,
      });

      setPreview(resp.data.profilepic);
      setIsNew(false);
    } catch {
      alert("Profile not found. Create new profile.");
      setIsNew(true);
      setPreview(null);
    }
  }

async function doSave() {
  try {
    console.log("Save clicked");
    console.log("Frontend running on:", window.location.origin);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== "") {
        fd.append(k, v as any);
      }
    });

    const resp = await axios.post(
      "https://127.0.0.1:2007/custprofile/save",
      fd
    );

    console.log("Response:", resp.data);
    alert("Profile saved successfully");
    setIsNew(false);

  } catch (err: any) {
    console.error("SAVE ERROR:", err.response?.data || err.message);
    alert("Error saving profile.");
  }
}



  async function doUpdate() {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v as any));

    await axios.post(
      "https://golden-needle-backend.vercel.app/custprofile/update",
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    alert("Profile updated");
  }

  return (
    <main
  className="min-h-screen bg-cover bg-center bg-no-repeat relative p-6"
  style={{ backgroundImage: "url('/images/tailor-bg.png')" }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>

  {/* Content */}
  <div className="relative z-10 max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        
        <h1 className="text-3xl font-serif text-black text-center mb-8">
          Customer Profile
        </h1>

        {/* Email + Search */}
        <div className="flex gap-4 mb-6">
          <input
            name="emailid"
            value={form.emailid}
            onChange={handleChange}
            placeholder="Email Id"
            className="flex-1 rounded-lg border border-[#E6D5B8] px-4 py-2
                       focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
          />
          <button
            onClick={doSearch}
            className="rounded-lg bg-black px-6 py-2 text-white
                       hover:bg-[#C9A24D] hover:text-black transition"
          >
            Search
          </button>
        </div>

        {/* Image */}
        <div className="flex gap-8 mb-8 items-center">
          <img
            src={
  preview
    ? preview
    : "/default-profile.png"
}

            className="w-36 h-36 rounded-xl object-cover border border-[#E6D5B8]"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm"
          />
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full rounded-lg border border-[#E6D5B8] px-4 py-2
                       focus:ring-2 focus:ring-[#C9A24D] outline-none"
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full rounded-lg border border-[#E6D5B8] px-4 py-2
                       focus:ring-2 focus:ring-[#C9A24D] outline-none"
          />

          <div className="flex gap-4">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="flex-1 rounded-lg border border-[#E6D5B8] px-4 py-2
                         focus:ring-2 focus:ring-[#C9A24D] outline-none"
            />
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="flex-1 rounded-lg border border-[#E6D5B8] px-4 py-2
                         focus:ring-2 focus:ring-[#C9A24D] outline-none"
            />
          </div>

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#E6D5B8] px-4 py-2
                       focus:ring-2 focus:ring-[#C9A24D] outline-none"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-10">
          {isNew ? (
            <button
              onClick={doSave}
              className="rounded-xl bg-black px-12 py-2 text-white
                         hover:bg-[#C9A24D] hover:text-black transition"
            >
              Save
            </button>
          ) : (
            <button
              onClick={doUpdate}
              className="rounded-xl bg-black px-12 py-2 text-white
                         hover:bg-[#C9A24D] hover:text-black transition"
            >
              Update
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
