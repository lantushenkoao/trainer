package com.trainer.service;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.willReturn;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.concurrent.atomic.AtomicInteger;

import com.trainer.model.Solution;
import com.trainer.model.Task;
import com.trainer.schema.GraphProcessorImpl;
import com.trainer.schema.Link;
import com.trainer.schema.Link.Directionality;
import com.trainer.schema.Node;
import com.trainer.schema.Point;
import com.trainer.schema.Schema;
import com.trainer.schema.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.val;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.StrictStubs.class)
public class SolutionEvaluatorTest {

    private interface TestData {

        int REFERENCE_SOLUTION_1_MARK = 3;

        Point POINT_10_10 = new Point(10, 10);

        Point POINT_20_20 = new Point(20, 20);

        Point POINT_50_50 = new Point(50, 50);

        Point POINT_40_40 = new Point(40, 40);

        Point POINT_50_10 = new Point(50, 10);

        Point POINT_100_100 = new Point(100, 100);

        Size SIZE_10_10 = new Size(10, 10);

        Size SIZE_40_40 = new Size(40, 40);
    }

    @Mock
    private Solution solutionToEvaluate;

    @Mock
    private Solution referenceSolution1;

    @Mock
    private Task task;

//    private Solution referenceSolution2;

    private Schema schemaToEvaluate = makeEmptySchema();

    private Schema referenceSchema1 = makeEmptySchema();

//    private Schema referenceSchema2 = makeEmptySchema();

    @Mock
    private SchemaService schemaService;

    private SolutionEvaluator solutionEvaluator;

    private AtomicInteger idGenerator = new AtomicInteger();

    @Before
    public void before() {
        solutionEvaluator = new SolutionEvaluator(schemaService, new GraphProcessorImpl());

        willReturn(schemaToEvaluate).given(schemaService).getSolutionSchema(solutionToEvaluate);
        willReturn(referenceSchema1).given(schemaService).getSolutionSchema(referenceSolution1);
        willReturn(task).given(solutionToEvaluate).getTask();

        willReturn(TestData.REFERENCE_SOLUTION_1_MARK).given(referenceSolution1).getMark();
    }

    @Test
    public void testEqualNodes_solutionMatched() throws Exception {
        String text = "text";
        givenSchemaNodes(schemaToEvaluate, makeRectNode(text));
        givenSchemaNodes(referenceSchema1, makeRectNode(text));
        thenSolutionMatched();
    }

    @Test
    public void testDifferentNodeTexts_solutionNotMatched() throws Exception {
        givenSchemaNodes(schemaToEvaluate, makeRectNode("1"));
        givenSchemaNodes(referenceSchema1, makeRectNode("2"));
        thenSolutionNotMatched(referenceSolution1);
    }


    @Test
    public void testDifferentNodeShapes_solutionNotMatched() throws Exception {
        String text = "text";
        givenSchemaNodes(schemaToEvaluate, makeNode(text, Node.Shape.SQUARE_RECT));
        givenSchemaNodes(referenceSchema1, makeNode(text, Node.Shape.DOCUMENT));
        thenSolutionNotMatched(referenceSolution1);
    }

    @Test
    public void testMultipleNodesWithEqualProperties_solutionMatched() throws Exception {
        String text = "text";
        givenSchemaNodes(schemaToEvaluate, makeRectNode(text), makeRectNode(text));
        givenSchemaNodes(referenceSchema1, makeRectNode(text), makeRectNode(text));
        thenSolutionMatched();
    }

    @Test
    public void testMultipleNodesWithEqualPropertiesButDifferentInstanceCount_solutionNotMatched() throws Exception {
        String text = "text";
        givenSchemaNodes(schemaToEvaluate, makeRectNode(text), makeRectNode(text));
        givenSchemaNodes(referenceSchema1, makeRectNode(text));
        thenSolutionNotMatched(referenceSolution1);
    }
    
    @Test
    public void testEqualNodesConnectedWithEqualDirectedLink_solutionMatched() throws Exception {
        String text = "text";
        givenSchemaNodesAndLinks(schemaToEvaluate,
            makeRectNode(text), makeSolidDirectedLink(text), makeRectNode(text));
        givenSchemaNodesAndLinks(referenceSchema1,
            makeRectNode(text), makeSolidDirectedLink(text), makeRectNode(text));
        thenSolutionMatched();
    }

