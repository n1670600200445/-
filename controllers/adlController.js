const controller = {};
const { login } = require("./loginusersControllers");
const ejs = require('ejs');


controller.showForm = (req, res) => {
    res.render('./forms/adlForm', { result: null, assessment: null, answers: {} });
};

controller.calculateScore = (req, res) => {
    let score = 0;

    // รับค่าจากฟอร์ม
    const answers = req.body;

    // รวมคะแนนจากแต่ละคำถาม
    for (let i = 1; i <= 10; i++) {
        if (answers['q' + i]) {
            score += parseInt(answers['q' + i]);
        }
    }

    // ตรวจสอบเกณฑ์การประเมิน
    let assessment;
    let data;
    if (score <= 4) {
        assessment = 'กลุ่มติดเตียง';
        data = { assessment: assessment };
    } else if (score <= 8) {
        assessment = 'กลุ่มติดบ้าน';
        data = { assessment: assessment };
    } else if (score <= 11) {
        assessment = 'กลุ่มติดสังคม';
        data = { assessment: assessment };
    } else if (score <= 20) {
        assessment = 'ไม่ใช่ผู้สูงอายุ';
        data = { assessment: assessment };
    }

    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).json(err);
        }

        let tableName;
        if (assessment === 'กลุ่มติดเตียง') {
            tableName = 'elderly';
        } else if (assessment === 'กลุ่มติดบ้าน') {
            tableName = 'house';
        } else if (assessment === 'กลุ่มติดสังคม') {
            tableName = 'society';
        } else if (assessment === 'ไม่ใช่ผู้สูงอายุ') {
            tableName = 'bedridden';
        }

        conn.query(`INSERT INTO ${tableName} SET ?`, data, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            
            // ส่งผลลัพธ์และคำตอบกลับไปยังหน้าฟอร์ม
            res.render('./forms/adlForm', { result: score, assessment: assessment, answers: answers });
        });
    });
};



controller.showForm3 = (req, res) => {
   
    res.render('../views/forms/adlForm_3 .ejs', { result: null, assessment: null, answers: {} });

};


controller.calculateScore3 = (req, res) => {
    let score = 0;

    // รับค่าจากฟอร์ม
    const answers = req.body;

    // รวมคะแนนจากแต่ละคำถาม
    for (let i = 1; i <= 10; i++) {
        if (answers['q' + i]) {
            score += parseInt(answers['q' + i]);
        }
    }

    // ตรวจสอบเกณฑ์การประเมิน
    let assessment;
    let data;
    if (score <= 4) {
        assessment = 'กลุ่มติดเตียง';
        data = { assessment: assessment };
    } else if (score <= 8) {
        assessment = 'กลุ่มติดบ้าน';
        data = { assessment: assessment };
    } else if (score <= 11) {
        assessment = 'กลุ่มติดสังคม';
        data = { assessment: assessment };
    } else if (score <= 20) {
        assessment = 'ไม่ใช่ผู้สูงอายุ';
        data = { assessment: assessment };
    }

    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).json(err);
        }

        let tableName;
        if (assessment === 'กลุ่มติดเตียง') {
            tableName = 'elderly';
        } else if (assessment === 'กลุ่มติดบ้าน') {
            tableName = 'house';
        } else if (assessment === 'กลุ่มติดสังคม') {
            tableName = 'society';
        } else if (assessment === 'ไม่ใช่ผู้สูงอายุ') {
            tableName = 'bedridden';
        }

        conn.query(`INSERT INTO ${tableName} SET ?`, data, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            
           

            // ส่งผลลัพธ์และคำตอบกลับไปยังหน้าฟอร์ม
            res.render('../views/forms/adlForm_3 .ejs', { result: score, assessment: assessment, answers: answers });
        });
    });
};




controller.showForm2 = (req, res) => {
    res.render('./forms/adlForm2', {
        result: null,
        assessment: null,
        answers: {},
        cookies: req.cookies  // Pass cookies to the view
    });
};

controller.calculateScore2 = (req, res) => {
    let score = 0;
    const answers = req.body;

    for (let i = 1; i <= 10; i++) {
        if (answers['q' + i]) {
            score += parseInt(answers['q' + i]);
        }
    }

    let assessment;
    let data;
    if (score <= 4) {
        assessment = 'กลุ่มติดเตียง';
    } else if (score <= 8) {
        assessment = 'กลุ่มติดบ้าน';
    } else if (score <= 11) {
        assessment = 'กลุ่มติดสังคม';
    } else if (score <= 20) {
        assessment = 'ไม่ใช่ผู้สูงอายุ';
    }
    data = { assessment: assessment };

    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).json(err);
        }

        let tableName;
        if (assessment === 'กลุ่มติดเตียง') {
            tableName = 'elderly';
        } else if (assessment === 'กลุ่มติดบ้าน') {
            tableName = 'house';
        } else if (assessment === 'กลุ่มติดสังคม') {
            tableName = 'society';
        } else if (assessment === 'ไม่ใช่ผู้สูงอายุ') {
            tableName = 'bedridden';
        }

        conn.query(`INSERT INTO ${tableName} SET ?`, data, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            
            res.render('./forms/adlForm2', { result: score, assessment: assessment, answers: answers, cookies: req.cookies });
        });
    });
};




module.exports = controller;
