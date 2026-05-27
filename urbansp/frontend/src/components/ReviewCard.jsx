function ReviewCard({ review }) {
  return (
    <div className="review-card">
      <div className="review-card-header">
        <strong>{review.author}</strong>
        <span>{review.rating} ★</span>
      </div>
      <p>{review.comment}</p>
      <small>{review.date}</small>
    </div>
  );
}

export default ReviewCard;
