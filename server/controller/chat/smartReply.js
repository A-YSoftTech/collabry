
const sendToGroq = require("../../groqAI");

const smartReply = async (req, res) => {
    try {
        const userId = req.userId;
        const { text } = req.body;
        // console.log(userId, interest, profession, tone);
        if (!text) {
            return res.status(400).json({ success: false, message: "Your message is empty" });
        }
        if (!userId) {
            return res.status(400).json({ success: false, message: "User not valid" });
        }

        const message = `You are a CHAT SMART REPLY AI.

            STRICT RULES:
            - Always generate exactly 3 replies only.
            - Each bio must be under 50 characters.
            - Don't explain any thing.

            Suggest 3 short friendly chat replies to:
            ${text}
            
            Output format:
            -
            -
            -`;

        const response = await sendToGroq(message);
        if (!response) {
            return res.status(400).json({ success: false, message: "Please type manually AI having some issue." });
        }
        const [reply1, reply2, reply3] = response
        .split("\n")
        .map(line => line.replace(/^-\s*/, "").trim())
        .filter(Boolean);
        // console.log(reply1,reply2,reply3);
        res.status(200).json({ success: true, message: "Replies generated",  reply1, reply2, reply3});

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
module.exports = smartReply;