import React, { useEffect, useState } from "react";

import SingleComment from "./SingleComment";

function ReplyComment(props) {
	const videoId = props.postId;

	const [childCommentNumber, setChildCommentNumber] = useState(0);
	const [openReply, setOpenReply] = useState(false);

	useEffect(() => {
		let commentNumber = 0;
		props.commentLists.map((comment) => {
			if (comment.responseTo === props.parentCommentId) commentNumber++;
		});

		setChildCommentNumber(commentNumber);
	}, [props.commentLists]);

	const renderReplyComment = (parentCommentId) => {
		return props.commentLists.map((comment, index) => (
			<React.Fragment>
				{comment.responseTo === parentCommentId && (
					<div style={{ width: "80%", marginLeft: "40px" }}>
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
					</div>
				)}
			</React.Fragment>
		));
	};

	const onHandleChange = () => {
		setOpenReply(!openReply);
		console.log(openReply);
	};

	return (
		<div>
			{childCommentNumber > 0 && (
				<p
					style={{
						fontSize: "14px",
						margin: 0,
						color: "gray",
					}}
					onClick={onHandleChange}
				>
					View {childCommentNumber} more comment(s)
				</p>
			)}
			{openReply && renderReplyComment(props.parentCommentId)}
		</div>
	);
}

export default ReplyComment;
