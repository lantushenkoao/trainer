package com.trainer.service;

import com.trainer.exception.TrainerException;
import com.trainer.model.Solution;
import com.trainer.model.Task;
import com.trainer.model.User;
import com.trainer.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final UserService userService;
    private final EntityManager entityManager;
    private final TaskRepository taskRepository;
    private final SolutionService solutionService;
    private final PermissionService permissionService;

    public Task getById(Long id) {
        applySolutionsFilter(userService.getCurrentUser());
        return taskRepository.findById(id)
                .orElseThrow(() -> new TrainerException("Задание не найдено"));
    }

    public Task saveOrUpdate(Task task) {
        if (task.getId() != null) {
            List<Solution> allStudentSolutions = solutionService.getAllStudentSolutionsByTaskId(task.getId());
            task.getSolutions().addAll(allStudentSolutions);
        }
        return taskRepository.save(task);
    }

    public void delete(Long id) {
        Task task = getById(id);
        task.setDeleted(true);
        saveOrUpdate(task);
    }

    public void applySolutionsFilter(User user) {
        Session session = entityManager.unwrap(Session.class);

        if (permissionService.isStudent(user)) {
            session.enableFilter("currentStudentSolution")
                    .setParameter("studentId", user.getId());
        } else {
            session.enableFilter("taskSolutions");
        }
    }

}
