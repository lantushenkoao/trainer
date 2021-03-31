package com.trainer.repository;

import com.trainer.model.Solution;
import com.trainer.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolutionRepository extends JpaRepository<Solution, Long> {

    List<Solution> findAllByTaskIdAndStudentIsNull(Long taskId);

    @EntityGraph(value = "Solution.students", type = EntityGraph.EntityGraphType.FETCH)
    Optional<Solution> findById(Long id);

    @EntityGraph(value = "Solution.students", type = EntityGraph.EntityGraphType.FETCH)
    Solution findByStudentIdAndTaskIdAndStudentIdIsNotNull(Long studentId, Long taskId);

    @EntityGraph(value = "Solution.students", type = EntityGraph.EntityGraphType.FETCH)
    List<Solution> findAllByTaskIdAndStudentIdIsNotNull(Long taskId);
}