import Video from "../models/Video";
import moment from "moment";
import Comment from "../models/Comment";
import User from "../models/User";
import routes from "../routes";

export const home = async (req, res) => {
  try {
    // Video의 All Elements get
    const videos = await Video.find({}).sort({ _id: -1 }).populate("creator");
    console.log(videos);
    res.render("home", { pageTitle: "Home", videos, moment });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

export const search = async (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    }).populate("creator");
    console.log(videos);
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos, moment });
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    files: { videoFile, thumbnail },
  } = req;
  const newVideo = await Video.create({
    fileUrl: videoFile[0].location,
    title,
    description,
    thumbnail: thumbnail[0].location,
    creator: req.user.id,
  });
  req.user.videos.push(newVideo);
  req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  //populate는 objectId type에만 가능
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate({
        path: "comments",
        populate: { path: "creator" },
      });

    res.render("videoDetail", {
      pageTitle: video.title,
      video,
      moment,
    });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (String(video.creator) !== req.user.id) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator !== req.user.id) {
      throw Error();
    } else {
      await Video.findOneAndRemove({ _id: id });
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

export const postRegisterView = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
  } = req;
  console.log("postAddComment");
  try {
    const video = await Video.findById(id);
    const user = await User.findById(req.user.id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
    });
    video.comments.push(newComment.id);
    user.comments.push(newComment.id);
    video.save();
    user.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postDeleteComment = async (req, res) => {
  const {
    params: { id },
    body: { videoId },
  } = req;
  const userId = req.user.id;
  try {
    //delete comment in Comment Schema
    await Comment.findByIdAndRemove({ _id: id });

    //delete comment in Video Schema
    const video = await Video.findById({ _id: videoId });
    const videoIdx = video.comments.indexOf(id);
    video.comments.splice(videoIdx, 1);
    video.save();

    //delete comment in User Schema
    const user = await User.findById({ _id: userId });
    const userIdx = user.comments.indexOf(id);
    user.comments.splice(userIdx, 1);
    user.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
