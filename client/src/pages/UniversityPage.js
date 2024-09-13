import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import universities from "../data/UniData";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

function UniversityPage() {
  let { id } = useParams();
  const [boardings, setBoardings] = useState([]);
  const university = universities.find((uni) => uni.id.toString() === id);

  useEffect(() => {
    if (university) {
      console.log("Fetching boardings for:", university.name);
      fetchBoardings();
    }
  }, [university]);

  const fetchBoardings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/BoardingHouse/university/${encodeURIComponent(university.name)}`
      );
      // Fetch reviews for each boarding house
      const boardingsWithReviews = await Promise.all(
        response.data.map(async (bh) => {
          const reviewResponse = await axios.get(
            `http://localhost:5000/api/reviews/boardingHouse/${bh._id}`
          );
          return { ...bh, reviews: reviewResponse.data };
        })
      );

      setBoardings(boardingsWithReviews);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((acc, rating) => acc + rating, 0);
    return total / ratings.length;
  };

  const renderStars = (averageRating) => {
    const filledStars = Math.round(averageRating);
    const emptyStars = 5 - filledStars;
    return (
      <>
        {[...Array(filledStars)].map((_, index) => (
          <span key={index} className="text-yellow-400 text-lg">
            ★
          </span>
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={index} className="text-gray-300 text-lg">
            ☆
          </span>
        ))}
      </>
    );
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <>
      <Header />
      <div className="flex">
        <div className="flex-1 container pr-60 pl-60 pt-4 pb-4 bg-gray-50 min-h-screen">
          {university ? (
            <h2 className="text-3xl font-bold text-gray-800 my-6 text-center">
              Boarding Houses near {university.name}
            </h2>
          ) : (
            <h2 className="text-3xl font-bold text-red-500 text-center my-6">
              University not found
            </h2>
          )}

          <div className="grid grid-cols-1 gap-8">
            {boardings.length > 0 ? (
              boardings.map((bh) => (
                <div
                  key={bh._id}
                  className="flex flex-col md:flex-row bg-white border-2 hover:border-blue-300 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden min-h-[160px]"
                >
                  <div className="w-60 h-full flex-shrink-0">
                    <img
                      src={bh.coverImage || "path/to/default/image.jpg"}
                      alt={bh.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:flex-1 p-4 flex flex-col justify-between">
                    <Link
                      to={`/boarding/${bh._id}`}
                      className="no-underline text-gray-900"
                    >
                      <h3 className="text-2xl font-bold mb-2 text-blue-600 hover:text-black">
                        {bh.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-[#1f3e72] mb-1">
                      Distance: {bh.distance} km from {university.name}
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                      {truncateText(bh.description, 100)}
                    </p>
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-lg">
                        {renderStars(
                          calculateAverageRating(
                            bh.reviews?.map((review) => review.rating)
                          )
                        )}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        ({bh.reviews ? bh.reviews.length : 0} reviews)
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-3">
                      Price: Rs {bh.price} Per Month
                    </p>
                    <p className="text-sm text-gray-700 mt-3">
                      This is for {bh.gender} students
                    </p>
                    <p
                      className={`text-sm mt-3 ${
                        bh.availability === "Available"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {bh.availability === "Available"
                        ? "Available"
                        : "Not Available"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-600 text-lg">
                No boarding houses found.
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UniversityPage;
