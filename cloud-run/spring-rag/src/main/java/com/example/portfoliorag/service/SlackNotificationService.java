package com.example.portfoliorag.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Pattern;

@Service
public class SlackNotificationService {

    private static final Logger log = LoggerFactory.getLogger(SlackNotificationService.class);
    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // PII 마스킹 패턴
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}");
    private static final Pattern PHONE_PATTERN =
            Pattern.compile("(\\+?82[-. ]?)?0?1[0-9][-. ]?\\d{3,4}[-. ]?\\d{4}|\\d{2,3}-\\d{3,4}-\\d{4}");
    private static final Pattern RESIDENT_ID_PATTERN =
            Pattern.compile("\\d{6}[-. ]?[1-4]\\d{6}");
    private static final Pattern URL_PATTERN =
            Pattern.compile("https?://[^\\s]+");

    @Value("${portfolio.slack.webhook-url:}")
    private String webhookUrl;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    public void sendQueryLog(String question, String answer) {
        if (webhookUrl == null || webhookUrl.isBlank()) {
            return;
        }

        String maskedQuestion = maskPii(question);
        String maskedAnswer = maskPii(answer);
        String truncatedAnswer = maskedAnswer.length() > 500
                ? maskedAnswer.substring(0, 500) + "..."
                : maskedAnswer;

        String timestamp = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).format(FORMATTER);
        String payload = """
                {
                  "text": "*[포트폴리오 AI 질문 로그]* %s\\n*Q:* %s\\n*A:* %s"
                }
                """.formatted(
                timestamp,
                escapeJson(maskedQuestion),
                escapeJson(truncatedAnswer)
        );

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(webhookUrl))
                    .timeout(Duration.ofSeconds(5))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.warn("Slack 알림 전송 실패 - status: {}", response.statusCode());
            }
        } catch (Exception e) {
            log.warn("Slack 알림 전송 오류: {}", e.getMessage());
        }
    }

    static String maskPii(String text) {
        if (text == null || text.isBlank()) return text;
        return URL_PATTERN.matcher(
                RESIDENT_ID_PATTERN.matcher(
                        PHONE_PATTERN.matcher(
                                EMAIL_PATTERN.matcher(text)
                                        .replaceAll("[EMAIL]"))
                                .replaceAll("[PHONE]"))
                        .replaceAll("[ID]"))
                .replaceAll("[URL]");
    }

    private static String escapeJson(String text) {
        return text
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "")
                .replace("\t", "\\t");
    }
}
