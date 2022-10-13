import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../shared/hooks/auth/use-auth";
import { deleteUser } from "./api";

export const DeleteUser = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const { isAuthenticated, handleSignOut } = useAuth();
    const token = useMemo(() => isAuthenticated().token, [isAuthenticated]);
    const [ state, setState ] = useState({
        redirect: false,
    });

    const deleteAccount = useCallback(() => {
        deleteUser(userId, token)
        .then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                handleSignOut(() => console.log("User is deleted"));
                setState({ redirect: true });
            }
        }) 
    }, [userId, token, handleSignOut]);

    const deleteConfirmed = useCallback(() => {
        let answer = window.confirm("Are you sure you want to delete your account?");

        if(answer) {
            deleteAccount();
        }
    }, [deleteAccount]);

    useEffect(() => {
        if(state.redirect)
        {
            navigate("/signin")
        }
    }, [state, navigate])

    return (
        <button 
            className="btn btn-raised btn-danger"
            onClick={deleteConfirmed}
        >
            Delete profile
        </button>
    )
}