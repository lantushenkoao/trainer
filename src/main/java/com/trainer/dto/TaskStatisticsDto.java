package com.trainer.dto;

import com.trainer.model.Task;
import lombok.Data;
import org.springframework.util.CollectionUtils;

@Data
public class TaskStatisticsDto {
    private long id;
    private int index;
    private String name;
    private boolean manualEvaluation;
    private boolean hasSolution;
    private Integer mark;

    public TaskStatisticsDto(Task task) {
        id = task.getId();
        index = task.getIndex();
        name = task.getName();
        manualEvaluation = task.isManualEvaluation();
        hasSolution = !CollectionUtils.isEmpty(task.getSolutions());
        if (hasSolution) {
            mark = task.getSolutions().iterator().next().getMark();
        }
    }
}