package com.example.portfoliorag.service;

import com.example.portfoliorag.repository.DocumentVectorStore;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class PortfolioDataLoader implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(PortfolioDataLoader.class);

    @Value("${portfolio.knowledge-url}")
    private String knowledgeUrl;

    @Value("${portfolio.velog-rss-url}")
    private String velogRssUrl;

    @Value("${portfolio.force-reindex:false}")
    private boolean forceReindex;

    private final DocumentVectorStore vectorStore;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public PortfolioDataLoader(DocumentVectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!forceReindex && vectorStore.hasData()) {
            log.info("Qdrant에 기존 데이터 있음 → 인덱싱 건너뜀 (force-reindex=false)");
            return;
        }
        log.info("포트폴리오 데이터 로딩 시작 (force-reindex={})", forceReindex);
        int portfolioCount = loadPortfolioDocuments();
        int blogCount = loadVelogPosts();
        log.info("데이터 로딩 완료 - 포트폴리오 문서: {}개, 블로그 포스트: {}개", portfolioCount, blogCount);
    }

    private int loadPortfolioDocuments() {
        log.info("포트폴리오 JSON 로딩: {}", knowledgeUrl);
        AtomicInteger count = new AtomicInteger(0);
        try {
            String json = fetchText(knowledgeUrl);
            JsonNode docs = objectMapper.readTree(json);

            if (!docs.isArray()) {
                log.warn("portfolio-knowledge.json이 배열 형식이 아닙니다");
                return 0;
            }

            for (JsonNode doc : docs) {
                String id = doc.path("id").asText("");
                String title = doc.path("title").asText("");
                String content = doc.path("content").asText("");
                String kind = doc.path("kind").asText("experience");
                String url = doc.path("url").isNull() ? "" : doc.path("url").asText("");

                if (id.isEmpty() || content.isEmpty()) continue;

                // tags를 content 앞에 붙여서 검색 정확도 향상
                StringBuilder tagsText = new StringBuilder();
                JsonNode tags = doc.path("tags");
                if (tags.isArray()) {
                    for (JsonNode tag : tags) tagsText.append(tag.asText()).append(" ");
                }

                String fullText = (tagsText + "\n" + title + "\n" + content).trim();

                Map<String, Object> metadata = new HashMap<>();
                metadata.put("title", title);
                metadata.put("url", url);
                metadata.put("kind", kind);

                vectorStore.addDocument(id, fullText, metadata);
                count.incrementAndGet();
            }
        } catch (Exception e) {
            log.error("포트폴리오 문서 로딩 실패: {}", e.getMessage(), e);
        }
        return count.get();
    }

    private int loadVelogPosts() {
        log.info("Velog RSS 로딩: {}", velogRssUrl);
        AtomicInteger count = new AtomicInteger(0);
        try {
            byte[] rssBytes = fetchBytes(velogRssUrl);
            // XML 1.0에서 허용되지 않는 제어 문자 제거 (0x00-0x08, 0x0B-0x0C, 0x0E-0x1F)
            String sanitized = sanitizeXml(new String(rssBytes, StandardCharsets.UTF_8));
            try (InputStream is = new java.io.ByteArrayInputStream(sanitized.getBytes(StandardCharsets.UTF_8))) {
                var dbFactory = DocumentBuilderFactory.newInstance();
                var dBuilder = dbFactory.newDocumentBuilder();
                var xmlDoc = dBuilder.parse(is);
                xmlDoc.getDocumentElement().normalize();

                NodeList items = xmlDoc.getElementsByTagName("item");
                for (int i = 0; i < items.getLength(); i++) {
                    Element item = (Element) items.item(i);

                    String title = getTagText(item, "title");
                    String link = getTagText(item, "link");
                    String descriptionHtml = getTagText(item, "description");

                    if (title.isEmpty() || link.isEmpty()) continue;

                    String plainText = stripHtml(descriptionHtml);
                    String fullText = title + "\n" + plainText;
                    String docId = "velog-" + i;

                    Map<String, Object> metadata = new HashMap<>();
                    metadata.put("title", title);
                    metadata.put("url", link);
                    metadata.put("kind", "blog");

                    vectorStore.addDocument(docId, fullText, metadata);
                    count.incrementAndGet();
                }
            }
        } catch (Exception e) {
            log.error("Velog RSS 로딩 실패: {}", e.getMessage(), e);
        }
        return count.get();
    }

    private String fetchText(String url) throws Exception {
        // 로컬 파일 경로 지원 (file:// 또는 절대 경로)
        if (url.startsWith("file://")) {
            return Files.readString(Path.of(url.substring(7)));
        }
        if (url.startsWith("/")) {
            return Files.readString(Path.of(url));
        }
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(15))
                .GET()
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP " + response.statusCode() + " from " + url);
        }
        return response.body();
    }

    private byte[] fetchBytes(String url) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(15))
                .GET()
                .build();
        HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP " + response.statusCode() + " from " + url);
        }
        return response.body();
    }

    /**
     * XML 1.0에서 허용되지 않는 제어 문자 제거
     * 허용: 0x9(탭), 0xA(개행), 0xD(캐리지리턴), 0x20 이상
     */
    private static String sanitizeXml(String xml) {
        return xml.chars()
                .filter(c -> c == 0x9 || c == 0xA || c == 0xD || (c >= 0x20 && c <= 0xD7FF)
                        || (c >= 0xE000 && c <= 0xFFFD))
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
    }

    private static String getTagText(Element parent, String tagName) {
        NodeList nodes = parent.getElementsByTagName(tagName);
        if (nodes.getLength() == 0) return "";
        return nodes.item(0).getTextContent().trim();
    }

    /**
     * HTML 태그와 이미지를 제거하고 순수 텍스트만 추출
     */
    private static String stripHtml(String html) {
        if (html == null || html.isEmpty()) return "";
        return html
                .replaceAll("<img[^>]*>", "")
                .replaceAll("<[^>]+>", " ")
                .replaceAll("\\s{3,}", "\n\n")
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">")
                .replaceAll("&amp;", "&")
                .replaceAll("&nbsp;", " ")
                .replaceAll("&quot;", "\"")
                .trim();
    }
}
