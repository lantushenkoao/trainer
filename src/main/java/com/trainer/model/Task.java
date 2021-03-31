package com.trainer.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.trainer.validation.PlainTextLength;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.Where;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedAttributeNode;
import javax.persistence.NamedEntityGraph;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.Set;

import static com.fasterxml.jackson.annotation.JsonProperty.Access;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NamedEntityGraph(name = "Task.solutions", attributeNodes = @NamedAttributeNode("solutions"))
@Where(clause = "is_deleted = 0")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Formula(value = "(SELECT COUNT(*) " +
                     "FROM tasks t " +
                     "WHERE t.topic_id = topic_id " +
                     "AND t.is_deleted = 0 " +
                     "AND (t.complexity < complexity OR (t.complexity = complexity AND t.id <= id)))")
    private int index;

    @NotBlank(message = "Добавьте название")
    @Size(max = 100, message = "Название должно содержать не более {max} символов")
    private String name;

    @NotBlank(message = "Добавьте описание")
    @PlainTextLength(min = 1, max = 5000, message = "Описание должно быть от {min} до {max} сиимволов")
    private String description;

    @Min(value = 1, message = "Сложность должна быть от 1 до 10")
    @Max(value = 10, message = "Сложность должна быть от 1 до 10")
    private int complexity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    @JsonProperty(access = Access.WRITE_ONLY)
    protected Topic topic;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @Filter(name = "currentStudentSolution", condition = "student_id = :studentId")
    @Filter(name = "taskSolutions", condition = "student_id is NULL")
    @OrderBy("id")
    @Valid
    private Set<Solution> solutions;

    private boolean isDeleted;

    @Column(name = "should_compare_position_on_evaluation")
    private boolean shouldComparePositionOnEvaluation;

    private boolean manualEvaluation;

}
