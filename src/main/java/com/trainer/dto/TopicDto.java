package com.trainer.dto;

import com.trainer.model.Topic;
import lombok.Data;
import org.springframework.util.CollectionUtils;

@Data
public class TopicDto {
    private Long id;
    private int index;
    private String name;
    private String description;
    private boolean hasTasks;

    public TopicDto(Topic topic) {
        id = topic.getId();
        index = topic.getIndex();
        name = topic.getName();
        description = topic.getDescription();
        hasTasks = !CollectionUtils.isEmpty(topic.getTasks());
    }
}