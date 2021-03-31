package com.trainer.model;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.Where;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Set;


@Entity
@Table(name = "topics")
@Getter
@Setter
@Where(clause = "is_deleted = 0")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Formula(value = "(SELECT COUNT(*) " +
                     "FROM topics t " +
                     "WHERE t.id <= id " +
                     "AND t.is_deleted = 0)")
    private int index;

    @NotBlank(message = "Добавьте название")
    @Size(max = 100, message = "Название должно содержать не более {max} символов")
    private String name;

    @NotBlank(message = "Добавьте описание")
    @Size(max = 500, message = "Описание должно содержать не более {max} символов")
    private String description;

    @OneToMany(mappedBy = "topic", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @OrderBy("complexity, id")
    private Set<Task> tasks;

    private boolean isDeleted;

}
