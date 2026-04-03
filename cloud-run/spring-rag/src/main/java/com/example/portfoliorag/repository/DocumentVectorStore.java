package com.example.portfoliorag.repository;

import com.example.portfoliorag.domain.DocumentSearchResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class DocumentVectorStore {

    private static final Logger log = LoggerFactory.getLogger(DocumentVectorStore.class);

    private final VectorStore vectorStore;

    public DocumentVectorStore(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void addDocument(String id, String text, Map<String, Object> metadata) {
        log.debug("문서 추가 - ID: {}", id);
        try {
            Map<String, Object> combined = new HashMap<>(metadata);
            combined.put("docId", id);

            Document document = new Document(text, combined);

            TokenTextSplitter splitter = TokenTextSplitter.builder()
                    .withChunkSize(512)
                    .withMinChunkSizeChars(100)
                    .withMinChunkLengthToEmbed(5)
                    .withMaxNumChunks(10000)
                    .withKeepSeparator(true)
                    .build();

            List<Document> chunks = splitter.split(document);
            vectorStore.add(chunks);
            log.debug("문서 추가 완료 - ID: {}, 청크 수: {}", id, chunks.size());
        } catch (Exception e) {
            log.error("문서 추가 실패 - ID: {}", id, e);
        }
    }

    /**
     * Qdrant 컬렉션에 데이터가 있는지 확인 (cold start 시 재인덱싱 여부 판단용)
     */
    public boolean hasData() {
        try {
            List<Document> probe = vectorStore.similaritySearch(
                    SearchRequest.builder().query("포트폴리오").topK(1).build());
            return probe != null && !probe.isEmpty();
        } catch (Exception e) {
            log.warn("Qdrant 데이터 확인 실패, 재인덱싱 진행: {}", e.getMessage());
            return false;
        }
    }

    public List<DocumentSearchResult> similaritySearch(String query, int topK) {
        log.debug("유사도 검색 - 질의: '{}', topK: {}", query, topK);
        try {
            SearchRequest request = SearchRequest.builder()
                    .query(query)
                    .topK(topK)
                    .build();

            List<Document> results = vectorStore.similaritySearch(request);
            if (results == null) return Collections.emptyList();

            return results.stream().map(doc -> {
                String docId = doc.getMetadata().getOrDefault("docId", "").toString();
                Map<String, Object> meta = doc.getMetadata().entrySet().stream()
                        .filter(e -> !e.getKey().equals("docId"))
                        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
                double score = doc.getScore() != null ? doc.getScore() : 0.0;
                return new DocumentSearchResult(docId, doc.getText(), meta, score);
            }).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("유사도 검색 실패", e);
            return Collections.emptyList();
        }
    }
}
