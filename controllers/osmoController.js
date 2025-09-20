// controllers/osmoController.js
const OSMO_TYPE_ID = 29; // อสม.

const osmoController = {};

osmoController.fetchAll = (conn, cb) => {
  const sql = `
    SELECT p.idpersonnel AS id,
           CONCAT_WS(' ', p.fname_ps, p.lname_ps) AS name
    FROM new_tasaban.personnel p
    WHERE p.personnel_type = ?
      AND (p.status_id IS NULL OR p.status_id = 1)
    ORDER BY name;
  `;
  conn.query(sql, [OSMO_TYPE_ID], cb);
};

// (เผื่อโหลดแบบ AJAX)
osmoController.list = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ error: "DB connect error", details: err });
    osmoController.fetchAll(conn, (e, rows) => {
      if (e) return res.status(500).json({ error: "Query failed", details: e });
      res.json(rows);
    });
  });
}; 

osmoController.search = (req, res) => {
  const q = (req.query.q || '').trim();
  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ error: 'DB connect error', details: err });

    const like = `%${q}%`;
    const sql = `
      SELECT p.idpersonnel AS id,
             CONCAT_WS(' ', p.fname_ps, p.lname_ps) AS name
      FROM new_tasaban.personnel p
      WHERE p.personnel_type = ?
        AND (p.status_id IS NULL OR p.status_id = 1)
        AND (? = '' OR p.fname_ps LIKE ? OR p.lname_ps LIKE ? OR CONCAT_WS(' ', p.fname_ps, p.lname_ps) LIKE ?)
      ORDER BY name
      LIMIT 30;
    `;
    conn.query(sql, [OSMO_TYPE_ID, q, like, like, like], (e, rows) => {
      if (e) return res.status(500).json({ error: 'Query failed', details: e });
      res.json(rows);
    });
  });
};

module.exports = osmoController;
