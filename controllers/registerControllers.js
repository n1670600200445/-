// const controller = {};
// const request = require('request')
// const redisC = require('../redis_db.js')
// //!---------------------------------------------------------เจ้าหน้าที่ลงทะเบียน------------------------------------------------
// controller.register = (req, res) => {
//     req.getConnection((err, conn) => {
//         conn.query('SELECT * FROM personneltype', (err, personneltype) => {
//             if (err) {
//                 res.json(err);
//             }
//             res.render('register/registerpersonnel', { session: req.session, personneltype: personneltype });
//         })
//     })
// };

// controller.getOTP = (req, res) => {
//     let generate_otp = Math.trunc(Math.random() * 1000000);
//     const phone_us = req.body.phone_us;
//     redisC.setex(phone_us, 600, generate_otp);
//     req.getConnection((err, conn) => {
//         var data = '{"sender": "CPTW","msisdn":  ["' + phone_us + '"],"message": "ใช้ OTP ' + generate_otp + ' เพื่อสมัครสมาชิก"}';
//         console.log(data);
//         var options = {
//             'method': 'POST',
//             'url': 'https://thsms.com/api/send-sms',
//             'headers': {
//                 "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC90aHNtcy5jb21cL21hbmFnZVwvYXBpLWtleSIsImlhdCI6MTcwOTE0ODk0NCwibmJmIjoxNzA5MTUyNzc4LCJqdGkiOiJBdTl0ZWRHYlJKR2N2RFNzIiwic3ViIjoxMTA4MjgsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.I8rQt8AKeRz8tjSihrvZf6swl--I9w-qY28jSGLXqh4"
//                 ,"Content-Type": "application/json"
//             },
//             'body': data,
//         };
//         request(options, function (error, response) {
//             if (error) throw new Error(error);
//             console.log(response.body);
//         });
//         res.render("register/verify", { phone_us })
//     })
// };

// controller.gettimeout = (req, res) => {
//     const { phone_us } = req.body;
//     redisC.ttl(phone_us, (err, ttl) => {
//         res.json({ timeout: ttl });
//     });
// };

// controller.verify_us = (req, res) => {
//     const input_verifynumber = req.body.input_verifynumber;
//     const phone_us = req.body.phone_us;
//     req.getConnection((err, conn) => {
//         conn.query('SELECT * FROM village', (err, village) => {
//             redisC.get(phone_us, (err, otp) => {
//                 if (otp) {
//                     if (input_verifynumber == otp) {
//                         return res.json({ Log: 1 });
//                     };
//                     return res.json({ Log: 2 });
//                 };
//                 return res.json({ Log: 3 });
//             });
//         });
//     });
// };

// controller.registersave = (req, res) => {
//     const data = req.body;
//     var checkPersonnelRegister = true;
//     req.getConnection((err, conn) => {
//         conn.query('SELECT idcard_ps FROM personnel', (err, personnel) => {
//             for (var i = 0; i < personnel.length; i++) {
//                 if (personnel[i].idcard_ps == data.idcard_ps) {
//                     res.render('register/registeruser_failed');
//                     checkPersonnelRegister = false
//                 }
//             }
//             if (checkPersonnelRegister) {
//                 req.getConnection((err, conn) => {
//                     conn.query('select * from line_token where idline_token = 1', (error, token) => {
//                         conn.query('INSERT INTO personnel set fname_ps = ? , lname_ps = ? , idcard_ps = ? , phone_ps = ?, personnel_type= ?, status_id = 2'
//                             , [data.fname_ps, data.lname_ps, data.idcard_ps, data.phone_us, data.personnel_type], (err, result) => {
//                                 if (err) {
//                                     console.log(err);
//                                 } else {
//                                     request({
//                                         method: 'POST',
//                                         url: 'https://notify-api.line.me/api/notify',
//                                         header: {
//                                             'Content-Type': 'application/x-www-form-urlencoded',
//                                         },
//                                         auth: {
//                                             bearer: token[0].line_token, //token
//                                         },
//                                         form: {
//                                             message: 'ได้มีการขอลงทะเบียนใช้งานระบบของเจ้าหน้าที่', //ข้อความที่จะส่ง
//                                         },
//                                     })
//                                     res.render('register/registerSuccess');
//                                 }
//                             })
//                     });
//                 });
//             }
//         })
//     })
// };
// //!---------------------------------------------------------ประชาชนลงทะเบียน------------------------------------------------


