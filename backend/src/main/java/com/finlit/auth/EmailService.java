package com.finlit.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Sends account-verification emails.
 *
 * If no SMTP username is configured (secrets.properties absent), it logs the
 * code to the backend console instead of failing — so the app still works for a
 * teammate who hasn't set up email yet. If sending throws, it also logs the code
 * as a fallback so registration never dead-ends.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String from;
    private final boolean configured;

    public EmailService(JavaMailSender mailSender,
                        @Value("${app.mail.from}") String from,
                        @Value("${spring.mail.username:}") String username) {
        this.mailSender = mailSender;
        this.from = from;
        this.configured = username != null && !username.isBlank();
    }

    /** True when SMTP is configured — lets callers know email will actually send. */
    public boolean isConfigured() {
        return configured;
    }

    public void sendVerificationCode(String to, String name, String code) {
        String subject = "Your FinLit verification code";
        String body = "Hi " + (name == null || name.isBlank() ? "there" : name) + ",\n\n"
                + "Welcome to FinLit! Enter this code to verify your email:\n\n"
                + "    " + code + "\n\n"
                + "The code expires in 15 minutes. If you didn't create a FinLit account,\n"
                + "you can safely ignore this email.\n\n"
                + "— The FinLit Team";

        send(to, subject, body, code, "Verification");
    }

    public void sendPasswordResetCode(String to, String name, String code) {
        String subject = "Your FinLit password reset code";
        String body = "Hi " + (name == null || name.isBlank() ? "there" : name) + ",\n\n"
                + "We got a request to reset your FinLit password. Enter this code in the app:\n\n"
                + "    " + code + "\n\n"
                + "The code expires in 15 minutes. If you didn't ask to reset your password,\n"
                + "you can safely ignore this email — your password stays unchanged.\n\n"
                + "— The FinLit Team";

        send(to, subject, body, code, "Password reset");
    }

    /**
     * Shared delivery path. {@code kind} only labels the log lines, so an
     * operator reading Render's logs can tell which flow a code belongs to.
     */
    private void send(String to, String subject, String body, String code, String kind) {
        if (!configured) {
            log.warn("[EmailService] SMTP not configured — {} code for {} is: {}", kind, to, code);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("[EmailService] {} email sent to {}", kind, to);
        } catch (Exception ex) {
            // Never let a mail failure block the user — log the code so they can
            // still proceed (visible to whoever runs the backend).
            log.error("[EmailService] Failed to send to {} ({}). Code is: {}",
                    to, ex.getMessage(), code);
        }
    }
}
