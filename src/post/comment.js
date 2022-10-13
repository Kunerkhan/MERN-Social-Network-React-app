import { memo, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../shared/icons/AvatarIcon.jpeg";
import { useAuth } from "../shared/hooks/auth/use-auth";

export const Comment = memo(({ comments, addComment, deleteComment }) => {
    const [state, setState] = useState({ text: "", error: "" });
    const { isAuthenticated } = useAuth();

    const onChange = useCallback((e) => {
        setState({ ...state, error: "", text: e.target.value });
    }, [state, setState]);

    const isValid = useCallback(() => {
        const { text } = state;

        if (!text.length > 0 || text.length > 150) {
            setState(prevState => ({
                ...prevState,
                error:
                    "Comment should not be empty and less than 150 characters long"
            }));

            return false;
        }

        return true;
    }, [state])

    const onSubmit = useCallback((event) => {
        event.preventDefault();

        if (!isAuthenticated().token) {
            setState(prevState => ({
                ...prevState,
                error:
                    "Please sign in to leave a comment"
            }));
        }

        if (isValid()) {
            addComment(state.text);
            setState({ text: "", error: "" });
        }
    }, [state.text, isAuthenticated, isValid, addComment]);

    return (
        <div>
            <h2 className="mt-5 mb-5">Leave a comment</h2>

            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <input
                        className="form-control"
                        type="text"
                        value={state.text}
                        onChange={onChange}
                    />

                    <button className="btn btn-raised btn-success mt-2">
                        Post
                    </button>
                </div>
            </form>

            {state.error && (
                <div
                    className="alert alert-danger"
                    style={{
                        display: state.error ? "" : "none"
                    }}
                >
                    {state.error}
                </div>
            )}

            <hr />

            <div className="col-md-14">
                <h3 className="text-primary">
                    {comments.length} Comments
                </h3>
                <hr />
                {
                    comments.map(comment => (
                        <div key={comment._id}>
                            <div>
                                <Link to={`/user/${comment.postedBy._id}`}>
                                    <img
                                        style={{ borderRadius: "50%", border: "1px solid black" }}
                                        className="float-left mr-2"
                                        height="30px"
                                        width="30px"
                                        src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                                        alt={comment.postedBy.title}
                                        onError={i => (i.target.src = `${DefaultProfile}`)}
                                    />

                                </Link>
                                <div>
                                    <p className="lead">
                                        {comment.text}
                                    </p>
                                    <br />

                                    <p className="form-italic mark">
                                        Posted by{" "}
                                        <Link to={`/user/${comment.postedBy._id}`}>
                                            {comment.postedBy.name}{" "}

                                        </Link>
                                        on{" "}
                                        {new Date(comment.created).toDateString()}

                                        {isAuthenticated().user && isAuthenticated().user._id === comment.postedBy._id && (

                                            <span
                                                className="text-danger float-right mr-1"
                                                onClick={() => deleteComment(comment)}
                                            >
                                                Delete post
                                            </span>
                                        )
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
})