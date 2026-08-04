package com.finlit.config;

import com.finlit.user.User;
import com.finlit.user.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Runs once on every incoming request. If there is a valid "Authorization:
 * Bearer <token>" header, it loads that user and marks the request as
 * authenticated — so controllers can trust who the caller is.
 *
 * If the header is missing or the token is invalid, it simply does nothing and
 * lets the request continue unauthenticated; secured endpoints will then 401.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            String token = header.substring(7);
            try {
                // Parse once, and insist this is an ACCESS token. Refresh tokens
                // are signed the same way but live 30 days instead of 24 hours —
                // without this check one would authenticate every endpoint, which
                // makes the short access-token lifetime pointless.
                Claims claims = jwtService.parse(token);
                if ("access".equals(claims.get("type", String.class))) {
                    UUID userId = UUID.fromString(claims.getSubject());
                    User user = userRepository.findById(userId).orElse(null);
                    if (user != null) {
                        var authentication = new UsernamePasswordAuthenticationToken(
                                user, null, List.of());
                        authentication.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            } catch (JwtException | IllegalArgumentException ex) {
                // Invalid / expired token — stay unauthenticated.
            }
        }

        filterChain.doFilter(request, response);
    }
}
