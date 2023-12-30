import React, { useState } from "react";
import { Comment, Avatar } from "antd";
import { useSelector } from "react-redux";
import Axios from "axios";

import LikesDisLikes from "./LikesDisLikes";

function SingleComment(props) {
	const videoId = props.postId;

	const user = useSelector((state) => state.user);

	const [openReply, setOpenReply] = useState(false);
	const [commentValue, setCommentValue] = useState("");

	const onClickReplyOpen = () => {
		setOpenReply(!openReply);
	};

	const onHandleChange = (event) => {
		setCommentValue(event.currentTarget.value);
	};

	const onSubmit = (event) => {
		event.preventDefault(); // submit button 누를 시 기본적으로 발생하는 refresh 현상 방지

		const variable = {
			content: commentValue,
			writer: user.userData._id,
			postId: videoId,
			responseTo: props.comment._id,
		};

		Axios.post("/api/comment/saveComment", variable).then((response) => {
			if (response.data.success) {
				console.log(response.data.result);
				setCommentValue("");
				onClickReplyOpen();
				props.refreshFunction(response.data.result);
			} else {
				alert("댓글을 저장하지 못했습니다.");
			}
		});
	};

	const actions = [
		<LikesDisLikes
			commentId={props.comment._id}
			userId={localStorage.getItem("userId")}
		/>,
		<span onClick={onClickReplyOpen} key="comment-basic-reply-to">
			Repy to
		</span>,
	];

	return (
		<div>
			<Comment
				actions={actions}
				author={props.comment.writer.name}
				avatar={[<Avatar src={props.comment.writer.image} alt />]}
				content={<p>{props.comment.content}</p>}
			/>

			{openReply && (
				<form style={{ display: "flex" }} onSubmit={onSubmit}>
					<textarea
						style={{ width: "100%", borderRadius: "5px" }}
						onChange={onHandleChange}
						value={commentValue}
						placeholder="코멘트를 작성해 주세요"
					/>
					<br />
					<button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
						Submit
					</button>
				</form>
			)}
		</div>
	);
}

export default SingleComment;
