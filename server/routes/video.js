const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");

const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}_${file.originalname}`);
	},
	fileFilter: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		if (ext !== ".mp4") {
			return cb(res.status(400).end("only mp4 is allowed"), false);
		}
		cb(null, true);
	},
});

const upload = multer({ storage: storage }).single("file");

//=================================
//             Video
//=================================

// Video Upload 관련

router.post("/uploadfiles", (req, res) => {
	// 비디오를 서버에 저장한다.
	upload(req, res, (err) => {
		if (err) {
			return res.json({ success: false, err });
		}
		return res.json({
			success: true,
			url: res.req.file.path,
			fileName: res.req.file.filename,
		});
	});
});

router.post("/uploadVideo", (req, res) => {
	// 비디오 정보들을 저장한다.
	const video = new Video(req.body);

	video.save((err, doc) => {
		if (err) return res.json({ success: false, err });
		res.status(200).json({ success: true });
	});
});

router.post("/thumbnail", (req, res) => {
	// 썸네일 생성하고 비디오 러닝타임도 가져오기

	let filePath = "";
	let fileDuration = "";

	// 비디오 정보 가져오기
	ffmpeg.ffprobe(req.body.url, function (err, metadata) {
		console.dir(metadata); // all metadata
		console.log(metadata.format.duration);
		fileDuration = metadata.format.duration;
	});

	// 썸네일 생성
	ffmpeg(req.body.url)
		.on("filenames", function (filenames) {
			console.log("Will generage " + filenames.join(", "));
			console.log(filenames);

			filePath = "uploads/thumbnails/" + filenames[0];
		})
		.on("end", function () {
			console.log("Screenshots taken");
			return res.json({
				success: true,
				url: filePath,
				fileDuration: fileDuration,
			});
		})
		.on("error", function (err) {
			console.log(err);
			return res.json({ success: false, err });
		})
		.screenshots({
			// Will take screenshots at 20%, 40%, 60% and 80% of the video
			count: 3,
			folder: "uploads/thumbnails",
			size: "320x240",
			// '%b' : input basename (filename w/o extension)
			filename: "thumbnail-%b.png",
		});
});

// LandingPage 관련
router.get("/getvideos", (req, res) => {
	// 비디오를 DB에서 가져와서 클라이언트에 보낸다.
	Video.find()
		.populate("writer")
		.exec((err, videos) => {
			if (err) return res.status(400).send(err);
			res.status(200).json({ success: true, videos });
		});
});

// VideoDetailPage 관련
router.post("/getVideoDetail", (req, res) => {
	Video.findOne({ _id: req.body.videoId })
		.populate("writer")
		.exec((err, videoDetail) => {
			if (err) return res.status(400).send(err);
			return res.status(200).json({ success: true, videoDetail });
		});
});

module.exports = router;
