package com.trainer.schema;

import java.util.List;

import lombok.Data;

@Data
public class Schema {

    private List<Node> nodes;

    private List<Link> links;
}
