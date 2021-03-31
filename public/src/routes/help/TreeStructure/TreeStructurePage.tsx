import * as React from 'react';
import '../common.scss';
import { routes } from '../../../util/routes';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { NavLink } from 'react-router-dom';
import ContentLayout from '../../../components/ContentLayout/ContentLayout';

const sample3 = require('../../../images/SVG/sample3.svg');

const TreeStructure = () =>
    <ContentLayout>
        <BreadcrumbsItem to={routes.HELP_ELEMENTS}>Древовидная структура</BreadcrumbsItem>
        <div>
            <div styleName="container">
                <div styleName="container__content">
                    <h1>Древовидная структура</h1>

                    <div styleName="container__content__grid">
                        <div styleName="container__content__grid__text">

                            <p>Древовидная структура является одним из способов представления иерархической структуры в
                                графическом виде.</p>

                            <p>Древовидной структурой называется благодаря тому, что граф выглядит как перевернутое дерево.
                                По этой же причине говорят, что корневой узел (корень) находится на самом верху, а листья —
                                внизу.</p>

                            <p>В теории графов дерево — связанный ациклический граф (для не ориентированных графов) или
                                связанный ацикличный граф в котором не более одного узла не имеют входящих ребер, а
                                остальные узлы имеют строго по одному входящему узлу (для ориентированных графов).</p>

                            <p>Ациклический ориентированный граф без жесткого условия связывания называется сетью,
                                Несвязанный граф из нескольких деревьев - лесом..</p>

                            <p>Из совокупности древовидных структур состоят неоднородные семантические сети.</p>

                            <p>Каждая конечная древовидная структура содержит элемент, не имеющий вышестоящего. Этот элемент
                                называется «корнем» или «корневым узлом». Он может считаться первым (или стартовым) узлом.</p>

                            <p>Обратное утверждение, в общем случае, неверно: бесконечные древовидные структуры могут иметь,
                                а могут и не иметь корневые узлы.</p>

                            <p>Линии, связывающие элементы называются «ветвями», а сами элементы называются узлами. Узлы без
                                потомков называются «конечными узлами» или «листьями».</p>

                            <p>Названия связей между узлами именуются по принципу семейных взаимосвязей.</p>

                            <p>На Западе в области информатики, в основном используются только названия членов семьи
                                мужского рода, в русском языке для обозначения узла, напрямую связанного с узлом-родителем и
                                находящимся в иерархии ниже, часто называют «дочерним».</p>

                            <p>В лингвистике (англоязычной, к примеру), напротив, используются названия членов семей
                                женского рода. Это свидетельствует о возврате к соглашению об общепринятых правилах
                                наименования, авторами которого являются студентки известного американского лингвиста Ноама
                                Хомского. Несмотря на это, в информатике нейтральные названия «родитель» и «дитя» часто
                                заменяются словами «отец» и «сын», кроме того термин «дядя» не менее активно используется
                                для обозначения других узлов, находящихся на том же уровне, что и родитель.</p>

                            <p>Узел является «родителем» другого узла, если он расположен на один шаг выше в иерархии
                                дерева, то есть находится ближе к корневому узлу.</p>

                            <p>«Дети» («брат» или «сестра») имеют общий родительский узел.</p>

                            <p>Узел, связанный со всеми нижележащими узлами называется «предком» или «предшественником».</p>

                            <p>В приведенном выше примере, «энциклопедия» является родителем по отношению к «науке» и
                                «культуре», которые соответственно, являются её «детьми». «Искусство» и «ремесло» являются
                                братьями по отношению друг к другу и детьми по отношению к «культуре».</p>

                            <p>Древовидные структуры используются для отображения всеx видов информации из области
                                таксономии, как например, генеалогическое древо, филогенетическое дерево, грамматическая
                                структура языка, способ логического упорядочивания веб-страниц на сайте и так далее.</p>

                            <p>В древовидной структуре может быть один и только один путь от одной точки до другой точки.</p>

                        </div>

                        <NavLink to={routes.HELP_LINKS} className="button" styleName="container__content__grid__back">
                            Назад
                        </NavLink>

                        <NavLink to={routes.HELP_ABOUT} className="button" styleName="container__content__grid__next">
                            Следующая статья
                        </NavLink>
                    </div>
                </div>

                <div styleName="container__sidebar">
                    <div styleName="container__sidebar__description">
                        Пример древовидной структуры:
                    </div>
                    <img src={sample3} styleName="container__sidebar__image"/>
                </div>

            </div>
        </div>
    </ContentLayout>;

export default TreeStructure;