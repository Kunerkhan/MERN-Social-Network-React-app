
import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Link } from "react-router-dom";

import { findPeople, followUser } from "./api";
import DefaultProfile from "../shared/icons/AvatarIcon.jpeg";
import { useAuth } from "../shared/hooks/auth/use-auth";

export const FindPeople = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [followMessage, setFollowMessage] = useState("");
    const { isAuthenticated } = useAuth();
    const userId = useMemo(() => isAuthenticated().user._id, [isAuthenticated]);
    const token = useMemo(() => isAuthenticated().token, [isAuthenticated]);

    const handleFollow = useCallback((user, i) => {
        followUser(userId, token, user._id)
        .then(data => {
            if(data.error) {
                setError(data.error)
            } else {
                let toFollow = users;
                toFollow.splice(i, 1)

                setUsers(toFollow);
                setOpen(prev => !prev);
                setFollowMessage(`Following ${user.name}`)
            }
        });
    }, [userId, token, users, setError, setUsers, setFollowMessage]);

    const renderUsers = () => (
        <div className="row">
            {users?.map((user, i) => (
                <div 
                    className="card col-md-4" 
                    key={i}
                >
                    <img
                        className="img-thumbnail" 
                        style={{
                            width: "auto",
                            height: "200px",
                        }}
                        src={user?.photo || DefaultProfile}
                        alt={user?.name}
                    />
                    <div className="card-body">
                        <h5 className="card-title">{user?.name}</h5>
                        <p className="card-text">{user?.email}</p>
                        <Link
                            to={`/user/${user?._id}`}
                            className="btn btn-raised btn-primary btn-sm"
                        >
                            View Profile
                        </Link>

                        <button 
                            className="btn btn-raised btn-info float-right btn-sm"
                            onClick={() => handleFollow(user, i)}
                        >
                            Follow
                        </button>
                    </div>
                </div>
            ))}
    </div>
    )

    useEffect(() => {
        if(userId && token)
        {
            findPeople(userId, token)
                .then(data => {
                    if(data.error) {
                        console.log(data.error)
                    }
                    else {
                        setUsers(data);
                    }
                });
        }

    }, [setUsers, userId, token, isAuthenticated]);

    return(
        <div className="container">
            <h2 className="mt-5 mb-5">
                Find people
            </h2>

            { open &&
                <div className="alert alert-success">
                    <p>{followMessage}</p> 
                </div>
            }

            {renderUsers()}
        </div>
    )
}