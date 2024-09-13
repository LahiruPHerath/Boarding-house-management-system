import axios from "axios";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [boarding, setBoardings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [visits, setVisits] = useState([]);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [acceptedVisits, setAcceptedVisits] = useState(0);
  const [pendingVisits, setPendingVisits] = useState(0);
  const [rejectedVisits, setRejectedVisits] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [notPaidCount, setNotPaidCount] = useState(0);
  const token = localStorage.getItem("token");
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  useEffect(() => {
    const fetchBoardings = async () => {
      try {
        if (!token) {
          console.error("No token found, please login first");
          return;
        }
        const response = await axios.get(
          "http://localhost:5000/api/BoardingHouse",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBoardings(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBoardings();
  }, [token]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/request/holder",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRequests(response.data);

        // Count requests by status
        const accepted = response.data.filter(
          (req) => req.status === "accept"
        ).length;
        const pending = response.data.filter(
          (req) => req.status === "pending"
        ).length;
        const rejected = response.data.filter(
          (req) => req.status === "reject"
        ).length;

        // Set counts
        setAcceptedCount(accepted);
        setPendingCount(pending);
        setRejectedCount(rejected);

        // Calculate paid and not paid students
        const paid = response.data.filter(
          (req) => req.status === "accept" && req.totalPrice === 0
        ).length;
        const notPaid = response.data.filter(
          (req) => req.status === "accept" && req.pricePerMonth === 0
        ).length;

        setPaidCount(paid);
        setNotPaidCount(notPaid);
      } catch (error) {
        console.log("Error fetching holder requests", error);
      }
    };
    fetchRequests();
  }, [token]);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/visit/holder",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setVisits(response.data);
        // Count requests by status
        const accepted = response.data.filter(
          (visit) => visit.status === "accept"
        ).length;
        const pending = response.data.filter(
          (visit) => visit.status === "pending"
        ).length;
        const rejected = response.data.filter(
          (visit) => visit.status === "reject"
        ).length;

        // Set counts
        setAcceptedVisits(accepted);
        setPendingVisits(pending);
        setRejectedVisits(rejected);
      } catch (error) {
        console.log("error fetching holder visit appointments:", error);
      }
    };
    fetchVisits();
  }, []);

  const data = {
    labels: ["Paid", "Not Paid"],
    datasets: [
      {
        label: "# of Users",
        data: [paidCount, notPaidCount],
        backgroundColor: ["#9fcbee", "#d8031c"],
        borderColor: ["#9fcbee", "#d8031c"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div className="text-black text-2xl mt-3 mb-2 font-semibold ">
        Number of Requests
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="flex justify-between items-center p-5 bg-white rounded-md shadow-md text-gray-800 gap-3">
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-3xl font-bold">{acceptedCount}</h2>
            <span className="text-md font-medium">Accepted Requests</span>
          </div>
        </div>

        <div className="flex justify-between items-center p-5 bg-white rounded-md shadow-md text-gray-800 gap-3">
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-3xl font-bold">{pendingCount}</h2>
            <span className="text-md font-medium">Pending Requests</span>
          </div>
        </div>

        <div className="flex justify-between items-center p-5 bg-white rounded-md shadow-md text-gray-800 gap-3">
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-3xl font-bold">{rejectedCount}</h2>
            <span className="text-md font-medium">Rejected Requests</span>
          </div>
        </div>
      </div>
      <div className="text-black text-2xl mt-5 mb-2 font-semibold ">
        Number of Visit Appointments
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="flex justify-between items-center p-5 bg-white rounded-md shadow-md text-gray-800 gap-3">
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-3xl font-bold">{acceptedVisits}</h2>
            <span className="text-md font-medium">Accepted Visits</span>
          </div>
        </div>

        <div className="flex justify-between items-center p-5 bg-white rounded-md shadow-md text-gray-800 gap-3">
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-3xl font-bold">{pendingVisits}</h2>
            <span className="text-md font-medium">Pending Visits</span>
          </div>
        </div>

        <div className="flex justify-between items-center p-5 bg-white rounded-md shadow-md text-gray-800 gap-3">
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-3xl font-bold">{rejectedVisits}</h2>
            <span className="text-md font-medium">Rejected Visits</span>
          </div>
        </div>
      </div>

      <div className="text-black text-2xl mt-5 mb-2 font-semibold ">
        Payment Status for {currentMonth}
      </div>
      <div className="w-full md:w-1/2 lg:w-1/3">
        <Pie data={data} />
      </div>
    </div>
  );
};

export default Dashboard;
