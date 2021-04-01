import * as React from 'react';
import './Header.scss';
import { CurrentUserContext } from '../../App';
import { Breadcrumbs } from 'react-breadcrumbs-dynamic';
import { routes } from '../../util/routes';
import { NavLink } from 'react-router-dom';
import { isStudent } from '../../util/roleUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChevronRight, faChevronDown, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import User from '../../types/User';
import * as _ from 'lodash';
const manual = require('../../docs/UserManual.pdf');

const logo = require('../../logo.svg');
library.add(faUser, faChevronRight, faChevronDown, faQuestion);

interface HeaderHOCProps {
    onLogout: () => void;
}

interface HeaderProps extends HeaderHOCProps {
    currentUser: User | null;
}

interface HeaderState {
    showProfileMenu: boolean
}


class Header extends React.Component<HeaderProps, HeaderState> {

    profileMenuLinkRef: React.RefObject<HTMLAnchorElement>;
    profileMenuRef: React.RefObject<HTMLDivElement>;

    constructor(props: HeaderProps) {
        super(props);
        this.state = {
            showProfileMenu: false
        };
        this.profileMenuLinkRef = React.createRef();
        this.profileMenuRef = React.createRef();
        this.handleClickOutsideProfileMenu = this.handleClickOutsideProfileMenu.bind(this);
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutsideProfileMenu);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutsideProfileMenu);
    }

    handleClickOutsideProfileMenu(event: MouseEvent) {
        const eventTarget = event.target as Node;
        if (this.state.showProfileMenu &&
            (this.profileMenuLinkRef.current && !(this.profileMenuLinkRef.current as HTMLAnchorElement).contains(eventTarget))) {
            this.toggleProfileMenu(false);
        }

    }

    toggleProfileMenu(toggle?: boolean) {
        this.setState(prevState => ({
            showProfileMenu: _.isUndefined(toggle)
                ? !prevState.showProfileMenu
                : toggle
        }));
    }

    renderProfileMenu() {
        return (
            <div styleName={`header__grid__menu__profile-menu ${!this.state.showProfileMenu ? ' header__grid__menu__profile-menu--hidden' : ''}`} ref={this.profileMenuRef}>
                <NavLink to={routes.PROFILE}>Профиль</NavLink>
                {isStudent(this.props.currentUser) &&
                    <NavLink to={routes.MY_STATISTICS}>Статистика</NavLink>
                }
                <NavLink to={routes.LOGOUT}>Выйти</NavLink>
            </div>
        );
    }

    render() {
        return (
            <div styleName="header">
                <div styleName="header__grid">
                    <div styleName="header__grid__logo">
                        <NavLink to={routes.HOME}>
                            <img src={logo} styleName="header__grid__logo"/>
                        </NavLink>
                    </div>

                    <div styleName="header__grid__breadcrumb">
                        <Breadcrumbs separator={<FontAwesomeIcon icon="chevron-right" size="xs"/>}
                                     item={NavLink}
                                     finalItem={'span'}/>
                    </div>

                    <div styleName="header__grid__menu">
                    {this.props.currentUser &&
                        <div styleName="header__grid__menu-container">
                            <a styleName="header__grid__menu__profile-menu-link" ref={this.profileMenuLinkRef}
                               onClick={() => this.toggleProfileMenu()}>
                                <FontAwesomeIcon icon="user" size="sm"/>
                                {this.props.currentUser.name}
                                <span styleName={`header__grid__menu__profile-menu-link__chevron ${this.state.showProfileMenu ? ' header__grid__menu__profile-menu-link__chevron--down' : ''}`}>
                                    <FontAwesomeIcon icon="chevron-down" size="sm"/>
                                </span>
                            </a>
                            {this.renderProfileMenu()}
                        </div>

                    }
                    <a href={manual} target="_blank">
                        <FontAwesomeIcon icon="question" size="sm"/>
                    </a>
                    </div>
                </div>
            </div>

        );
    }
}

export default (props: HeaderHOCProps) => (
    <CurrentUserContext.Consumer>
        {currentUser => <Header onLogout={props.onLogout} currentUser={currentUser}/>}
    </CurrentUserContext.Consumer>
);
