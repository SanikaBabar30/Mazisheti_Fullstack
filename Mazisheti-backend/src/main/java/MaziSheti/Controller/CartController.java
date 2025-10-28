package MaziSheti.Controller;

import MaziSheti.Cart;
import MaziSheti.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // ✅ Add a single item to cart
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@Valid @RequestBody Cart cart) {
        try {
            Cart addedCart = cartService.addToCart(cart);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Item added to cart successfully!");
            response.put("cartItem", addedCart);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to add item to cart");
            error.put("details", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

    // ✅ NEW — Add multiple items to cart in one request
    @PostMapping("/add-multiple")
    public ResponseEntity<?> addMultipleToCart(@Valid @RequestBody List<Cart> cartItems) {
        if (cartItems == null || cartItems.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Cart items list cannot be empty");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        try {
            List<Cart> addedItems = cartService.addMultipleToCart(cartItems);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Multiple items added to cart successfully!");
            response.put("cartItems", addedItems);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to add multiple items to cart");
            error.put("details", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

    // ✅ Get all items in buyer's cart
    @GetMapping("/{buyerId}")
    public ResponseEntity<?> getCartItems(@PathVariable Long buyerId) {
        if (buyerId == null || buyerId <= 0) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid buyer ID");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        List<Cart> cartItems = cartService.getCartItems(buyerId);
        return ResponseEntity.ok(cartItems);
    }

    // ✅ Remove item from cart
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> removeItem(@PathVariable Long id) {
        if (id == null || id <= 0) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid cart item ID");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        try {
            cartService.removeFromCart(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Item removed successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to remove item");
            error.put("details", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ✅ Update quantity of item in cart
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Long id,
            @RequestParam @Min(1) int quantity
    ) {
        if (id == null || id <= 0) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid cart item ID");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        if (quantity <= 0) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Quantity must be at least 1");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        try {
            Cart updatedCart = cartService.updateQuantity(id, quantity);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cart quantity updated successfully!");
            response.put("cartItem", updatedCart);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update quantity");
            error.put("details", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ✅ Global exception handler
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleInvalidArgumentException(IllegalArgumentException e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Invalid argument");
        error.put("details", e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}
