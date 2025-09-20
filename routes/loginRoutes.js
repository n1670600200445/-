const express = require('express');
const router = express.Router();

const loginViews = require('../controllers/loginControllers');

router.get('/',loginViews.login); //เข้าหน้าแรก login
router.get('/loginadmin',loginViews.loginadmin)
router.post('/login', loginViews.loginHome); //ใส่รหัสเพื่อเข้าหน้า home
router.get('/index', loginViews.dashboard);//เข้าสู่หน้าหลัก
router.get('/logout', loginViews.logout);

module.exports = router;