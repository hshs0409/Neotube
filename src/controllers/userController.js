import passport from "passport";
import routes from "../routes";
import User from "../models/User";
import moment from "moment";
import millify from "millify";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = await User({
        name,
        email,
      });
      console.log(user);
      await User.register(user, password);
      req.flash("success", "Success Join!! Welcome NeoTube😍");
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};

export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: "💖💖 Welcome Neotube!! 💖💖",
  failureFlash: "Can't log in. Check email or password",
});

export const githubLoginCallback = async (
  accessToken,
  refreshToken,
  profile,
  cb
) => {
  console.log(accessToken, refreshToken, profile, cb);
  const {
    _json: { id, avatar_url, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl: avatar_url,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const githubLogin = passport.authenticate("github");

export const postGithubLogin = (req, res) => {
  req.flash("info", "Success Login!! Welcome NeoTube😍");
  res.redirect(routes.home);
};

export const kakaoLoginCallback = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  const {
    _json: {
      id,
      properties: { nickname, profile_image },
      kakao_account: { email },
    },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.kakaoId = id;
      user.save();
      return done(null, user);
    }
    const newUser = await User.create({
      email,
      name: nickname,
      kakaoId: id,
      avatarUrl: profile_image,
    });
    return done(null, newUser);
  } catch (error) {
    return done(error);
  }
};

export const kakaoLogin = passport.authenticate("kakao");

export const postKakaoLogin = (req, res) => {
  req.flash("info", "Success Login!! Welcome NeoTube😍");
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.flash("info", "Logged Out 😉😉😉😉");
  req.logout();
  res.redirect(routes.home);
};

export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById(id)
      .populate("videos")
      .populate({
        path: "videos",
        populate: { path: "creator" },
      });
    res.render("userDetail", {
      pageTitle: "User Detail",
      user,
      moment,
      millify,
    });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const getEditProfile = (req, res) => {
  res.render("editProfile", { pageTitle: "Edit Profile" });
};

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email, description },
    file,
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      description,
      avatarUrl: file ? file.location : req.user.avatarUrl,
    });
    //file upload 시에 enctype 빼먹지 말자!!!!!!!!
    req.flash("success", "Success Edit Profile 👌👌");
    res.redirect(routes.userDetail(req.user.id));
  } catch (error) {
    req.flash("error", "Can't Edit Profile ❌❌");
    res.redirect(`/users/${routes.editProfile}`);
  }
};

export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 },
  } = req;
  try {
    if (newPassword !== newPassword1) {
      req.flash("error", "Password is not the same 🙅‍♂️🙅‍♀️");
      res.status(400);
      res.redirect(`/users${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    req.flash("success", "Success change password 🙆‍♀️🙆‍♂️");
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "Can't change password 🙆‍♀️🙆‍♂️");
    res.status(400);
    res.redirect(`/users${routes.changePassword}`);
  }
};

export const postAddLike = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById(id);
    console.log(user);
    user.likes += 1;
    user.save();
  } catch {
    res.status(400);
  } finally {
    res.end();
  }
};
