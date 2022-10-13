import { useCallback, useState, memo } from "react"

import { useAuth } from "../shared/hooks/auth/use-auth";

export const ForgotPassword = memo(() => {
    const [state, setState] = useState({
        email: "",
        message: "",
        error: ""
    });
    const { forgotPassword } = useAuth();

    const handleForgotPassword = useCallback((e) => {
        e.preventDefault();
        setState({ message: "", error: "" });
        forgotPassword(state.email)
        .then(data => {
            if (data.error) {
                setState({ error: data.error });
            } else {
                setState({ message: data.message });
            }
        });
    }, [state.email, setState, forgotPassword]);

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">Ask for Password Reset</h2>

            {state.message && (
                <h4 className="bg-success">{state.message}</h4>
            )}
            {state.error && (
                <h4 className="bg-warning">{state.error}</h4>
            )}

            <form>
                <div className="form-group mt-5">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Your email address"
                        value={state.email}
                        name="email"
                        onChange={e =>
                            setState({
                                email: e.target.value,
                                message: "",
                                error: ""
                            })
                        }
                        autoFocus
                    />
                </div>
                <button
                    onClick={handleForgotPassword}
                    className="btn btn-raised btn-primary"
                >
                    Send Password Rest Link
                </button>
            </form>
        </div>
    )
})