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

        final String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            try {
                String email = jwtTokenUtil.extractEmail(token);
                String role = jwtTokenUtil.extractRole(token);

                //  Debugging logs to check if the role and email are extracted properly
                logger.info("Extracted email: {}", email);
                logger.info("Extracted role: {}", role);
                logger.info("Assigned authority: " + role);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    if (jwtTokenUtil.validateToken(token, email)) {
                        // Create authority with ROLE_ prefix
                        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);

                        // Create the authentication token
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(email, null, Collections.singleton(authority));

                        // Set authentication details
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);

                        //  Confirm authority has been applied
                        logger.info("Authorities set in context: {}", authentication.getAuthorities());
                    }
                }

            } catch (Exception ex) {
                //  Log token errors (expired, invalid, etc.)
                logger.warn("JWT processing failed: {}", ex.getMessage());
            }
        }

        // Proceed with the filter chain
        chain.doFilter(request, response);
    }
}
