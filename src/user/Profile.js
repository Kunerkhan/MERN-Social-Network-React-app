import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../shared/hooks/auth/use-auth";
import { getUser, followUser, unfollowUser } from "./api";
import { getPostsByUserId } from "../post/api";

import DefaultProfile from "../shared/icons/AvatarIcon.jpeg";
import { DeleteUser } from "./DeleteUserDialog";
import { FollowProfileButton } from "./FollowProfileButton";
import { ProfileTabs } from "./ProfileTabs";

export const Profile = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        id: "",
        user: {
            following: [],
            followers: [],
            posts: [],
        },
        reditectToSignIn: false,
        following: false,
    });
    const { userId } = useParams();
    const { isAuthenticated } = useAuth();
    const token = useMemo(() => isAuthenticated().token, [isAuthenticated]);

    const checkFollow = useCallback((user) => {
        const jwt = isAuthenticated();

        const match = user.followers.find(follower => follower._id === jwt.user._id);

        return match;
    }, [isAuthenticated]);

    const handleFollow = useCallback(() => {
        const followId = isAuthenticated().user._id;

        followUser(userId, token, followId)
            .then(data => {
                if (data.error) {
                    setState({ ...state, error: data.error })
                } else {
                    setState({ ...state, user: data, following: !state.following })
                }
            });
    }, [userId, state, token, isAuthenticated, setState]);

    const getUserPosts = useCallback((id) => {
        getPostsByUserId(id, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                }
                else {
                    setState(prevState => ({
                        ...prevState,
                        user: {
                            ...prevState.user,
                            posts: data.posts
                        }
                    }));
                }
            })
    }, [token])

    const handleUnfollow = useCallback(() => {
        const unfollowId = isAuthenticated().user._id;

        unfollowUser(userId, token, unfollowId)
            .then(data => {
                if (data.error) {
                    setState({ ...state, error: data.error })
                } else {
                    setState({ ...state, user: data, following: !state.following });

                }
            })
    }, [userId, state, token, isAuthenticated, setState]);

    const init = useCallback(() =>
        getUser(userId, token)
            .then(data => {
                if (data.error) {
                    setState({ ...state, reditectToSignIn: true });
                } else {
                    let following = checkFollow(data);
                    setState({ ...state, user: data, id: data._id, following });
                }
            }),
        [userId, token, state, checkFollow, setState]);


    useEffect(() => {
        if (state.reditectToSignIn) {
            navigate('/signin');
        }
    }, [state.reditectToSignIn, navigate]);

    useEffect(() => {
        if (userId) {
            init();
            getUserPosts(userId);
        }

    }, [userId]);

    console.log(state);

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">
                Profile
            </h2>
            <div className="row">
                <div className="col-md-4">
                    <img
                        className="img-thumbnail"
                        style={{
                            width: "auto",
                            height: "200px",
                        }}
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${userId}?${new Date().getTime()}`}
                        onError={i => (i.target.src = `${DefaultProfile}`)}
                        alt={state.user?.name}
                    />
                </div>

                <div className="col-md-8">
                    <div className="lead mt-2">
                        <p>Hello, {state.user?.name}</p>
                        <p>Email: {state.user?.email}</p>
                        <p>
                            {`Joined 
                                ${new Date(state.user?.created)
                                    .toDateString()}`
                            }
                        </p>
                    </div>
                    {isAuthenticated().user && isAuthenticated().user._id === state.id ? (
                        <div className="d-inline-block">
                            <Link
                                className="btn btn-raised btn-info mr-5"
                                to={`/post/create`}
                            >
                                Create post
                            </Link>
                            <Link
                                className="btn btn-raised btn-success mr-5"
                                to={`/edit/${state.id}`}
                            >
                                Edit profile
                            </Link>
                            <DeleteUser />
                        </div>
                    ) : (
                        <FollowProfileButton
                            following={state.following}
                            onFollow={handleFollow}
                            onUnfollow={handleUnfollow}
                        />
                    )}



                </div>
            </div>

            <div>
                {isAuthenticated().user &&
                    isAuthenticated().user.role === "admin" && (
                        <div class="card mt-5">
                            <div className="card-body">
                                <h5 className="card-title">
                                    Admin
                                </h5>
                                <p className="mb-2 text-danger">
                                    Edit/Delete as an Admin
                                </p>
                                <Link
                                    className="btn btn-raised btn-success mr-5"
                                    to={`/user/edit/${state.user.id}`}
                                >
                                    Edit Profile
                                </Link>
                                <DeleteUser />
                            </div>
                        </div>
                    )}
            </div>

            <div className="row">
                <div className="col md-12 mt-5 mb-5">

                    {
                        state.user?.about && (
                            <>
                                <hr />

                                <p className="lead">
                                    {state.user?.about}
                                </p>
                            </>
                        )
                    }
                    <hr />

                    <ProfileTabs
                        followers={state.user.followers}
                        following={state.user.following}
                        posts={state.user.posts}
                    />
                </div>
            </div>
        </div>
    )
}