// controller.registeruser = (req, res) => {
//     const phone_us = req.body.phone_us
//     req.getConnection((err, conn) => {
//         conn.query('SELECT * FROM sex', (err, sex) => {
//             conn.query('SELECT * FROM village', (err, village) => {
//                 if (err) {
//                     res.json(err);
//                 } else {
//                     res.render('register/registeruser', { sex: sex, village: village });
//                 }
//             })
//         })
//     })
// };

// controller.registerusersave = (req, res) => {
//     const data = req.body;
//     console.log(data);
//     if (data.mm < 10) {
//         data.mm = "0" + data.mm;
//     }
//     if (data.dd < 10) {
//         data.dd = "0" + data.dd;
//     }
//     const formatdate = data.yyyy + "-" + data.mm + "-" + data.dd
//     console.log("formatdate : ", formatdate);
//     const data2 = {
//         "fname_us": data.fname_us,
//         "lname_us": data.lname_us,
//         "idcard_us": data.idcard_us,
//         "phone_us": data.phone_us,
//         "sex_us": data.sex_us,
//         "address_us": data.address_us,
//         "village_id": data.village_id,
//         "birthday_us": formatdate,
//     }

//     var checkUserRegister = true;
//     req.getConnection((err, conn) => {
//         conn.query('SELECT idcard_us FROM users', (err, users) => {
//             for (var i = 0; i < users.length; i++) {
//                 if (users[i].idcard_us == data2.idcard_us) {
//                     res.render('register/registeruser_failed');
//                     checkUserRegister = false
//                 }
//             }
//             if (checkUserRegister) {
//                 conn.query('select * from line_token where idline_token = 1', (error, token) => {
//                     conn.query('INSERT INTO users set fname_us = ? , lname_us = ? , idcard_us = ? , phone_us = ?, sex_us= ?, status_id = 2 , address_us = ?, village_id = ?, birthday_us = ?'
//                         , [data2.fname_us, data2.lname_us, data2.idcard_us, data2.phone_us, data2.sex_us, data2.address_us, data2.village_id, data2.birthday_us], (err, result) => {
//                             if (err) {
//                                 console.log(err);
//                             } else {
//                                 request({
//                                     method: 'POST',
//                                     url: 'https://notify-api.line.me/api/notify',
//                                     header: {
//                                         'Content-Type': 'application/x-www-form-urlencoded',
//                                     },
//                                     auth: {
//                                         bearer: token[0].line_token, //token
//                                     },
//                                     form: {
//                                         message: 'ได้มีการขอลงทะเบียนใช้งานระบบของประชาชน', //ข้อความที่จะส่ง
//                                     },
//                                 })
//                                 res.render('register/registerSuccess');
//                             }
//                         });
//                 });
//             }
//         })
//     })
// };

// //!-----------------------------------------------------------------------------------ADMIN ยืนยันการลงทะเบียน-----------------------------------------------------
// controller.registerList = (req, res) => {//?รายชื่อคนขอลงทะเบียนทั้งส่วนของเจ้าหน้าที่และประชาชน
//     req.getConnection((err, conn) => {
//         conn.query('SELECT * FROM personnel ps JOIN personneltype psty ON ps.personnel_type = psty.idpersonneltype  WHERE status_id = 2', (err, personnel) => {
//             conn.query('SELECT * FROM users us  JOIN village vl ON vl.idvillage = us.village_id WHERE status_id = 2;', (err, users) => {
//                 if (err) {
//                     res.json(err);
//                 }
//                 res.render('register/registerList', { session: req.session, personnel: personnel, users: users });
//             })
//         })
//     })
// };

// controller.registerAcceptPersonnel = (req, res) => {//?อนุมัติเจ้าหน้าที่
//     if (req.session.idadmins) {
//         const { id } = req.params;
//         req.session.success = true;
//         req.session.topic = "อนุมัติเจ้าหน้าที่เรียบร้อยแล้ว";
//         req.getConnection((err, conn) => {
//             conn.query('UPDATE personnel set status_id = 1 WHERE idpersonnel = ?', [id], (err, result) => {
//                 if (err) {
//                     res.json(err);
//                 }
//                 setTimeout(() => {
//                     res.redirect('/register/person');
//                 }, 1000)
//             });
//         });
//     } else {
//         res.redirect('/');
//     }
// }

