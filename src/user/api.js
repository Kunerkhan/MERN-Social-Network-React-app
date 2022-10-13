export const getUser = (userId, token) =>
    fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .catch(err => { console.log(err)});

export const getUsersList = () =>
    fetch(`${process.env.REACT_APP_API_URL}/users/`, {
        method: "GET",
    })
    .then(res => res.json())
    .catch(err => { console.log(err)});

export const deleteUser = (userId, token) =>
    fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "Delete",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .catch(err => { console.log(err)});

export const updateUser = (userId, user, token) =>
    fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: user,
    })
    .then(res => res.json())
    .catch(err => { console.log(err)});

export const updateLocalStorage = (user, next) => {
    if(typeof window !== "undefined")
    {
        if(localStorage.getItem("jwt")) {
            let auth = JSON.parse(localStorage.getItem("jwt"));
            auth.user = user;
            localStorage.setItem("jwt", JSON.stringify(auth));
            
            next();
        }
    }
}

export const followUser = (userId, token, followId) =>
    fetch(`${process.env.REACT_APP_API_URL}/user/follow`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            userId,
            followId
        }),
    })
    .then(res => res.json())
    .catch(err => { console.log(err)});

export const unfollowUser = (userId, token, unfollowId) =>
    fetch(`${process.env.REACT_APP_API_URL}/user/unfollow`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            userId,
            unfollowId
        }),
    })
    .then(res => res.json())
    .catch(err => { console.log(err)});

export const findPeople = (userId, token) =>
    fetch(`${process.env.REACT_APP_API_URL}/user/findpeople/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    .then(res => res.json())
    .catch(err => { console.log(err)});