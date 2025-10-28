package MaziSheti.Security;

import java.io.IOException;
import java.util.Collections;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        String method = request.getMethod();

        // ✅ Skip JWT validation only for PUBLIC endpoints
        if (
            path.startsWith("/auth/") ||
            path.startsWith("/uploads/") ||
            path.startsWith("/api/buyers/register") ||
            path.startsWith("/api/buyers/login") ||
            path.startsWith("/api/vendors/register") ||
            (path.startsWith("/api/products") && method.equalsIgnoreCase("GET")) ||
            (path.startsWith("/api/crops") && method.equalsIgnoreCase("GET")) ||
            (path.startsWith("/api/reviews/product") && method.equalsIgnoreCase("GET")) ||
            method.equalsIgnoreCase("OPTIONS")
        ) {
            logger.debug("Skipping JWT filter for public endpoint: {}", path);
            chain.doFilter(request, response);
            return;
        }

        // ✅ Continue for protected endpoints
        final String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            try {
                String email = jwtTokenUtil.extractEmail(token);
                String role = jwtTokenUtil.extractRole(token);

                logger.debug("Extracted email: {}", email);
                logger.debug("Extracted role: {}", role);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    if (jwtTokenUtil.validateToken(token, email)) {
                        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(email, null, Collections.singleton(authority));

                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        logger.info("✅ Authenticated user: {} with role: {}", email, role);
                    } else {
                        logger.warn("❌ Invalid JWT token for user: {}", email);
                    }
                }
            } catch (Exception ex) {
                logger.error("❌ JWT processing failed: {}", ex.getMessage());
            }
        } else {
            logger.debug("⚠️ No Authorization header found or invalid format");
        }

        // Continue with the filter chain
        chain.doFilter(request, response);
    }
}
