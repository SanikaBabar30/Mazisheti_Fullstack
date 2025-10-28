package MaziSheti.Config;

import MaziSheti.Security.CustomAccessDeniedHandler;
import MaziSheti.Security.JwtRequestFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * ✅ Security configuration for JWT-based authentication.
 * - Supports React frontend (localhost:5173)
 * - Stateless sessions
 * - Role-based access control
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    public SecurityConfig(JwtRequestFilter jwtRequestFilter, CustomAccessDeniedHandler accessDeniedHandler) {
        this.jwtRequestFilter = jwtRequestFilter;
        this.accessDeniedHandler = accessDeniedHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // ✅ Enable CORS and disable CSRF (we’re using JWT)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())

            // ✅ Stateless sessions (no cookies or HTTP sessions)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // ✅ Proper error handling
            .exceptionHandling(ex -> ex
                .accessDeniedHandler(accessDeniedHandler)
                .authenticationEntryPoint(new Http403ForbiddenEntryPoint())
            )

            // ✅ Authorization Rules
            .authorizeHttpRequests(auth -> auth

                // 🌍 Public endpoints (no authentication)
                .requestMatchers(
                        "/auth/**",
                        "/api/register",          // ✅ Farmer Registration
                        "/api/buyers/register",   // ✅ Buyer Registration
                        "/api/vendors/register",  // ✅ Vendor Registration
                        "/api/buyers/login",
                        "/uploads/**"
                ).permitAll()

                // 📰 Public GET requests
                .requestMatchers(HttpMethod.GET,
                        "/api/products/**",
                        "/api/crops/**",
                        "/api/reviews/product/**",  // ✅ Anyone can view reviews
                        "/api/crop-stage/upload"
                ).permitAll()

                // 🧑‍🤝‍🧑 Buyer-only endpoints
                .requestMatchers(HttpMethod.POST, "/api/reviews/add/**").hasAuthority("ROLE_BUYER")
                .requestMatchers(HttpMethod.PUT, "/api/reviews/update/**").hasAuthority("ROLE_BUYER")
                .requestMatchers("/api/cart/**").hasAuthority("ROLE_BUYER")

                // 👨‍🌾 Farmer-only endpoints
                .requestMatchers(HttpMethod.POST, "/api/schedules/generate/**").hasAuthority("ROLE_FARMER")

                // 🧑‍⚖️ Admin-only endpoints
                .requestMatchers(HttpMethod.PUT, "/api/reviews/flag/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/crops").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/crops/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/crops/**").hasAuthority("ROLE_ADMIN")

                // ✅ Allow CORS preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // 🔒 All remaining /api/** requests require authentication
                .requestMatchers("/api/**").authenticated()

                // 🚫 Everything else also secured
                .anyRequest().authenticated()
            )

            // ✅ Add JWT Filter
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * ✅ Expose AuthenticationManager for login authentication.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * ✅ Allow frontend (React at localhost:5173) to access backend via CORS.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
