import { Link } from "react-router-dom";
import DefaultProfile from "../shared/icons/AvatarIcon.jpeg";

export const ProfileTabs = ({ followers, following, posts }) => {

    return (
        <div>
            <div className="row">
                <div className="col-md-4">
                    <h3 className="text-primary">
                        Followers
                    </h3>
                    <hr />
                    {
                        followers.map(person => (
                            <div key={person._id}>
                                <div>
                                    <Link to={`/user/${person._id}`}>
                                        <img
                                            style={{ borderRadius: "50%", border: "1px solid black" }}
                                            className="float-left mr-2"
                                            height="30px"
                                            width="30px"
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                                            alt={person.name}
                                            onError={i => (i.target.src = `${DefaultProfile}`)}
                                        />
                                        <div>
                                            <p className="lead">
                                                {person.name}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className="col-md-4">
                    <h3 className="text-primary">
                        Following
                    </h3>
                    <hr />
                    {
                        following.map(person => (
                            <div key={person._id}>
                                <div>
                                    <Link to={`/user/${person._id}`}>
                                        <img
                                            style={{ borderRadius: "50%", border: "1px solid black" }}
                                            className="float-left mr-2"
                                            height="30px"
                                            width="30px"
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                                            alt={person.title}
                                            onError={i => (i.target.src = `${DefaultProfile}`)}
                                        />
                                        <div>
                                            <p className="lead">
                                                {person.tile}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className="col-md-4">
                    <h3 className="text-primary">
                        Posts
                    </h3>
                    <hr />

                    {
                        posts?.map(post => (
                            <div key={post._id}>
                                <div>
                                    <Link to={`/posts/${post._id}`}>
                                        <div>
                                            <p className="lead">
                                                {post.title}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

        </div>
    )
}