const express = require('express');
const router = express.Router();

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const campgrounds = require('../controllers/campgrounds');
const wrapAsync = require('../utility/wrapAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

router
  .route('/')
  .get(wrapAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array('image'),
    validateCampground,
    wrapAsync(campgrounds.createCampground)
  );

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router
  .route('/:id')
  .get(wrapAsync(campgrounds.showCampgrounds))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateCampground,
    wrapAsync(campgrounds.editCampground)
  )
  .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground));

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  wrapAsync(campgrounds.renderEditForm)
);

module.exports = router;
