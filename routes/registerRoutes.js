const express = require('express');
const router = express.Router();

const registerViews = require('../controllers/registerControllers');

//!---------------------------------------------------------เจ้าหน้าที่ลงทะเบียน------------------------------------------------
router.get('/register',registerViews.register); //?เข้าหน้าลงทะเบียน
router.post('/register/save',registerViews.registersave); //? บันทึกการลงทะเบียน
//!---------------------------------------------------------ประชาชนที่ลงทะเบียน------------------------------------------------
// router.post('/timeout',registerViews.gettimeout); //?เข้าหน้าลงทะเบียน
// router.post('/register/getotp_us',registerViews.getOTP)
// router.post('/register/verify_us',registerViews.verify_us)
// router.get('/registeruser',registerViews.registeruser); //?เข้าหน้าลงทะเบียน
// router.post('/register/usersave',registerViews.registerusersave); //? บันทึกการลงทะเบียน


router.get('/registeruser', registerViews.registeruser); //? เข้าหน้าลงทะเบียน
router.post('/register/usersave', registerViews.registerusersave); //? บันทึกการลงทะเบียน

//! ----------------------------------------------------------------ADMIN--------------------------------------------------
router.get('/register/person',registerViews.registerList);//?รายชื่อคนขอลงทะเบียนทั้งส่วนของเจ้าหน้าที่และประชาชน
router.get('/register/person/personnel:id',registerViews.registerAcceptPersonnel);//?อนุมัติเจ้าหน้าที่
router.get('/register/person/personnelCancel/:id',registerViews.registerCancelPersonnel);//?ไม่อนุมัติเจ้าหน้าที่
router.get('/register/person/user:id',registerViews.registerAcceptUser);//?อนุมัติประชาชน
router.get('/register/person/userCancel/:id',registerViews.registerCancelUser);//?ไม่อนุมัติประชาชน


module.exports = router;