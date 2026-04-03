package com.example.portfoliorag.domain;

import java.util.Map;

public record DocumentSearchResult(
        String id,
        String content,
        Map<String, Object> metadata,
        double score
) {}
