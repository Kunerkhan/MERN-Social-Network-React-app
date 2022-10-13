
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../shared/hooks/auth/use-auth";

const initialValues = {
    name: "",
    email: "",
    password: "",
    error: "",
    open: false,
};

export const SignUp  = () => {
    const [ state, setState ] = useState(initialValues);
    const { handleSignUp } = useAuth();

    const handleChange = useCallback((e) => {
        setState({
            error: ""
        });
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }, [state, setState]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const { name, email, password, } = state;

        handleSignUp({
            name,
            email,
            password,
        })
        .then(data => {
            if(data.error) setState({ error: data.error })
            else setState({ ...initialValues, open: true })
        });

    }, [state, handleSignUp]);

    const renderForm = useCallback((name, email, password) => (
    <form>
        <div className="form-group">
            <label className="text-muted">
                Name
            </label>
            <input  
                className="form-control" 
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
            />
        </div>

        <div className="form-group">
            <label className="text-muted">
                Email
            </label>
            <input 
                className="form-control"
                type="email" 
                name="email"
                value={email}
                onChange={handleChange}
            />
        </div>


        <div className="form-group">
            <label className="text-muted">
                Password
            </label>
            <input 
                className="form-control"
                type="password" 
                name="password"
                value={password}
                onChange={handleChange}
            />
        </div>

        <button 
            className="btn btn-raised btn-primary" 
            type="submit"
            onClick={handleSubmit}
        >
            Submit
        </button>
    </form>
    ), [handleChange, handleSubmit]);

    return(
        <div className="container">
            <h2 className="mt-5 mb-5">
                SignUp
            </h2>

            <div className="alert alert-danger" style={{
                display: state.error ? "" : "none"
            }}>
                {state.error}
            </div>

            <div className="alert alert-info" style={{
                display: state.open ? "" : "none"
            }}>
                New account is successfully created. Please, 
                <Link to="/signin">login</Link>.
            </div>

            {renderForm(state.name, state.email, state.password)}
        </div>
    )
}