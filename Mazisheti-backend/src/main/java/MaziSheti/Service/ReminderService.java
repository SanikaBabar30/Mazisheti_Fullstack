package MaziSheti.Service;

import MaziSheti.FarmerCropSchedule;
import MaziSheti.Repository.FarmerCropScheduleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private FarmerCropScheduleRepository farmerCropScheduleRepository;

    @Autowired
    private EmailService emailService;

    // This method runs every day at 8 AM
    @Scheduled(cron = "0 0 8 * * ?") 
    public void sendDailyReminders() {
        LocalDate today = LocalDate.now();

        // Get all crop schedules for today
        List<FarmerCropSchedule> schedulesForToday = farmerCropScheduleRepository
        	    .findByStartDateLessThanEqualAndEndDateGreaterThanEqual(today, today);

        // If no schedules exist for today
        if (schedulesForToday.isEmpty()) {
            System.out.println("No crop schedules found for today.");
        }

        // Send email reminders for each schedule
        for (FarmerCropSchedule schedule : schedulesForToday) {
            try {
                emailService.sendCropScheduleReminder(
                        schedule.getFarmer(), 
                        schedule.getCropStage(), 
                        schedule.getStartDate()
                );
                System.out.println("Reminder sent to farmer: " + schedule.getFarmer().getFullName());
            } catch (Exception e) {
                System.err.println("Failed to send reminder for schedule ID: " + schedule.getId());
                e.printStackTrace();
            }
        }
    }
}
