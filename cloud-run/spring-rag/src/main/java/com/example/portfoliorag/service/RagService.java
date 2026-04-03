package com.example.portfoliorag.service;

import com.example.portfoliorag.domain.DocumentSearchResult;
import com.example.portfoliorag.domain.QueryResponse;
import com.example.portfoliorag.domain.SourceLink;
import com.example.portfoliorag.repository.DocumentVectorStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class RagService {

    private static final Logger log = LoggerFactory.getLogger(RagService.class);
    private static final String NO_EVIDENCE = "사이트 내 정보로는 확인되지 않습니다.";

    @Value("${portfolio.chat.model}")
    private String chatModel;

    private final DocumentVectorStore vectorStore;
    private final ChatService chatService;

    public RagService(DocumentVectorStore vectorStore, ChatService chatService) {
        this.vectorStore = vectorStore;
        this.chatService = chatService;
    }

    public QueryResponse query(String question) {
        log.info("RAG 질의: {}", question);

        List<DocumentSearchResult> results = vectorStore.similaritySearch(question, 10);

        if (results.isEmpty()) {
            log.info("관련 문서를 찾을 수 없음");
            return new QueryResponse(NO_EVIDENCE, List.of());
        }

        String context = IntStream.range(0, results.size())
                .mapToObj(i -> "[문서 %d]\n%s".formatted(i + 1, results.get(i).content()))
                .collect(Collectors.joining("\n\n"));

        String systemPrompt = buildSystemPrompt(context);

        var chatResponse = chatService.chat(question, systemPrompt, chatModel);
        String answer = (chatResponse != null && chatResponse.getResult() != null)
                ? chatResponse.getResult().getOutput().getText()
                : NO_EVIDENCE;

        List<SourceLink> sources = extractSources(results);
        return new QueryResponse(answer.trim(), sources);
    }

    /**
     * 검색 결과에서 중복 없는 출처 목록 추출
     */
    private List<SourceLink> extractSources(List<DocumentSearchResult> results) {
        Map<String, SourceLink> seen = new LinkedHashMap<>();
        for (DocumentSearchResult result : results) {
            String title = (String) result.metadata().getOrDefault("title", "");
            String url = (String) result.metadata().getOrDefault("url", "");
            if (title.isEmpty()) continue;
            seen.putIfAbsent(title, new SourceLink(title, url.isEmpty() ? null : url));
        }
        return new ArrayList<>(seen.values());
    }

    private String buildSystemPrompt(String context) {
        return """
                당신은 포트폴리오 사이트 전용 AI 도우미입니다.

                고정 프로필:
                - 포트폴리오 주인 이름: 하은영
                - 희망 직무: Software Engineer

                규칙:
                1) 반드시 아래 CONTEXT와 고정 프로필에 있는 정보만 근거로 답변합니다.
                2) 질문에서 "너", "당신", "본인", "작성자", "주인"은 포트폴리오 주인(하은영)을 의미합니다.
                3) CONTEXT와 고정 프로필에 근거가 없으면 "%s"라고만 답변합니다.
                4) 과장·추측·허위 정보를 만들지 않습니다.
                5) 모든 답변은 한국어 존댓말로 작성합니다.
                6) 질문에서 "N개/N가지/N건"처럼 개수를 요청하면 반드시 정확히 그 개수만큼 번호 목록으로 답변합니다.
                7) 목록 답변 중 항목이 부족해도 임의로 축약하지 말고 누락 없이 완결된 답변을 작성합니다.
                8) 질문이 "이력/연도순/목록/전체" 정리를 요구하고 개수를 지정하지 않으면, CONTEXT에서 찾은 관련 항목을 누락 없이 모두 정리합니다.
                9) 같은 이벤트를 의미하는 항목이 중복으로 보이면 한 번만 제시합니다.
                10) 답변 마지막에 [출처] 항목으로 참고한 문서 제목을 짧게 정리합니다.

                CONTEXT:
                %s
                """.formatted(NO_EVIDENCE, context);
    }
}
