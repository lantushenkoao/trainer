import * as React from 'react';
import './UserPage.scss';
import { Role } from '../../../types/Role';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { routes } from '../../../util/routes';
import CreateOrUpdateUser from '../../../types/EditUser';
import { CurrentUserContext } from '../../../App';
import User from '../../../types/User';
import * as api from '../../../util/api';
import { setStateWithPromise } from '../../../util/promiseWrappers';
import { toast } from 'react-toastify';
import { goTo } from '../../../util/history';
import ContentLayout from '../../../components/ContentLayout/ContentLayout';
import AbortingRequestTracker from '../../../util/abortingRequestTracker';
import { isAdmin } from '../../../util/roleUtils';
import * as _ from 'lodash';
import { ChangeEvent } from 'react';

interface UserPageProps extends UserPageHOCProps {
    currentUser: User | null;
}

interface UserPageHOCProps {
    userId?: number;
}

interface UserPageState extends CreateOrUpdateUser {
    initialName: string;
}

const newUser: CreateOrUpdateUser = {
    id: null,
    name: '',
    username: '',
    email: '',
    currentPassword: '',
    password: '',
    passwordConfirm: '',
    role: 'STUDENT'
};

const NAME_PATTERN_REGEX = new RegExp(/^[а-яё]+-?[а-яё]* [а-яё]+-?[а-яё]* [а-яё]+-?[а-яё]*$/iu);

class UserPage extends React.Component<UserPageProps, UserPageState> {

    requestTracker: AbortingRequestTracker;
    formRef: React.RefObject<HTMLFormElement>;
    nameInputRef: React.RefObject<HTMLInputElement>;
    oldPasswordInputRef: React.RefObject<HTMLInputElement>;
    passwordInputRef: React.RefObject<HTMLInputElement>;
    passwordConfirmInputRef: React.RefObject<HTMLInputElement>;
    minPasswordLength: number = 6;
    maxPasswordLength: number = 20;

    constructor(props: UserPageProps) {
        super(props);
        this.state = {
            ...newUser,
            initialName: ''
        };
        this.requestTracker = new AbortingRequestTracker();
        this.formRef = React.createRef();
        this.nameInputRef = React.createRef();
        this.oldPasswordInputRef = React.createRef();
        this.passwordInputRef = React.createRef();
        this.passwordConfirmInputRef = React.createRef();
    }

    componentDidMount() {
        this.loadUser();
    }

    componentWillUnmount(){
        this.requestTracker.cancelAll();
    }

    loadUser() {
        if (this.isNewUser()) {
            return setStateWithPromise(this, newUser);
        } else {
            return this.requestTracker.add(api.getUser(this.props.userId as number))
                .then(user => this.saveUserToState(user));
        }
    }

    saveUserToState(user: User) {
        const {id, name, username, email} = user;
        const role = user.roles[0];
        return setStateWithPromise(this, {
            id, name, username, email, role, initialName: name
        });
    }

    isSSOUser() {
        return this.props.currentUser && this.props.currentUser.ssologin;
    }

    isMyProfile() {
        return this.props.currentUser != null && this.props.currentUser.id === this.props.userId;
    }

    isNewUser() {
        return !this.props.userId;
    }

    changeName(name: string) {
        this.setState({name});
        this.resetInputValidity(this.nameInputRef);
    }

    changeEmail(email: string) {
        this.setState({email});
    }

    changeUsername(username: string) {
        this.setState({username});
    }

    changeCurrentPassword(currentPassword: string) {
        this.setState({currentPassword});
    }

    changePassword(password: string) {
        this.setState({password});
    }

    changePasswordConfirm(passwordConfirm: string) {
        this.setState({passwordConfirm});
        this.resetInputValidity(this.passwordConfirmInputRef);
    }

    resetInputValidity(inputRef: React.RefObject<HTMLInputElement>) {
        const input = inputRef.current as HTMLInputElement;
        if (!input.checkValidity()) {
            input.setCustomValidity('');
        }
    }

    changeRole(role : Role) {
        this.setState({role});
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const isValid = this.validateForm();

        if (isValid) {
            const request = this.isNewUser()
                ? api.createUser(this.state)
                : api.updateUser(this.state);
            this.requestTracker.add(request)
                .then(() => {
                    const message = this.isNewUser()
                        ? 'Пользователь создан'
                        : 'Изменения сохранены';
                    toast(message, {type: toast.TYPE.SUCCESS});
                    goTo(routes.USERS_LIST);
                });
        }
    }

    validateForm() {
        const nameInput = this.nameInputRef.current as HTMLInputElement;
        const passwordConfirmInput = this.passwordConfirmInputRef.current as HTMLInputElement;
        const form = this.formRef.current as HTMLFormElement;

        if (!this.state.name.match(NAME_PATTERN_REGEX)) {
            nameInput.setCustomValidity('Введите корректные фамилию, имя и отчество');
        } else {
            nameInput.setCustomValidity('');
        }

        if (!_.isEmpty(this.state.password) && this.state.passwordConfirm !== this.state.password) {
            passwordConfirmInput.setCustomValidity('Пароли не совпадают');
        } else {
            passwordConfirmInput.setCustomValidity('');
        }

        form.checkValidity();
        return form.reportValidity();
    }

