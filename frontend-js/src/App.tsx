import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./curdAxios/Login";
import Signup from "./curdAxios/Signup";
import CustomerProfile from "./curdAxios/CustomerProfile";
import VerifyOTP from "./VerifyOtp";
import ProfileTailor from "./curdAxios/ProfileTailor";
import FindTailor from "./curdAxios/FindTailor";
import RateAndReview from "./curdAxios/RateAndReview";
import TailorProfile from "./curdAxios/TailorProfile";
import CustomerDashboard from "./curdAxios/CustomerDashboard";
import TailorDashboard from "./curdAxios/TailorDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Signup/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tailor-profile" element={<ProfileTailor />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/find-tailor" element={<FindTailor />} />
        <Route path="/review" element={<RateAndReview />} />
        <Route path="/tailor/:id" element={<TailorProfile />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/tailor/dashboard" element={<TailorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
