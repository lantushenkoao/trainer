import * as React from 'react';
import '../common.scss';
import { routes } from '../../../util/routes';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { NavLink } from 'react-router-dom';
import ContentLayout from '../../../components/ContentLayout/ContentLayout';

const sample2 = require('../../../images/SVG/sample2.svg');

const LinkDiagramPage = () =>
    <ContentLayout>
        <BreadcrumbsItem to={routes.HELP_ELEMENTS}>Диаграмма связей</BreadcrumbsItem>
        <div>

            <div styleName="container">
                <div styleName="container__content">
                    <h1>Диаграмма связей</h1>

                    <div styleName="container__content__grid">
                        <div styleName="container__content__grid__text">

                            <p>Диагра́мма свя́зей, известная также как интелле́кт-ка́рта, ка́рта мыслей (англ. Mind map) или
                                ассоциати́вная ка́рта — метод структуризации концепций с использованием графической записи в
                                виде диаграммы.</p>

                            <p>Диаграмма связей реализуется в виде древовидной схемы, на которой изображены слова, идеи,
                                задачи или другие понятия, связанные ветвями, отходящими от центрального понятия или идеи.
                                Является одним из инструментов управления личными знаниями, для которого достаточно
                                карандаша и бумаги.</p>

                            <p>На русский язык термин может переводиться как «карта мыслей», «интеллект-карта», «карта
                                памяти», «ментальная карта», «ассоциативная карта», «ассоциативная диаграмма» или «схема
                                мышления».</p>

                            <p>Методика разработана психологом Тони Бьюзеном в конце 1960-х годов.</p>

                            <p>История создания и развития</p>

                            <p>Графические методы записи знаний и систем моделирования на протяжении веков использовались в
                                методиках обучения, мозгового штурма, запоминания, визуального мышления для решения проблем,
                                возникающих в процессе деятельности педагогов, инженеров, психологов и представителей многих
                                других специальностей.</p>

                            <p>Одни из самых ранних примеров таких графических записей были разработаны философом 3 века н.
                                э. Порфирием из Тироса, он графически изобразил концепцию категорий философии Аристотеля.
                                Философ Раймунд Луллий (1235—1315) также использовал подобную методику.</p>

                            <p>Семантические сети были разработаны в конце 50-х годов 20 века для попытки описания процесса
                                обучения человека, в дальнейшем эта теория получила своё развитие благодаря работам Аллана
                                Коллинза и Росса Куиллиана в начале 60-х. Британский писатель Тони Бьюзен, автор книг по
                                популярной психологии утверждает, что он является изобретателем современного вида диаграмм
                                связей. По его словам, его вдохновили идеи Альфреда Коржибски из области общей семантики,
                                популяризованной в научно-фантастических романах Роберта Хайнлайна и Альфреда ван Вогта.
                                Бьюзен утверждает, что положение о том, что, исходя из традиционных представлений о
                                восприятии информации, читателю приходится просматривать страницу слева направо и сверху
                                вниз, — неверно, что на самом деле человек «сканирует» страницу целиком и нелинейно. Бьюзен
                                также использует популярные предположения о работе полушарий головного мозга в качестве
                                подтверждения того, что диаграммы связей — эффективный способ конспектирования информации.</p>

                            <p>Диаграммы связей используются в различных формах и приложениях, включая обучение, образование,
                                планирование и построение инженерных диаграмм. По сравнению с концептуальными картами
                                (англ.) русск., которые были разработаны специалистами по обучению в 1970-х, структура
                                диаграмм связей сохранила радиальный формат записи, но упростилась благодаря использованию
                                только одного центрального слова.</p>

                            <p>Достоинством метода является структурированность информации и легкость получения общего
                                представления о заложенных в диаграмму знаниях.</p>

                            <p>К недостаткам следует отнести ограниченную масштабируемость и сфокусированность на
                                единственном центральном понятии.</p>

                        </div>

                        <NavLink to={routes.HELP_SCHEME} className="button" styleName="container__content__grid__back">
                            Назад
                        </NavLink>

                        <NavLink to={routes.HELP_TREE} className="button" styleName="container__content__grid__next">
                            Следующая статья
                        </NavLink>
                    </div>
                </div>

                <div styleName="container__sidebar">
                    <div styleName="container__sidebar__description">
                        Пример использования блока «Сущность» и ненаправленных линий:
                    </div>
                    <img src={sample2} styleName="container__sidebar__image"/>
                </div>

            </div>
        </div>
    </ContentLayout>;

export default LinkDiagramPage;
