import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineRateReview } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const UserRequest = () => {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [payAmount, setPayAmount] = useState(0);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/request/user",
          config
        );
        setRequests(response.data);
      } catch (error) {
        console.log("Error fetching holder request", error);
      }
    };
    fetchRequests();
  }, []);

  const handlePayNow = async (request) => {
    try {
      const result = await Swal.fire({
        title: "Confirm Payment",
        text: `Are you sure you want to pay Rs ${request.totalPrice} for ${request.boardingHouse.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, pay now!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await axios.put(
          `http://localhost:5000/api/request/pay/${request._id}`,
          { amount: request.totalPrice },
          config
        );
        setRequests(
          requests.map((req) => (req._id === request._id ? response.data : req))
        );
        toast.success("Payment successful");
      }
    } catch (error) {
      console.log("Error processing payment", error);
      toast.error("Payment failed");
    }
  };

  const handleReviewClick = (request) => {
    if (request.status === "accept") {
      navigate(`/user-dashboard/user-review/${request.boardingHouse._id}`);
    } else if (request.status === "reject") {
      toast.error("Your request was rejected.");
    } else {
      toast.warning("Please wait until the holder accepts your request.");
    }
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <ToastContainer />
      <div className="w-full p-4 bg-white rounded-md">
        <div className="relative overflow-auto mt-5">
          <table className="w-full text-sm text-left text-black">
            <thead className="text-sm text-black uppercase border-b-2 border-blue-700">
              <tr>
                <th scope="col" className="py-3  px-2">
                  No
                </th>
                <th scope="col" className="py-3 px-4 ">
                  Boarding House Name
                </th>
                <th scope="col" className="py-3 px-4">
                  Image
                </th>
                <th scope="col" className="py-3 ">
                  Holder Contact Number
                </th>
                <th scope="col" className="py-3 px-4">
                  Result
                </th>

                <th scope="col" className="py-3 px-4">
                  Review
                </th>
                {requests.length > 0 && requests[0].status === "accept" && (
                  <>
                    <th scope="col" className="py-3 px-4">
                      Total Payable
                    </th>
                    <th scope="col" className="py-3 px-5">
                      Pay Now
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={index}>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    {request.boardingHouse.name}
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <img
                      className="w-[50px] h-[50px]"
                      src={request.boardingHouse.coverImage}
                      alt=""
                    />
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    {request.boardingHouse?.user?.contactNumber || "N/A"}
                  </td>

                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    {request.status}
                  </td>

                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <div className="flex justify-start items-center gap-4">
                      <button
                        onClick={() => handleReviewClick(request)}
                        className="p-[6px] border border-black rounded hover:shadow-lg hover:shadow-blue-200"
                      >
                        <MdOutlineRateReview size={20} />
                      </button>
                    </div>
                  </td>
                  {request.status === "accept" && (
                    <>
                      <td className="py-1 px-4 font-medium whitespace-nowrap">
                        Rs {request.totalPrice}
                      </td>
                      <td className="py-1 px-4 font-medium whitespace-nowrap">
                        <button
                          onClick={() => handlePayNow(request)}
                          className="ml-2 px-4 py-1 bg-blue-600 text-white rounded"
                        >
                          Pay Now
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserRequest;
