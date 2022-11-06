import express from "express";
var router = express.Router();
import { monitorChange, getBNBPriceByBlock, getTableData } from "../controllers/pcs.js";

/* GET API listing. */
router.get("/", function (req, res, next) {
  res.send("API Router");
});


//Monitoring Price Changes
monitorChange();

//Get WBNB/BUSD Price every second Group by Block number
//getBNBPriceByBlock();

export default router;
