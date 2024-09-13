import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Request = () => {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/request/holder",
          config
        );
        setRequests(response.data);
      } catch (error) {
        console.log("Error fetching holder request", error);
      }
    };
    fetchRequests();
  }, []);

  const updateStatus = async (reqId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/request/${reqId}`,
        { status: newStatus },
        config
      );
      setRequests(
        requests.map((req) =>
          req._id === reqId ? { ...req, status: newStatus } : req
        )
      );
      toast.success("Status Updated Successfully");
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  };

  const monthlyPayment = (request) => {
    if (request.totalPrice === 0) {
      return (
        <span className="text-green-500 font-semibold uppercase ">
          RECEIVED
        </span>
      );
    } else {
      return (
        <span className="text-red-500 font-semibold uppercase ">
          NOT RECEIVED
        </span>
      );
    }
  };

  const sendPaymentReminder = async (requestId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/request/remind/${requestId}`,
        {},
        config
      );
      toast.success("Reminder sent successfully");
    } catch (error) {
      toast.error("Error sending reminder");
    }
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <ToastContainer />
      <div className="w-full p-4 bg-white rounded-md">
        <div className="relative overflow-auto mt-5">
          <table className="w-full text-sm text-left text-black ">
            <thead className="text-sm text-black uppercase border-b-2 border-blue-700">
              <tr>
                <th scope="col" className="py-3">
                  No
                </th>
                <th scope="col" className="py-3 px-4">
                  User Name
                </th>
                <th scope="col" className="py-3">
                  User Profile Pic
                </th>
                <th scope="col" className="py-3">
                  Contact Number
                </th>
                <th scope="col" className="py-3">
                  Boarding house name
                </th>
                <th scope="col" className="py-3">
                  Number of Persons
                </th>
                <th scope="col" className="py-3 px-4">
                  Action
                </th>
                <th scope="col" className="py-3 px-4">
                  Monthly Payment
                </th>
                <th scope="col" className="py-3 px-4">
                  Payment Reminder
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={index}>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <span>
                      {request.user.firstName + " " + request.user.lastName}
                    </span>
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <img
                      className="w-[50px] h-[50px]"
                      src={request.user.profilePictureUrl}
                      alt=""
                    />
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <span>{request.user.contactNumber}</span>
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <span>{request.boardingHouse.name}</span>
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <span>{request.numPersons}</span>
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <select
                      onChange={(e) =>
                        updateStatus(request._id, e.target.value)
                      }
                      value={request.status}
                      className="px-2 py-1 focus:border-indigo-500 outline-none bg-white border border-slate-700 rounded-md text-black"
                    >
                      <option value="pending">Pending</option>
                      <option value="accept">Accept</option>
                      <option value="reject">Reject</option>
                    </select>
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    {monthlyPayment(request)}
                  </td>
                  {request.status === "accept" && request.totalPrice !== 0 ? (
                    <td className="py-1 px-4 font-medium whitespace-nowrap">
                      <button
                        onClick={() => sendPaymentReminder(request._id)}
                        className="px-2 py-1 bg-blue-500 text-white rounded-md"
                      >
                        Send Reminder
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Request;
