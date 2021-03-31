package com.trainer.controller;

import com.trainer.exception.TrainerException;
import com.trainer.model.Solution;
import com.trainer.model.Task;
import com.trainer.service.PermissionService;
import com.trainer.service.SolutionService;
import com.trainer.service.TaskService;
import com.trainer.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
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
import java.util.Objects;

import static com.trainer.security.Roles.ADMIN;
import static com.trainer.security.Roles.METHODIST;

@RestController
@RequestMapping("/api/solution")
@RequiredArgsConstructor
public class SolutionController {

    private final UserService userService;
    private final SolutionService solutionService;
    private final PermissionService permissionService;
    private final TaskService taskService;

    @Secured({ADMIN, METHODIST})
    @GetMapping(value = "get", params = {"taskId"})
    public List<Solution> getSolutions(@RequestParam Long taskId) {
        return solutionService.getByTaskId(taskId);
    }

    @GetMapping(value = "get", params = {"studentId", "taskId"})
    public Solution getStudentSolution(@RequestParam Long studentId, @RequestParam Long taskId) {
        permissionService.checkSeeStudentSolutions(studentId);
        return solutionService.getStudentSolutionByTaskId(studentId, taskId);
    }

    @PostMapping(value = "create")
    public Solution create(@Valid @RequestBody Solution solution, Errors errors) {

        if (errors.hasErrors()) {
            throw new TrainerException(errors);
        }

        solution.setStudent(permissionService.isStudent()
                ? userService.getCurrentUser()
                : null);

        Task task = taskService.getById(solution.getTask().getId());
        solution.setTask(task);

        return solutionService.saveOrUpdate(solution);
    }

    @PostMapping(value = "update")
    public Solution update(@RequestBody Solution solution) {

        Solution originalSolution = solutionService.getById(solution.getId());

        permissionService.checkEditSolution(originalSolution);

        originalSolution.setData(solution.getData());

        return solutionService.saveOrUpdate(originalSolution);
    }

    @Secured({ADMIN})
    @PostMapping(value = "evaluate")
    public Solution update(@RequestBody EvaluateSolutionCommand command) {

        Solution solution = solutionService.getById(command.solutionId);

        if (!solution.getTask().isManualEvaluation()) {
            throw new TrainerException("Невозможно сохранить оценку, т.к. решения к этому заданию оцениваются в" +
                    "автоматическом режиме");
        }

        solution.setMark(command.mark);

        return solutionService.saveOrUpdate(solution);
    }

    @Data
    private static class EvaluateSolutionCommand {
        private Long solutionId;
        private Integer mark;
    }

    @Secured({ADMIN, METHODIST})
    @PostMapping(value = "delete")
    public void delete(@RequestBody Solution solution) {
        solutionService.delete(solution.getId());
    }

}