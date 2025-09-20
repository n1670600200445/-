const controller = {};
const path = require("path");
const fs = require("fs");
const { log } = require("console");
const uuidv4 = require('uuid').v4;


controller.list = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM menu_main WHERE del_status = 0 ;', (err, menus) => {
                conn.query('SELECT * FROM group_us;', (err, group_us) => {
                    conn.query('SELECT * FROM group_ps;', (err, group_ps) => {
                        conn.query('SELECT * FROM forms; ', (err, forms) => {
                            conn.query('SELECT * FROM personneltype; ', (err, personneltype) => {
                                if (err) {
                                    res.json(err);
                                }
                                res.render('menus/list', { menus, group_us, group_ps, forms, personneltype, session: req.session });
                            })
                        })
                    })
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.fetch_mm_list = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT name_mm,icon_mm,group_mm,type_radio FROM menu_main WHERE del_status = 0 and nomember_radio = 1 order by order_mm;', (err, menus) => {
                if (err) {
                    res.json(err);
                }
                res.json({ menus });
            })
        })
    } else {
        res.redirect('/');
    }
}

controller.clicktab_mm = (req, res) => {
    if (req.session.idadmins) {
        const num_click_mm = req.body.val;
        req.getConnection((err, conn) => {
            if (num_click_mm == 1) {
                conn.query('SELECT idmenu_main,name_mm,icon_mm,group_mm,type_radio FROM menu_main WHERE del_status = 0 and nomember_radio = 1 order by nomember_order;', (err, menus) => {
                    if (err) {
                        res.json(err);
                    }
                    res.json({ menus });
                })
            } else if (num_click_mm == 2) {
                conn.query('SELECT idmenu_main,name_mm,icon_mm,group_mm,type_radio FROM menu_main WHERE del_status = 0 and member_radio = 1  order by member_order;', (err, menus) => {
                    if (err) {
                        res.json(err);
                    }
                    res.json({ menus });
                })
            } else {
                conn.query('SELECT idmenu_main,name_mm,icon_mm,group_mm_ps,type_radio FROM menu_main WHERE del_status = 0 and officer_radio = 1  order by officer_order;', (err, menus) => {
                    if (err) {
                        res.json(err);
                    }
                    res.json({ menus });
                })
            }
        })
    } else {
        res.redirect('/');
    }
}

controller.clicktab_ms = (req, res) => {
    if (req.session.idadmins) {
        const num_click_mm = req.body.val;
        const mm_id = req.body.mm_id
        req.getConnection((err, conn) => {
            if (num_click_mm == 1) {
                conn.query('SELECT idmenu_sub,name_ms,icon_ms,group_ms FROM menu_sub where del_status = 0 and nomember_radio = 1 and mm_id = ? order by nomember_order', [mm_id], (err, menus) => {
                    if (err) {
                        res.json(err);
                    }
                    res.json({ menus });
                })
            } else if (num_click_mm == 2) {
                conn.query('SELECT idmenu_sub,name_ms,icon_ms,group_ms FROM menu_sub where del_status = 0 and member_radio = 1 and mm_id = ? order by member_order', [mm_id], (err, menus) => {
                    if (err) {
                        res.json(err);
                    }
                    res.json({ menus });
                })
            } else {
                conn.query('SELECT idmenu_sub,name_ms,icon_ms,group_ms_ps FROM menu_sub where del_status = 0 and officer_radio = 1 and mm_id = ? order by officer_order', [mm_id], (err, menus) => {
                    if (err) {
                        res.json(err);
                    }
                    res.json({ menus });
                })
            }
        })
    } else {
        res.redirect('/');
    }
}

controller.fetch_ms_list = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM menu_sub WHERE del_status = 0 order by order_ms;', (err, menus) => {
                if (err) {
                    res.json(err);
                }
                res.json({ menus });
            })
        })
    } else {
        res.redirect('/');
    }
}

controller.icon_default = (req, res) => {
    fs.readdir('./public/image_default', function (err, ic_de) {
        if (err) {
            console.log("err");
        }
        res.json({ ic_de })
    })
};

controller.forms_list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM menu_main;', (err, menus) => {
            if (err) {
                res.json(err);
            }
            res.render('menus/list', { menus, session: req.session });
        })
    })
};

