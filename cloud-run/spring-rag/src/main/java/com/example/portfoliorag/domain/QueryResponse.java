package com.example.portfoliorag.domain;

import java.util.List;

public record QueryResponse(String text, List<SourceLink> sources) {}
