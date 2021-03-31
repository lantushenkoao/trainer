package com.trainer.service;

import com.trainer.exception.TrainerException;
import com.trainer.model.Solution;
import com.trainer.repository.SolutionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class SolutionService {

    private final SolutionRepository solutionRepository;
    private final PermissionService permissionService;
    private final SolutionEvaluator solutionEvaluator;


    public Solution getById(Long id) {
        return solutionRepository.findById(id).orElseThrow(() -> new TrainerException("Решение не найдено"));
    }

    public List<Solution> getTaskSolutions(Long taskId) {
        return solutionRepository.findAllByTaskIdAndStudentIsNull(taskId);
    }

    public Solution getStudentSolutionByTaskId(Long studentId, Long taskId) {
        return solutionRepository.findByStudentIdAndTaskIdAndStudentIdIsNotNull(studentId, taskId);
    }

    public List<Solution> getAllStudentSolutionsByTaskId(Long taskId) {
        return solutionRepository.findAllByTaskIdAndStudentIdIsNotNull(taskId);
    }

    public List<Solution> getByTaskId(Long taskId) {
        return solutionRepository.findAllByTaskIdAndStudentIsNull(taskId);
    }

    public Solution saveOrUpdate(Solution solution) {
        if (permissionService.isStudent()) {
            solution.setMark(calculateResultMark(solution));
        }
        return solutionRepository.save(solution);
    }

    public void delete(Long solutionId) {
        solutionRepository.deleteById(solutionId);
    }

    private Integer calculateResultMark(Solution solution) {
        if (solution.getTask().isManualEvaluation()) {
            return null;
        }
        List<Solution> solutions = getByTaskId(solution.getTask().getId());
        return solutionEvaluator.calculateMark(solution, solutions);
    }
}
