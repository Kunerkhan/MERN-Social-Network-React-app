import React, { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../shared/hooks/auth/use-auth";

export const Menu = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, handleSignOut } = useAuth();

    const isLinkActive = useCallback((path) => 
        location.pathname === path ? {color: "#ff9900"} : { color: "#fff"},
        [location.pathname]);

    return(    
    <div>
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link 
                    className="nav-link" 
                    style={isLinkActive("/")} 
                    to="/">
                        Home
                </Link>
            </li>
            <li className="nav-item">
                <Link 
                    className="nav-link" 
                    style={isLinkActive("/users")} 
                    to="/users">
                        Users
                </Link>
            </li>
            {
                !isAuthenticated() && (
                    <>
                        <li className="nav-item">
                            <Link 
                                className="nav-link" 
                                style={isLinkActive("/signin")} 
                                to="/signin">
                                    Sign In
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className="nav-link" 
                                style={isLinkActive("/signup")} 
                                to="/signup">
                                    Sign Up
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className="nav-link"
                                to="/post/create"
                                style={isLinkActive('/post/create')} 
                            >
                                Create post
                            </Link>
                        </li>
                    </>
                )
            }
            {isAuthenticated() && isAuthenticated().user.role === "admin" && (
                <li className="nav-item">
                    <Link
                        to={`/admin`}
                        style={isLinkActive('/admin')}
                        className="nav-link"
                    >
                        Admin
                    </Link>
                </li>
            )}

            {
                isAuthenticated() && (
                    <>
                        <li className="nav-item">
                            <Link 
                                className="nav-link"
                                to={`user/${isAuthenticated().user._id}`}
                                style={isLinkActive(`/user/${isAuthenticated().user._id}`)} 
                            >
                                {`${isAuthenticated().user.name}'s profile`}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className="nav-link"
                                to="/findpeople"
                                style={isLinkActive('/findpeople')} 
                            >
                                Find people
                            </Link>
                        </li>
                        <li className="nav-item">
                            <span
                                className="nav-link" 
                                style={{ color: "#fff", cursor: "pointer"}}
                                onClick={() => handleSignOut(() => navigate("/"))}
                            >
                                Sign Out
                            </span>
                        </li>
                    </>

                )
            }

        </ul>
        
    </div>)
}