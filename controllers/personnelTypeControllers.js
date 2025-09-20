const controller = {};

//-------------------------------------------------------------------------------Admin-------------------------------------------------------------------------------
controller.list = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM personneltype', (err, personneltype) => {
                let idpersonneltype1 = []
                let name_pst1 = []
                for (i in personneltype) {
                    idpersonneltype1.push(personneltype[i].idpersonneltype)
                    name_pst1.push(personneltype[i].name_pst)
                }
                if (err) {
                    console.log(err);
                }
                res.render('personnelType/list', { personneltype,idpersonneltype1,name_pst1, session: req.session });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.save = (req, res) => {
    if (req.session.idadmins) {
        const data = req.body;
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO personneltype set name_pst = ? '
                , [data.name_pst], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        setTimeout(() => {
                            res.redirect('/personneltype',);
                        }, 1000)
                    }
                });
        });
    } else {
        res.redirect('/');
    }
};

controller.update = (req, res) => {
    if (req.session.idadmins) {
        req.session.success = true;
        req.session.topic = "แก้ไขข้อมูลการติดต่อเสร็จเรียบร้อยแล้ว";
        req.getConnection((err, conn) => {
            conn.query('UPDATE personneltype set name_pst = ? where idpersonneltype = ?',
                [req.body.name_pst, req.body.idpersonneltype], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    setTimeout(() => {
                        res.redirect('/personneltype');
                    }, 1000)
                });
        });
    } else {
        res.redirect('/');
    }
}

controller.delete = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('DELETE FROM personneltype WHERE idpersonneltype = ?', [req.body.idpersonneltype], (err, result) => {
                if (err) {
                    res.render('delete_err');
                } else {
                    req.session.success = true;
                    req.session.topic = "ลบข้อมูลการติดต่อเรียบร้อยแล้ว";
                    setTimeout(() => {
                        res.redirect('/personneltype');
                    }, 1000)
                }

            });
        });
    } else {
        res.redirect('/');
    }
};
//! ----------------------------------------------------Controller ดูรายชื่อเจ้าหน้าที่ในหน่วยงาน--------------------------------------------

controller.listname = (req, res) => { //*เข้าหน้ารายชื่อเจ้าหน้าที่ที่อยู่ในหน่วยงาน
    if (req.session.idadmins) {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM personnel ps JOIN personneltype psty ON ps.personnel_type = psty.idpersonneltype WHERE ps.personnel_type = ? AND ps.status_id = 1', [id], (err, personnelname) => {
                conn.query('SELECT * FROM personneltype psty WHERE psty.idpersonneltype = ?', [id], (err, personnelnametype) => {

                    if (err) {
                        console.log(err);
                    }
                    res.render('personnelType/listnamepersonnel', { personnelname: personnelname, personnelnametype: personnelnametype, session: req.session });
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.savename = (req, res) => {
    if (req.session.idadmins) {
        const personnelname_type = req.body.personnel_type;
        const fname_ps = req.body.fname_ps;
        const lname_ps = req.body.lname_ps;
        const phone_ps = req.body.phone_ps;
        const idcard_ps = req.body.idcard_ps;
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO personnel set fname_ps = ?, lname_ps =?, phone_ps = ?, idcard_ps = ?, personnel_type= ?, status_id = 1 '
                , [fname_ps, lname_ps, phone_ps, idcard_ps, personnelname_type], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        setTimeout(() => {
                            res.redirect('/personneltype/name' + personnelname_type,);
                        }, 1000)
                    }
                });
        });
    } else {
        res.redirect('/');
    }
};

controller.deletename = (req, res) => {
    if (req.session.idadmins) {
        const idpersonnel_type = req.body.idpersonnel_type
        const idpersonnel = req.body.idpersonnel;
        req.getConnection((err, conn) => {
            conn.query('DELETE FROM personnel WHERE idpersonnel = ?', [idpersonnel], (err, result) => {
                if (err) {
                    console.log(err);
                    res.render('delete_err');
                } else {
                    req.session.success = true;
                    req.session.topic = "ลบข้อมูลการติดต่อเรียบร้อยแล้ว";
                    setTimeout(() => {
                        res.redirect('/personneltype/name' + idpersonnel_type);
                    }, 1000)
                }

            });
        });
    } else {
        res.redirect('/');
    }
};

controller.updatename = (req, res) => {
    if (req.session.idadmins) {
        const personnel_type = req.body.personnel_type
        const fname_ps = req.body.fname_ps;
        const lname_ps = req.body.lname_ps;
        const phone_ps = req.body.phone_ps;
        const idcard_ps = req.body.idcard_ps;
        const idpersonnel = req.body.idpersonnel;

        req.session.success = true;
        req.session.topic = "แก้ไขข้อมูลการติดต่อเสร็จเรียบร้อยแล้ว";
        req.getConnection((err, conn) => {
            conn.query('UPDATE personnel set fname_ps = ?, lname_ps = ?, phone_ps = ?, idcard_ps = ? where idpersonnel = ?',
                [fname_ps, lname_ps,phone_ps, idcard_ps,idpersonnel], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    setTimeout(() => {
                        res.redirect('/personneltype/name' + personnel_type);
                    }, 1000)
                });
        });
    } else {
        res.redirect('/');
    }
}
module.exports = controller;