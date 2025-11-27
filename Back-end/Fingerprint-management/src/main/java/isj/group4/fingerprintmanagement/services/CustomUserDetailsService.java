package isj.group4.fingerprintmanagement.services;

import isj.group4.fingerprintmanagement.entity.Admin;
import isj.group4.fingerprintmanagement.repository.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepo adminRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Admin admin = adminRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found"));

        // Create authority with ROLE_ prefix as Spring Security expects
        String authority = "ROLE_" + admin.getRole().name();

        return org.springframework.security.core.userdetails.User.builder()
                .username(admin.getEmail())
                .password(admin.getPassword())
                .authorities(authority)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!admin.getActive())
                .build();
    }
}