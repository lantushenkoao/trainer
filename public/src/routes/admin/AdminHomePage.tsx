import * as React from 'react';
import './AdminHomePage.scss';
import ContentLayout from '../../components/ContentLayout/ContentLayout';
import { NavLink } from 'react-router-dom';
import { routes } from '../../util/routes';

const AdminHomePage = () => (

    <ContentLayout leftBarContent="Страница администратора">
        <div styleName="container">
            <NavLink to={routes.TOPICS_LIST} className="button">
                Темы и задания
            </NavLink>
            <NavLink to={routes.USERS_LIST} className="button">
                Учётные записи пользователей
            </NavLink>
        </div>
    </ContentLayout>
);

export default AdminHomePage;
