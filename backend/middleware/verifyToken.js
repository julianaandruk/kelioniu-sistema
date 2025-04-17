const jwt = require('jsonwebtoken');

// Middleware funkcija, kuri patikrina JWT tokeną iš užklausos antraštės
function verifyToken(req, res, next) {
  // Paimame 'Authorization' antraštę iš užklausos
  const authHeader = req.headers.authorization;

  // Jei tokeno nėra – gražiname 401 (neautorizuota)
  if (!authHeader) return res.status(401).json({ message: 'Token trūksta' });

  // Išskiriame tokeną iš antraštės (formato: "Bearer tokenas")
  const token = authHeader.split(' ')[1];

  try {
    // Patikriname tokeną naudodami tą patį slaptą raktą, kuris buvo naudotas generuojant
    const user = jwt.verify(token, 'slaptas_raktas');

    // Įrašome vartotojo informaciją į užklausos objektą, kad būtų galima naudoti vėliau
    req.user = user;

    // Pereiname prie kito middleware ar route handler
    next();
  } catch (err) {
    // Jei tokenas neteisingas arba pasibaigęs – gražiname 403 (uždrausta)
    return res.status(403).json({ message: 'Neleistinas tokenas' });
  }
}

module.exports = verifyToken;