controller.save = (req, res) => {
    if (req.session.idadmins) {
        const name_mm = req.body.name_mm;
        const type_r = req.body.type_mm;
        const time_r = req.body.checktime_radio;
        const status_r = req.body.checkstatus_radio;
        const group_r = req.body.checkgroup_radio;
        const group_rps = req.body.checkgroup_radio_ps;
        const icon_r = req.body.checkicon_radio;
        const detail_mm = req.body.detail_mm;
        const nomb_r = req.body.nomember_radio;
        const mb_r = req.body.member_radio;
        const officer_r = req.body.officer_radio;

        if (time_r == 1) {
            // datestart_mm = '0000-00-00'
            // dateend_mm = '0000-00-00'
            datestart_mm = null; // ตั้งเป็น NULL หากคอลัมน์รองรับ
            dateend_mm = null;
        } else {
            datestart_mm = req.body.datestart_mm;
            dateend_mm = req.body.dateend_mm;
        }

        if (type_r == 1) {
            form_mm = '-';
            personneltype_mm = '-';
        } else {
            form_mm = req.body.form_mm;
            personneltype_mm = req.body.personneltype_mm;
        }

        if (group_r == 1) {
            group_mm = '-'
        } else {
            group_mm = req.body.group_mm;
        }

        if (group_rps == 1) {
            group_mm_ps = '-'
        } else {
            group_mm_ps = req.body.group_mm_ps;
        }

        if (nomb_r == '1') {
            nomember_radio = 1;
        } else {
            nomember_radio = 0;
        }

        if (mb_r == '2') {
            member_radio = 1;
        } else {
            member_radio = 0;
        }

        if (officer_r == '3') {
            officer_radio = 1;
        } else {
            officer_radio = 0;
        }

        if (icon_r == 1) {
            if (req.files) {
                var file = req.files;
                filename_save = file[0].filename
            }
        } else {
            var filename_save = req.body.value_icon_default
        }

        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM menu_main WHERE del_status = 0;', (err, menu_max) => {
                const order_mm = menu_max.length + 1
                conn.query('INSERT INTO menu_main SET name_mm = ?,type_radio = ?,form_mm = ?,personneltype_mm = ?,time_radio = ?,datestart_mm = ?,dateend_mm = ?,status_radio= ?,group_radio = ?,group_mm = ?,icon_mm= ?,order_mm = ?, detail_mm = ?,nomember_radio = ?,member_radio = ?,officer_radio = ?,group_radio_ps = ?,group_mm_ps = ?', [name_mm, type_r, form_mm, personneltype_mm, time_r, datestart_mm, dateend_mm, status_r, group_r, group_mm, filename_save, order_mm, detail_mm, nomember_radio, member_radio, officer_radio, group_rps, group_mm_ps], (err, menus) => {
                    if (err) {
                        res.json(err);
                    } else {
                        req.session.success = true;
                        req.session.topic = "เพิ่มข้อมูลการติดต่อเรียบร้อยแล้ว";
                        setTimeout(() => {
                            res.redirect('/menus');
                        }, 1000)
                    }
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.update = (req, res) => {
    if (req.session.idadmins) {
        const idmm = req.body.idmm;
        const name_mm = req.body.name_mm;
        const type_r = req.body.type_mm;
        const time_r = req.body.checktime_radio;
        const status_r = req.body.checkstatus_radio;
        const group_r = req.body.checkgroup_radio;
        const group_rps = req.body.checkgroup_radio_ps;
        const icon_r = req.body.checkicon_radio;
        const detail_mm = req.body.detail_mm;
        const nomb_r = req.body.nomember_radio;
        const mb_r = req.body.member_radio;
        const officer_r = req.body.officer_radio;


        if (time_r == 1) {
            // datestart_mm = '0000-00-00'
            // dateend_mm = '0000-00-00'
            datestart_mm = null; // ตั้งเป็น NULL หากคอลัมน์รองรับ
            dateend_mm = null;
        } else {
            datestart_mm = req.body.datestart_mm;
            dateend_mm = req.body.dateend_mm;
        }

        if (type_r == 1) {
            form_mm = '-';
            personneltype_mm = '-';
        } else {
            form_mm = req.body.form_mm;
            personneltype_mm = req.body.personneltype_mm;
        }

        if (group_r == 1) {
            group_mm = '-'
        } else {
            group_mm = req.body.group_mm;

        }
        if (group_rps == 1) {
            group_mm_ps = '-'
        } else {
            group_mm_ps = req.body.group_mm_ps;
        }

        if (nomb_r == '1') {
            nomember_radio = 1;
        } else {
            nomember_radio = 0;
        }

        if (mb_r == '2') {
            member_radio = 1;
        } else {
            member_radio = 0;
        }

        if (officer_r == '3') {
            officer_radio = 1;
        } else {
            officer_radio = 0;
        }

        if (icon_r == 1) {
            if (req.files) {
                var file = req.files;
                filename = file[0].filename
            }
        } else {
            var filename = req.body.value_icon_default
        }

        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM menu_main WHERE idmenu_main = ? ', [idmm], (err, menu_default) => {
                conn.query('UPDATE menu_main SET name_mm = ?,type_radio = ?,form_mm = ?,personneltype_mm = ?,time_radio = ?,datestart_mm = ?,dateend_mm = ?,status_radio= ?,group_radio = ?,group_mm = ?,icon_mm= ?, detail_mm = ?,nomember_radio = ?,member_radio = ?,officer_radio = ?,group_radio_ps = ?,group_mm_ps = ? WHERE idmenu_main = ?', [name_mm, type_r, form_mm, personneltype_mm, time_r, datestart_mm, dateend_mm, status_r, group_r, group_mm, filename, detail_mm, nomember_radio, member_radio, officer_radio, group_rps, group_mm_ps, idmm], (err, update_value) => {
                    if (err) {
                        res.json(err);
                    } else {
                        req.session.success = true;
                        req.session.topic = "แก้ไขข้อมูลการติดต่อเรียบร้อยแล้ว";
                        setTimeout(() => {
                            res.redirect('/menus');
                        }, 1000)
                    }
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.delete = (req, res) => {
    if (req.session.idadmins) {
        const idmm = req.body.idmm;
        const order_mm = req.body.order_mm;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM menu_main WHERE order_mm > ? order by order_mm', [order_mm], (err, sort_menus) => {
                for (var i = 0; i < sort_menus.length; i++) {
                    conn.query('UPDATE menu_main SET order_mm = ? WHERE idmenu_main = ?', [sort_menus[i].order_mm - 1, sort_menus[i].idmenu_main], (err, update_order_mm) => { })
                }
            })
            conn.query('UPDATE menu_main SET del_status = 1 WHERE idmenu_main = ?', [idmm], (err, delete_mm) => {
                if (err) {
                    res.json(err);
                } else {
                    req.session.success = true;
                    req.session.topic = "ลบข้อมูลการติดต่อเรียบร้อยแล้ว";
                    setTimeout(() => {
                        res.redirect('/menus');
                    }, 1000)
                }
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.edit = (req, res) => {
    const idmm = req.body.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM menu_main where idmenu_main = ?;', [idmm], (err, data) => {
            if (err) {
                console.log("err");
            }
            res.json({ data })
        })
    })
};

controller.check = (req, res) => {
    const idmm = req.body.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM menu_main where idmenu_main = ?;', [idmm], (err, data) => {
            if (err) {
                console.log("err");
            }
            res.json({ data })
        })
    })
};

controller.findmenu_sub = (req, res) => {
    if (req.session.idadmins) {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM menu_sub WHERE del_status = 0 and mm_id = ? order by order_ms', [id], (err, menu_sub) => {
                conn.query('SELECT * FROM menu_main WHERE idmenu_main = ?', [id], (err, menu_main) => {
                    conn.query('SELECT * FROM group_us ;', (err, group_us) => {
                        conn.query('SELECT * FROM group_ps;', (err, group_ps) => {
                            conn.query('SELECT * FROM forms; ', (err, forms) => {
                                conn.query('SELECT * FROM personneltype; ', (err, personneltype) => {
                                    if (err) {
                                        res.json(err);
                                    }
                                    res.render('menus/list_sub', { idmm: id, menu_main, menu_sub, group_us, group_ps, forms, personneltype, session: req.session });
                                })
                            })
                        })
                    })
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

//------------------------------------------------------------------------------------------
// controller.save_ms = (req, res) => {
//     if (req.session.idadmins) {
//         const mm_id = req.body.mm_id;
//         const name_ms = req.body.name_ms;
//         const form_ms = req.body.form_ms;
//         const personneltype_ms = req.body.personneltype_ms;
//         const time_r = req.body.checktime_radio;
//         const status_r = req.body.checkstatus_radio;
//         const group_r = req.body.checkgroup_radio;
//         const group_rps = req.body.checkgroup_radio_ps;
//         const icon_r = req.body.checkicon_radio;
//         const detail_ms = req.body.detail_ms;
//         const nomb_r = req.body.nomember_radio;
//         const mb_r = req.body.member_radio;
//         const officer_r = req.body.officer_radio;

//         if (time_r == 1) {
//             // datestart_ms = '0000-00-00'
//             // dateend_ms = '0000-00-00'
//             datestart_mm = null; // ตั้งเป็น NULL หากคอลัมน์รองรับ
//             dateend_mm = null;
//         } else {
//             datestart_ms = req.body.datestart_ms;
//             dateend_ms = req.body.dateend_ms;
//         }

//         if (group_r == 1) {
//             group_mm = '-'
//         } else {
//             group_mm = req.body.group_mm;
//         }

//         if (group_rps == 1) {
//             group_mm_ps = '-'
//         } else {
//             group_mm_ps = req.body.group_mm_ps;
//         }

//         if (nomb_r == '1') {
//             nomember_radio = 1;
//         } else {
//             nomember_radio = 0;
//         }

//         if (mb_r == '2') {
//             member_radio = 1;
//         } else {
//             member_radio = 0;
//         }

//         if (officer_r == '3') {
//             officer_radio = 1;
//         } else {
//             officer_radio = 0;
//         }

//         if (icon_r == 1) {
//             if (req.files) {
//                 var file = req.files;
//                 filename = file[0].filename
//             }
//         } else {
//             var filename = req.body.value_icon_default
//         }

//         req.getConnection((err, conn) => {
//             conn.query('SELECT * FROM menu_sub WHERE del_status = 0;', (err, menu_max) => {
//                 const order_ms = menu_max.length + 1
//                 conn.query('INSERT INTO menu_sub SET mm_id =?, name_ms = ?,form_ms = ?,personneltype_ms = ?,time_radio = ?,datestart_ms = ?,dateend_ms = ?,status_ms= ?,group_radio = ?,group_ms = ?,icon_ms = ?,order_ms = ?, detail_ms = ?,nomember_radio = ?,member_radio = ?,officer_radio = ?,group_radio_ps = ?,group_ms_ps = ?',
//                     [mm_id, name_ms, form_ms, personneltype_ms, time_r, datestart_ms, dateend_ms, status_r, group_r, group_mm, filename, order_ms, detail_ms, nomember_radio, member_radio, officer_radio, group_rps, group_mm_ps], (err, menu_sub) => {
//                         if (err) {
//                             res.json(err);
//                         } else {
//                             req.session.success = true;
//                             req.session.topic = "เพิ่มข้อมูลเรียบร้อยแล้ว";
//                             setTimeout(() => {
//                                 res.redirect('/menus/find' + mm_id);
//                             }, 1000)
//                         }
//                     })
//             })
//         })
//     } else {
//         res.redirect('/');
//     }
// };

//------------------------------------------------แก้ใหม่-------------------------

controller.save_ms = (req, res) => {
    if (req.session.idadmins) {
        const mm_id = req.body.mm_id;
        const name_ms = req.body.name_ms;
        const form_ms = req.body.form_ms;
        const personneltype_ms = req.body.personneltype_ms;
        const time_r = req.body.checktime_radio;
        const status_r = req.body.checkstatus_radio;
        const group_r = req.body.checkgroup_radio;
        const group_rps = req.body.checkgroup_radio_ps;
        const icon_r = req.body.checkicon_radio;
        const detail_ms = req.body.detail_ms;
        const nomb_r = req.body.nomember_radio;
        const mb_r = req.body.member_radio;
        const officer_r = req.body.officer_radio;

        let datestart_ms;
        let dateend_ms;
        let group_mm;
        let group_mm_ps;
        let filename;

        if (time_r == 1) {
            datestart_ms = null; // Set to NULL if the column supports it
            dateend_ms = null;
        } else {
            datestart_ms = req.body.datestart_ms;
            dateend_ms = req.body.dateend_ms;
        }

        if (group_r == 1) {
            group_mm = '-';
        } else {
            group_mm = req.body.group_mm;
        }

        if (group_rps == 1) {
            group_mm_ps = '-';
        } else {
            group_mm_ps = req.body.group_mm_ps;
        }

        let nomember_radio = nomb_r == '1' ? 1 : 0;
        let member_radio = mb_r == '2' ? 1 : 0;
        let officer_radio = officer_r == '3' ? 1 : 0;

        if (icon_r == 1) {
            if (req.files) {
                var file = req.files;
                filename = file[0].filename;
            }
        } else {
            filename = req.body.value_icon_default;
        }

        req.getConnection((err, conn) => {
            if (err) throw err; // Handle connection error
            conn.query('SELECT * FROM menu_sub WHERE del_status = 0;', (err, menu_max) => {
                if (err) throw err; // Handle query error
                const order_ms = menu_max.length + 1;
                conn.query('INSERT INTO menu_sub SET mm_id =?, name_ms = ?, form_ms = ?, personneltype_ms = ?, time_radio = ?, datestart_ms = ?, dateend_ms = ?, status_ms= ?, group_radio = ?, group_ms = ?, icon_ms = ?, order_ms = ?, detail_ms = ?, nomember_radio = ?, member_radio = ?, officer_radio = ?, group_radio_ps = ?, group_ms_ps = ?',
                    [mm_id, name_ms, form_ms, personneltype_ms, time_r, datestart_ms, dateend_ms, status_r, group_r, group_mm, filename, order_ms, detail_ms, nomember_radio, member_radio, officer_radio, group_rps, group_mm_ps], (err, menu_sub) => {
                        if (err) {
                            res.json(err);
                        } else {
                            req.session.success = true;
                            req.session.topic = "เพิ่มข้อมูลเรียบร้อยแล้ว";
                            setTimeout(() => {
                                res.redirect('/menus/find' + mm_id);
                            }, 1000);
                        }
                    });
            });
        });
    } else {
        res.redirect('/');
    }
};

//----------------------------------------------------------------------------------------
controller.edit_ms = (req, res) => {
    const idms = req.body.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM menu_sub where idmenu_sub = ?;', [idms], (err, data) => {
            if (err) {
                console.log("err");
            }
            res.json({ data })
        })
    })
};

controller.update_ms = (req, res) => {
    if (req.session.idadmins) {
        console.log(req.body);
        console.log(req.files);
        const idms = req.body.idms;
        const name_ms = req.body.name_ms;
        const time_r = req.body.checktime_radio;
        const status_r = req.body.checkstatus_radio;
        const group_r = req.body.checkgroup_radio;
        const group_rps = req.body.checkgroup_radio_ps;
        const icon_r = req.body.checkicon_radio;
        const detail_ms = req.body.detail_ms;
        const nomb_r = req.body.nomember_radio;
        const mb_r = req.body.member_radio;
        const officer_r = req.body.officer_radio;
        const form_ms = req.body.form_ms;
        const personneltype_ms = req.body.personneltype_ms;

        if (time_r == 1) {
            datestart_ms = '0000-00-00'
            dateend_ms = '0000-00-00'
        } else {
            datestart_ms = req.body.datestart_ms;
            dateend_ms = req.body.dateend_ms;
        }

        if (group_r == 1) {
            group_ms = '-'
        } else {
            group_ms = req.body.group_mm;

        }

        if (group_rps == 1) {
            group_ms_ps = '-'
        } else {
            group_ms_ps = req.body.group_mm_ps;
        }

        if (nomb_r == '1') {
            nomember_radio = 1;
        } else {
            nomember_radio = 0;
        }

        if (mb_r == '2') {
            member_radio = 1;
        } else {
            member_radio = 0;
        }

        if (officer_r == '3') {
            officer_radio = 1;
        } else {
            officer_radio = 0;
        }

        if (icon_r == 1) {
            if (req.files) {
                var file = req.files;
                filename = file[0].filename
            }
        } else {
            var filename = req.body.value_icon_default
        }

        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM menu_sub WHERE idmenu_sub = ? ', [idms], (err, menu_default) => {
                conn.query('UPDATE menu_sub SET name_ms = ?,form_ms = ?,personneltype_ms = ?,time_radio = ?,datestart_ms = ?,dateend_ms = ?,status_ms= ?,group_radio = ?,group_ms = ?,icon_ms = ?, detail_ms = ?,nomember_radio = ?,member_radio = ?,officer_radio = ?,group_radio_ps = ?,group_ms_ps = ? WHERE idmenu_sub = ?;', [name_ms, form_ms, personneltype_ms, time_r, datestart_ms, dateend_ms, status_r, group_r, group_ms, filename, detail_ms,nomember_radio,member_radio,officer_radio,group_rps,group_ms_ps, idms], (err, update_value) => {
                    if (err) {
                        res.json(err);
                    } else {
                        req.session.success = true;
                        req.session.topic = "แก้ไขข้อมูลการติดต่อเรียบร้อยแล้ว";
                        setTimeout(() => {
                            res.redirect('/menus/find' + menu_default[0].mm_id);
                        }, 1000)
                    }
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.check_ms = (req, res) => {
    const idmm = req.body.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM menu_sub where idmenu_sub = ?;', [idmm], (err, data) => {
            if (err) {
                console.log("err");
            }
            res.json({ data })
        })
    })
};

controller.delete_ms = (req, res) => {
    if (req.session.idadmins) {
        const idms = req.body.idms;
        const order_ms = req.body.order_ms;
        const mm_id = req.body.mm_id;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM menu_sub WHERE order_ms > ? order by order_ms', [order_ms], (err, sort_menus) => {
                for (var i = 0; i < sort_menus.length; i++) {
                    conn.query('UPDATE menu_sub SET order_ms = ? WHERE idmenu_sub = ?', [sort_menus[i].order_ms - 1, sort_menus[i].idmenu_sub], (err, update_order_mm) => { })
                }
            })
            conn.query('UPDATE menu_sub SET del_status = 1 WHERE idmenu_sub = ?', [idms], (err, delete_mm) => {
                if (err) {
                    res.json(err);
                } else {
                    req.session.success = true;
                    req.session.topic = "ลบข้อมูลการติดต่อเรียบร้อยแล้ว";
                    setTimeout(() => {
                        res.redirect('/menus/find' + mm_id);
                    }, 1000)
                }
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.position_mm = (req, res) => {
    if (req.session.idadmins) {
        const setpositions = req.body.positions;
        const fl = req.body.menu_length;
        const tmm = req.body.tabmm;
        const updateField = tmm == 1 ? 'nomember_order' :
            tmm == 2 ? 'member_order' :
                tmm == 3 ? 'officer_order' : null;
        req.getConnection((err, conn) => {
            const sql = 'UPDATE menu_main SET ' + updateField + ' = ? WHERE idmenu_main = ?';

            const updatePromises = [];
            for (var i = 0; i < fl; i++) {
                const promise = new Promise((resolve, reject) => {
                    conn.query(sql, [setpositions[i][1], setpositions[i][0]], (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                });
                updatePromises.push(promise);
            }

            Promise.all(updatePromises)
                .then(() => {
                    res.json({ message: "success" });
                })
                .catch(err => {
                    res.json(err);
                });
        });
    } else {
        res.redirect('/');
    }
};


controller.position_ms = (req, res) => {
    if (req.session.idadmins) {
        const setpositions = req.body.positions;
        const fl = req.body.menu_length;
        const tmm = req.body.tabmm;
        const updateField = tmm == 1 ? 'nomember_order' :
            tmm == 2 ? 'member_order' :
                tmm == 3 ? 'officer_order' : null;

        req.getConnection((err, conn) => {
            const sql = 'UPDATE menu_sub SET ' + updateField + ' = ? WHERE idmenu_sub = ?';

            const updatePromises = [];
            for (var i = 0; i < fl; i++) {
                const promise = new Promise((resolve, reject) => {
                    conn.query(sql, [setpositions[i][1], setpositions[i][0]], (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                });
                updatePromises.push(promise);
            }

            Promise.all(updatePromises)
                .then(() => {
                    res.json({ message: "success" });
                })
                .catch(err => {
                    res.json(err);
                });
        });
    } else {
        res.redirect('/');
    }
};

module.exports = controller;