    @Test
    public void testEqualNodesConnectedWithLinkWithDifferentText_solutionMatched() throws Exception {
        String text1 = "text1";
        String text2 = "text2";
        givenSchemaNodesAndLinks(schemaToEvaluate,
            makeRectNode(text1), makeSolidDirectedLink(text1), makeRectNode(text1));
        givenSchemaNodesAndLinks(referenceSchema1,
            makeRectNode(text1), makeSolidDirectedLink(text2), makeRectNode(text1));
        thenSolutionNotMatched(referenceSolution1);
    }

    @Test
    public void testEqualNodesConnectedWithLinkWithDifferentDirectionality_solutionMatched() throws Exception {
        String text = "text";
        givenSchemaNodesAndLinks(schemaToEvaluate,
            makeRectNode(text), makeSolidLink(text, Directionality.DIRECTED), makeRectNode(text));
        givenSchemaNodesAndLinks(referenceSchema1,
            makeRectNode(text), makeSolidLink(text, Directionality.UNDIRECTED), makeRectNode(text));
        thenSolutionNotMatched(referenceSolution1);
    }

    @Test
    public void testEqualNodesConnectedWithLinkWithDifferentLine_solutionMatched() throws Exception {
        String text = "text";
        Link dashedLink = makeSolidDirectedLink(text);
        dashedLink.setLine(Link.Line.DASHED);

        givenSchemaNodesAndLinks(schemaToEvaluate,
            makeRectNode(text), dashedLink, makeRectNode(text));
        givenSchemaNodesAndLinks(referenceSchema1,
            makeRectNode(text), makeSolidDirectedLink(text), makeRectNode(text));
        thenSolutionNotMatched(referenceSolution1);
    }

    @Test
    public void testEqualNodesConnectedWithEqualDirectedLinkWithFlippedSourceAndTarget_solutionNotMatched() throws Exception {
        String sourceText = "source";
        String targetText= "target";
        String link = "link";

        givenSchemaNodesAndLinks(schemaToEvaluate,
            makeRectNode(sourceText), makeSolidDirectedLink(link), makeRectNode(targetText));
        givenSchemaNodesAndLinks(referenceSchema1,
            makeRectNode(targetText), makeSolidDirectedLink(link), makeRectNode(sourceText));
        thenSolutionNotMatched(referenceSolution1);
    }

    @Test
    public void testEqualNodesConnectedWithEqualUndirectedLinkHavingSourceAndTargetFlipped_solutionMatched() throws Exception {
        String sourceText = "source";
        String targetText= "target";
        String link = "link";

        givenSchemaNodesAndLinks(schemaToEvaluate,
            makeRectNode(sourceText), makeSolidLink(link, Directionality.UNDIRECTED), makeRectNode(targetText));
        givenSchemaNodesAndLinks(referenceSchema1,
            makeRectNode(targetText), makeSolidLink(link,Directionality.UNDIRECTED), makeRectNode(sourceText));
        thenSolutionMatched();
    }

    @Test
    public void testEqualNodesWithAbsentLinkInEvaluatedSolution_solutionNotMatched() throws Exception {
        String text = "text";

        givenSchemaNodes(schemaToEvaluate, makeRectNode(text), makeRectNode(text));

        Node source = makeRectNode(text);
        Node target = makeRectNode(text);
        givenSchemaNodes(referenceSchema1, source, target);
        givenSchemaLink(referenceSchema1, source, makeSolidDirectedLink(text), target);

        thenSolutionNotMatched(referenceSolution1);
    }

    @Test
    public void testEqualNodesWithDifferentNodesLinked_solutionNotMatched() throws Exception {
        String text = "text";
        String first = "first";
        String second = "second";
        String third = "third";

        givenSchemaNodes(referenceSchema1, makeRectNode(third));
        givenSchemaNodesAndLinks(referenceSchema1,
            makeRectNode(first), makeSolidDirectedLink(text), makeRectNode(second));

        givenSchemaNodes(schemaToEvaluate, makeRectNode(first));
        givenSchemaNodesAndLinks(schemaToEvaluate,
            makeRectNode(second), makeSolidDirectedLink(text), makeRectNode(third));

        thenSolutionNotMatched(referenceSolution1);
    }

