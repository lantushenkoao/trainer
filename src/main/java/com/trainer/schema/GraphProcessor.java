package com.trainer.schema;

import java.util.Map;

public interface GraphProcessor {

    boolean isEqualStructure(Schema left, Schema right);

    Map<String, String> getNodesStructureMapping(Schema reference, Schema target);
}
