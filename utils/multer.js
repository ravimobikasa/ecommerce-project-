const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: './public/images/products',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  },
})

function checkFileType(req, file, cb) {
  const filetypes = /jpeg|jpg|png|gif/

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    req.errors = 'Images Only '
    cb(null, true)
  }
}

const upload = multer({
  storage: storage,

  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(req, file, cb)
  },
})
// .single('myImage')
module.exports = {
  upload,
}
