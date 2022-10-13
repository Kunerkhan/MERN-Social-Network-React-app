export const FollowProfileButton = ({ following, onFollow, onUnfollow }) => {

    return(
        <div className="d-inline-block">
            {
               following ? (
                    <button 
                        className="btn btn-warning btn-raised"
                        onClick={onUnfollow}
                    >
                        Unfollow
                    </button>
                ) : (
                    <button 
                    className="btn btn-success btn-raised mr-5"
                    onClick={onFollow}
                    >
                        Follow
                    </button> 
                )
            }
        </div>
    )
}