// controller.registerAcceptUser = (req, res) => {//?อนุมัติประชาชน
//     if (req.session.idadmins) {
//         const { id } = req.params;
//         req.session.success = true;
//         req.session.topic = "อนุมัติประชาชนเสร็จเรียบร้อยแล้ว";
//         req.getConnection((err, conn) => {
//             conn.query('UPDATE users set status_id = 1 WHERE idusers = ?', [id], (err, result) => {
//                 if (err) {
//                     res.json(err);
//                 }
//                 setTimeout(() => {
//                     res.redirect('/register/person');
//                 }, 1000)
//             });
//         });
//     } else {
//         res.redirect('/');
//     }
// }

// controller.registerCancelPersonnel = (req, res) => {//?ไม่อนุมัติเจ้าหน้าที่
//     if (req.session.idadmins) {
//         const { id } = req.params;
//         req.session.success = true;
//         req.session.topic = "ไม่อนุมัติเจ้าหน้าที่";
//         req.getConnection((err, conn) => {
//             conn.query('DELETE FROM personnel WHERE idpersonnel = ?', [id], (err, result) => {
//                 if (err) {
//                     res.json(err);
//                 }
//                 setTimeout(() => {
//                     res.redirect('/register/person');
//                 }, 1000)
//             });
//         });
//     } else {
//         res.redirect('/');
//     }
// }

// controller.registerCancelUser = (req, res) => {//?ไม่อนุมัติประชาชน
//     if (req.session.idadmins) {
//         const { id } = req.params;
//         req.session.success = true;
//         req.session.topic = "ไม่อนุมัติประชาชน";
//         req.getConnection((err, conn) => {
//             conn.query('DELETE FROM users WHERE idusers = ?', [id], (err, result) => {
//                 if (err) {
//                     res.render('delete_err');
//                 }
//                 setTimeout(() => {
//                     res.redirect('/register/person');
//                 }, 1000)
//             });
//         });
//     } else {
//         res.redirect('/');
//     }
// }
// module.exports = controller;




const controller = {};
const request = require('request')
//!---------------------------------------------------------เจ้าหน้าที่ลงทะเบียน------------------------------------------------
// controller.register = (req, res) => {
//     req.getConnection((err, conn) => {
//         conn.query('SELECT * FROM personneltype', (err, personneltype) => {
//             if (err) {
//                 res.json(err);
//             }
//             res.render('register/registerpersonnel', { session: req.session, personneltype: personneltype });
//         });
//     });
// };

//--------------------------------แก้ไข้เจ้าหน้าที่ที่ลงทะเบียน------------------------------------------------------------------

controller.register = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        // Query for personneltype and village
        const personneltypeQuery = 'SELECT * FROM personneltype';
        const villageQuery = 'SELECT * FROM village';

        // Execute both queries in parallel
        conn.query(personneltypeQuery, (err, personneltype) => {
            if (err) {
                return res.json(err);
            }

            conn.query(villageQuery, (err, village) => {
                if (err) {
                    return res.json(err);
                }

                // Render the page with both personneltype and village data
                res.render('register/registerpersonnel', {
                    session: req.session,
                    personneltype: personneltype,
                    village: village
                });
            });
        });
    });
};

//-----------------------------------------------------------------------อันเก่า-------------------

//CYXRakgTTup2mC0G8P5xNpv7nlrbpZJtHw86gMxcxLq  ไลน์
// ลบฟังก์ชัน getOTP ที่เกี่ยวข้องกับการส่ง OTP ออกไป

// ลบฟังก์ชัน gettimeout ที่เกี่ยวข้องกับการหมดเวลาของ OTP ออกไป

// ลบฟังก์ชัน verify_us ที่เกี่ยวข้องกับการยืนยัน OTP ออกไป

