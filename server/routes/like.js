const express = require("express");
const router = express.Router();
const { Like } = require("../models/Like");
const { DisLike } = require("../models/Dislike");

//=================================
//            Comment
//=================================

// likes data 불러오기
router.post("/getLikes", (req, res) => {
	let variable = {};

	if (req.body.videoId) {
		// video에 대한 likes data를 불러오는 경우
		variable = { videoId: req.body.videoId };
	} else {
		// comment에 대한 likes data를 불러오는 경우
		variable = { commentId: req.body.commentId };
	}

	Like.find(variable).exec((err, likes) => {
		if (err) return res.status(400).send(err);
		res.status(200).json({ success: true, likes });
	});
});

// dislikes data 불러오기
router.post("/getDisLikes", (req, res) => {
	let variable = {};

	if (req.body.videoId) {
		// video에 대한 dislikes data를 불러오는 경우
		variable = { videoId: req.body.videoId };
	} else {
		// comment에 대한 dislikes data를 불러오는 경우
		variable = { commentId: req.body.commentId };
	}

	DisLike.find(variable).exec((err, dislikes) => {
		if (err) return res.status(400).send(err);
		res.status(200).json({ success: true, dislikes });
	});
});

// like 올리기
router.post("/upLike", (req, res) => {
	let variable = {};

	if (req.body.videoId) {
		variable = { videoId: req.body.videoId };
	} else {
		variable = { commentId: req.body.commentId };
	}

	// Like collection에다가 클릭 정보를 넣기
	const like = new Like(variable);

	like.save((err, likeResult) => {
		if (err) return res.json({ success: false, err });

		// 만약 dislike이 이미 클릭이 되어있다면, Dislike을 1 줄여준다.
		DisLike.findByIdAndDelete(variable).exec((err, dislikeResult) => {
			if (err) return res.status(400).json({ success: false, err });
			res.status(200).json({ success: true });
		});
	});
});

module.exports = router;
