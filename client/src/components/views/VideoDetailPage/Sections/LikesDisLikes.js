import React, { useEffect, useState } from "react";
import { Tooltip, Icon } from "antd";
import Axios from "axios";

function LikesDisLikes(props) {
	// like
	const [likes, setLikes] = useState(0);
	const [likeAction, setLikeAction] = useState(null);

	// dislike
	const [dislikes, setDislikes] = useState(0);
	const [dislikeAction, setDislikeAction] = useState(null);

	let variable = {};

	if (props.video) {
		variable = { videoId: props.videoId, userId: props.userId };
	} else {
		variable = { commentId: props.commentId, userId: props.userId };
	}

	useEffect(() => {
		// likes data 가져오기
		Axios.post("/api/like/getLikes", variable).then((response) => {
			if (response.data.success) {
				// 얼마나 많은 like를 받았는지
				setLikes(response.data.likes.length);

				// 내가 이미 그 like를 눌렀는지
				response.data.likes.map((like) => {
					if (like.userId === props.userId) {
						setLikeAction("liked");
					}
				});
			} else {
				alert("Likes의 정보를 가져오지 못했습니다.");
			}
		});

		// dislikes	data 가져오기
		Axios.post("/api/like/getDisLikes", variable).then((response) => {
			if (response.data.success) {
				// 얼마나 많은 dislike를 받았는지
				setDislikes(response.data.dislikes.length);

				// 내가 이미 그 dislike를 눌렀는지
				response.data.dislikes.map((dislike) => {
					if (dislike.userId === props.userId) {
						setDislikeAction("disliked");
					}
				});
			} else {
				alert("Dislikes의 정보를 가져오지 못했습니다.");
			}
		});
	}, []);

	const onLike = () => {
		if (likeAction === null) {
			// like이 클릭이 되어있지 않았던 경우
			Axios.post("/api/like/upLike", variable).then((response) => {
				if (response.data.success) {
					setLikes(likes + 1);
					setLikeAction("liked");

					if (dislikeAction !== null) {
						setDislikeAction(null);
						setDislikes(dislikes - 1);
					}
				} else {
					alert("likes를 올리지 못했습니다.");
				}
			});
		} else {
			// like이 클릭이 되어있던 경우
			Axios.post("/api/like/unLike", variable).then((response) => {
				if (response.data.success) {
					setLikes(likes - 1);
					setLikeAction(null);
				} else {
					alert("likes를 내리지 못했습니다.");
				}
			});
		}
	};

	const onDislike = () => {
		if (dislikeAction !== null) {
			// dislike이 이미 클릭되어있을 경우
			Axios.post("/api/like/unDislike", variable).then((response) => {
				if (response.data.success) {
					setDislikes(dislikes - 1);
					setDislikeAction(null);
				} else {
					alert("dislike을 내리지 못했습니다.");
				}
			});
		} else {
			// dislike이 클릭되어있지 않은 경우
			Axios.post("/api/like/upDislike", variable).then((response) => {
				if (response.data.success) {
					setDislikes(dislikes + 1);
					setDislikeAction("disliked");

					if (likeAction !== null) {
						setLikeAction(null);
						setLikes(likes - 1);
					}
				} else {
					alert("dislike을 내리지 못했습니다.");
				}
			});
		}
	};

	return (
		<div>
			<span>
				<Tooltip title="Like">
					<Icon
						type="like"
						theme={likeAction === "liked" ? "filled" : "outlined"}
						onClick={onLike}
					/>
				</Tooltip>
				<span
					style={{ paddingLeft: "8px", cursor: "auto", marginRight: "10px" }}
				>
					{likes}
				</span>
			</span>

			<span key="comment-basic-like">
				<Tooltip title="Dislike">
					<Icon
						type="dislike"
						theme={dislikeAction === "disliked" ? "filled" : "outlined"}
						onClick={onDislike}
					/>
				</Tooltip>
				<span
					style={{ paddingLeft: "8px", cursor: "auto", marginRight: "10px" }}
				>
					{dislikes}
				</span>
			</span>
		</div>
	);
}

export default LikesDisLikes;
