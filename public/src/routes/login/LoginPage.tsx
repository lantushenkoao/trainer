import * as React from 'react';
import './LoginPage.scss';

interface LoginPageState {
    username: string;
    password: string;
}

interface LoginPageProps {
    onLogin: (username: string, password: string) => void
}

class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
    constructor(props: LoginPageProps){
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    changeUsername(username: string) {
        this.setState({username});
    }

    changePassword(password: string) {
        this.setState({password});
    }

    onLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.props.onLogin(this.state.username, this.state.password)
    }

    render() {
        return (
            <div styleName="container">
                <div styleName="container__helper">
                    <form styleName="container__form"
                          onSubmit={(e) => this.onLogin(e)}>

                        <label styleName="container__form__label" htmlFor="username">Логин</label>
                        <input className="input"
                               id="username"
                               name="username"
                               value={this.state.username}
                               onChange={(e) => this.changeUsername(e.target.value)}
                               required={true}
                               maxLength={20}/>

                        <label styleName="container__form__label" htmlFor="password">Пароль</label>
                        <input className="input"
                               id="password"
                               name="password"
                               value={this.state.password}
                               type="password"
                               onChange={(e) => this.changePassword(e.target.value)}
                               required={true}
                               minLength={6}
                               maxLength={20}/>

                        <div styleName="container__form__submit-button">
                            <input type="submit"
                                   className="button"
                                   styleName="container__form__submit-button"
                                   value="Войти"/>
                        </div>

                    </form>
                </div>
            </div>
        );
    }
}

export default (props: LoginPageProps) => <LoginPage {...props}/>;
