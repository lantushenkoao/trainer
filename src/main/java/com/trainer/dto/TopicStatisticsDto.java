package com.trainer.dto;

import com.trainer.model.Topic;
import lombok.Data;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class TopicStatisticsDto {
    private long id;
    private int index;
    private String name;
    private List<TaskStatisticsDto> tasks = new ArrayList<>();

    public TopicStatisticsDto(Topic topic) {
        id = topic.getId();
        index = topic.getIndex();
        name = topic.getName();
        if (!CollectionUtils.isEmpty(topic.getTasks())) {
            tasks = topic.getTasks()
                    .stream()
                    .map(TaskStatisticsDto::new)
                    .collect(Collectors.toList());
        }
    }
}