const express = require("express");
const { initializeDatabase, getStatistics, getBarChart, getPiechart, getallCombinedData } = require("../controllers/product.js");

const router = express.Router();



router.route("/addalldata").get(initializeDatabase);

router.route("/statistics/:month").get(getStatistics);

router.route("/barchart/:month").get(getBarChart);

router.route("/piechart/:month").get(getPiechart);

router.route("/combineddata/:month").get(getallCombinedData);





module.exports = router;