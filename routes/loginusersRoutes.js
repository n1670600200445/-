const express = require('express');
const router = express.Router();

const loginusersViews = require('../controllers/loginusersControllers');
//!------------------------------------------------------------ประชาชนในหมู่บ้าน----------------------------------------------
router.get('/loginusers',loginusersViews.login); //เข้าหน้าแรก login
router.post('/loginusers',loginusersViews.loginusers); //เข้าสู่ระบบแจ้งเหตุ
router.get('/logoutusers', loginusersViews.logout);//ออกจากระบบ

router.post('/loginusers_nm',loginusersViews.loginusers_nm); //เข้าสู่ระบบแจ้งเหตุ


//!------------------------------------------------------------เจ้าหน้าที่----------------------------------------------
router.get('/loginpersonnel',loginusersViews.loginps); //เข้าหน้าแรก login
router.post('/loginpersonnel',loginusersViews.loginpersonnel); //เข้าสู่ระบบแจ้งเหตุ
router.get('/logoutpersonnel', loginusersViews.logoutps);//ออกจากระบบ



module.exports = router;