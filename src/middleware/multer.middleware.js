const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = ` ${new Date(Date.now())}-req.user._id `
      cb(null, file.originalname + '-' + uniqueSuffix);
    }
  });
  
  export const upload = multer({ storage: storage });