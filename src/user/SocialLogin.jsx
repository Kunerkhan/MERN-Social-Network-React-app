import React, { useEffect, useState } from "react";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../shared/hooks/auth/use-auth";

export const SocialLogin = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        redirectToReferrer: false
    });
    const { socialLogin, handleAuthenticate } = useAuth();
    const responseGoogle = response => {
        console.log(response);
        const { googleId, name, email, imageUrl } = response.profileObj;
        const user = {
            password: googleId,
            name: name,
            email: email,
            imageUrl: imageUrl
        };

        socialLogin(user).then(data => {
            console.log("signin data: ", data);
            if (data.error) {
                console.log(data.error, "Error Login. Please try again..");
            } else {
                console.log("signin success - setting jwt: ", data);
                handleAuthenticate(data, () => {
                    setState({ ...state, redirectToReferrer: true });
                });
            }
        });
    };

    useEffect(() => {
        if (state.redirectToReferrer) {
            navigate("/");
        }
    }, [state.redirectToReferrer, navigate]);

    return(
        <div className="container">
        <GoogleLogin
            clientId="264195210314-t25gondsfasjh7m7ro635bfi5ucjb6l4.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
        />
    </div>
    )
}