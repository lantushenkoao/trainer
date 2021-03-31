package com.trainer.schema;

import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.val;
import org.jgrapht.Graph;
import org.jgrapht.GraphMapping;
import org.jgrapht.alg.isomorphism.IsomorphismInspector;
import org.jgrapht.alg.isomorphism.VF2GraphIsomorphismInspector;
import org.jgrapht.graph.SimpleGraph;
import org.springframework.stereotype.Component;

@Component
public class GraphProcessorImpl implements GraphProcessor {

    private static final int COMPARE_NOT_EQUAL = 1;

    private static final int COMPARE_EQUAL = 0;

    private static final Comparator<Node> NODE_PROPS_COMPARATOR =
        Comparator.<Node, String>comparing(node -> node.getText().trim())
            .thenComparing(Node::getShape);

    private static final Comparator<Edge> EDGE_SOURCE_AND_TARGET_COMPARATOR =
        Comparator.comparing(Edge::getSource, NODE_PROPS_COMPARATOR)
            .thenComparing(Edge::getTarget, NODE_PROPS_COMPARATOR);

    @Override
    public boolean isEqualStructure(Schema left, Schema right) {
        return makeIsomorphismInspector(left, right).isomorphismExists();
    }

    @Override
    public Map<String, String> getNodesStructureMapping(Schema reference, Schema target) {
        val inspector = makeIsomorphismInspector(reference, target);
        GraphMapping<Vertex, Edge> mapping = inspector.getMappings().next();
        return reference.getNodes().stream()
            .collect(Collectors.toMap(
                Node::getId,
                node -> mapping.getVertexCorrespondence(new Vertex(node), true).node.getId()
            ));
    }

    private IsomorphismInspector<Vertex, Edge> makeIsomorphismInspector(Schema left, Schema right) {
        return new VF2GraphIsomorphismInspector<>(
            makeGraph(left),
            makeGraph(right),
            GraphProcessorImpl::vertexComparator,
            GraphProcessorImpl::edgeComparator
        );
    }

    private Graph<Vertex, Edge> makeGraph(Schema schema) {
        Map<String, Node> nodes = schema.getNodes().stream()
            .collect(Collectors.toMap(Node::getId, Function.identity()));

        SimpleGraph<Vertex, Edge> graph = new SimpleGraph<>(Edge.class);
        schema.getNodes().forEach(node -> graph.addVertex(new Vertex(node)));
        schema.getLinks().forEach(link -> {
            Vertex source = new Vertex(nodes.get(link.getSourceNodeId()));
            Vertex target = new Vertex(nodes.get(link.getTargetNodeId()));
            graph.addEdge(source, target, new ExplicitEdge(link, source.node, target.node));
        });

        Map<String, Set<String>> nodesAdjacency = new HashMap<>();
        schema.getLinks().forEach(link -> {
            markNodesAsAdjacent(nodesAdjacency, link.getSourceNodeId(), link.getTargetNodeId());
        });

        schema.getNodes().forEach(possibleSource -> {
            schema.getNodes().forEach(possibleTarget -> {
                boolean linkAlreadyExists = nodesAdjacency.getOrDefault(possibleSource.getId(), Collections.emptySet())
                    .contains(possibleTarget.getId());

                if (!possibleSource.getId().equals(possibleTarget.getId())
                    && !linkAlreadyExists
                    && isNodePositionedInsideAnother(possibleSource, possibleTarget)
                ) {
                    graph.addEdge(
                        new Vertex(possibleSource), new Vertex(possibleTarget),
                        new ImplicitEdge(possibleSource, possibleTarget)
                    );
                    markNodesAsAdjacent(nodesAdjacency, possibleSource.getId(), possibleTarget.getId());
                }
            });
        });

        return graph;
    }

    private static void markNodesAsAdjacent(Map<String, Set<String>> adjacency, String nodeOneId, String nodeTwoId) {
        adjacency.computeIfAbsent(nodeOneId, k -> new HashSet<>()).add(nodeTwoId);
        adjacency.computeIfAbsent(nodeTwoId, k -> new HashSet<>()).add(nodeOneId);
    }

