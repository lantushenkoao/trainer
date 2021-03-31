package com.trainer.schema;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class Node {
    
    public enum Shape {
        SQUARE_RECT,
        ROUND_RECT,
        RHOMBUS,
        ROUND,
        DOCUMENT,
        PARALLELOGRAM,
        TRIANGLE,
        PENTAGON,
        CARD,
        TRAPEZOID
    }

    @JsonCreator
    public Node(
        @JsonProperty("x") float x, @JsonProperty("y") float y,
        @JsonProperty("width") float width, @JsonProperty("height") float height
    ) {
        position = new Point(x, y);
        size = new Size(width, height);
    }

    private String id;

    private String text;

    private Shape shape;

    private Size size;

    private Point position;
}