    onDelete() {
        confirm(`Внимание!\nПосле подтверждения, это действие отменить нельзя.\nУдалить пользователя ${this.state.name}?`) &&
        this.requestTracker.add(api.deleteUser(this.state.id as number))
            .then(() => {
                toast('Пользователь удалён', {type: toast.TYPE.SUCCESS});
                goTo(routes.USERS_LIST)
            })
    }

    getPageInfo(showUserName: boolean) {
        return this.isNewUser()
            ? 'Создать нового пользователя'
            : this.isMyProfile()
                ? 'Профиль'
                : showUserName
                    ? `Редактировать пользователя ${this.state.initialName}`
                    : 'Редактировать пользователя'
    }

    render() {
        return (
            <ContentLayout leftBarContent={this.getPageInfo(true)}>
                <BreadcrumbsItem to={this.isNewUser()
                    ? routes.USER_NEW
                    : routes.USER_EDIT(this.state.id as number)}>
                    {this.getPageInfo(false)}
                </BreadcrumbsItem>
                <form ref={this.formRef}
                      styleName="user-form"
                      onSubmit={(e) => this.onSubmit(e)}
                      noValidate={true}>

                    <label htmlFor="name">Имя</label>
                    <input className="input"
                           id="name"
                           value={this.state.name}
                           required={true}
                           maxLength={100}
                           ref={this.nameInputRef}
                           onChange={(e) => this.changeName(e.target.value)}/>

                    <label htmlFor="email">Электронный адрес</label>
                    <input type="email"
                           id="email"
                           className="input"
                           value={this.state.email || ''}
                           onChange={(e) => this.changeEmail(e.target.value)}/>

                    <label htmlFor="username">Логин</label>
                    <input className="input"
                           id="username"
                           value={this.state.username}
                           required={true}
                           disabled={!this.isNewUser()}
                           onChange={(e) => this.changeUsername(e.target.value)}/>

                    {isAdmin(this.props.currentUser) &&
                        <label htmlFor="role">Роль</label>
                    }
                    {isAdmin(this.props.currentUser) &&
                        <select className="input"
                                id="role"
                                styleName="user-form__role-select"
                                value={this.state.role}
                                onChange={(e) => this.changeRole(e.target.value as Role)}
                                disabled={this.isMyProfile()}>
                            <option value="STUDENT">Студент</option>
                            <option value="METHODIST">Методист</option>
                            <option value="ADMIN">Администратор</option>
                        </select>
                    }

                    {!this.isNewUser() &&
                        <div styleName="user-form__delimiter"/>
                    }

                    <label htmlFor="password">{this.isNewUser() ? 'Пароль' : 'Новый пароль'}</label>
                    <input type="password"
                           id="password"
                           className="input"
                           value={this.state.password}
                           required={this.isNewUser() ||
                                     !_.isEmpty(this.state.currentPassword) ||
                                     !_.isEmpty(this.state.passwordConfirm)}
                           minLength={this.minPasswordLength}
                           maxLength={this.maxPasswordLength}
                           ref={this.passwordInputRef}
                           onChange={(e) => this.changePassword(e.target.value)}/>

                    <label htmlFor="passwordConfirm">Подтверждение пароля</label>
                    <input type="password"
                           id="passwordConfirm"
                           className="input"
                           required={this.isNewUser() || !_.isEmpty(this.state.password)}
                           minLength={this.minPasswordLength}
                           maxLength={this.maxPasswordLength}
                           value={this.state.passwordConfirm}
                           ref={this.passwordConfirmInputRef}
                           onChange={(e) => this.changePasswordConfirm(e.target.value)}/>

                    {this.isMyProfile() && ! this.isSSOUser() &&
                        <label htmlFor="currentPassword">Текущий пароль</label>
                    }
                    {this.isMyProfile() && ! this.isSSOUser() &&
                        <input type="password"
                               id="currentPassword"
                               className="input"
                               value={this.state.currentPassword}
                               ref={this.oldPasswordInputRef}
                               required={!_.isEmpty(this.state.password)}
                               minLength={this.minPasswordLength}
                               maxLength={this.maxPasswordLength}
                               onChange={(e) => this.changeCurrentPassword(e.target.value)}/>
                    }

                    <div styleName="user-form__buttons-container">
                        <input type="submit" className="button button-submit"
                               value={this.isNewUser() ? 'Создать пользователя' : 'Сохранить'}/>
                        {isAdmin(this.props.currentUser) && !this.isMyProfile() && !this.isNewUser() &&
                            <button className="button button-delete" onClick={() => this.onDelete()}>
                                Удалить
                            </button>
                        }
                    </div>
                </form>
            </ContentLayout>
        );
    }
}

export default (props: UserPageHOCProps) => (
    <CurrentUserContext.Consumer>
        {currentUser => <UserPage userId={Number(props.userId)} currentUser={currentUser} />}
    </CurrentUserContext.Consumer>
);