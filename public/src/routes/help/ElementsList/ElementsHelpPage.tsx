import * as React from 'react';
import '../common.scss';
import { routes } from '../../../util/routes';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { NavLink } from 'react-router-dom';
import ContentLayout from '../../../components/ContentLayout/ContentLayout';

const terminator = require('../../../images/SVG/terminator block.svg');
const process = require('../../../images/SVG/process block.svg');
const IO = require('../../../images/SVG/IO block.svg');
const entity = require('../../../images/SVG/entity block.svg');
const selector = require('../../../images/SVG/selector block.svg');
const document = require('../../../images/SVG/document block.svg');

const arrow = require('../../../images/SVG/arrow.svg');
const doubleArrow = require('../../../images/SVG/double arrow.svg');
const line = require('../../../images/SVG/line.svg');
const dottedArrows = require('../../../images/SVG/dotted arrows.svg');

const sample1 = require('../../../images/SVG/sample1.svg');
const sample2 = require('../../../images/SVG/sample2.svg');

const ElementsHelpPage = () =>
    <ContentLayout>
        <BreadcrumbsItem to={routes.HELP_ELEMENTS}>Описание типов элементов схемы</BreadcrumbsItem>
        <div>
            <div styleName="container">
                <div styleName="container__content">
                    <h1>Описание типов элементов схемы</h1>

                    <div styleName="container__content__grid">
                        <img src={terminator} styleName="container__content__grid__image"/>
                        <div styleName="container__content__grid__description">
                            <div styleName="container__content__grid__description__header">Терминатор (ограничитель)</div>
                            Отображает начало и конец последовательного алгоритма. Как правило, данный элемент содержит
                            фразы «Начало», «Старт» или «Вход» в начале блок-схемы и «Конец», «Финиш» или «Выход» в конце
                            блок-схемы.
                        </div>

                        <img src={process} styleName="container__content__grid__image"/>
                        <div styleName="container__content__grid__description">
                            <div styleName="container__content__grid__description__header">Действие</div>
                            Отображает процесс, действие, выполнение одной или нескольких операций, приводящее к изменению
                            состояния системы. Например, процесс обсуждения чего-либо, процесс производства детали, процесс
                            доставки продукции.
                        </div>

                        <img src={IO} styleName="container__content__grid__image"/>
                        <div styleName="container__content__grid__description">
                            <div styleName="container__content__grid__description__header">Ввод / вывод</div>
                            Отображает входящую или исходящую информацию, продукцию. Например, «Закупленные детали»,
                            «Информация от диспетчера», «Отправленный товар».
                        </div>

                        <img src={entity} styleName="container__content__grid__image"/>
                        <div styleName="container__content__grid__description">
                            <div styleName="container__content__grid__description__header">Сущность</div>
                            Отображает некоторую сущность или понятие, которая обычно иллюстрирует дискретную единицу
                            системы взаимоотношений или понятие в системе понятий. Например, «Фирма 1», «Здоровье»,
                            «Внешняя среда».
                        </div>

                        <img src={document} styleName="container__content__grid__image"/>
                        <div styleName="container__content__grid__description">
                            <div styleName="container__content__grid__description__header">Документ</div>
                            Отображает документ, который является итогом какого-то действия или действий в схеме
                            бизнес-процесса. Также может отображать входящий документ, на основании которого инициируются
                            определенные процессы в описываемой схеме. Например, «Договор», «Смета», «Заявка».
                        </div>

                        <img src={selector} styleName="container__content__grid__image"/>
                        <div styleName="container__content__grid__description">
                            <div styleName="container__content__grid__description__header">Выбор (логическое условие)</div>
                            Отображает точку выбора, принятия решения. Результатом этого элемента всегда является два
                            предопределенных значения – Истина или Ложь (Да или Нет). Внутри ромба записывается логическое
                            условие, например, «А больше Б?», «Предложение одобряется?», «Этот прибор работает?»
                        </div>

                        <img src={line} styleName="container__content__grid__image"/>
                        <div styleName="container__content__grid__description">
                            <div styleName="container__content__grid__description__header">Ненаправленная линия</div>
                            Отображает связь между сущностями, явлениями или понятиями в диаграмме связей (Mind map).
                        </div>

                        <img src={arrow} styleName="container__content__grid__image"/>
                        <div styleName="container__content__grid__description">
                            <div styleName="container__content__grid__description__header">Направленная линия</div>
                            Отображает связь между сущностями, явлениями или понятиями в блок-схеме древовидного типа,
                            показывая связи между сущностями, показывая направление от главного (корневого) узла к
                            периферийным узлам схемы, например от директора к заместителям и далее к сотрудникам низших
                            звеньев, показыва влияние (главенство) одних элементов на другие в иерархии. В случае блок-схемы
                            процесса, показывает последовательность исполнения этого процесса от начала к продожению, с
                            возможными циклами и ветвлениями и в итоге, к концу схемы данного процесса.
                        </div>

                        <img src={doubleArrow} styleName="container__content__grid__image"/>
                        <div styleName="container__content__grid__description">
                            <div styleName="container__content__grid__description__header">Двунаправленная линия</div>
                            Отображает связь между сущностями или понятиями, которая является взаимной, то есть являет собой
                            взаимосвязь, где оба элемента влияют друг на друга одновременно.
                        </div>

                        <img src={dottedArrows} styleName="container__content__grid__image"/>
                        <div styleName="container__content__grid__description">
                            <div styleName="container__content__grid__description__header">Пунктирная линия</div>
                            Пунктирная линия, которая может быть ненаправленной, направленной и двунаправленной, отображает
                            связь или последовательность действий, которая является возможной, но не определенной.
                        </div>

                        <NavLink to={routes.HELP} className="button" styleName="container__content__grid__back">
                            Назад
                        </NavLink>

                        <NavLink to={routes.HELP_SCHEME} className="button" styleName="container__content__grid__next">
                            Следующая статья
                        </NavLink>
                    </div>
                </div>

                <div styleName="container__sidebar">
                    <div styleName="container__sidebar__description">
                        Пример использования блоков «Терминатор», «Действие», «Выбор», «Документ», «Ввод/Вывод», направленных линий:
                    </div>
                    <img src={sample1} styleName="container__sidebar__image"/>

                    <div styleName="container__sidebar__description">
                        Пример использования блока «Сущность» и ненаправленных линий:
                    </div>
                    <img src={sample2} styleName="container__sidebar__image"/>
                </div>

            </div>
        </div>
    </ContentLayout>;

export default ElementsHelpPage;
