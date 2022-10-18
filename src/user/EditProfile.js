import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../shared/hooks/auth/use-auth";
import { getUser, updateUser, updateLocalStorage } from "./api";
import DefaultProfile from "../shared/icons/AvatarIcon.jpeg";

const initialValues = {
    id: "",
    name: "",
    email: "",
    password: "",
    about: "",
    error: "",
    fileSize: 0,
    loading: false,
    redirectToProfile: false,
};

export const EditProfile = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [state, setState] = useState(initialValues);
    const { isAuthenticated } = useAuth();
    const token = useMemo(() => isAuthenticated().token, [isAuthenticated]);

    const init = useCallback(() =>
        getUser(userId, token)
            .then(data => {
                if (data.error) {
                    setState({ redirectToProfile: false });
                } else {
                    setState({
                        ...state,
                        id: data._id,
                        name: data.name,
                        email: data.email,
                        about: data.about,
                        error: "",
                    });
                }
            }),
        [userId, state, token, setState]);

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
        const { name, email, password, fileSize } = state;

        if (fileSize > 1000000) {
            setState({
                ...state,
                error: "File size should be less than 1 Mb",
                loading: false,
            });
            return false;
        }

        if (name.length === 0) {
            setState({
                ...state,
                error: "Name is required",
                loading: false,
            });
            return false;
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            setState({
                ...state,
                error: "A vaild email is required",
                loading: false,
            });
            return false;
        }


        if (password.length >= 0 && password.length <= 5) {
            setState({
                ...state,
                error: "Password must be at least 6 characters long",
                loading: false,
            });
            return false;
        }

        return true;
    }, [state, setState]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        setState({ ...state, loading: true })

        if (isValid()) {
            const { name, email, password, photo, about } = state;
            let formData = new FormData();
            formData.append('photo', photo);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('about', about);

            updateUser(userId, formData, token)
                .then(data => {
                    if (data.error) setState({ error: data.error })
                    else if (isAuthenticated().user.role === "admin") {
                        setState({
                            ...initialValues,
                            redirectToProfile: true
                        });
                    }
                    else {
                        updateLocalStorage(data, () => {
                            setState({
                                ...initialValues,
                                redirectToProfile: true
                            });
                        });
                    }
                });
        }

    }, [userId, state, token, isValid]);

    const renderForm = useCallback((name, email, password, about) => (
        <form>
            <div className="form-group">
                <label className="text-muted">
                    Profile photo
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
                    Name
                </label>
                <input
                    className="form-control"
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">
                    Email
                </label>
                <input
                    className="form-control"
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">
                    About
                </label>
                <textarea
                    className="form-control"
                    type="text"
                    name="about"
                    value={about}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">
                    Password
                </label>
                <input
                    className="form-control"
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                />
            </div>

            <button
                className="btn btn-raised btn-primary"
                type="submit"
                onClick={handleSubmit}
            >
                Save
            </button>
        </form>
    ), [handleChange, handleSubmit]);

    useEffect(() => {
        if (userId) {
            init();
        }

    }, [userId]);

    useEffect(() => {
        if (state.redirectToProfile) {
            navigate(`/user/${userId}`);
        }
    }, [state.redirectToProfile, userId, navigate]);

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">
                Edit Profile
            </h2>

            {state.loading && (<div className="jumbotron text-center">
                <h2>Loading...</h2>
            </div>)
            }

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

            {
                <img
                    className="img-thumbnail"
                    style={{
                        width: "auto",
                        height: "200px",
                    }}
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${userId}?${new Date().getTime()}`}
                    alt={state.name}
                    onError={i => i.target.src = DefaultProfile}
                />
            }

            {isAuthenticated().user.role === "admin" ||
                (isAuthenticated().user._id === userId &&
                    renderForm(state.name, state.email, state.password, state.about))
            }
        </div>
    )
};