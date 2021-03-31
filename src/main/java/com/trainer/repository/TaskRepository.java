package com.trainer.repository;

import com.trainer.model.Task;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @EntityGraph(value = "Task.solutions", type = EntityGraph.EntityGraphType.FETCH)
    Optional<Task> findById(Long id);

}
