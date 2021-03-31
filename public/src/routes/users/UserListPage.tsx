import * as React from 'react';
import User from '../../types/User';
import './UserListPage.scss';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { routePatterns, routes } from '../../util/routes';
import { NavLink, Route, Switch } from 'react-router-dom';
import UserPage from './user/UserPage';
import * as api from '../../util/api';
import { CurrentUserContext } from '../../App';
import { toast } from 'react-toastify';
import ContentLayout from '../../components/ContentLayout/ContentLayout';
import { isStudent, roleNames } from '../../util/roleUtils';
import AbortingRequestTracker from '../../util/abortingRequestTracker';
import { RouteComponentProps } from 'react-router';
import StatisticsPage from './statistics/StudentStatisticsPage';

interface UserListPageState {
    users: User[];
}

interface UserListPageHOCProps {}

interface UserListPageProps extends UserListPageHOCProps {
    currentUser: User;
}

class UserListPage extends React.Component<UserListPageProps, UserListPageState> {

    requestTracker: AbortingRequestTracker;

    constructor(props: UserListPageProps) {
        super(props);
        this.state = {
            users: []
        };
        this.requestTracker = new AbortingRequestTracker();
    }

    componentDidMount() {
        this.loadUserList();
    }

    componentWillUnmount(){
        this.requestTracker.cancelAll();
    }

    loadUserList() {
        this.requestTracker.add(api.listUsers())
            .then(users => this.setState({users}))
    }

    onDeleteUser(user: User) {
        confirm(`Внимание!\nПосле подтверждения, это действие отменить нельзя.\nУдалить пользователя ${user.name}?`) &&
        this.requestTracker.add(api.deleteUser(user.id))
            .then(() => {
                toast('Пользователь удалён', {type: toast.TYPE.SUCCESS});
                this.loadUserList();
            })
    }

    renderUserRow(user: User) {
        return (
            <tr key={user.id}>
                <td styleName="users-table__cell-name users-table__cell--bottom-border" title={user.name}>
                    {user.name}
                </td>
                <td styleName="users-table__cell-role users-table__cell--bottom-border">
                    {roleNames[user.roles[0]]}
                </td>
                <td styleName="users-table__cell-buttons">
                    {isStudent(user)
                        ? <NavLink to={routes.USER_STATISTICS(user.id)}
                                   className="button">Статистика</NavLink>
                        : <button className="button" disabled={true}>Статистика</button>
                    }
                    <NavLink to={routes.USER_EDIT(user.id)}
                             className="button">Редактировать</NavLink>
                    <button onClick={() => this.onDeleteUser(user)}
                            disabled={user.id == this.props.currentUser.id}
                            className={'button ' + (user.id !== this.props.currentUser.id
                                ? 'button-delete'
                                : 'button--disabled')}>
                        Удалить
                    </button>
                </td>
            </tr>
        );
    }

    render () {
        return (
            <ContentLayout leftBarContent="Список пользователей">
                <div className="content" styleName="container">
                    <NavLink to={routes.USER_NEW} styleName="container__button-new" className="button button-new">
                        Добавить пользователя
                    </NavLink>
                    <div className="scrollbar-wrapper" styleName="container__scrollbar-wrapper">
                        <table styleName="users-table">
                            <tbody>
                            {this.state.users.map(user => this.renderUserRow(user))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </ContentLayout>
        );
    }
}

export default (props: UserListPageHOCProps) => (
    <CurrentUserContext.Consumer>
        {(currentUser: User) =>
            <div className="content">
                <BreadcrumbsItem to={routes.USERS_LIST}>Список пользователей</BreadcrumbsItem>
                <Switch>
                    <Route exact path={routes.USER_NEW} component={() => <UserPage/>} />
                    <Route exact path={routePatterns.USER_EDIT}
                           component={(route: RouteComponentProps<{userId: number}>) =>
                               <UserPage userId={route.match.params.userId}/>}
                    />
                    <Route path={routePatterns.USER_STATISTICS}
                           component={(route: RouteComponentProps<{userId: number}>) =>
                               <StatisticsPage userId={route.match.params.userId}/>}
                    />
                    <Route component={() => <UserListPage {...{currentUser, ...props}}/>} />
                </Switch>
            </div>
        }
    </CurrentUserContext.Consumer>

);