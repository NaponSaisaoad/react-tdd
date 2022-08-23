import {Component} from "react";

class SignUpPage extends Component {
    state = {
        password: '',
        passwordRepeat: ''
    }

    onChangePassword = (event) => {
        const currentValue = event.target.value;
        this.setState({
            password: currentValue,
        })
    }

    onChangePasswordRepeat = (event) => {
        const currentValue = event.target.value;
        this.setState({
            passwordRepeat: currentValue,
        })
    }

    render() {
       let disabled = true;
       const { password, passwordRepeat} = this.state;
       if (password && passwordRepeat) {
        disabled = password !== passwordRepeat
       }
        return (
            <div> 
            <h1>Sign Up</h1>
            <label htmlFor="username"> Username </label>
            <input id="username"/>
            <label  htmlFor="email"> Email </label>
            <input id="email"/>
            <label  htmlFor="password"> Password </label>
            <input type="password" id="password" onChange={this.onChangePassword}/>
            <label  htmlFor="passwordRepeat"> Password Repeat</label>
            <input type="password" id="passwordRepeat" onChange={this.onChangePasswordRepeat}/>
            <button disabled={disabled}>Sign Up</button>
            </div> 
        )
    }
}

export default SignUpPage;