    private static boolean isNodePositionedInsideAnother(Node inner, Node outer) {
        Point innerRightBottom = calculateRectRightBottomCorner(inner.getPosition(), inner.getSize());
        Point outerRightBottom = calculateRectRightBottomCorner(outer.getPosition(), outer.getSize());

        return outer.getPosition().getX() < inner.getPosition().getX()
            && outer.getPosition().getY() < inner.getPosition().getY()
            && innerRightBottom.getX() < outerRightBottom.getX()
            && innerRightBottom.getY() < outerRightBottom.getY();
    }

    private static Point calculateRectRightBottomCorner(Point topLeft, Size size) {
        return new Point(
            topLeft.getX() + size.getWidth(),
            topLeft.getY() + size.getHeight()
        );
    }

    private static int vertexComparator(Vertex left, Vertex right) {
        return NODE_PROPS_COMPARATOR.compare(left.node, right.node);
    }

    private static int edgeComparator(Edge left, Edge right) {
        if (left.getClass().equals(right.getClass())) {
            if(left instanceof ExplicitEdge) {
                return explicitEdgeComparator((ExplicitEdge) left, (ExplicitEdge) right);
            } else {
                return EDGE_SOURCE_AND_TARGET_COMPARATOR.compare(left, right);
            }
        } else {
            return COMPARE_NOT_EQUAL;
        }
    }

    private static int explicitEdgeComparator(ExplicitEdge left, ExplicitEdge right) {
        Comparator<Link> linkPropsComparator = Comparator.<Link, String>comparing(link -> link.getText().trim())
            .thenComparing(Link::getLine)
            .thenComparing(Link::getDirectionality);

        return Comparator.<ExplicitEdge, Link>comparing(edge -> edge.link, linkPropsComparator)
            .thenComparing((leftEdge, rightEdge) -> {
                Link.Directionality directionality = leftEdge.link.getDirectionality();

                if(directionality == Link.Directionality.DIRECTED) {
                    return EDGE_SOURCE_AND_TARGET_COMPARATOR.compare(leftEdge, rightEdge);
                } else {
                    boolean isEqualSetOfVertexes = (
                        NODE_PROPS_COMPARATOR.compare(leftEdge.source, rightEdge.source) == COMPARE_EQUAL
                        && NODE_PROPS_COMPARATOR.compare(leftEdge.target, rightEdge.target) == COMPARE_EQUAL
                    ) || (
                        NODE_PROPS_COMPARATOR.compare(leftEdge.source, rightEdge.target) == COMPARE_EQUAL
                        && NODE_PROPS_COMPARATOR.compare(leftEdge.target, rightEdge.source) == COMPARE_EQUAL
                    );
                    return isEqualSetOfVertexes ? COMPARE_EQUAL : COMPARE_NOT_EQUAL;
                }
            })
            .compare(left, right);
    }

    @AllArgsConstructor
    private static class Vertex {

        private final Node node;

        @Override
        public int hashCode() {
            return Objects.hash(node.getId());
        }

        @Override
        public boolean equals(Object o) {
            return o != null && o.getClass().equals(getClass())
                && Objects.equals(((Vertex) o).node.getId(), node.getId());
        }
    }

    private interface Edge {

        Node getSource();

        Node getTarget();
    }

    @Getter
    @AllArgsConstructor
    private static class ExplicitEdge implements Edge {

        private final Link link;

        private final Node source;

        private final Node target;

        @Override
        public int hashCode() {
            return Objects.hash(link.getId());
        }

        @Override
        public boolean equals(Object o) {
            return o != null && o.getClass().equals(getClass())
                && Objects.equals(((ExplicitEdge)o).link.getId(), link.getId());
        }
    }

    @Getter
    @AllArgsConstructor
    private static class ImplicitEdge implements Edge {

        private final Node source;

        private final Node target;

        @Override
        public int hashCode() {
            return Objects.hash(source.getId(), target.getId());
        }

        @Override
        public boolean equals(Object o) {
            if(o != null && o.getClass().equals(getClass())) {
                ImplicitEdge other = (ImplicitEdge) o;
                return other.source.getId().equals(source.getId())
                    && other.target.getId().equals(target.getId());
            } else {
                return false;
            }
        }
    }
}
