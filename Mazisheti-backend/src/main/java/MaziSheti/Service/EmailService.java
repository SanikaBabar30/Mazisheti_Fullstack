package MaziSheti.Service;

import MaziSheti.FarmerReg;
import MaziSheti.CropStage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private Environment env;

    // 1. Approval Email
    public void sendApprovalEmail(String toEmail, String name) {
        if (name == null || name.trim().isEmpty()) {
            name = "Farmer";
        }

        String subject = "Farmer Registration Approved";
        String body = "Dear " + name + ",\n\n" +
                      "Thank you for registering with Mazisheti. Your account has been approved.\n\n" +
                      "You may now log in and start using the system.\n\n" +
                      "Best regards,\n" +
                      "The Mazisheti Team";

        sendEmail(toEmail, subject, body);
    }

    // 2. Crop Schedule Reminder Email (Daily)
    public void sendCropScheduleReminder(FarmerReg farmer, CropStage cropStage, LocalDate scheduleDate) {
        String subject = "Crop Activity Reminder for " + scheduleDate;
        String body = "Dear " + farmer.getFullName() + ",\n\n" +
                      "This is a reminder for today's crop activity:\n\n" +
                      "Stage: " + cropStage.getStage() + "\n" +
                      "Activity: " + cropStage.getActivities() + "\n" +
                      "Pesticides: " + cropStage.getPesticides() + "\n" +
                      "Scheduled Date: " + scheduleDate + "\n\n" +
                      "Please ensure that the necessary tasks are completed on time.\n\n" +
                      "Best regards,\n" +
                      "The Mazisheti Team";

        sendEmail(farmer.getEmail(), subject, body);
    }

    // 3. Schedule Creation Notification with Details
    public void sendScheduleCreatedEmail(String toEmail, String fullName, String stageName,
                                         LocalDate startDate, LocalDate endDate,
                                         String activities, String pesticides) {
        String subject = "Crop Schedule Created";
        String body = "Hi " + fullName + ",\n\n" +
                      "A new crop schedule has been created for you:\n\n" +
                      "Stage: " + stageName + "\n" +
                      "Start Date: " + startDate + "\n" +
                      "End Date: " + endDate + "\n" +
                      "Activity: " + activities + "\n" +
                      "Pesticides: " + pesticides + "\n\n" +
                      "Please check your GrowFarming schedule for more information.\n\n" +
                      "Thank you,\nMazisheti";

        sendEmail(toEmail, subject, body);
    }

    // Common email sending logic
    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(env.getProperty("spring.mail.username"));
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }
}