controller.registersave = (req, res) => {
    const data = req.body;
    var checkPersonnelRegister = true;
    req.getConnection((err, conn) => {
        conn.query('SELECT idcard_ps FROM personnel', (err, personnel) => {
            for (var i = 0; i < personnel.length; i++) {
                if (personnel[i].idcard_ps == data.idcard_ps) {
                    res.render('register/registeruser_failed');
                    checkPersonnelRegister = false;
                }
            }
            if (checkPersonnelRegister) {
                req.getConnection((err, conn) => {
                    conn.query('select * from line_token where idline_token = 1', (error, token) => {
                        conn.query('INSERT INTO personnel set fname_ps = ? , lname_ps = ? , idcard_ps = ? , phone_ps = ?, personnel_type= ?, status_id = 2',
                            [data.fname_ps, data.lname_ps, data.idcard_ps, data.phone_us, data.personnel_type], (err, result) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    request({
                                        method: 'POST',
                                        url: 'https://notify-api.line.me/api/notify',
                                        header: {
                                            'Content-Type': 'application/x-www-form-urlencoded',
                                        },
                                        auth: {
                                            bearer: token[0].line_token, //token
                                        },
                                        form: {
                                            message: 'ได้มีการขอลงทะเบียนใช้งานระบบของเจ้าหน้าที่', //ข้อความที่จะส่ง
                                        },
                                    });
                                    res.render('register/registerSuccess');
                                }
                            });
                    });
                });
            }
        });
    });
};

//--------------------------------แก้ไขใหม่---------------------------------------------------------

// controller.registersave = (req, res) => {
//     const data = req.body;
//     var checkPersonnelRegister = true;
//     req.getConnection((err, conn) => {
//         if (err) return res.json(err);

//         // Query to check if the idcard_ps already exists
//         conn.query('SELECT idcard_ps FROM personnel', (err, personnel) => {
//             if (err) return res.json(err);

//             for (var i = 0; i < personnel.length; i++) {
//                 if (personnel[i].idcard_ps == data.idcard_ps) {
//                     res.render('register/registeruser_failed');
//                     checkPersonnelRegister = false;
//                     break;  // No need to continue the loop if a match is found
//                 }
//             }

//             if (checkPersonnelRegister) {
//                 // If personnel ID card is unique, proceed with insertion
//                 req.getConnection((err, conn) => {
//                     if (err) return res.json(err);

//                     // Query to get the line token
//                     conn.query('SELECT * FROM line_token WHERE idline_token = 1', (error, token) => {
//                         if (error) return res.json(error);

//                         // Insert personnel data with village ID
//                         conn.query(
//                             'INSERT INTO personnel (fname_ps, lname_ps, idcard_ps, phone_ps,  village_id, status_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
//                             [data.fname_ps, data.lname_ps, data.idcard_ps, data.phone_ps,  data.village_id, 2], // Including village_id
//                             (err, result) => {
//                                 if (err) {
//                                     console.log(err);
//                                     return res.json(err);
//                                 }

//                                 // Send notification using LINE Notify
//                                 request({
//                                     method: 'POST',
//                                     url: 'https://notify-api.line.me/api/notify',
//                                     header: {
//                                         'Content-Type': 'application/x-www-form-urlencoded',
//                                     },
//                                     auth: {
//                                         bearer: token[0].line_token, // Use the token from the query
//                                     },
//                                     form: {
//                                         message: 'ได้มีการขอลงทะเบียนใช้งานระบบของเจ้าหน้าที่', // Message to send
//                                     },
//                                 });

//                                 // Render success page
//                                 res.render('register/registerSuccess');
//                             }
//                         );
//                     });
//                 });
//             }
//         });
//     });
// };

//!---------------------------------------------------------ประชาชนลงทะเบียน------------------------------------------------


controller.registeruser = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM sex', (err, sex) => {
            conn.query('SELECT * FROM village', (err, village) => {
                if (err) {
                    res.json(err);
                } else {
                    res.render('register/registeruser', { sex: sex, village: village });
                }
            });
        });
    });
};

