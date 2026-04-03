package com.example.portfoliorag.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final OpenAiApi openAiApi;

    public ChatService(OpenAiApi openAiApi) {
        this.openAiApi = openAiApi;
    }

    public ChatResponse chat(String userInput, String systemPrompt, String model) {
        log.debug("OpenAI 챗 호출 - 모델: {}", model);
        try {
            Prompt prompt = new Prompt(
                    List.of(new SystemMessage(systemPrompt), new UserMessage(userInput)),
                    ChatOptions.builder().model(model).build()
            );
            OpenAiChatModel chatModel = OpenAiChatModel.builder()
                    .openAiApi(openAiApi)
                    .build();
            return chatModel.call(prompt);
        } catch (Exception e) {
            log.error("OpenAI 챗 호출 오류: {}", e.getMessage(), e);
            return null;
        }
    }
}