    @Test
    public void testThreeEqualNodesConnectedWithEqualLinks_solutionMatched() throws Exception {
        String text = "text";
        String first = "first";
        String second = "second";
        String third = "third";

        {
            Node firstNode = makeRectNode(first);
            Node secondNode = makeRectNode(second);
            Node thirdNode = makeRectNode(third);
            givenSchemaNodes(referenceSchema1, firstNode, secondNode, thirdNode);
            givenSchemaLink(referenceSchema1, firstNode, makeSolidDirectedLink(text), secondNode);
            givenSchemaLink(referenceSchema1, secondNode, makeSolidDirectedLink(text), thirdNode);
            givenSchemaLink(referenceSchema1, thirdNode, makeSolidDirectedLink(text), firstNode);
        }

        {
            Node firstNode = makeRectNode(first);
            Node secondNode = makeRectNode(second);
            Node thirdNode = makeRectNode(third);
            givenSchemaNodes(schemaToEvaluate, firstNode, secondNode, thirdNode);
            givenSchemaLink(schemaToEvaluate, firstNode, makeSolidDirectedLink(text), secondNode);
            givenSchemaLink(schemaToEvaluate, secondNode, makeSolidDirectedLink(text), thirdNode);
            givenSchemaLink(schemaToEvaluate, thirdNode, makeSolidDirectedLink(text), firstNode);
        }

        thenSolutionMatched();
    }

    @Test
    public void testEqualNodesWithEqualLinksButDifferentStructure_solutionNotMatched() throws Exception {
        String text = "text";
        String first = "first";
        String second = "second";

        givenSchemaNodesAndLinks(referenceSchema1,
            makeRectNode(second), makeSolidDirectedLink(text), makeRectNode(first));
        givenSchemaNodesAndLinks(referenceSchema1,
            makeRectNode(second), makeSolidDirectedLink(text), makeRectNode(first));

        {
            Node firstA = makeRectNode(first);
            Node firstB = makeRectNode(first);
            Node secondA = makeRectNode(second);
            Node secondB = makeRectNode(second);

            givenSchemaNodes(schemaToEvaluate, firstA, firstB, secondA, secondB);
            givenSchemaLink(schemaToEvaluate,
                secondA, makeSolidDirectedLink(text), firstA);
            givenSchemaLink(schemaToEvaluate,
                secondA, makeSolidDirectedLink(text), firstB);
        }

        thenSolutionNotMatched(referenceSolution1);
    }

    @Test
    public void testEqualNodesWithEqualLinksAndSamePositioning_solutionMatched() throws Exception {
        givenTaskRequiresPositionMatch(true);

        val reference = givenTwoNodesAndLinkSchema(referenceSchema1);
        reference.source.setPosition(TestData.POINT_10_10);
        reference.target.setPosition(TestData.POINT_50_50);

        val evaluated = givenTwoNodesAndLinkSchema(schemaToEvaluate);
        evaluated.source.setPosition(TestData.POINT_10_10);
        evaluated.target.setPosition(TestData.POINT_50_50);

        thenSolutionMatched();
    }

    @Test
    public void testEqualNodesWithEqualLinksAndSimilarPositioning_solutionMatched() throws Exception {
        givenTaskRequiresPositionMatch(true);

        val reference = givenTwoNodesAndLinkSchema(referenceSchema1);
        reference.source.setPosition(TestData.POINT_10_10);
        reference.target.setPosition(TestData.POINT_50_50);

        val evaluated = givenTwoNodesAndLinkSchema(schemaToEvaluate);
        evaluated.source.setPosition(TestData.POINT_10_10);
        evaluated.target.setPosition(TestData.POINT_40_40);

        thenSolutionMatched();
    }

    @Test
    public void testEqualNodesWithEqualLinksButDifferentPositioning_solutionNotMatched() throws Exception {
        givenTaskRequiresPositionMatch(true);

        val reference = givenTwoNodesAndLinkSchema(referenceSchema1);
        reference.source.setPosition(TestData.POINT_10_10);
        reference.target.setPosition(TestData.POINT_50_50);

        val evaluated = givenTwoNodesAndLinkSchema(schemaToEvaluate);
        evaluated.source.setPosition(TestData.POINT_10_10);
        evaluated.target.setPosition(TestData.POINT_50_10);

        thenSolutionNotMatched(referenceSolution1);
    }
    
