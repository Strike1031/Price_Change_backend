import express from "express";
var router = express.Router();
import { monitorChange, getBNBPriceByBlock } from "../controllers/pcs.js";

/* GET API listing. */
router.get("/", function (req, res, next) {
  res.send("API Router");
});

router.get("/price", function (req, res, next) {
  res.send("Price Changes");
});

//Monitoring Price Changes
monitorChange();

//Get WBNB/BUSD Price every second Group by Block number
//getBNBPriceByBlock();

// module.exports = router;
export default router;
