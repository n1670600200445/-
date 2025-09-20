const controller = {};
const { validationResult } = require('express-validator');

controller.list = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM group_us', (err, group_us) => {
                if (err) {
                    res.json(err);
                }
                res.render('group/list', { group_us, session: req.session });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.save = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO  group_us set name_group=?,detail_group=?', [req.body.name_group, req.body.detail_group], (err, group_us) => {
                if (err) {
                    console.log(err);
                }
                setTimeout(() => {
                    res.redirect('/group');
                }, 1000)
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.edit = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM group_us WHERE idgroup_us=?', [req.body.id], (err, group_us) => {
                if (err) {
                    res.json(err);
                }
                res.json({ group_us: group_us[0], session: req.session });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.update = (req, res) => {
    if (req.session.idadmins) {
        console.log(req.body);
        req.getConnection((err, conn) => {
            conn.query('UPDATE group_us SET name_group=?,detail_group=? WHERE idgroup_us = ?', [req.body.name_group, req.body.detail_group, req.body.idgroup_us], (err, group_us) => {
                if (err) {
                    console.log(err);
                }
                setTimeout(() => {
                    res.redirect('/group');
                }, 1000)
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.checkdelete = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM group_us WHERE idgroup_us=?', [req.body.id], (err, group_us) => {
                if (err) {
                    res.json(err);
                }
                res.json({ group_us: group_us[0], session: req.session });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.delete = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('DELETE FROM group_us WHERE idgroup_us = ?', [req.body.idgroup_us], (err, group_us) => {
                if (err) {
                    console.log(err);
                }
                setTimeout(() => {
                    res.redirect('/group');
                }, 1000)
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.finduserIngroup = (req, res) => {
    if (req.session.idadmins) {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM users WHERE FIND_IN_SET(?, group_us) > 0', [id], (err, user_ingroup) => {
                conn.query('SELECT * FROM users WHERE FIND_IN_SET(?, group_us) = 0 OR group_us IS NULL;', [id], (err, user_nogroup) => {
                    if (err) {
                        res.json(err);
                    }
                    res.render('group/list_useringroup', { idgroup_us: id, user_ingroup, user_nogroup, session: req.session });
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.save_member = (req, res) => {
    if (req.session.idadmins) {
        const idgroup = req.body.idgroup_us;
        const member_name = req.body.member_name
        const list_member_save = member_name.split(',')
        req.getConnection((err, conn) => {
            for (let i in list_member_save) {
                conn.query("UPDATE users SET group_us = CASE WHEN CHAR_LENGTH(IFNULL(group_us, '')) < 1 THEN ? ELSE CONCAT(group_us, ?) END WHERE idusers = ?", [idgroup, ',' + idgroup, list_member_save[i]], (err, data) => {
                    if (err) {
                        console.log(err);
                    }
                })
            }
            if (err) {
                console.log(err);
            }
            setTimeout(() => {
                res.redirect('/group/find' + idgroup);
            }, 1000)
        })

    } else {
        res.redirect('/');
    }
};

controller.check_member = (req, res) => {
    if (req.session.idadmins) {
        const iduser_mm = req.body.id;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM users WHERE idusers = ?', [iduser_mm], (err, data) => {
                if (err) {
                    console.log(err);
                }
                res.json({ data, session: req.session });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.delete_member = (req, res) => {
    if (req.session.idadmins) {
        const iduser_mm = req.body.iduser_mm;
        const idgroup = req.body.idgroup_us;
        req.getConnection((err, conn) => {
            conn.query('SELECT group_us FROM users WHERE idusers = ?', [iduser_mm], (err, findallgroup) => {
                const groupsArray = findallgroup.map(row => row.group_us); // Extracting the 'group_us' property
                const filteredNumbers = groupsArray.join(',').split(',').filter(num => !idgroup.includes(num)).join(',');
                console.log(filteredNumbers);
                conn.query('UPDATE users set group_us = ? WHERE idusers = ?', [filteredNumbers, iduser_mm], (err, data) => {
                    if (err) {
                        console.log(err);
                    }
                    setTimeout(() => {
                        res.redirect('/group/find' + idgroup);
                    }, 1000)
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.list_ps = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM group_ps', (err, group_us) => {
                if (err) {
                    res.json(err);
                }
                res.render('group/list_ps', { group_us, session: req.session });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.save_ps = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO  group_ps set gname_ps=?,gdetail_ps=?', [req.body.name_group, req.body.detail_group], (err, group_ps) => {
                if (err) {
                    console.log(err);
                }
                setTimeout(() => {
                    res.redirect('/group_personnel');
                }, 1000)
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.edit_ps = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM group_ps WHERE idgroup_ps=?', [req.body.id], (err, group_us) => {
                if (err) {
                    res.json(err);
                }
                res.json({ group_us: group_us[0], session: req.session });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.update_ps = (req, res) => {
    if (req.session.idadmins) {
        console.log(req.body);
        req.getConnection((err, conn) => {
            conn.query('UPDATE group_ps SET gname_ps=?,gdetail_ps=? WHERE idgroup_ps = ?', [req.body.name_group, req.body.detail_group, req.body.idgroup_us], (err, group_ps) => {
                if (err) {
                    console.log(err);
                }
                setTimeout(() => {
                    res.redirect('/group_personnel');
                }, 1000)
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.checkdelete_ps = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM group_ps WHERE idgroup_ps=?', [req.body.id], (err, group_us) => {
                if (err) {
                    res.json(err);
                }
                res.json({ group_us: group_us[0], session: req.session });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.delete_ps = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('DELETE FROM group_ps WHERE idgroup_ps = ?', [req.body.idgroup_us], (err, group_us) => {
                if (err) {
                    console.log(err);
                }
                setTimeout(() => {
                    res.redirect('/group_personnel');
                }, 1000)
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.finduserIngroup_ps = (req, res) => {
    if (req.session.idadmins) {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM personnel ps JOIN personneltype psty ON ps.personnel_type = psty.idpersonneltype AND status_id = 1  WHERE FIND_IN_SET(?, group_ps) > 0', [id], (err, user_ingroup) => {
                conn.query('SELECT * FROM personnel WHERE FIND_IN_SET(?, group_ps) = 0 OR group_ps IS NULL;', [id], (err, user_nogroup) => {
                    if (err) {
                        res.json(err);
                    }
                    res.render('group/list_useringroup_ps', { idgroup_us: id, user_ingroup, user_nogroup, session: req.session });
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.save_member_ps = (req, res) => {
    if (req.session.idadmins) {
        const idgroup = req.body.idgroup_us;
        const member_name = req.body.member_name
        const list_member_save = member_name.split(',')
        req.getConnection((err, conn) => {
            for (i in list_member_save) {
                conn.query("UPDATE personnel SET group_ps = CASE WHEN CHAR_LENGTH(IFNULL(group_ps, '')) < 1 THEN ? ELSE CONCAT(group_ps, ?) END WHERE idpersonnel = ?", [idgroup, ',' + idgroup, list_member_save[i]], (err, data) => {
                    if (err) {
                        console.log(err);
                    }
                })
            }
            if (err) {
                console.log(err);
            }
            setTimeout(() => {
                res.redirect('/group_ps/find' + idgroup);
            }, 1000)
        })

    } else {
        res.redirect('/');
    }
};

controller.check_member_ps = (req, res) => {
    if (req.session.idadmins) {
        const iduser_mm = req.body.id;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM personnel WHERE idpersonnel = ?', [iduser_mm], (err, data) => {
                if (err) {
                    console.log(err);
                }
                res.json({ data, session: req.session });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.delete_member_ps = (req, res) => {
    if (req.session.idadmins) {
        const iduser_mm = req.body.iduser_mm;
        const idgroup = req.body.idgroup_us;
        req.getConnection((err, conn) => {
            conn.query('SELECT group_ps FROM personnel WHERE idpersonnel = ?', [iduser_mm], (err, findallgroup) => {
                const groupsArray = findallgroup.map(row => row.group_ps); // Extracting the 'group_us' property
                const filteredNumbers = groupsArray.join(',').split(',').filter(num => !idgroup.includes(num)).join(',');
                console.log(filteredNumbers);
                conn.query('UPDATE personnel set group_ps = ? WHERE idpersonnel = ?', [filteredNumbers,iduser_mm], (err, data) => {
                    if (err) {
                        console.log(err);
                    }
                    setTimeout(() => {
                        res.redirect('/group_ps/find' + idgroup);
                    }, 1000)
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

module.exports = controller;