    @Test
    public void test_implicitRelationships_EqualNodes_positionedOneOnTopAnother_solutionMatched() throws Exception {
        String textA = "textA";
        String textB = "textB";

        {
            Node a = makeRectNode(textA);
            a.setPosition(TestData.POINT_10_10);
            a.setSize(TestData.SIZE_40_40);
            Node b = makeRectNode(textB);
            b.setPosition(TestData.POINT_20_20);
            b.setSize(TestData.SIZE_10_10);
            givenSchemaNodes(referenceSchema1, a, b);
        }

        {
            Node a = makeRectNode(textA);
            a.setPosition(TestData.POINT_10_10);
            a.setSize(TestData.SIZE_40_40);
            Node b = makeRectNode(textB);
            b.setPosition(TestData.POINT_20_20);
            b.setSize(TestData.SIZE_10_10);
            givenSchemaNodes(schemaToEvaluate, a, b);
        }

        thenSolutionMatched();
    }

    @Test
    public void test_implicitRelationships_EqualNodes_positionedOneOnTopAnotherInReferenceSolution_solutionNotMatched() throws Exception {
        String textA = "textA";
        String textB = "textB";

        {
            Node a = makeRectNode(textA);
            a.setPosition(TestData.POINT_10_10);
            a.setSize(TestData.SIZE_40_40);
            Node b = makeRectNode(textB);
            b.setPosition(TestData.POINT_20_20);
            b.setSize(TestData.SIZE_10_10);
            givenSchemaNodes(referenceSchema1, a, b);
        }

        {
            Node a = makeRectNode(textA);
            a.setPosition(TestData.POINT_20_20);
            a.setSize(TestData.SIZE_40_40);
            Node b = makeRectNode(textB);
            b.setPosition(TestData.POINT_10_10);
            b.setSize(TestData.SIZE_10_10);
            givenSchemaNodes(schemaToEvaluate, a, b);
        }

        thenSolutionNotMatched();
    }

    private TwoNodesAndLinkSchema givenTwoNodesAndLinkSchema(Schema schema) {
        String text = "text";
        Node source = makeRectNode(text);
        Node target = makeRectNode(text);
        Link link = makeSolidDirectedLink(text);
        givenSchemaNodesAndLinks(schema, source, link, target);
        return new TwoNodesAndLinkSchema(source, target, link);
    }

    private void givenTaskRequiresPositionMatch(boolean requires) {
        willReturn(requires).given(task).isShouldComparePositionOnEvaluation();
    }

    private void givenSchemaNodes(Schema schema, Node ...nodes) {
        schema.getNodes().addAll(Arrays.asList(nodes));
    }

    private void givenSchemaLink(Schema schema, Node source, Link link, Node target) {
        link.setSourceNodeId(source.getId());
        link.setTargetNodeId(target.getId());
        schema.getLinks().add(link);
    }

    private void givenSchemaNodesAndLinks(Schema schema, Node source, Link link, Node target) {
        givenSchemaNodes(schema, source, target);
        givenSchemaLink(schema, source, link, target);
    }

    private void thenSolutionMatched() {
        thenSolutionMatched(TestData.REFERENCE_SOLUTION_1_MARK, referenceSolution1);
    }

    private void thenSolutionMatched(int mark, Solution ...reference) {
        assertEquals(mark, solutionEvaluator.calculateMark(solutionToEvaluate, Arrays.asList(reference)));
    }

    private void thenSolutionNotMatched(Solution ...reference) {
        assertEquals(0, solutionEvaluator.calculateMark(solutionToEvaluate, Arrays.asList(reference)));
    }

    private Link makeSolidDirectedLink(String text) {
        return makeSolidLink(text, Directionality.DIRECTED);
    }

    private Link makeSolidLink(String text, Directionality directionality) {
        Link link = new Link();
        link.setId(String.valueOf(idGenerator.incrementAndGet()));
        link.setText(text);
        link.setLine(Link.Line.SOLID);
        link.setDirectionality(directionality);
        return link;
    }

    private Node makeNode(String text, Node.Shape shape) {
        Node node = new Node(0, 0, 0, 0);
        node.setId(String.valueOf(idGenerator.incrementAndGet()));
        node.setText(text);
        node.setShape(shape);
        return node;
    }

    private Node makeRectNode(String text) {
        return makeNode(text, Node.Shape.SQUARE_RECT);
    }

    private Schema makeEmptySchema() {
        Schema schema = new Schema();
        schema.setLinks(new ArrayList<>());
        schema.setNodes(new ArrayList<>());
        return schema;
    }

    @Data
    @AllArgsConstructor
    private static class TwoNodesAndLinkSchema {

        private Node source;

        private Node target;

        private Link link;
    }
}
