package com.trainer.service;

import java.util.Collection;
import java.util.DoubleSummaryStatistics;
import java.util.Map;
import java.util.stream.Collectors;

import com.trainer.model.Solution;
import com.trainer.schema.GraphProcessor;
import com.trainer.schema.Node;
import com.trainer.schema.Point;
import com.trainer.schema.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class SolutionEvaluator {

    private static final float MAX_DISTANCE_IN_NORMALIZED_SPACE = 0.3f;

    @Autowired
    private final SchemaService schemaService;

    @Autowired
    private final GraphProcessor graphProcessor;

    public int calculateMark(Solution solutionToEvaluate, Collection<Solution> referenceSolutions) {
        return referenceSolutions.stream()
            .filter(referenceSolution -> {
                Schema reference = schemaService.getSolutionSchema(referenceSolution);
                Schema schemaToEvaluate = schemaService.getSolutionSchema(solutionToEvaluate);
                if (graphProcessor.isEqualStructure(reference, schemaToEvaluate)) {
                    return solutionToEvaluate.getTask().isShouldComparePositionOnEvaluation()
                        ? isNodesPositionCorrect(reference, schemaToEvaluate)
                        : true;
                } else {
                    return false;
                }
            })
            .findFirst()
            .map(Solution::getMark)
            .orElse(0);
    }

    private boolean isNodesPositionCorrect(Schema reference, Schema evaluated) {
        Map<String, String> mapping = graphProcessor.getNodesStructureMapping(reference, evaluated);
        Map<String, Point> referencePositions = calcNormalizedPositions(reference);
        Map<String, Point> evaluatedSchema = calcNormalizedPositions(evaluated);

        return reference.getNodes().stream()
            .allMatch(referenceNode -> {
                Point referencePosition = referencePositions.get(referenceNode.getId());
                Point evaluatedPosition = evaluatedSchema.get(mapping.get(referenceNode.getId()));
                return calcDistance(referencePosition, evaluatedPosition) < MAX_DISTANCE_IN_NORMALIZED_SPACE;
            });
    }

    private Map<String, Point> calcNormalizedPositions(Schema schema) {
        DoubleSummaryStatistics xStats = schema.getNodes().stream()
            .mapToDouble(node -> node.getPosition().getX())
            .summaryStatistics();

        DoubleSummaryStatistics yStats = schema.getNodes().stream()
            .mapToDouble(node -> node.getPosition().getY())
            .summaryStatistics();

        return schema.getNodes().stream()
            .collect(Collectors.toMap(
                Node::getId,
                node -> new Point(
                    normalize(node.getPosition().getX(), (float) xStats.getMin(), (float) xStats.getMax()),
                    normalize(node.getPosition().getY(), (float) yStats.getMin(), (float) yStats.getMax())
                )));
    }

    private static float normalize(float value, float min, float max) {
        return (value - min) / (max - min);
    }

    private float calcDistance(Point a, Point b) {
        return (float) Math.sqrt(
            Math.pow(a.getX() - b.getX(), 2)
            + Math.pow(a.getY() - b.getY(), 2)
        );
    }

}
