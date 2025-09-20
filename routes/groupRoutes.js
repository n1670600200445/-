const express = require('express');
const router = express.Router();

const groupViews = require('../controllers/groupControllers');

router.get('/group',groupViews.list); //เข้าหน้ารายชื่อ กลุ่ม
router.post('/group/save',groupViews.save); //เข้าหน้ารายชื่อ กลุ่ม
router.post('/group/edit',groupViews.edit); //เข้าหน้ารายชื่อ กลุ่ม
router.post('/group/update',groupViews.update); //เข้าหน้ารายชื่อ กลุ่ม
router.post('/group/checkdelete',groupViews.checkdelete); //เข้าหน้ารายชื่อ กลุ่ม
router.post('/group/delete',groupViews.delete); //เข้าหน้ารายชื่อ กลุ่ม

router.get('/group/find:id',groupViews.finduserIngroup);
router.post('/user_member/save',groupViews.save_member);
router.post('/user_member/check',groupViews.check_member);
router.post('/user_member/delete',groupViews.delete_member);

//เจ้าหน้าที่
router.get('/group_personnel',groupViews.list_ps); //เข้าหน้ารายชื่อกลุ่มเจ้าหน้าที่
router.post('/group_ps/save',groupViews.save_ps); //เข้าหน้ารายชื่อ กลุ่ม
router.post('/group_ps/edit',groupViews.edit_ps); //เข้าหน้ารายชื่อ กลุ่ม
router.post('/group_ps/update',groupViews.update_ps); //เข้าหน้ารายชื่อ กลุ่ม
router.post('/group_ps/checkdelete',groupViews.checkdelete_ps); //เข้าหน้ารายชื่อ กลุ่ม
router.post('/group_ps/delete',groupViews.delete_ps); //เข้าหน้ารายชื่อ กลุ่ม

router.get('/group_ps/find:id',groupViews.finduserIngroup_ps);
router.post('/user_member_ps/save',groupViews.save_member_ps);
router.post('/user_member_ps/check',groupViews.check_member_ps);
router.post('/user_member_ps/delete',groupViews.delete_member_ps);


module.exports = router;