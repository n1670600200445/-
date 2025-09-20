const express = require('express');
const router = express.Router();

const userlViews = require('../controllers/usersControllers');

router.get('/users',userlViews.list); //เข้าหน้ารายชื่อประชาชน
router.post('/users/save',userlViews.save); //เพิ่มรายชื่อประชาชน
router.post('/users/edit',userlViews.edit); //เข้าหน้าแก้ไขรายชื่อประชาชน
router.post('/users/update',userlViews.update); //แก้ไขรายชื่อประชาชน
router.post('/users/checkdelete',userlViews.checkdelete); //เข้าหน้าแก้ไขรายชื่อประชาชน
router.post('/users/delete',userlViews.delete);//ยืนยันการลบข้อมูลเข้าหน้ารายชื่อประชาชน

router.get('/register/people',userlViews.listpeople); //เลือกค้นหา
router.post('/seach',userlViews.listpeopleseach); //ค้นหา

module.exports = router;