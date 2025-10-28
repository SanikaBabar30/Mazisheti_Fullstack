package MaziSheti.Service;

import MaziSheti.Admin;
import MaziSheti.Notification;
import MaziSheti.Repository.AdminRepository;
import MaziSheti.Repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Send a notification message to all admins.
     *
     * @param message message text to send
     */
    public void notifyAdmin(String message) {
        List<Admin> admins = adminRepository.findAll();

        for (Admin admin : admins) {
            Notification notification = new Notification();
            notification.setAdmin(admin);
            notification.setMessage(message);
            notification.setRead(false);
            notification.setTimestamp(LocalDateTime.now());

            notificationRepository.save(notification);
        }
    }
}
