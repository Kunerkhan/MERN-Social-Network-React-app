

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../shared/hooks/auth/use-auth";
import { SocialLogin } from "./SocialLogin";

const initialValues = {
    email: "",
    password: "",
    error: "",
    redirectToReferer: false,
    loading: false,
};

export const SignIn = () => {
    const navigate = useNavigate();
    const [state, setState] = useState(initialValues);
    const { handleSignIn, handleAuthenticate } = useAuth();

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
        setState({ ...state, loading: true });
        const { email, password, } = state;

        handleSignIn({
            email,
            password,
        })
            .then(data => {
                if (data.error) {
                    setState({ error: data.error, loading: false });
                }
                else {
                    handleAuthenticate(data, () => setState({
                        redirectToReferer: true,
                    }))
                }
            });

    }, [state, handleSignIn, handleAuthenticate, setState]);

    const renderForm = useCallback((email, password) => (
        <form>
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

    useEffect(() => {
        if (state.redirectToReferer) {
            navigate("/");
        }
    }, [state.redirectToReferer, navigate]);

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">
                SignIn
            </h2>

            <hr />
            <SocialLogin />
            <hr />

            <div className="alert alert-danger" style={{
                display: state.error ? "" : "none"
            }}>
                {state.error}
            </div>

            {state.loading && (<div className="jumbotron text-center">
                <h2>Loading...</h2>
            </div>)
            }

            {renderForm(state.email, state.password)}

            <p>
                <Link to="/forgot-password" className="text-danger">
                    {" "}
                    Forgot Password
                </Link>
            </p>
        </div>
    )
}