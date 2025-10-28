package MaziSheti.Service;

import MaziSheti.Review;
import MaziSheti.Repository.ReviewRepository;
import MaziSheti.Repository.BuyerRepository;
import MaziSheti.Repository.ProductCatalogRepository;
import MaziSheti.ProductCatalog;
import MaziSheti.Buyer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BuyerRepository buyerRepository;

    @Autowired
    private ProductCatalogRepository productRepository;

    /**
     * ✅ Add a new review for a product by a buyer.
     * Automatically captures buyer name and flags low ratings.
     */
    public Review addReview(Long productId, String buyerEmail, int rating, String comment) {
        // 🔹 Fetch buyer using email from JWT
        Buyer buyer = buyerRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new RuntimeException("Buyer not found with email: " + buyerEmail));

        // 🔹 Fetch the product being reviewed
        ProductCatalog product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        // 🔹 Create new review
        Review review = new Review();
        review.setBuyer(buyer);
        review.setProduct(product);
        review.setRating(rating);
        review.setComment(comment);
        review.setBuyerName(buyer.getBuyerName()); // ✅ Correct getter
        review.setCreatedAt(LocalDateTime.now());

        // 🔹 Auto-flag review if rating ≤ 2
        review.setFlagged(rating <= 2);

        return reviewRepository.save(review);
    }

    /**
     * ✅ Get all reviews for a specific product.
     */
    public List<Review> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    /**
     * ✅ Flag an existing review manually (Admin feature).
     */
    public void flagReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));

        review.setFlagged(true);
        reviewRepository.save(review);
    }

    /**
     * ✅ Update an existing review (only by the buyer who wrote it).
     */
    public Review updateReview(Long reviewId, String buyerEmail, int rating, String comment) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));

        // 🔹 Ensure only review author can update it
        if (!review.getBuyer().getEmail().equalsIgnoreCase(buyerEmail)) {
            throw new RuntimeException("You are not authorized to update this review.");
        }

        // 🔹 Update review details
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(LocalDateTime.now());
        review.setBuyerName(review.getBuyer().getBuyerName()); // ✅ Corrected
        review.setFlagged(rating <= 2); // Auto-flag poor ratings

        return reviewRepository.save(review);
    }
}
