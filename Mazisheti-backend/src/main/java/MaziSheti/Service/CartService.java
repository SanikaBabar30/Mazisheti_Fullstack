package MaziSheti.Service;

import MaziSheti.Cart;
import MaziSheti.Repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    // ✅ Add or update a single item in the cart
    public Cart addToCart(Cart cartItem) {
        if (cartItem.getBuyerId() == null || cartItem.getProductId() == null) {
            throw new IllegalArgumentException("Buyer ID and Product ID are required.");
        }

        return cartRepository.findByBuyerIdAndProductId(cartItem.getBuyerId(), cartItem.getProductId())
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + cartItem.getQuantity());
                    return cartRepository.save(existing);
                })
                .orElseGet(() -> cartRepository.save(cartItem));
    }

    // ✅ Add multiple items at once
    public List<Cart> addMultipleToCart(List<Cart> cartItems) {
        if (cartItems == null || cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart items list cannot be empty.");
        }

        return cartItems.stream()
                .map(this::addToCart)
                .toList();
    }

    // ✅ Get all cart items for a buyer
    public List<Cart> getCartItems(Long buyerId) {
        return cartRepository.findByBuyerId(buyerId);
    }

    // ✅ Remove item from cart
    public void removeFromCart(Long id) {
        if (!cartRepository.existsById(id)) {
            throw new RuntimeException("Cart item with ID " + id + " does not exist");
        }
        cartRepository.deleteById(id);
    }

    // ✅ Update quantity of an item
    public Cart updateQuantity(Long id, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }

        Cart item = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item with ID " + id + " not found"));
        item.setQuantity(quantity);
        return cartRepository.save(item);
    }
}
