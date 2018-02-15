const User = require('../../models/User')
const router = require('express').Router()
const adminApi = require("./adminApi")
const uid = require('uid2')

router.post("/init-user-registration", async function(req, res, next) {
  const { username } = req.body

  const existUser = await User.findOne({ username })
  
  if (existUser) {
    return res.status(400).json({ message: 'User name taken' })
  }

  const initInfo = await adminApi.initUserRegistration();
  
  const user = new User({
    username,
    zkitId: initInfo.UserId,
    registrationData: {
      sessionId: initInfo.RegSessionId,
      sessionVerifier: initInfo.RegSessionVerifier
    },
    state: 0
  });

  user.save();

  res.status(200).json({
    userId: user.zkitId,
    regSessionId: user.registrationData.sessionId
  })
});

router.post("/finish-user-registration", async function(req, res, next) {
  const { userId, validationVerifier } = req.body;

  const validationCode = uid(32);
  const user = await User.findOne({ zkitId: userId, state: 0 })

  if (user.state !== 0) throw new Error("UserInWrongState");

  user.registrationData.validationVerifier = validationVerifier;
  user.registrationData.validationCode = validationCode;
  user.state = 1;

  // validate user when register
  const { sessionId, sessionVerifier } = user.registrationData;
  
  await adminApi.validateUser(user.zkitId, sessionId, sessionVerifier, validationVerifier);
  
  res.json({id: user.id, username: user.username})
});

router.get("/user", async function (req, res, next) {
  const { username, zkitId } = req.query

  const user = typeof username === "string" ?
    await User.findOne({ username })
    :
    await User.findOne({ zkitId })

  if (!user)
    return res.status(400).json({ message: "User does not exist" })  
  
  res.json(user)
});



module.exports = router;