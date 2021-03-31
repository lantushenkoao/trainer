import * as React from 'react';
import {Redirect, Route, RouteProps} from 'react-router';
import { CurrentUserContext } from '../App';
import { Role } from '../types/Role';
import { hasOneOfRoles } from './roleUtils';
import User from '../types/User';
import { goTo } from './history';
import { routes } from './routes';
import * as _ from 'lodash';

interface SecuredRouteProps extends RouteProps  {
    roles?: Role[];
    currentUser: User | null;
}

const SecuredRoute = (props: SecuredRouteProps) => {
    if (props.currentUser && _.isEmpty(props.roles) || hasOneOfRoles(props.currentUser, props.roles as Role[])) {
        return <Route {...props}/>;
    } else {
        return <Redirect to={{pathname: routes.HOME}}/>
    }
};

interface SecuredRouteHOCProps extends RouteProps  {
    roles?: Role[];
}

export default (props: SecuredRouteHOCProps) => (
    <CurrentUserContext.Consumer>
        {currentUser => <SecuredRoute {...props} currentUser={currentUser} />}
    </CurrentUserContext.Consumer>
);
