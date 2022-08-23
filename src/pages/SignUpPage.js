import {Component} from "react";

class SignUpPage extends Component {
    render() {
        return (
            <div> 
            <h1>Sign Up</h1>
            <label htmlFor="username"> Username </label>
            <input id="username"/>
            <label  htmlFor="email"> Email </label>
            <input id="email"/>
            <label  htmlFor="password"> Password </label>
            <input type="password" id="password"/>
            <label  htmlFor="passwordRepeat"> Password Repeat</label>
            <input type="password" id="passwordRepeat"/>
            <button disabled>Sign Up</button>
            </div> 
        )
    }
}

export default SignUpPage;