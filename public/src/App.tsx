import * as React from 'react';
import {Redirect, Route, Router, Switch} from 'react-router-dom';
import LoginPage from './routes/login/LoginPage';
import { ToastContainer, ToastPosition } from 'react-toastify';
import Header from './components/Header/Header';
import User from './types/User';
import { setStateWithPromise } from './util/promiseWrappers';
import AdminHomePage from './routes/admin/AdminHomePage';
import history, { goTo } from './util/history';
import TopicListPage from './routes/topics/TopicListPage';
import SecuredRoute from './util/SecuredRoute';
import { routePatterns, routes } from './util/routes';
import UserListPage from './routes/users/UserListPage';
import * as api from './util/api';
import {
    saveSessionToLocalStorage,
    Session,
    SESSION_LOCAL_STORAGE_KEY,
    setDefaultCsrfHeader
} from './util/session';
import { BreadcrumbsItem, BreadcrumbsProvider } from 'react-breadcrumbs-dynamic';
import { isAdmin } from './util/roleUtils';
import './App.scss';
import UserPage from './routes/users/user/UserPage';
import AbortingRequestTracker from './util/abortingRequestTracker';
import * as _ from 'lodash';
import HelpListPage from './routes/help/HelpPage';
import StudentStatisticsPage from './routes/users/statistics/StudentStatisticsPage';
import { RouteComponentProps } from 'react-router';

interface AppState {
    session: Session;
    isSessionLoaded: boolean
}

export const CurrentUserContext = React.createContext<User | null>(null);

class App extends React.Component<any, AppState> {

    requestTracker: AbortingRequestTracker;

    constructor(props: any){
        super(props);
        this.state = {
            session: {} as Session,
            isSessionLoaded: false
        };
        this.requestTracker = new AbortingRequestTracker();
    }

    componentDidMount() {
        this._loadSession();
        window.addEventListener('storage', this.onUpdateSession.bind(this));
    }

    onUpdateSession(e: StorageEvent) {
        if (e.key === SESSION_LOCAL_STORAGE_KEY) {
            this._loadSession();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('storage', this.onUpdateSession);
    }

    login(username: string, password: string){
        this.requestTracker.add(api.login(username, password))
            .then(session => {
                saveSessionToLocalStorage(session);
                return setStateWithPromise(this, {...session});
            }).then(() => goTo(routes.HOME));
    }

    logout() {
        let thiz = this;
        this.requestTracker.add(api.logout())
            .then(() => {
                thiz._loadSession()
                    .then((session) => {
                        saveSessionToLocalStorage(session);
                    })
            });
        return <Redirect to={routes.LOGIN}/>
    }

    _loadSession() {
        let thiz = this;
        return this.requestTracker.add(api.getSession())
            .then((session) => {
                if (!_.isEqual(thiz.state.session, session)) {
                    thiz.setState({
                        session,
                        isSessionLoaded: true
                    });
                }
                setDefaultCsrfHeader(session.csrfToken);
                return session;
            });
    }


    getHomePageComponent() {
        const currentUser = this.state.session.currentUser;
        if (currentUser) {
            if (!isAdmin(currentUser)) {
                return <Redirect to={{pathname: routes.TOPICS_LIST}}/>;
            }
            return <AdminHomePage/>;
        } else {
            return <LoginPage onLogin={this.login.bind(this)} />;
        }
    }

    render() {
        return this.state.isSessionLoaded
            ? this.renderForLoadedSession()
            : null;
    }

    renderForLoadedSession() {
        return (
            <BreadcrumbsProvider>
                <CurrentUserContext.Provider value={this.state.session.currentUser}>
                    <BreadcrumbsItem to={routes.HOME}>Тренажёр</BreadcrumbsItem>
                    <ToastContainer style={{whiteSpace: 'pre-wrap'}} position={ToastPosition.TOP_CENTER}/>
                    <Router history={history}>
                        <Route path={routes.HOME} component={() =>
                            <div styleName="layout">
                                <Header onLogout={() => this.logout()}/>
                                <div styleName="content">
                                    <Switch>
                                        <Route exact path={routes.HOME} component={() => this.getHomePageComponent()}/>

                                        <SecuredRoute path={routes.PROFILE} component={() =>
                                            <UserPage userId={(this.state.session.currentUser as User).id}/>}/>

                                        <SecuredRoute path={routes.USERS_LIST} roles={['ADMIN']}
                                                      component={() => <UserListPage/>}/>

                                        <SecuredRoute path={routes.MY_STATISTICS} roles={['STUDENT']} component={() =>
                                            <StudentStatisticsPage userId={(this.state.session.currentUser as User).id}/>}/>

                                        <SecuredRoute path={routePatterns.USER_STATISTICS} roles={['ADMIN']}
                                                      component={(route: RouteComponentProps<{topicId: number}>) =>
                                                          <StudentStatisticsPage userId={route.match.params.topicId}/>}/>

                                        <SecuredRoute path={routes.TOPICS_LIST} component={() => <TopicListPage/>}/>

                                        <Route path={routes.HELP} component={() => <HelpListPage/>}/>

                                        <Route path={routes.LOGOUT} component={() => this.logout()}/>

                                        {/*If no route matched - redirect to home page*/}
                                        <Route component={() => {
                                            goTo(routes.HOME);
                                            return null;
                                        }} />
                                    </Switch>
                                </div>
                            </div>
                        }/>
                    </Router>
                </CurrentUserContext.Provider>
            </BreadcrumbsProvider>
        );
    }
}

export default App;
