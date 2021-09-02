import React from "react";
import {Link} from "react-router-dom";
import { validations  } from "../utilities/validations";

class Login extends React.Component {
    constructor(props) {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {
                email: "",
                password: ""
            }
        };
    }


    handleChange = ({target}) => {
        let {name, value} = target;
        let {errors} = this.state;
        validations(errors, name, value);
        this.setState({[name]: value, errors});

    }

    handleSubmit = (event) => {
        event.preventDefault();
    }

    render() {
        let {email, password} = this.state.errors;
        return (
            <main>
                <section className="mt-20">
                    <form className="w-1/3 mx-auto border border-gray-400 p-6 rounded-md shadow-md" onSubmit={this.handleSubmit}>
                        <div className="text-center">
                            <legend className="text-2xl font-bold">Sign In</legend>
                            < Link to="/register">
                                <span className="text-green-700 text-lg text-center"> New here? </span>
                            </Link>
                        </div>
                        <fieldset className="my-3">

                            <input className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md"type="text" placeholder="Enter Email" value={this.state.email} name="email" onChange={(e) => this.handleChange(e)}/>
                            <span className="text-red-500">{email}</span>

                            <input className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md"type="password" placeholder="Enter Password" value={this.state.password} name="password" onChange={(e) => this.handleChange(e)}/>
                            <span className="text-red-500">{password}</span>

                            <input type="submit" value="Log In" className="block w-full my-6 py-2 px-3 btn btn-green cursor-pointer" disabled={password || email}/>

                        </fieldset>
                    </form>
                </section>
            </main>
        )
    }
}

export default Login;