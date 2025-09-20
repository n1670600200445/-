const controller = {};
const { validationResult } = require('express-validator');

//-------------------------------------------------------------------------------Admin-------------------------------------------------------------------------------
controller.list = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM personnel ps JOIN personneltype psty ON ps.personnel_type = psty.idpersonneltype AND status_id = 1', (err, personnel) => {
                conn.query('SELECT * FROM personneltype',(err,personneltype) =>{
                    let idpersonnel1 = []
                    let fname_ps1 = []
                    let lname_ps1 = []
                    let phone_ps1 = []
                    let idcard_ps1 = []
                    let personnel_type1 = []
                    let status_id1 = []
                    let idpersonneltype1 = []
                    let name_pst1 = []
                    for(i in personnel){
                        idpersonnel1.push(personnel[i].idpersonnel)
                        fname_ps1.push(personnel[i].fname_ps)
                        lname_ps1.push(personnel[i].lname_ps)
                        phone_ps1.push(personnel[i].phone_ps)
                        idcard_ps1.push(personnel[i].idcard_ps)
                        personnel_type1.push(personnel[i].personnel_type)
                        status_id1.push(personnel[i].status_id)
                        idpersonneltype1.push(personnel[i].idpersonneltype)
                        name_pst1.push(personnel[i].name_pst)
                    }
                 if (err) {
                    console.log(err);
                 }
                 res.render('personnel/list', { personnel: personnel,personneltype: personneltype,idpersonnel1,fname_ps1,lname_ps1,phone_ps1,idcard_ps1,personnel_type1,status_id1,idpersonneltype1,name_pst1, session: req.session });
                })
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
                conn.query('INSERT INTO personnel set fname_ps = ? , lname_ps = ? , phone_ps = ? , idcard_ps = ? , personnel_type = ? , status_id = 1'
                    , [data.fname_ps, data.lname_ps, data.phone_ps, data.idcard_ps, data.personnel_type], (err, result) => {
                        if (err) {
                            console.log(err);
                        }else{
                            setTimeout(() => {
                                res.redirect('/personnel',);
                            }, 1000)
                        } 
                            });
                    });
    } else {
        res.redirect('/');
    }
};

controller.edit = (req, res) => {
    if (req.session.idadmins) {
        const id  = req.body.id;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM personnel WHERE idpersonnel = ?;', [id], (err, personnel) => {
                conn.query('SELECT * FROM personneltype',(err,personneltype) =>{
                res.json({ editpersonnel: personnel[0],personneltype: personneltype, session: req.session
                });
            });
        });
    });
    } else {
        res.redirect('/');
    }
};

controller.update = (req, res) => {
    if (req.session.idadmins) {
        const data = req.body;
            req.session.success = true;
            req.session.topic = "แก้ไขข้อมูลการติดต่อเสร็จเรียบร้อยแล้ว";
            req.getConnection((err, conn) => {
                conn.query('UPDATE personnel set fname_ps = ? , lname_ps = ? , phone_ps = ? , idcard_ps = ? , personnel_type = ? where idpersonnel = ?',
                    [data.fname_ps, data.lname_ps, data.phone_ps, data.idcard_ps, data.personnel_type, data.idpersonnel], (err, result) => {
                                if (err) {
                                    console.log(err);
                                }
                                setTimeout(() => {
                                    res.redirect('/personnel');
                                }, 1000)
                            });
                    });
    } else {
        res.redirect('/');
    }
}

controller.checkdelete = (req, res) => {
    if (req.session.idadmins) {
        const id  = req.body.id;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM personnel WHERE idpersonnel = ?;', [id], (err, personnel) => {
                conn.query('SELECT * FROM personneltype',(err,personneltype) =>{
                res.json({ editpersonnel: personnel[0],personneltype: personneltype, session: req.session
                });
            });
        });
    });
    } else {
        res.redirect('/');
    }
};

controller.delete = (req, res) => {
    if (req.session.idadmins) {
        const  id  = req.body.idpersonnel;
        req.getConnection((err, conn) => {
                conn.query('DELETE FROM personnel WHERE idpersonnel = ?', [id], (err, admins) => {
                    if (err) {
                        res.render('delete_err');
                    } else {
                        req.session.success = true;
                        req.session.topic = "ลบข้อมูลการติดต่อเรียบร้อยแล้ว";
                        setTimeout(() => {
                            res.redirect('/personnel');
                        }, 1000)
                    }
                    
                });
            });
    } else {
        res.redirect('/');
    }
};
module.exports = controller;