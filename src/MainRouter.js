import React from "react";
import { Route, Routes } from "react-router-dom";

import { Home } from "./core/Home";
import { Menu } from "./core/Menu";
import { SignUp } from "./user/SignUp";
import { SignIn } from "./user/SignIn";
import { Profile } from "./user/Profile";
import { Users } from "./user/Users";
import { FindPeople } from "./user/FindPeople";
import { EditProfile } from "./user/EditProfile";
import { NewPost } from "./post/NewPost";
import { PrivateRoute } from "./auth/PrivateRoute";
import { PostDetails } from "./post/Details";
import { EditPost } from "./post/EditPost";
import { ForgotPassword } from "./user/ForgotPassword";
import { ResetPassword } from "./user/ResetPassword";
import { Admin } from "./admin/Admin";

export const MainRouter = () => (
    <div>
        <Menu />

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
                path="/reset-password/:resetPasswordToken"
                element={<ResetPassword />}
            />
            <Route
                path="/post/create"
                element={
                    <PrivateRoute>
                        <NewPost />
                    </PrivateRoute>
                }
            />
            <Route
                path="/posts/:postId"
                element={<PostDetails />}
            />
            <Route path="/users" element={<Users />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route
                path="/edit/:userId"
                element={
                    <PrivateRoute>
                        <EditProfile />
                    </PrivateRoute>
                }
            />
            <Route
                path="/post/edit/:postId"
                element={
                    <PrivateRoute>
                        <EditPost />
                    </PrivateRoute>
                }
            />
            <Route
                path="/findpeople"
                element={
                    <PrivateRoute>
                        <FindPeople />
                    </PrivateRoute>
                }
            />


            <Route path="/user/:userId" element={<Profile />} />
        </Routes>
    </div>
)