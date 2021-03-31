package com.trainer.service;

import com.trainer.exception.TrainerException;
import com.trainer.model.Topic;
import com.trainer.model.User;
import com.trainer.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;
    private final TaskService taskService;
    private final UserService userService;

    public List<Topic> listAll() {
        taskService.applySolutionsFilter(userService.getCurrentUser());
        return topicRepository.findAllByOrderByIndexAsc();
    }

    public List<Topic> listAllForUser(Long userId) {
        taskService.applySolutionsFilter(userService.getById(userId));
        return topicRepository.findAllByOrderByIndexAsc();
    }

    public Topic getById(long topicId) {
        taskService.applySolutionsFilter(userService.getCurrentUser());
        return topicRepository.findById(topicId)
                .orElseThrow(() -> new TrainerException("Тема не найдена"));
    }

    public Topic getByIndex(int index) {
        taskService.applySolutionsFilter(userService.getCurrentUser());
        return topicRepository.findByIndex(index);
    }

    public void delete(Long topicId) {
        Topic topic = getById(topicId);

        if (!CollectionUtils.isEmpty(topic.getTasks())) {
            throw new TrainerException("Тема не может быть удалена, т.к. содержит задания");
        }

        topic.setDeleted(true);
        saveOrUpdate(topic);
    }

    public Topic saveOrUpdate(Topic topic) {
        return topicRepository.save(topic);
    }

}
