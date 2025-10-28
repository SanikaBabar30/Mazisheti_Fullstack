package MaziSheti;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.scheduling.annotation.EnableScheduling;

import MaziSheti.Config.*;
import MaziSheti.Admin;
import MaziSheti.Repository.AdminRepository;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties({
    FarmerReportConfig.class,
    CropReportConfig.class,
    SeedTypeReportConfig.class,
    FarmerCropScheduleReportConfig.class
})
public class MaziShetiApplication {

    public static void main(String[] args) {
        SpringApplication.run(MaziShetiApplication.class, args);
    }

    @Bean
    CommandLineRunner createAdmin(AdminRepository adminRepository) {
        return args -> {
            if (adminRepository.findByEmail("mazisheti@gmail.com") == null) {
                Admin admin = new Admin();
                admin.setEmail("mazisheti@gmail.com");
                admin.setPassword(new BCryptPasswordEncoder().encode("admin123")); // Use hashed password
                admin.setRole("ADMIN");
                admin.setName("Admin"); // Add this field in Admin entity if not present
                adminRepository.save(admin);
                System.out.println("✅ Admin created in admin table: mazisheti@gmail.com / admin123");
            }
        };
    }
}
