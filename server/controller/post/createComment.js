
const sendToGroq = require("../../groqAI");
const { postModel, commentModel } = require("../../models/postModel");
const { userProfileModel } = require("../../models/profileModel");

const addOrUpdateComment = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId, text } = req.body;

    const message = `You are an AI moderation system for a social media platform.

      Your job is to analyze user comments and classify toxicity.

      Definitions:
      - NORMAL: respectful, neutral, or constructive comment
      - LOW_TOXIC: mild rude or negative tone
      - MEDIUM_TOXIC: insulting, offensive, or aggressive language
      - HIGH_TOXIC: hate speech, threats, harassment, or abusive content

      Analyze this comment:
      "${text}"

      Return response in JSON format only:
      {
        "label": "NORMAL / LOW_TOXIC / MEDIUM_TOXIC / HIGH_TOXIC",
        "confidence": 0-100,
        "category": "insult / hate speech / threat / harassment / none",
        "safe_to_display": true/false
      }`;

    const response = await sendToGroq(message);
    if (!response) {
      return res.status(400).json({ success: false, message: "Please type manually AI having some issue." });
    }
    const cleanResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanResponse);

    const label = parsed.label;
    const confidence = parsed.confidence;
    const category = parsed.category;
    const isSafe = parsed.safe_to_display;

    if(!isSafe){
      return res.status(400).json({ success: false, message: "Your comment is highly toxic" }); 
    }

    const profile = await userProfileModel.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const profileId = profile._id;

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const comment = await commentModel.findOne({ postId, userId });
    if (!comment) {
      const createComment = new commentModel({
        userId: userId,
        profileId: profileId,
        postId: postId,
        text: text
      });
      const response = await createComment.save();
      post.comments.push(response._id);
      await post.save();
      return res.status(200).json({ success: true, message: "comment created" });
    }

    comment.text = text;


    await comment.save();


    res.status(200).json({
      success: true,
      message: `${label} comment`
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = addOrUpdateComment;
