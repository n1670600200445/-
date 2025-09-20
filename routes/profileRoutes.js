const express = require('express');
const router = express.Router();

const profileViews = require('../controllers/profileControllers');

router.get('/profile',profileViews.profile); //เข้าหน้า profile
router.post('/profile/uploadlogo',profileViews.uploadlogo); //uploadlogo
router.post('/profile/updatename',profileViews.updatename); //uploadlogo

router.post('/profile/users_profile',profileViews.user_profile);//userProfile
router.post('/profile/personnels_profile',profileViews.personnel_profile);//userProfile
router.post('/profile/admins_profile',profileViews.admin_profile);//userProfile

module.exports = router;