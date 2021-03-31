package com.trainer.schema;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class Link {

    public enum Line {
        SOLID,
        DASHED
    }

    public enum Directionality {
        UNDIRECTED,
        DIRECTED,
        BIDIRECTED
    }

    private String id;


    @JsonProperty("source")
    private String sourceNodeId;

    @JsonProperty("target")
    private String targetNodeId;

    private String text;

    private Line line;

    private Directionality directionality;
}
