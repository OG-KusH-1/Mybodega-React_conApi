package com.example.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.example.api.filter.JwtAuthFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // Habilita manejo de CORS en Security
                .cors(cors -> {}) // Customizer.withDefaults()
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Permite preflight a TODO (clave para CORS)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Permite login sin auth
                        .requestMatchers("/auth/login").permitAll()
                        // Resto protegido
                        .anyRequest().authenticated()
                )
                // Tu filtro JWT antes del UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // Configuración centralizada de CORS para Security
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();

        // Orígenes permitidos (en dev, tu Vite)
        cfg.setAllowedOrigins(List.of("http://localhost:5173"));
        // Si en algún momento necesitas patrones: cfg.setAllowedOriginPatterns(List.of("http://localhost:*"));

        // Métodos permitidos, incluye OPTIONS para el preflight
        cfg.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Headers permitidos por el preflight
        cfg.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization"));

        // Headers que expones al frontend (opcionalmente Authorization si lo devuelves)
        cfg.setExposedHeaders(List.of("Authorization"));

        // Si vas a usar cookies/sesiones (no parece tu caso con JWT), habilita credenciales
        // OJO: si usas allowCredentials(true) NO puedes usar "*" en allowedOrigins
        cfg.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica a todo
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
