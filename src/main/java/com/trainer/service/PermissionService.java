package com.trainer.service;

import com.trainer.exception.TrainerException;
import com.trainer.model.Solution;
import com.trainer.model.Task;
import com.trainer.model.Topic;
import com.trainer.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.validation.Valid;
import java.util.Set;

import static com.trainer.security.Roles.ADMIN;
import static com.trainer.security.Roles.METHODIST;
import static com.trainer.security.Roles.STUDENT;

@Service
public class PermissionService {

    @Value("${task.complete.minMark}")
    private int minSuccessMark;

    @Autowired
    private UserService userService;

    public void checkSeeTask(Task task) {
        if (!canSeeTask(task)) {
            throw new TrainerException("Вы не можете просматривать это задание");
        }
    }

    public boolean canSeeTask(Task task) {
        if (!isStudent()) {
            return true;
        }

        Task prevTask = task.getTopic().getTasks()
                .stream()
                .filter(t -> t.getIndex() == task.getIndex() - 1)
                .findFirst()
                .orElse(null);
        return prevTask == null || isCompleted(prevTask);
    }

    private boolean isCompleted(Task task) {
        return task.getSolutions()
                .stream()
                .anyMatch(solution -> solution.getMark() >= minSuccessMark);
    }

    public void checkEditSolution(Solution solution) {
        if (!canEditSolution(solution)) {
            throw new TrainerException("У вас нет прав на редактирование этого решения");
        }
    }

    public boolean canEditSolution(Solution solution) {
        User currentUser = userService.getCurrentUser();
        return isStudent(currentUser)
                ? solution.getStudent() != null && currentUser.getId().equals(solution.getStudent().getId())
                : solution.getStudent() == null;
    }

    public void checkEditUser(User user) {
        if (!canEditUser(user)) {
            throw new TrainerException("У вас нет прав на редактирование этого пользователя");
        }
    }

    public boolean canEditUser(User editUser) {
        User currentUser = userService.getCurrentUser();
        return editUser.getId().equals(currentUser.getId()) || isAdmin();

    }

    public void checkSeeStudentSolutions(Long studentId) {
        if (!canSeeStudentSolutions(studentId)) {
            throw new TrainerException("У вас нет прав для просмотра решений этого пользователя");
        }
    }

    public boolean canSeeStudentSolutions(Long studentId) {
        return userService.getCurrentUser().getId().equals(studentId) || !isStudent();
    }

    public boolean isAdmin() {
        return isAdmin(userService.getCurrentUser());
    }

    public boolean isAdmin(User user) {
        return hasRole(user, ADMIN);
    }

    public boolean isMethodist() {
        return isMethodist(userService.getCurrentUser());
    }

    public boolean isMethodist(User user) {
        return hasRole(user, METHODIST);
    }

    public boolean isStudent(User user) {
        return hasRole(user, STUDENT);
    }

    public boolean isStudent() {
        return isStudent(userService.getCurrentUser());
    }

    private boolean hasRole(User user, String expectedRoleName) {
        return user.getRoles()
                .stream()
                .anyMatch(role -> role.getName().equals(expectedRoleName));
    }
}
