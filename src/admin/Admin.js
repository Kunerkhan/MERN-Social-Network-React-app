import { memo, useEffect, useState } from "react";
import { Users } from "../user/Users";
import { Posts } from "../post/Posts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../shared/hooks/auth/use-auth";

export const Admin = memo(() => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        redirectToHome: false,
    });
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if(isAuthenticated().user.role !== "admin")
        {
            setState(prevState => ({
                ...prevState,
                redirectToHome: true,
            }))
        }
    }, []);

    useEffect(() => {
        if(state.redirectToHome)
        {
            navigate("/");
        }
    }, [state.redirectToHome]);


    return (
        <div>
            <div className="jumbotron">
                <h2>Admin Dashboard</h2>
                <p className="lead">Welcome to React Frontend</p>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <h2>Posts</h2>
                        <hr />
                        <Posts />
                    </div>
                    <div className="col-md-6">
                        <h2>Users</h2>
                        <hr />
                        <Users />
                    </div>
                </div>
            </div>
        </div>
    )
})