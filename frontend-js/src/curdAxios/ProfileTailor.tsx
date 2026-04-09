// import { useState, useEffect } from "react";
// import axios from "axios";
// import type { AnyKeys } from "mongoose";

// export default function ProfileTailor() {
//   const emailid = localStorage.getItem("emailid") || "";

//   const [form, setForm] = useState({
//     emailid,
//     name: "",
//     contact: "",
//     address: "",
//     city: "",
//     aadharNo: "",
//     category: [] as string[],
//     speciality: [] as string[],
//     website: "",
//     since: "",
//     workType: "",
//     shopAddress: "",
//     shopCity: "",
//     otherInfo: "",
//   });

//   const [profilePreview, setProfilePreview] = useState<string | null>(null);
//   const [aadharPreview, setAadharPreview] = useState<string | null>(null);
//   const [profileImage, setProfileImage] = useState<File | null>(null);
//   const [aadharImage, setAadharImage] = useState<File | null>(null);

//   const [loading, setLoading] = useState(false);
//   const [isExisting, setIsExisting] = useState(false);

//   const categoryOptions = ["Male", "Female", "Child"];
//   const specialityOptions = [
//     "Blouse Stitching",
//     "Lehenga Stitching",
//     "Suit Stitching",
//     "Sherwani Stitching",
//     "Alteration",
//     "Kids Wear",
//     "Designer Wear",
//     "Wedding Wear",
//   ];

//   useEffect(() => {
//     if (!emailid) return;

//     axios
//       .get(`https://golden-needle-backend.vercel.app/tailor/${emailid}`)
//       .then((res) => {
//         if (res.data) {
//           setForm({
//             ...res.data,
//             category: res.data.category || [],
//             speciality: res.data.speciality || [],
//           });
//           setProfilePreview(res.data.profileImage);
//           setAadharPreview(res.data.aadharImage);
//           setIsExisting(true);
//         }
//       })
//       .catch(() => {});
//   }, [emailid]);

//   const handleChange = (e: any) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleCheckbox = (field: "category" | "speciality", value: string) => {
//     setForm((prev) => {
//       const list = prev[field];
//       return list.includes(value)
//         ? { ...prev, [field]: list.filter((v) => v !== value) }
//         : { ...prev, [field]: [...list, value] };
//     });
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData();

//       Object.entries(form).forEach(([key, value]) => {
//         if (Array.isArray(value)) {
//           formData.append(key, JSON.stringify(value));
//         } else {
//           formData.append(key, value as string);
//         }
//       });

//       if (profileImage) formData.append("profileImage", profileImage);
//       if (aadharImage) formData.append("aadharImage", aadharImage);

//       const res = await axios.post(
//         "https://golden-needle-backend.vercel.app/tailor/save",
//         formData,
//       );

//       alert(res.data.msg);
//       setIsExisting(true);
//     } catch {
//       alert("Error saving profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//        className="min-h-screen flex items-center justify-center 
//              bg-cover bg-center bg-no-repeat relative"
//   style={{ backgroundImage: "url('/images/tailor-bg.png')" }}
//     >
//       <form
//         onSubmit={handleSubmit}
//         className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-[#E6D5B8] p-10 space-y-10"
//       >
//         {/* HEADER */}
//         <div className="text-center">
//           <h1 className="text-4xl font-serif text-gray-800">Tailor Profile</h1>
//           <p className="text-gray-500 mt-2">
//             Complete your professional details
//           </p>
//         </div>

//         {/* IMAGE UPLOAD */}
//         <div className="flex flex-wrap justify-center gap-12">
//           <UploadBox
//             title="Profile Photo"
//             preview={profilePreview}
//             onChange={(file: any) => {
//               setProfileImage(file);
//               setProfilePreview(URL.createObjectURL(file));
//             }}
//             rounded
//           />

//           <UploadBox
//             title="Aadhaar Card"
//             preview={aadharPreview}
//             onChange={async (file: any) => {
//               setAadharImage(file);
//               setAadharPreview(URL.createObjectURL(file));

