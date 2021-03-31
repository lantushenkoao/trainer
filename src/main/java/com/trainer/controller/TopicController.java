package com.trainer.controller;

import com.trainer.dto.TopicDto;
import com.trainer.dto.TopicStatisticsDto;
import com.trainer.exception.TrainerException;
import com.trainer.model.Topic;
import com.trainer.service.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

import static com.trainer.security.Roles.ADMIN;
import static com.trainer.security.Roles.METHODIST;

@RestController
@RequestMapping("/api/topic")
public class TopicController {

    @Autowired
    private TopicService topicService;

    @GetMapping("get")
    public TopicDto get(@RequestParam Long id) {
        return new TopicDto(topicService.getById(id));
    }

    @GetMapping("statistics")
    public TopicStatisticsDto getStatistics(@RequestParam Long id) {
        return new TopicStatisticsDto(topicService.getById(id));
    }

    @GetMapping("list")
    public List<TopicDto> list() {
        return topicService.listAll()
                .stream()
                .map(TopicDto::new)
                .collect(Collectors.toList());
    }

    @Secured({ADMIN, METHODIST})
    @PostMapping("create")
    public Topic create(@Valid @RequestBody Topic topic, Errors errors) {

        validateIndexUnique(topic, errors);

        if (errors.hasErrors()) {
            throw new TrainerException(errors);
        }

        return topicService.saveOrUpdate(topic);
    }

    @Secured({ADMIN, METHODIST})
    @PostMapping("update")
    public Topic update(@Valid @RequestBody Topic topic, Errors errors) {

        validateIndexUnique(topic, errors);

        if (errors.hasErrors()) {
            throw new TrainerException(errors);
        }

        return topicService.saveOrUpdate(topic);
    }

    @Secured({ADMIN, METHODIST})
    @PostMapping("delete")
    public void delete(@RequestBody Topic topic) {
        topicService.delete(topic.getId());
    }

    private void validateIndexUnique(Topic topic, Errors errors) {
        if (topic.getId() != null) {
            Topic sameIndexTopic = topicService.getByIndex(topic.getIndex());
            if (sameIndexTopic != null && !sameIndexTopic.getId().equals(topic.getId())) {
                errors.rejectValue("index", null, "Тема с таким номером уже существует");
            }
        }
    }

}
