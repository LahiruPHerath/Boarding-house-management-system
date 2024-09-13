import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Import pages and components
import HomePage from "./pages/Home";
import UniversityPage from "./pages/UniversityPage";
import BoardingHouseDetails from "./pages/BoardingHouseDetails";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import AllBoardings from "./pages/AllBoardings";
import UserDashboard from "./pages/user dashboard/UserDashboard";
import UserProfile from "./pages/user dashboard/UserProfile";
import MainLayout from "./holder dashboard/components/MainLayout";
import AddBoarding from "./holder dashboard/view/AddBoarding";
import EditBoarding from "./holder dashboard/view/EditBoarding";
import UpdateBoarding from "./holder dashboard/view/UpdateBoarding";
import Chat from "./holder dashboard/view/Chat";
import Profile from "./holder dashboard/view/Profile";
import Request from "./holder dashboard/view/Request";
import ReviewsPage from "./pages/ReviewPage";
import UserReview from "./pages/user dashboard/UserReview";
import UserRequest from "./pages/user dashboard/UserRequest";
import VisitSchedule from "./pages/VisitSchedule";
import VisitAppointments from "./holder dashboard/view/VisitAppointments";
import UserVisits from "./pages/user dashboard/UserVisits";
import ChatToHolder from "./pages/ChatToHolder";
import AdminLayout from "./admin dashboard/components/AdminLayout";
import MessageList from "./holder dashboard/view/SenderList";

import ManageBoardings from "./admin dashboard/views/ManageBoardings";
import ManageUsers from "./admin dashboard/views/ManageUsers";
import ManageReviews from "./admin dashboard/views/ManageReviews";

const isAuthenticated = true; // Replace with actual authentication status
const userRole = localStorage.getItem("role");

const ProtectedRoute = ({ element: Element, allowedRoles }) => {
  return isAuthenticated && allowedRoles.includes(userRole) ? (
    <Element />
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/university/:id" element={<UniversityPage />} />
        <Route path="/boarding/:_id" element={<BoardingHouseDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/allboardings" element={<AllBoardings />} />
        <Route path="/reviews/:_id" element={<ReviewsPage />} />
        <Route path="/visit-schedule/:boardingHouseId" element={<VisitSchedule />} />
        <Route path="/chat-holder/:receiverId" element={<ChatToHolder />} />
        
        {/* User Dashboard Routes */}
        <Route path="/user-dashboard" element={<UserDashboard />}>
          <Route path="user-profile/:id" element={<UserProfile />} />
          <Route path="user-review/:boardingHouseId" element={<UserReview />} />
          <Route path="user-request" element={<UserRequest />} />
          <Route path="user-visit" element={<UserVisits />} />
        </Route>
        
        {/* Holder Dashboard Routes */}
        <Route path="/holder-dashboard" element={<ProtectedRoute element={MainLayout} allowedRoles={["holder"]} />}>
          <Route path="add-boarding" element={<AddBoarding />} />
          <Route path="edit-boarding" element={<EditBoarding />} />
          <Route path="update-boarding/:id" element={<UpdateBoarding />} />
          <Route path="request" element={<Request />} />
          <Route path="visit" element={<VisitAppointments />} />
          <Route path="chat/:receiverId" element={<Chat />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="message-list" element={<MessageList />} />
        </Route>
        
        {/* Admin Dashboard Routes */}
        <Route path="/admin-dashboard" element={<AdminLayout />}>
          <Route path="manage-boardings" element={<ManageBoardings />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-reviews" element={<ManageReviews />} />
        </Route>
        
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