//               const fd = new FormData();
//               fd.append("aadharImage", file);

//               const res = await axios.post(
//                 "https://golden-needle-backend.vercel.app/tailor/ocr-aadhar",
//                 fd,
//               );

//               setForm((prev) => ({
//                 ...prev,
//                 name: res.data.name || prev.name,
//                 aadharNo: res.data.aadharNo || prev.aadharNo,
//               }));
//             }}
//           />
//         </div>

//         {/* PERSONAL */}
//         <Section title="Personal Information">
//           <Grid>
//             <Input
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="Full Name"
//             />
//             <Input
//               name="contact"
//               value={form.contact}
//               onChange={handleChange}
//               placeholder="Contact Number"
//             />
//             <Input
//               name="aadharNo"
//               value={form.aadharNo}
//               onChange={handleChange}
//               placeholder="Aadhaar Number"
//             />
//             <Input
//               name="city"
//               value={form.city}
//               onChange={handleChange}
//               placeholder="City"
//             />
//             <Input
//               name="address"
//               value={form.address}
//               onChange={handleChange}
//               placeholder="Address"
//               full
//             />
//           </Grid>
//         </Section>

//         {/* CATEGORY */}
//         <Section title="Category">
//           <CheckboxGrid
//             options={categoryOptions}
//             selected={form.category}
//             onChange={(val: any) => handleCheckbox("category", val)}
//           />
//         </Section>

//         {/* SPECIALITY */}
//         <Section title="Speciality">
//           <CheckboxGrid
//             options={specialityOptions}
//             selected={form.speciality}
//             onChange={(val: any) => handleCheckbox("speciality", val)}
//           />
//         </Section>

//         {/* PROFESSIONAL */}
//         <Section title="Professional Details">
//           <Grid>
//             <Input
//               name="website"
//               value={form.website}
//               onChange={handleChange}
//               placeholder="Website / Instagram"
//             />
//             <Input
//               name="since"
//               value={form.since}
//               onChange={handleChange}
//               placeholder="Since (Year)"
//             />
//             <Input
//               name="workType"
//               value={form.workType}
//               onChange={handleChange}
//               placeholder="Work Type"
//             />
//             <Input
//               name="shopCity"
//               value={form.shopCity}
//               onChange={handleChange}
//               placeholder="Shop City"
//             />
//             <Input
//               name="shopAddress"
//               value={form.shopAddress}
//               onChange={handleChange}
//               placeholder="Shop Address"
//               full
//             />
//           </Grid>
//         </Section>

//         {/* OTHER */}
//         <Section title="Additional Info">
//           <textarea
//             name="otherInfo"
//             value={form.otherInfo}
//             onChange={handleChange}
//             className="w-full border border-[#E6D5B8] rounded-xl p-3 focus:ring-2 focus:ring-[#C9A24D]"
//             rows={4}
//             placeholder="Anything else..."
//           />
//         </Section>

//         {/* BUTTON */}
//         <button
//           type="submit"
//           className="w-full bg-black text-white py-3 rounded-xl hover:bg-[#C9A24D] hover:text-black transition"
//         >
//           {loading
//             ? "Saving..."
//             : isExisting
//               ? "Update Profile"
//               : "Save Profile"}
//         </button>
//       </form>
//     </div>
//   );
// }

// /* ---------- COMPONENTS ---------- */

// const Section = ({ title, children }: any) => (
//   <div>
//     <h2 className="text-lg font-semibold mb-4 border-b pb-2 border-[#E6D5B8]">
//       {title}
//     </h2>
//     {children}
//   </div>
// );

// const Grid = ({ children }: any) => (
//   <div className="grid md:grid-cols-2 gap-4">{children}</div>
// );

// const Input = ({ name, value, onChange, placeholder, full }: any) => (
//   <input
//     name={name}
//     value={value}
//     onChange={onChange}
//     placeholder={placeholder}
//     className={`border border-[#E6D5B8] rounded-xl p-3 focus:ring-2 focus:ring-[#C9A24D] ${
//       full ? "md:col-span-2" : ""
//     }`}
//   />
// );

