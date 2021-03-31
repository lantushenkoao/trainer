import * as React from 'react';
import './common.scss';
import { routes } from '../../util/routes';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { NavLink, Route, Switch } from 'react-router-dom';
import ElementsHelpPage from './ElementsList/ElementsHelpPage';
import BlockSchemeHelpPage from './BlockScheme/BlockSchemePage';
import LinksDiagramHelpPage from './LinksDiagram/LinksDiagramPage';
import TreeStructureHelpPage from './TreeStructure/TreeStructurePage';
import AboutHelpPage from './About/AboutPage';
import ContentLayout from '../../components/ContentLayout/ContentLayout';

const HelpTocPage = () =>
    <ContentLayout>
        <h1>Техники визуализации:</h1>
        <ul styleName="container__list">
            <li styleName="container__list__element">
                <NavLink styleName="container__list__element__link" to={routes.HELP_ELEMENTS}>
                    Описание типов элементов схемы
                </NavLink>
            </li>
            <li styleName="container__list__element">
                <NavLink styleName="container__list__element__link" to={routes.HELP_SCHEME}>
                    Блок-схема
                </NavLink>
            </li>
            <li styleName="container__list__element">
                <NavLink styleName="container__list__element__link" to={routes.HELP_LINKS}>
                    Диаграмма связей
                </NavLink>
            </li>
            <li styleName="container__list__element">
                <NavLink styleName="container__list__element__link" to={routes.HELP_TREE}>
                    Древовидная структура
                </NavLink>
            </li>
            <li styleName="container__list__element">
                <NavLink styleName="container__list__element__link" to={routes.HELP_ABOUT}>
                    О предмете визуализации
                </NavLink>
            </li>
        </ul>
    </ContentLayout>;

export default () => (
    <div className="content">
        <BreadcrumbsItem to={routes.HELP}>Техники визуализации</BreadcrumbsItem>
        <Switch>
            <Route path={routes.HELP_ELEMENTS} component={() => <ElementsHelpPage/>}/>
            <Route path={routes.HELP_SCHEME} component={() => <BlockSchemeHelpPage/>}/>
            <Route path={routes.HELP_LINKS} component={() => <LinksDiagramHelpPage/>}/>
            <Route path={routes.HELP_TREE} component={() => <TreeStructureHelpPage/>}/>
            <Route path={routes.HELP_ABOUT} component={() => <AboutHelpPage/>}/>
            <Route path={routes.HELP} component={() => <HelpTocPage/>}/>
        </Switch>
    </div>
);