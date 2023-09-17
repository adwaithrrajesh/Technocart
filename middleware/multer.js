const multer = require('multer')
const path = require('path')

  // Multer (file upload setup)
  const storage = multer.diskStorage({
    destination: (req,files,cb)=>{
    cb(null,'public/images/products')
    },
    filename:(req, file, cb)=>{
    cb(null, Date.now() +path.extname(file.originalname))
    }
    })
    const upload = multer({storage:storage})


    module.exports = upload;

    