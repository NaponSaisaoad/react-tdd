import { Component } from "react";
import axios from "axios";
import Input from "./components/input";
import { withTranslation } from "react-i18next"

class SignUpPage extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordRepeat: '',
        apiProgress: false,
        signUpSuccess: false,
        errors: ''
    }

    onChange = (event) => {
        const { id, value } = event.target;
        this.setState({
            [id]: value
        })
    }

    submit = (event) => {
        event.preventDefault();
        const { username, email, password } = this.state;
        const body = {
            username, email, password
        }
        this.setState({ apiProgress: true })
        this.setState({ signUpSuccess: true })
        try {
            axios.post("/api/1.0/users", body)
        } catch (error) {
            this.setState({errors: "Username cannot be null"})
        }
    }

    onChangePasswordRepeat = (event) => {
        const currentValue = event.target.value;
        this.setState({
            passwordRepeat: currentValue,
        })
    }

    render() {
        const { t } = this.props;
        let disabled = true;
        const { password, passwordRepeat, apiProgress, signUpSuccess, errors } = this.state;
        if (password && passwordRepeat) {
            disabled = password !== passwordRepeat
        }
        return (
            <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
                {!signUpSuccess &&
                    <form className="card mt-5" data-testid="form-sign-up">
                        <div className="card-herder">
                            <h1> { t('signUp')} </h1>
                        </div>
                        <Input id="username" label="Username" onChange={this.onChange} help={errors.username}/>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="email"> {t('email')} </label>
                            <input id="email" className="form-control" onChange={this.onChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="password"> {t('password')} </label>
                            <input type="password" className="form-control" id="password" onChange={this.onChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="passwordRepeat"> {t('passwordRepeat')}</label>
                            <input type="password" className="form-control" id="passwordRepeat" onChange={this.onChange} />
                        </div>
                        <button className="btn btn-primary" disabled={disabled || apiProgress} onClick={this.submit}>
                            {apiProgress && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}{t('signUp')}</button>
                    </form>
                }
                {signUpSuccess && <div>Please check you e-email to active your account</div>}
            </div>

        )
    }
}

const  SignUpWithTranslation = withTranslation()(SignUpPage);

export default SignUpWithTranslation;