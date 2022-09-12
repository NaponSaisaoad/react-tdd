import { Component } from "react";
import axios from "axios";

class SignUpPage extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordRepeat: '',
        apiProgress: false
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
        this.setState({apiProgress: true})
        axios.post("/api/1.0/users", body)
    }

    onChangePasswordRepeat = (event) => {
        const currentValue = event.target.value;
        this.setState({
            passwordRepeat: currentValue,
        })
    }

    render() {
        let disabled = true;
        const { password, passwordRepeat, apiProgress } = this.state;
        if (password && passwordRepeat) {
            disabled = password !== passwordRepeat
        }
        return (
            <div>
                <form>
                    <h1>Sign Up</h1>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label"> Username </label>
                        <input id="username" className="form-control" onChange={this.onChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="email"> Email </label>
                        <input id="email" className="form-control" onChange={this.onChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="password"> Password </label>
                        <input type="password" className="form-control" id="password" onChange={this.onChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="passwordRepeat"> Password Repeat</label>
                        <input type="password" className="form-control" id="passwordRepeat" onChange={this.onChange} />
                    </div>
                    <button className="btn btn-primary" disabled={disabled || apiProgress} onClick={this.submit}>
                    {apiProgress && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}Sign Up</button>
                </form>
                <div>Please check you e-email to active your account</div>
            </div>
            
        )
    }
}

export default SignUpPage;