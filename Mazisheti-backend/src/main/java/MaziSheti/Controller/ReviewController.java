package MaziSheti.Controller;

import MaziSheti.Review;
import MaziSheti.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 🌿 ReviewController — Handles all product review operations
 * - Buyers ➜ Add / Update their reviews
 * - Public ➜ View reviews
 * - Admin ➜ Flag inappropriate reviews
 */
@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // ----------------------------------------------------------------------
    // 🟩 CREATE — Add new product review
    // ----------------------------------------------------------------------
    /**
     * ✅ Add a new review (Buyer only)
     * Example JSON:
     * {
     *   "rating": 5,
     *   "comment": "Excellent quality product!"
     * }
     */
    @PostMapping("/add/{productId}")
    public ReviewResponse addReview(
            @PathVariable Long productId,
            @RequestBody ReviewRequest reviewRequest,
            Principal principal
    ) {
        String buyerEmail = principal.getName();
        Review review = reviewService.addReview(
                productId,
                buyerEmail,
                reviewRequest.getRating(),
                reviewRequest.getComment()
        );
        return convertToResponse(review);
    }

    // ----------------------------------------------------------------------
    // 🟨 READ — Get all reviews for a product
    // ----------------------------------------------------------------------
    /**
     * ✅ Fetch all reviews for a specific product (Public access)
     */
    @GetMapping("/product/{productId}")
    public List<ReviewResponse> getReviewsByProduct(@PathVariable Long productId) {
        return reviewService.getReviewsByProduct(productId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ----------------------------------------------------------------------
    // 🟦 UPDATE — Modify an existing review
    // ----------------------------------------------------------------------
    /**
     * ✅ Update an existing review (Only by the buyer who wrote it)
     * Example JSON:
     * {
     *   "rating": 4,
     *   "comment": "Updated review after a week of use."
     * }
     */
    @PutMapping("/update/{reviewId}")
    public ReviewResponse updateReview(
            @PathVariable Long reviewId,
            @RequestBody ReviewRequest reviewRequest,
            Principal principal
    ) {
        String buyerEmail = principal.getName();
        Review updatedReview = reviewService.updateReview(
                reviewId,
                buyerEmail,
                reviewRequest.getRating(),
                reviewRequest.getComment()
        );
        return convertToResponse(updatedReview);
    }

    // ----------------------------------------------------------------------
    // 🟥 FLAG — Admin flags inappropriate reviews
    // ----------------------------------------------------------------------
    /**
     * ✅ Flag a review manually (Admin feature)
     */
    @PutMapping("/flag/{reviewId}")
    public String flagReview(@PathVariable Long reviewId) {
        reviewService.flagReview(reviewId);
        return "✅ Review flagged successfully!";
    }

    // ----------------------------------------------------------------------
    // 🧩 DTO CLASSES — To keep requests and responses clean
    // ----------------------------------------------------------------------

    /** 🔹 Request DTO — Incoming review data from frontend */
    public static class ReviewRequest {
        private int rating;
        private String comment;

        // Getters & Setters
        public int getRating() { return rating; }
        public void setRating(int rating) { this.rating = rating; }

        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }

    /** 🔹 Response DTO — Outgoing review data to frontend */
    public static class ReviewResponse {
        private Long id;
        private String buyerName;
        private int rating;
        private String comment;
        private String createdAt;
        private boolean flagged;

        // Getters & Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getBuyerName() { return buyerName; }
        public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

        public int getRating() { return rating; }
        public void setRating(int rating) { this.rating = rating; }

        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }

        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

        public boolean isFlagged() { return flagged; }
        public void setFlagged(boolean flagged) { this.flagged = flagged; }
    }

    // ----------------------------------------------------------------------
    // 🔹 Helper — Convert Entity → Response DTO
    // ----------------------------------------------------------------------
    private ReviewResponse convertToResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setBuyerName(review.getBuyerName() != null ? review.getBuyerName() : "Unknown Buyer");
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt() != null ? review.getCreatedAt().toString() : "N/A");
        response.setFlagged(review.isFlagged());
        return response;
    }
}
