// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../connection/cloudinary");

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "social/uploads",
//     resource_type: "auto",
//     public_id: (req, file) => file.originalname.split(".")[0] + "-" + Date.now()
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../connection/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {

    const type = req.body.type || "post";

    let uploadOptions = {
      folder: "social/uploads",
      resource_type: "auto",
      public_id: file.originalname.split(".")[0] + "-" + Date.now(),
    };

    if (type === "status") {
      uploadOptions.expires_at =
        Math.floor(Date.now() / 1000) + (60);
    }

    return uploadOptions;
  },
});

const upload = multer({ storage });

module.exports = upload;
