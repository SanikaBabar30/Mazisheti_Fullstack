package MaziSheti;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔹 Product being reviewed
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private ProductCatalog product;

    // 🔹 Buyer who gave the review
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private Buyer buyer;

    private int rating;               // Rating: 1–5 stars
    private String comment;           // Review text/comment
    private boolean flagged = false;  // If review is reported
    private LocalDateTime createdAt = LocalDateTime.now();

    // ✅ Store buyer name directly for easy frontend display
    private String buyerName;

    // --- Constructors ---
    public Review() {}

    public Review(ProductCatalog product, Buyer buyer, int rating, String comment) {
        this.product = product;
        setBuyer(buyer); // also sets buyerName automatically
        this.rating = rating;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public ProductCatalog getProduct() {
        return product;
    }
    public void setProduct(ProductCatalog product) {
        this.product = product;
    }

    public Buyer getBuyer() {
        return buyer;
    }
    public void setBuyer(Buyer buyer) {
        this.buyer = buyer;
        if (buyer != null) {
            // ✅ Use correct getter from Buyer.java
            this.buyerName = buyer.getBuyerName();
        } else {
            this.buyerName = "Unknown";
        }
    }

    public int getRating() {
        return rating;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }
    public void setComment(String comment) {
        this.comment = comment;
    }

    public boolean isFlagged() {
        return flagged;
    }
    public void setFlagged(boolean flagged) {
        this.flagged = flagged;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getBuyerName() {
        return buyerName;
    }
    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }

    // --- Optional: for debugging/logging ---
    @Override
    public String toString() {
        return "Review{" +
                "id=" + id +
                ", buyerName='" + buyerName + '\'' +
                ", rating=" + rating +
                ", comment='" + comment + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
