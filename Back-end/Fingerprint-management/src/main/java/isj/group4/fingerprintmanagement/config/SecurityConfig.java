package isj.group4.fingerprintmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration for the application.
 * Configures password encoding and basic security settings.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Password encoder bean using BCrypt algorithm.
     * BCrypt is a strong hashing algorithm designed for password storage.
     *
     * @return BCryptPasswordEncoder instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Security filter chain configuration.
     * Currently permitting all requests for development.
     *
     * TODO: In production, configure proper authentication and authorization:
     * - Protect admin endpoints with authentication
     * - Configure JWT authentication filter
     * - Set up role-based access control
     *
     * @param http HttpSecurity to configure
     * @return configured SecurityFilterChain
     * @throws Exception if configuration fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF for API (enable it if using session-based auth with forms)
            .csrf(csrf -> csrf.disable())

            // Configure authorization
            .authorizeHttpRequests(auth -> auth
                // Allow all requests for now (development mode)
                .anyRequest().permitAll()
            )

            // Stateless session (for JWT-based auth)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        return http.build();
    }
}

