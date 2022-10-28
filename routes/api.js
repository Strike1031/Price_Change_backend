import express from "express";
var router = express.Router();
import { monitorChange } from "../controllers/pcs.js";

/* GET API listing. */
router.get("/", function (req, res, next) {
  res.send("API Router");
});

router.get("/price", function (req, res, next) {
  res.send("Price Changes");
});

//Monitoring Price Changes
monitorChange();

// module.exports = router;
export default router;