// const CheckboxGrid = ({ options, selected, onChange }: any) => (
//   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//     {options.map((opt: string) => (
//       <label
//         key={opt}
//         className={`border rounded-xl px-3 py-2 cursor-pointer ${
//           selected.includes(opt)
//             ? "bg-[#C9A24D] text-black"
//             : "border-[#E6D5B8]"
//         }`}
//       >
//         <input
//           type="checkbox"
//           checked={selected.includes(opt)}
//           onChange={() => onChange(opt)}
//           className="hidden"
//         />
//         {opt}
//       </label>
//     ))}
//   </div>
// );

// const UploadBox = ({ title, preview, onChange, rounded }: any) => (
//   <div className="text-center">
//     <p className="mb-2 font-medium">{title}</p>

//     {preview && (
//       <img
//         src={preview}
//         className={`w-28 h-28 object-cover border border-[#E6D5B8] mb-2 ${
//           rounded ? "rounded-full" : "rounded-lg"
//         }`}
//       />
//     )}

//     <input
//       type="file"
//       onChange={(e: any) => {
//         const file = e.target.files[0];
//         if (file) onChange(file);
//       }}
//     />
//   </div>
// );


import { useState, useEffect } from "react";
import axios from "axios";
import type { AnyKeys } from "mongoose";

