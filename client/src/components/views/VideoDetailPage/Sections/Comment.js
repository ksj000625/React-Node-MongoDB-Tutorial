import Axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

function Comment(props) {
	const videoId = props.postId;

	const user = useSelector((state) => state.user);

	const [commentValue, setCommentValue] = useState("");

	const handleClick = (event) => {
		setCommentValue(event.currentTarget.value);
	};

	const onSubmit = (event) => {
		event.preventDefault(); // submit button 누를 시 기본적으로 발생하는 refresh 현상 방지

		const variable = {
			content: commentValue,
			writer: user.userData._id,
			postId: videoId,
		};

		Axios.post("/api/comment/saveComment", variable).then((response) => {
			if (response.data.success) {
				console.log(response.data.result);
				setCommentValue("");
				props.refreshFunction(response.data.result);
			} else {
				alert("댓글을 저장하지 못했습니다.");
			}
		});
	};

	return (
		<div>
			<br />
			<p>Replies</p>
			<hr />

			{/** Comment Lists */}
			{props.commentLists &&
				props.commentLists.map(
					(comment, index) =>
						!comment.responseTo && (
							<React.Fragment>
								<SingleComment
									refreshFunction={props.refreshFunction}
									comment={comment}
									postId={videoId}
								/>
								<ReplyComment
									parentCommentId={comment._id}
									refreshFunction={props.refreshFunction}
									commentLists={props.commentLists}
									postId={videoId}
								/>
							</React.Fragment>
						)
				)}

			{/** Root Comment Form */}

			<form style={{ display: "flex" }} onSubmit={onSubmit}>
				<textarea
					style={{ width: "100%", borderRadius: "5px" }}
					onChange={handleClick}
					value={commentValue}
					placeholder="코멘트를 작성해 주세요"
				/>
				<br />
				<button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
					Submit
				</button>
			</form>
		</div>
	);
}

export default Comment;
