import * as React from 'react';
import '../common.scss';
import { routes } from '../../../util/routes';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { NavLink } from 'react-router-dom';
import ContentLayout from '../../../components/ContentLayout/ContentLayout';

const sample1 = require('../../../images/SVG/sample1.svg');

const BlockSchemePage = () =>
    <ContentLayout>
        <BreadcrumbsItem to={routes.HELP_ELEMENTS}>Блок-схема</BreadcrumbsItem>
        <div>
            <div styleName="container">
                <div styleName="container__content">
                    <h1>Блок-схема</h1>

                    <div styleName="container__content__grid">
                        <div styleName="container__content__grid__text">
                            <p>Схе́ма — графическое представление определения, анализа или метода решения задачи, в котором
                                используются символы для отображения данных, потока, оборудования и т. д.</p>

                            <p>Блок-схема — распространенный тип схем (графических моделей), описывающих алгоритмы или
                                процессы, в которых отдельные шаги изображаются в виде блоков различной формы, соединенных
                                между собой линиями, указывающими направление последовательности.</p>

                            <p>Порядок выполнения действий задается путём соединения вершин дугами, что позволяет
                                рассматривать блок-схемы не только как наглядную интерпретацию алгоритма, удобную для
                                восприятия человеком, но и как взвешенный ориентированный граф (т. н. граф-схема алгоритма,
                                ГСА). Подобное представление алгоритмов используется при построении систем логического
                                управления, реализующих заданные управляющие алгоритмы, в задачах распараллеливания
                                вычислений и т. д.</p>
                        </div>

                        <NavLink to={routes.HELP_ELEMENTS} className="button" styleName="container__content__grid__back">
                            Назад
                        </NavLink>

                        <NavLink to={routes.HELP_LINKS} className="button" styleName="container__content__grid__next">
                            Следующая статья
                        </NavLink>
                    </div>
                </div>

                <div styleName="container__sidebar">
                    <div styleName="container__sidebar__description">
                        Пример использования блоков «Терминатор», «Действие», «Выбор», «Документ», «Ввод/Вывод», направленных линий:
                    </div>
                    <img src={sample1} styleName="container__sidebar__image"/>
                </div>

            </div>
        </div>

    </ContentLayout>;

export default BlockSchemePage;
