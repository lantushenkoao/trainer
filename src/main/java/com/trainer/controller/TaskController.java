package com.trainer.controller;

import com.trainer.exception.TrainerException;
import com.trainer.model.Solution;
import com.trainer.model.Task;
import com.trainer.model.Topic;
import com.trainer.schema.Link;
import com.trainer.schema.Node;
import com.trainer.schema.Schema;
import com.trainer.service.PermissionService;
import com.trainer.service.SchemaService;
import com.trainer.service.SolutionService;
import com.trainer.service.TaskService;
import com.trainer.service.TopicService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.security.access.annotation.Secured;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.trainer.security.Roles.ADMIN;
import static com.trainer.security.Roles.METHODIST;

@RestController
@RequestMapping("/api/task")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final SolutionService solutionService;
    private final TopicService topicService;
    private final SchemaService schemaService;
    private final PermissionService permissionService;

    @GetMapping("get")
    public Task get(@RequestParam Long id) {
        Task task = taskService.getById(id);
        permissionService.checkSeeTask(task);
        return task;
    }

    @GetMapping("getWithStudentSolution")
    public Task get(@RequestParam Long taskId,
                    @RequestParam Long studentId) {
        Task task = taskService.getById(taskId);
        Solution solution = solutionService.getStudentSolutionByTaskId(studentId, taskId);
        task.setSolutions(Collections.singleton(solution));
        return task;
    }

    @GetMapping("getInitialNodes")
    public Object getInitialNodes(@RequestParam Long id) {
        List<SolutionNode> resultNodes = new ArrayList<>();
        Set<SolutionLink> resultLinks = new HashSet<>();

        for(Solution solution : solutionService.getTaskSolutions(id)) {
            Schema schema = schemaService.getSolutionSchema(solution);

            schema.getNodes().forEach(node -> {
                boolean alreadyPresent = resultNodes.stream()
                    .anyMatch(solutionNode ->
                        solutionNode.getShape().equals(node.getShape()) && solutionNode.getText().equals(node.getText())
                    );

                if(!alreadyPresent) {
                    val solutionNode = new SolutionNode();
                    solutionNode.setText(StringUtils.trimWhitespace(node.getText()));
                    solutionNode.setShape(node.getShape());
                    solutionNode.setWidth(node.getSize().getWidth());
                    solutionNode.setHeight(node.getSize().getHeight());
                    resultNodes.add(solutionNode);
                }
            });

            schema.getLinks().stream()
                .map(link -> {
                    val solutionLink = new SolutionLink();
                    solutionLink.setText(link.getText());
                    solutionLink.setDirectionality(link.getDirectionality());
                    solutionLink.setLine(link.getLine());
                    return solutionLink;
                })
                .forEach(resultLinks::add);
        }

        val result = new HashMap<String, Object>();
        result.put("nodes", resultNodes);
        result.put("links", resultLinks);
        return result;
    }

    @Secured({ADMIN, METHODIST})
    @PostMapping("create")
    public Task create(@Valid @RequestBody Task task, Errors errors) {

        if (task.getTopic() == null || task.getTopic().getId() == null) {
            throw new TrainerException("Тема не найдена");
        }

        if (task.isManualEvaluation()) {
            task.getSolutions().clear();
        } else {
            validateSolutions(task);
        }

        if (errors.hasErrors()) {
            throw new TrainerException(errors);
        }


        Topic topic = topicService.getById(task.getTopic().getId());
        task.setTopic(topic);

        task.getSolutions().forEach(solution -> solution.setTask(task));

        return taskService.saveOrUpdate(task);
    }


    @Secured({ADMIN, METHODIST})
    @PostMapping("update")
    public Task update(@Valid @RequestBody Task command, Errors errors) {

        if (command.isManualEvaluation()) {
            command.getSolutions().clear();
        } else {
            validateSolutions(command);
        }

        if (errors.hasErrors()) {
            throw new TrainerException(errors);
        }

        Task task = taskService.getById(command.getId());
        task.setName(command.getName());
        task.setDescription(command.getDescription());
        task.setComplexity(command.getComplexity());
        task.setShouldComparePositionOnEvaluation(command.isShouldComparePositionOnEvaluation());
        task.setManualEvaluation(command.isManualEvaluation());

        Set<Solution> savedSolutions = task.getSolutions();
        savedSolutions.clear();
        savedSolutions.addAll(command.getSolutions()
                .stream()
                .peek(solution -> solution.setTask(task))
                .collect(Collectors.toList())
        );

        return taskService.saveOrUpdate(task);
    }

    @Secured({ADMIN, METHODIST})
    @PostMapping("delete")
    public void delete(@RequestBody Task task) {
        taskService.delete(task.getId());
    }

    private void validateSolutions(Task task) {
        Set<Solution> solutions = task.getSolutions();

        if (solutions.isEmpty()) {
            throw new TrainerException("Добавьте хотя бы одно решение");
        }

        if (solutions.stream().anyMatch(solution -> solution.getStudent() != null)) {
            throw new TrainerException("Вы не можете сохранять решения от имени студента");
        }

        if (solutions.stream().anyMatch(solution -> solution.getMark() == null)) {
            throw new TrainerException("Каждое решение должно иметь оценку");
        }

        if (solutions.size() > 5) {
            throw new TrainerException("Задание может содержать не более 5 вариантов решений");
        }
    }

    @Data
    private static class SolutionNode {

        private String text;

        private Node.Shape shape;

        private float width;

        private float height;
    }

    @Data
    private static class SolutionLink {

        private String text;

        private Link.Line line;

        private Link.Directionality directionality;
    }
}
