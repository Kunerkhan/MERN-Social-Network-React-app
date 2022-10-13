import { memo, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../shared/hooks/auth/use-auth";

export const ResetPassword = memo(() => {
    const { resetPasswordToken } = useParams();
    const [state, setState] = useState({
        email: "",
        message: "",
        error: ""
    });

    const { resetPassword } = useAuth();

    const handleResetPassword = e => {
        e.preventDefault();
        setState({ message: "", error: "" });
 
        resetPassword({
            newPassword: state.newPassword,
            resetPasswordLink: resetPasswordToken
        }).then(data => {
            if (data.error) {
                console.log(data.error);
                setState({ error: data.error });
            } else {
                console.log(data.message);
                setState({ message: data.message, newPassword: "" });
            }
        });
    };

    return(
        <div className="container">
        <h2 className="mt-5 mb-5">Reset your Password</h2>

        {state.message && (
            <h4 className="bg-success">{state.message}</h4>
        )}
        {state.error && (
            <h4 className="bg-warning">{state.error}</h4>
        )}

        <form>
            <div className="form-group mt-5">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Your new password"
                    value={state.newPassword}
                    name="newPassword"
                    onChange={e =>
                        setState({
                            newPassword: e.target.value,
                            message: "",
                            error: ""
                        })
                    }
                    autoFocus
                />
            </div>
            <button
                onClick={handleResetPassword}
                className="btn btn-raised btn-primary"
            >
                Reset Password
            </button>
        </form>
    </div>  
    )
})