export default function ProfileTailor() {
  const emailid = localStorage.getItem("emailid") || "";

  const [form, setForm] = useState({
    emailid,
    name: "",
    contact: "",
    address: "",
    city: "",
    aadharNo: "",
    category: [] as string[],
    speciality: [] as string[],
    website: "",
    since: "",
    workType: "",
    shopAddress: "",
    shopCity: "",
    otherInfo: "",
  });

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [aadharPreview, setAadharPreview] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [aadharImage, setAadharImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [isExisting, setIsExisting] = useState(false);

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

  useEffect(() => {
    if (!emailid) return;

    axios
      .get(`https://golden-needle-backend.vercel.app/tailor/${emailid}`)
      .then((res) => {
        if (res.data) {
          setForm({
            ...res.data,
            category: res.data.category || [],
            speciality: res.data.speciality || [],
          });
          setProfilePreview(res.data.profileImage);
          setAadharPreview(res.data.aadharImage);
          setIsExisting(true);
        }
      })
      .catch(() => {});
  }, [emailid]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (field: "category" | "speciality", value: string) => {
    setForm((prev) => {
      const list = prev[field];
      return list.includes(value)
        ? { ...prev, [field]: list.filter((v) => v !== value) }
        : { ...prev, [field]: [...list, value] };
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });

      if (profileImage) formData.append("profileImage", profileImage);
      if (aadharImage) formData.append("aadharImage", aadharImage);

      const res = await axios.post(
        "https://golden-needle-backend.vercel.app/tailor/save",
        formData,
      );

      alert(res.data.msg);
      setIsExisting(true);
    } catch {
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center 
                 bg-cover bg-center bg-no-repeat relative py-10"
      style={{ backgroundImage: "url('/images/tailor-bg.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>

      {/* Content */}
      <div className="relative z-10 w-full px-6">
        <form
          onSubmit={handleSubmit}
          className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-[#E6D5B8] p-10 space-y-10"
        >
          {/* HEADER */}
          <div className="text-center">
            <h1 className="text-4xl font-serif text-gray-800">
              Tailor Profile
            </h1>
            <p className="text-gray-500 mt-2">
              Complete your professional details
            </p>
          </div>

          {/* IMAGE UPLOAD */}
          <div className="flex flex-wrap justify-center gap-12">
            <UploadBox
              title="Profile Photo"
              preview={profilePreview}
              onChange={(file: any) => {
                setProfileImage(file);
                setProfilePreview(URL.createObjectURL(file));
              }}
              rounded
            />

            <UploadBox
              title="Aadhaar Card"
              preview={aadharPreview}
              onChange={async (file: any) => {
                setAadharImage(file);
                setAadharPreview(URL.createObjectURL(file));

                const fd = new FormData();
                fd.append("aadharImage", file);

                const res = await axios.post(
                  "https://golden-needle-backend.vercel.app/tailor/ocr-aadhar",
                  fd,
                );

                setForm((prev) => ({
                  ...prev,
                  name: res.data.name || prev.name,
                  aadharNo: res.data.aadharNo || prev.aadharNo,
                }));
              }}
            />
          </div>

          {/* PERSONAL */}
          <Section title="Personal Information">
            <Grid>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" />
              <Input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact Number" />
              <Input name="aadharNo" value={form.aadharNo} onChange={handleChange} placeholder="Aadhaar Number" />
              <Input name="city" value={form.city} onChange={handleChange} placeholder="City" />
              <Input name="address" value={form.address} onChange={handleChange} placeholder="Address" full />
            </Grid>
          </Section>

          {/* CATEGORY */}
          <Section title="Category">
            <CheckboxGrid
              options={categoryOptions}
              selected={form.category}
              onChange={(val: any) => handleCheckbox("category", val)}
            />
          </Section>

          {/* SPECIALITY */}
          <Section title="Speciality">
            <CheckboxGrid
              options={specialityOptions}
              selected={form.speciality}
              onChange={(val: any) => handleCheckbox("speciality", val)}
            />
          </Section>

          {/* PROFESSIONAL */}
          <Section title="Professional Details">
            <Grid>
              <Input name="website" value={form.website} onChange={handleChange} placeholder="Website / Instagram" />
              <Input name="since" value={form.since} onChange={handleChange} placeholder="Since (Year)" />
              <Input name="workType" value={form.workType} onChange={handleChange} placeholder="Work Type" />
              <Input name="shopCity" value={form.shopCity} onChange={handleChange} placeholder="Shop City" />
              <Input name="shopAddress" value={form.shopAddress} onChange={handleChange} placeholder="Shop Address" full />
            </Grid>
          </Section>

          {/* OTHER */}
          <Section title="Additional Info">
            <textarea
              name="otherInfo"
              value={form.otherInfo}
              onChange={handleChange}
              className="w-full border border-[#E6D5B8] rounded-xl p-3 focus:ring-2 focus:ring-[#C9A24D]"
              rows={4}
              placeholder="Anything else..."
            />
          </Section>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-[#C9A24D] hover:text-black transition"
          >
            {loading
              ? "Saving..."
              : isExisting
              ? "Update Profile"
              : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

const Section = ({ title, children }: any) => (
  <div>
    <h2 className="text-lg font-semibold mb-4 border-b pb-2 border-[#E6D5B8]">
      {title}
    </h2>
    {children}
  </div>
);

const Grid = ({ children }: any) => (
  <div className="grid md:grid-cols-2 gap-4">{children}</div>
);

const Input = ({ name, value, onChange, placeholder, full }: any) => (
  <input
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`border border-[#E6D5B8] rounded-xl p-3 focus:ring-2 focus:ring-[#C9A24D] ${
      full ? "md:col-span-2" : ""
    }`}
  />
);

const CheckboxGrid = ({ options, selected, onChange }: any) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {options.map((opt: string) => (
      <label
        key={opt}
        className={`border rounded-xl px-3 py-2 cursor-pointer ${
          selected.includes(opt)
            ? "bg-[#C9A24D] text-black"
            : "border-[#E6D5B8]"
        }`}
      >
        <input
          type="checkbox"
          checked={selected.includes(opt)}
          onChange={() => onChange(opt)}
          className="hidden"
        />
        {opt}
      </label>
    ))}
  </div>
);

const UploadBox = ({ title, preview, onChange, rounded }: any) => (
  <div className="text-center">
    <p className="mb-2 font-medium">{title}</p>

    {preview && (
      <img
        src={preview}
        className={`w-28 h-28 object-cover border border-[#E6D5B8] mb-2 ${
          rounded ? "rounded-full" : "rounded-lg"
        }`}
      />
    )}

    <input
      type="file"
      onChange={(e: any) => {
        const file = e.target.files[0];
        if (file) onChange(file);
      }}
    />
  </div>
);