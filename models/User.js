import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  description: {
    type: String,
    default: "No description",
  },
  avatarUrl: {
    type: String,
    default:
      "https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png",
  },
  likes: {
    type: Number,
    default: 0,
  },
  kakaoId: Number,
  githubId: Number,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const model = mongoose.model("User", UserSchema);

export default model;
