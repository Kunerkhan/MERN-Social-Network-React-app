
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom";
import DefaultPostImage from "../shared/icons/PostIcon.jpeg";
import { Comment } from "./comment";

import { getPostById, deletePost, likePost, unlikePost, commentPost, uncommentPost } from "./api";
import { useAuth } from "../shared/hooks/auth/use-auth";

export const PostDetails = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({ post: '', deleted: false, like: false, likes: 0, comments: [], redirectToSignIn: false });
    const { postId } = useParams();
    const { isAuthenticated } = useAuth();
    const token = useMemo(() => isAuthenticated().token, [isAuthenticated]);
    const userId = useMemo(() => isAuthenticated().user._id, [isAuthenticated]);

    const removePost = useCallback(() => {
        if (token && postId) {
            deletePost(postId, token)
                .then(data => {
                    if (data.error) {
                        console.log(data.error);
                    }
                    else {
                        setState(prevState => ({
                            ...prevState,
                            deleted: true,
                        }))
                    }
                })
        }
    }, [postId, token]);

    const removeComment = useCallback((comment) => {
        if (token && postId) {
            uncommentPost(userId, token, postId, comment)
                .then(data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        setState(prevState => ({ ...prevState, comments: data.comments }))
                    }
                })
        }
    }, [userId, postId, token]);

    const confirmComentDelete = useCallback((comment) => {
        let answer = window.confirm("Are you sure you want to comment?");

        if (answer) {
            removeComment(comment);
        }
    }, [removeComment]);

    const confirmDelete = useCallback(() => {
        let answer = window.confirm("Are you sure you want to delete post?");

        if (answer) {
            removePost();
        }
    }, [removePost]);

    const like = useCallback(() => {
        let callApi = state.like ? unlikePost : likePost;

        if (!userId) {
            setState(prevState => ({ ...prevState, redirectToSignIn: true }))
        }

        callApi(userId, token, postId)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setState(prevState => ({
                        ...prevState,
                        like: !prevState.like,
                        likes: data.likes.length,
                    }))
                }
            })
    }, [postId, userId, state.like, token]);

    const checkLike = useCallback((likes) => {
        let match = likes.indexOf(userId) !== -1;

        return match;
    }, [userId])

    const addComment = useCallback((text) => {
        commentPost(userId, token, postId, { text })
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    setState(prevState => ({ ...prevState, comments: data.comments }))
                }
            })
    }, [userId, token, postId]);

    const renderPost = () => (
        <div className="card">
            <img
                className="img-thumbnail mb-3"
                style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover"
                }}
                src={`${process.env.REACT_APP_API_URL}/post/photo/${state?.post?._id}`}
                alt={state?.post?.name}
                onError={i => i.target.src = `${DefaultPostImage}`}
            />

            {state.like ? (
                <h3 onClick={like}>
                    <i
                        className="fa fa-thumbs-up text-success bg-dark"
                        style={{ padding: '10px', borderRadius: '50%' }}
                    />{' '}
                    {state.likes} Like
                </h3>
            ) : (
                <h3 onClick={like}>
                    <i
                        className="fa fa-thumbs-up text-warning bg-dark"
                        style={{ padding: '10px', borderRadius: '50%' }}
                    />{' '}
                    {state.likes} Like
                </h3>
            )}
            <div className="card-body">
                <p className="card-text">{state?.post?.body}</p>
                <br />
                <p className="font-italic mark">
                    Posted by:{" "}
                    <Link to={state?.post?.postedBy?._id ? `/user/${state?.post?.postedBy?._id}` : ""}>{state?.post?.postedBy?.name || "Unknown"}</Link>
                    {" "} on {new Date(state?.post?.created).toDateString()}
                </p>
                <div className="d-inline-block">
                    <Link
                        to="/"
                        className="btn btn-raised btn-primary btn-sm mr-5"
                    >
                        Back to posts
                    </Link>
                    {isAuthenticated().user && isAuthenticated().user._id === state?.post?.postedBy?._id && (
                        <>
                            <Link
                                to={`/post/edit/${postId}`}
                                className="btn btn-raised btn-warning btn-sm mr-5"
                            >
                                Update post
                            </Link>
                            <button
                                className="btn btn-raised btn-warning btn-sm mr-5"
                            >

                            </button>
                            <button
                                className="btn btn-raised btn-danger btn-sm mr-5"
                                onClick={confirmDelete}
                            >
                                Delete post
                            </button>
                        </>)
                    }

                    <div>
                        {isAuthenticated().user &&
                            isAuthenticated().user.role === "admin" && (
                                <div class="card mt-5">
                                    <div className="card-body">
                                        <h5 className="card-title">Admin</h5>
                                        <p className="mb-2 text-danger">
                                            Edit/Delete as an Admin
                                        </p>
                                        <Link
                                            to={`/post/edit/${postId}`}
                                            className="btn btn-raised btn-warning btn-sm mr-5"
                                        >
                                            Update Post
                                        </Link>
                                        <button
                                            onClick={confirmComentDelete}
                                            className="btn btn-raised btn-danger"
                                        >
                                            Delete Post
                                        </button>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    )

    useEffect(() => {
        getPostById(postId)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                }
                else {
                    setState(prevState => ({
                        ...prevState,
                        post: data,
                        likes: data.likes.length,
                        like: checkLike(data.likes),
                        comments: data.comments,
                    }));
                }
            });
    }, [postId, checkLike, setState]);

    useEffect(() => {
        if (state.deleted) {
            navigate('/');
        }
    }, [state.deleted, navigate]);

    useEffect(() => {
        if (state.redirectToSignIn) {
            navigate('/signin');
        }
    }, [state.redirectToSignIn, navigate]);

    return (
        <div className="container">
            <h2 className="card-title">{state?.post?.title}</h2>

            {!state?.post ?
                (<div className="jumbotron text-center">
                    <h2>Loading...</h2>
                </div>)
                : renderPost()
            }

            <Comment
                comments={state.comments.reverse()}
                addComment={addComment}
                deleteComment={confirmComentDelete}
            />
        </div>
    )
}