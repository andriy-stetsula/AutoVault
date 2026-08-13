"use client";

import { getCar } from "@/app/services/api";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import "./details.scss";
import Link from "next/link";

type Reviews = {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerEmail: string;
};

type Car = {
  id: number;
  images: string[];
  title: string;
  brand: string;
  thumbnail: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  stock: number;
  reviews: Reviews[];
};

export default function CarDetails({}: { params: { carId: string } }) {
  const { carId } = useParams<{ carId: string }>();

  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editComment, setEditComment] = useState("");

  const [comment, setComment] = useState("");
  const [car, setCar] = useState<Car | null>(null);
  const [darkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    async function loadCar() {
      const data = await getCar(carId);

      const savedReviews = localStorage.getItem(`reviews_${carId}`);
      setCar(data);
      setReviews(savedReviews ? JSON.parse(savedReviews) : data.reviews);
    }

    loadCar();
  }, [carId]);

  function deleteReview(reviewId: string) {
    const updatedReviews = reviews.filter((review) => review.id !== reviewId);

    setReviews(updatedReviews);

    localStorage.setItem(`reviews_${carId}`, JSON.stringify(updatedReviews));
  }

  function startEdit(review: Reviews) {
    setEditingReview(review.id);
    setEditComment(review.comment);
  }

  function saveEdit(reviewId: string) {
    if (!editComment.trim()) return;

    const updatedReviews = reviews.map((review) =>
      review.id === reviewId ? { ...review, comment: editComment } : review,
    );

    setReviews(updatedReviews);

    localStorage.setItem(`reviews_${carId}`, JSON.stringify(updatedReviews));

    setEditingReview(null);
    setEditComment("");
  }

  const [userId] = useState(() => {
    let id = localStorage.getItem("userId");

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("userId", id);
    }

    return id;
  });

  function addReview() {
    if (!name.trim() || !comment.trim()) return;

    const newReview = {
      id: crypto.randomUUID(),
      reviewerName: name,
      reviewerEmail: userId,
      rating,
      comment,
    };

    setReviews([newReview, ...reviews]);
    localStorage.setItem(
      `reviews_${carId}`,
      JSON.stringify([newReview, ...reviews]),
    );

    setName("");
    setComment("");
    setRating(5);
  }

  if (!car) {
    return <h1>Car not found</h1>;
  }

  return (
    <main className={`details ${darkMode ? "dark" : ""}`}>
      <div className="back">
        <Link href="/">‹ Back to catalog</Link>
      </div>
      <div className="container">
        <div className="details-image">
          <img src={car.images[0]} alt={car.title} />
        </div>
        <div className="info">
          <h1>
            {car.brand} {car.title}
          </h1>

          <p className="price">{car.price}</p>

          <div className="specs">
            <div className="spec">
              <span>Brand</span>
              <strong>{car.brand}</strong>
            </div>

            <div className="spec">
              <span>Model</span>
              <strong>{car.title}</strong>
            </div>

            <div className="spec">
              <span>Category</span>
              <strong>{car.category}</strong>
            </div>

            <div className="spec">
              <span>Price</span>
              <strong>${car.price}</strong>
            </div>

            <div className="spec">
              <span>Rating</span>
              <strong>{car.rating} ⭐</strong>
            </div>

            <div className="spec">
              <span>In Stock</span>
              <strong>{car.stock}</strong>
            </div>
          </div>
        </div>
        <div className="left">
          <div className="reviews">
            <h2>Reviews</h2>
            {car.reviews.length === 0 ? (
              <p>No reviews yet</p>
            ) : (
              reviews.map((review) => (
                <div className="review" key={review.id}>
                  <div className="review-header">
                    <strong>{review.reviewerName}</strong>
                    <span>{"⭐".repeat(review.rating)}</span>
                  </div>

                  {editingReview === review.id ? (
                    <div className="edit-review">
                      <textarea
                        value={editComment}
                        onChange={(event) => setEditComment(event.target.value)}
                      />

                      <button onClick={() => saveEdit(review.id)}>Save</button>

                      <button onClick={() => setEditingReview(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <p>{review.comment}</p>

                      {review.reviewerEmail === userId && (
                        <div className="review-actions">
                          <button onClick={() => deleteReview(review.id)}>
                            Delete
                          </button>

                          <button onClick={() => startEdit(review)}>
                            Edit
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="add-review">
          <h2>Add Review</h2>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <select
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
          >
            <option value="1">⭐</option>
            <option value="2">⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
          </select>
          <textarea
            placeholder="Your Review"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <button onClick={addReview}>Submit Review</button>
        </div>
      </div>
    </main>
  );
}
