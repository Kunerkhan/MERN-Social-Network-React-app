
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import DefaultPostImage from "../shared/icons/PostIcon.jpeg";

import { getPosts } from "./api";

export const Posts = () => {
    const [state, setState] = useState({
        posts: [],
        page: 1,
    });

    const renderPosts = () => (
        <div className="row">
            {state?.posts?.map(post => (
                <div
                    className="card col-md-4"
                    key={post._id}
                >
                    <img
                        className="img-thumbnail mb-3"
                        style={{
                            width: "100%",
                            height: "200px",
                        }}
                        src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                        alt={post.name}
                        onError={i => i.target.src = `${DefaultPostImage}`}
                    />
                    <div className="card-body">
                        <h5 className="card-title">{post.title}</h5>
                        <p className="card-text">{post.body.substring(0, 100)}</p>
                        <br />
                        <p className="font-italic mark">
                            Posted by:{" "}
                            <Link to={post?.postedBy?._id ? `/user/${post?.postedBy?._id}` : ""}>{post?.postedBy?.name || "Unknown"}</Link>
                            {" "} on {new Date(post.created).toDateString()}
                        </p>
                        <Link
                            to={`/posts/${post._id}`}
                            className="btn btn-raised btn-primary btn-sm"
                        >
                            Read more
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );

    const loadPosts = page => {
        getPosts(page)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                }
                else {
                    setState({ ...state, posts: data });
                }
            });
    };

    const loadMore = number => {
        setState({ ...state, page: state.page + number });
    };

    const loadLess = number => {
        setState({ ...state, page: state.page - number });
    };

    useEffect(() => {
        loadPosts(state.page);
    }, [state.page]);

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">
                {!state?.posts?.length ? "Loading..." : "Recent Posts"}
            </h2>

            {renderPosts()}

            {state?.page > 1 ? (
                <button
                    className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
                    onClick={() => loadLess(1)}
                >
                    Previous ({state.page - 1})
                </button>
            ) : ""}

            {state?.posts?.length ? (
                <button
                    className="btn btn-raised btn-success mt-5 mb-5"
                    onClick={() => loadMore(1)}
                >
                    Next ({state.page + 1})
                </button>
            ) : ""}
        </div>
    )
}