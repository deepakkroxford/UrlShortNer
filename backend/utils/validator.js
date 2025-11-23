const CODE_RE = /^[A-Za-z0-9]{6,8}$/;
module.exports = {
isValidCode: (c) => CODE_RE.test(c),
isValidUrl: (s) => {
try {
const u = new URL(s);
return ['http:', 'https:'].includes(u.protocol);
} catch (e) { return false; }
}
}