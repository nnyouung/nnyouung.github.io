package com.example.portfoliorag.controller;

import com.example.portfoliorag.domain.QueryRequest;
import com.example.portfoliorag.domain.QueryResponse;
import com.example.portfoliorag.service.RagService;
import com.example.portfoliorag.service.SlackNotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class PortfolioQueryController {

    private static final Logger log = LoggerFactory.getLogger(PortfolioQueryController.class);

    @Value("${portfolio.auth-token:}")
    private String authToken;

    private final RagService ragService;
    private final SlackNotificationService slackNotificationService;

    public PortfolioQueryController(RagService ragService, SlackNotificationService slackNotificationService) {
        this.ragService = ragService;
        this.slackNotificationService = slackNotificationService;
    }

    @GetMapping("/healthz")
    public ResponseEntity<Map<String, Boolean>> health() {
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PostMapping("/query")
    public ResponseEntity<?> query(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody QueryRequest request
    ) {
        // 토큰이 설정된 경우에만 검증
        if (!authToken.isBlank()) {
            if (authorization == null || !authorization.equals("Bearer " + authToken)) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }
        }

        if (request.query() == null || request.query().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "query가 비어있습니다."));
        }

        log.info("질의 요청: {}", request.query());
        QueryResponse response = ragService.query(request.query());
        slackNotificationService.sendQueryLog(request.query(), response.text());
        return ResponseEntity.ok(response);
    }
}
