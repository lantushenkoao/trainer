import * as React from 'react';
import '../common.scss';
import { routes } from '../../../util/routes';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { NavLink } from 'react-router-dom';
import ContentLayout from '../../../components/ContentLayout/ContentLayout';

const AboutPage = () =>
    <ContentLayout>
        <div styleName="container">
        <BreadcrumbsItem to={routes.HELP_ELEMENTS}>О предмете визуализации</BreadcrumbsItem>
            <div styleName="container__content">
                <h1>О предмете визуализации</h1>

                <div styleName="container__content__grid">
                    <div styleName="container__content__grid__text">
                        <p>В современных образовательных стандартах все большее внимание уделяется визуализации и
                            схематизации предмета изучения. К основным методам визуализации относятся использование
                            знаково-символических средств представления информации, применение моделей и схем для
                            преобразования учебного материала к наглядной краткой форме, подготовка доклада с опорой на
                            графические изображения для более легкого достижения понимания предмета.</p>

                        <p>Аналитическая визуализация – это представление содержания выступления или документа в
                            наглядной, образной форме. Визуализация является вспомогательным средством раскрытия
                            информации, она помогает выделить главные идеи выступления, максимально выразительно
                            донести содержание выступления или документа до слушателя (читателя).</p>

                        <p>Схематизация это одна из форм визуализации, основанная на применении определенного языка
                            построения схемы – системы условных знаков, символов, графем, позволяющих выразить объекты,
                            процессы и связи между ними в определенной, во многих случаях стандартизированной,
                            графической форме. Объект схематизации делится на части, главные и второстепенные;
                            выявляются отношения между этими частями (элементами схемы); выбирается язык схематизации;
                            создается схема объекта схематизации – явления, структуры или процесса, чтобы получить его
                            структурно и логически схематизированное изображение.</p>

                        <p>Схематизация выполняет функции абстрагирования (выделение главных признаков, описание объекта
                            средствами формального языка), графического моделирования объекта или явления,
                            иллюстрирования концепций, структур или процессов.</p>

                        <p>Обучение визуализации, и в более узком смысле – схематизации, включает в себя умение понимать
                            схемы, условные знаки схем и связи между знаками; создавать схемы, абстрагируя реальные
                            объекты и действия до условных знаков. Овладение этими умениями позволит применять
                            визуализацию на практике, в учебно-познавательной деятельности и далее, в процессе деловых и
                            производственных коммуникаций.</p>
                    </div>

                    <NavLink to={routes.HELP_TREE} className="button" styleName="container__content__grid__back">
                        Назад
                    </NavLink>
                </div>
            </div>
            <div styleName="container__sidebar"/>
        </div>
    </ContentLayout>;

export default AboutPage;
