export const getPosts = (page) =>
    fetch(`${process.env.REACT_APP_API_URL}/posts/?page=${page}`, {
        method: "GET",
    })
    .then(res => res.json())
    .catch(err => { console.log(err)});

export const getPostById = (postId) =>
    fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "GET",
    })
    .then(res => res.json())
    .catch(err => { console.log(err)});

export const createPost = (userId, token, post) =>
    fetch(`${process.env.REACT_APP_API_URL}/post/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: post,
    })
    .then(res => res.json())
    .catch(err => { console.log(err)});

export const getPostsByUserId = (userId, token) =>
    fetch(`${process.env.REACT_APP_API_URL}/posts/by/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .catch(err => { console.log(err)});

export const deletePost = (postId, token) =>
    fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .catch(err => { console.log(err)});

export const updatePost = (postId, token, post) =>
    fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: post,
    })
    .then(res => res.json())
    .catch(err => { console.log(err)});

export const likePost = (userId, token, postId) =>
    fetch(`${process.env.REACT_APP_API_URL}/post/like/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            userId,
            postId,
        }),
    })
    .then(res => res.json())
    .catch(err => { console.log(err)});

export const unlikePost = (userId, token, postId) =>
    fetch(`${process.env.REACT_APP_API_URL}/post/unlike/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            userId,
            postId,
        }),
    })
    .then(res => res.json())
    .catch(err => { console.log(err)});

export const commentPost = (userId, token, postId, comment) =>
    fetch(`${process.env.REACT_APP_API_URL}/post/comment/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            userId,
            postId,
            comment
        }),
    })
    .then(res => res.json())
    .catch(err => { console.log(err)});

export const uncommentPost = (userId, token, postId, comment) =>
    fetch(`${process.env.REACT_APP_API_URL}/post/uncomment/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            userId,
            postId,
            comment,
        }),
    })
    .then(res => res.json())
    .catch(err => { console.log(err)});