controller.registerusersave = (req, res) => {
    const data = req.body;
    console.log(data);
    if (data.mm < 10) {
        data.mm = "0" + data.mm;
    }
    if (data.dd < 10) {
        data.dd = "0" + data.dd;
    }
    const formatdate = data.yyyy + "-" + data.mm + "-" + data.dd;
    console.log("formatdate : ", formatdate);
    const data2 = {
        "fname_us": data.fname_us,
        "lname_us": data.lname_us,
        "idcard_us": data.idcard_us,
        "phone_us": data.phone_us,
        "sex_us": data.sex_us,
        "address_us": data.address_us,
        "village_id": data.village_id,
        "birthday_us": formatdate,
    };

    var checkUserRegister = true;
    req.getConnection((err, conn) => {
        conn.query('SELECT idcard_us FROM users', (err, users) => {
            for (var i = 0; i < users.length; i++) {
                if (users[i].idcard_us == data2.idcard_us) {
                    res.render('register/registeruser_failed');
                    checkUserRegister = false;
                }
            }
            if (checkUserRegister) {
                conn.query('select * from line_token where idline_token = 1', (error, token) => {
                    conn.query('INSERT INTO users set fname_us = ? , lname_us = ? , idcard_us = ? , phone_us = ?, sex_us= ?, status_id = 2 , address_us = ?, village_id = ?, birthday_us = ?',
                        [data2.fname_us, data2.lname_us, data2.idcard_us, data2.phone_us, data2.sex_us, data2.address_us, data2.village_id, data2.birthday_us], (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                request({
                                    method: 'POST',
                                    url: 'https://notify-api.line.me/api/notify',
                                    header: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    auth: {
                                        bearer: token[0].line_token, //token
                                    },
                                    form: {
                                        message: 'ได้มีการขอลงทะเบียนใช้งานระบบของประชาชน', //ข้อความที่จะส่ง
                                    },
                                });
                                res.render('register/registerSuccess');
                            }
                        });
                });
            }
        });
    });
};

//!-----------------------------------------------------------------------------------ADMIN ยืนยันการลงทะเบียน-----------------------------------------------------
controller.registerList = (req, res) => {//?รายชื่อคนขอลงทะเบียนทั้งส่วนของเจ้าหน้าที่และประชาชน
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM personnel ps JOIN personneltype psty ON ps.personnel_type = psty.idpersonneltype  WHERE status_id = 2', (err, personnel) => {
            conn.query('SELECT * FROM users us  JOIN village vl ON vl.idvillage = us.village_id WHERE status_id = 2;', (err, users) => {
                if (err) {
                    res.json(err);
                }
                res.render('register/registerList', { session: req.session, personnel: personnel, users: users });
            });
        });
    });
};

controller.registerAcceptPersonnel = (req, res) => {//?อนุมัติเจ้าหน้าที่
    if (req.session.idadmins) {
        const { id } = req.params;
        req.session.success = true;
        req.session.topic = "อนุมัติเจ้าหน้าที่เรียบร้อยแล้ว";
        req.getConnection((err, conn) => {
            conn.query('UPDATE personnel set status_id = 1 WHERE idpersonnel = ?', [id], (err, result) => {
                if (err) {
                    res.json(err);
                }
                setTimeout(() => {
                    res.redirect('/register/person');
                }, 1000);
            });
        });
    } else {
        res.redirect('/');
    }
}

controller.registerAcceptUser = (req, res) => {//?อนุมัติประชาชน
    if (req.session.idadmins) {
        const { id } = req.params;
        req.session.success = true;
        req.session.topic = "อนุมัติประชาชนเสร็จเรียบร้อยแล้ว";
        req.getConnection((err, conn) => {
            conn.query('UPDATE users set status_id = 1 WHERE idusers = ?', [id], (err, result) => {
                if (err) {
                    res.json(err);
                }
                setTimeout(() => {
                    res.redirect('/register/person');
                }, 1000);
            });
        });
    } else {
        res.redirect('/');
    }
}

controller.registerCancelPersonnel = (req, res) => {//?ไม่อนุมัติเจ้าหน้าที่
    if (req.session.idadmins) {
        const { id } = req.params;
        req.session.success = true;
        req.session.topic = "ไม่อนุมัติเจ้าหน้าที่";
        req.getConnection((err, conn) => {
            conn.query('DELETE FROM personnel WHERE idpersonnel = ?', [id], (err, result) => {
                if (err) {
                    res.json(err);
                }
                setTimeout(() => {
                    res.redirect('/register/person');
                }, 1000);
            });
        });
    } else {
        res.redirect('/');
    }
}

controller.registerCancelUser = (req, res) => {//?ไม่อนุมัติประชาชน
    if (req.session.idadmins) {
        const { id } = req.params;
        req.session.success = true;
        req.session.topic = "ไม่อนุมัติประชาชน";
        req.getConnection((err, conn) => {
            conn.query('DELETE FROM users WHERE idusers = ?', [id], (err, result) => {
                if (err) {
                    res.render('delete_err');
                }
                setTimeout(() => {
                    res.redirect('/register/person');
                }, 1000);
            });
        });
    } else {
        res.redirect('/');
    }
}

module.exports = controller;
