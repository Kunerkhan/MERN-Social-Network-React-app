import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../shared/hooks/auth/use-auth";
import { getPostById, updatePost } from "./api";
import DefaultProfile from "../shared/icons/PostIcon.jpeg";

const initialValues = {
    id: "",
    title: "",
    photo: "",
    body: "",
    error: "",
    fileSize: 0,
    loading: false,
    redirectToProfile: false,
};

export const EditPost = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [state, setState] = useState(initialValues);
    const { isAuthenticated } = useAuth();
    const token = useMemo(() => isAuthenticated().token, [isAuthenticated]);
    const photoUrl = useMemo(() => postId ? 
        `${process.env.REACT_APP_API_URL}/post/photo/${postId}}?${new Date().getTime()}` 
        : DefaultProfile, [postId]);

    const init = useCallback(() => 
        getPostById(postId)
            .then(data => {
                if(data.error) {
                    setState({ redirectToProfile: false });
                } else {
                    setState({ 
                        ...state,
                        id: data._id,
                        title: data.title,
                        body: data.body,
                        error: "",
                     });
                }
            }), 
    [postId, state, setState]);

    const handleChange = useCallback((e) => {
        const value = e.target.name === "photo" ? e.target.files[0] : e.target.value;
        const fileSize = e.target.name === "photo" ? e.target.files[0].size : 0;

        setState({
            ...state,
            [e.target.name]: value,
            fileSize,
        });
    }, [state, setState]);

    const isValid = useCallback(() => {
        const { title, body, fileSize } = state;

        if(fileSize > 1000000)
        {
            setState({ 
                ...state, 
                error: "File size should be less than 1 Mb",
                loading: false,
            });
            return false;
        }

        if(title.length === 0)
        {
            setState({ 
                ...state, 
                error: "Title is required",
                loading: false,
             });
            return false;
        }

        if(body.length === 0)
        {
            setState({ 
                ...state, 
                error: "Body is required",
                loading: false,
             });
            return false;
        }

        return true;
    }, [state, setState]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        setState({ ...state, loading: true })

        if(isValid()) {
            const { title, body, photo } = state;
            let postData = new FormData();

            if(photo)
            {
                postData.append('photo', photo); 
            }
            
            postData.append('title', title);
            postData.append('body', body);
            
            updatePost(postId, token, postData)
                .then(data => {
                    if(data.error) setState({ error: data.error })
                    else {
                        setState({...initialValues, redirectToProfile: true});
                    }
            });
        }

}, [postId, state, token, isValid]);

const renderForm = useCallback((title, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted">
                    Post photo
                </label>
                <input  
                    className="form-control" 
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">
                    Title
                </label>
                <input  
                    className="form-control" 
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange}
                />
            </div>
    
            <div className="form-group">
                <label className="text-muted">
                    Body
                </label>
                <input 
                    className="form-control"
                    type="text" 
                    name="body"
                    value={body}
                    onChange={handleChange}
                />
            </div>
    
            <button 
                className="btn btn-raised btn-primary" 
                type="submit"
                onClick={handleSubmit}
            >
                Update post
            </button>
        </form>
        ), [handleChange, handleSubmit]);

    useEffect(() => {
        if(postId)
        {
            init();
        }

    }, [postId]);

    useEffect(() => {
        if(state.redirectToProfile)
        {
            navigate(`/user/${isAuthenticated().user._id}`);
        }
    }, [state.redirectToProfile, postId, isAuthenticated,  navigate]);

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">
                {state.title}
            </h2>

            {state.loading && (<div className="jumbotron text-center">
                <h2>Loading...</h2>
            </div>)
            }

            { state.error && (
                <div 
                    className="alert alert-danger" 
                    style={{
                        display: state.error ? "" : "none"
                    }}
                >
                    {state.error}
                </div>
            )}    

            {
                <img
                    className="img-thumbnail" 
                    style={{
                        width: "auto",
                        height: "200px",
                    }}
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${postId}?${new Date().getTime()}`} 
                    alt={state.name}
                    onError={i => i.target.src = DefaultProfile}
                />
            }

            {renderForm(state.title, state.body)}
        </div>
    )
};