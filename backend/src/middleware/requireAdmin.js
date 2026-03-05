export function requireAdmin(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (!process.env.ADMIN_TOKEN) {
    return res.status(500).json({ ok: false, code: "ADMIN_TOKEN_MISSING" });
  }
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, code: "UNAUTHORIZED" });
  }
  next();
}