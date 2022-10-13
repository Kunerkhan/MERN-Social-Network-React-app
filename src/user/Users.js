
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";

import { getUsersList } from "./api";
import DefaultProfile from "../shared/icons/AvatarIcon.jpeg";

export const Users = () => {
    const [users, setUsers] = useState([]);

    const renderUsers = () => (
        <div className="row">
            {users.map(user => (
                <div 
                    className="card col-md-4" 
                    key={user._id}
                >
                    <img
                        className="img-thumbnail" 
                        style={{
                            width: "auto",
                            height: "200px",
                        }}
                        src={user.photo || DefaultProfile}
                        alt={user.name}
                    />
                    <div className="card-body">
                        <h5 className="card-title">{user.name}</h5>
                        <p className="card-text">{user.email}</p>
                        <Link
                            to={`/user/${user._id}`}
                            className="btn btn-raised btn-primary btn-sm"
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            ))}
    </div>
    )

    useEffect(() => {
        getUsersList()
            .then(data => {
                if(data.error) {
                    console.log(data.error)
                }
                else {
                    setUsers(data.users);
                }
            });
    }, [setUsers]);

    return(
        <div className="container">
            <h2 className="mt-5 mb-5">
                Users
            </h2>

            {renderUsers()}
        </div>
    )
}