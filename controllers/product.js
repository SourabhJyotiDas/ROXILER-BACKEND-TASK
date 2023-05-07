const Product = require("../models/product");
const axios = require("axios");



exports.initializeDatabase = async (req, res, next) => {
   try {
      // Fetch JSON data from the third-party API
      const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');

      // Insert the seed data into the products collection
      const products = await Product.insertMany(data);

      res.status(200).json({
         success: true,
         products
      })
   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message,
      });
   }
}

exports.getStatistics = async (req, res, next) => {
   try {
      const month = req.params.month.toLowerCase(); // Convert the month parameter to lowercase
      const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');

      // Filter the data based on the selected month
      const filteredData = data.filter(item => {
         const itemMonth = new Date(item.dateOfSale).toLocaleString('default', { month: 'long' }).toLowerCase();
         return itemMonth === month;
      });

      // Calculate the total sale amount, number of sold items, and number of not sold items
      const totalSaleAmount = filteredData.reduce((total, item) => total + item.price, 0);
      const totalSoldItems = filteredData.reduce((total, item) => total + item.sold, 0);
      const totalNotSoldItems = filteredData.reduce((total, item) => {
         if (item.sold === false) {
            return total + 1;
         } else {
            return total;
         }
      }, 0);

      const statistics = {
         totalSaleAmount,
         totalSoldItems,
         totalNotSoldItems
      };

      res.status(200).json({
         success: true,
         statistics
      })
   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message,
      });
   }
}


exports.getBarChart = async (req, res, next) => {
   try {
      const month = req.params.month.toLowerCase(); // Convert the month parameter to lowercase
      const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');

      // Filter the data based on the selected month
      const filteredData = data.filter(item => {
         const itemMonth = new Date(item.dateOfSale).toLocaleString('default', { month: 'long' }).toLowerCase();
         return itemMonth === month;
      });

      // Define the price ranges
      const priceRanges = [
         { min: 0, max: 100 },
         { min: 101, max: 200 },
         { min: 201, max: 300 },
         { min: 301, max: 400 },
         { min: 401, max: 500 },
         { min: 501, max: 600 },
         { min: 601, max: 700 },
         { min: 701, max: 800 },
         { min: 801, max: 900 },
         { min: 901, max: Infinity }
      ];

      // Count the number of items in each price range
      const priceRangeCounts = priceRanges.map(range => {
         const count = filteredData.filter(item => item.price >= range.min && item.price <= range.max).length;
         return {
            range: `${range.min} - ${range.max}`,
            count
         };
      });

      res.status(200).json({
         success: true,
         priceRangeCounts
      })
   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message,
      });
   }
}

exports.getPiechart = async (req, res, next) => {
   try {
      const selectedMonth = req.params.month.toLowerCase();

      const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');

      // Filter data based on the selected month
      const filteredData = data.filter(item => {
         const saleDate = new Date(item.dateOfSale);
         return saleDate.toLocaleString('default', { month: 'long' }).toLowerCase() === selectedMonth;
      });

      // Count the number of items in each category
      const categoryCounts = {};

      filteredData.forEach(item => {
         const category = item.category;
         categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      // Prepare the data for the pie chart
      const pieChartData = Object.keys(categoryCounts).map(category => {
         return {
            category,
            count: categoryCounts[category]
         };
      });

      res.status(200).json({
         success: true,
         pieChartData
      });

   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message,
      });
   }
}

exports.getallCombinedData = async (req, res, next) => {
   try {
      const month = req.params.month;
      // Make requests to the three APIs
      const statisticsResponse = await axios.get(`http://localhost:4000/api/v1/statistics/${month}`);
      const barChartResponse = await axios.get(`http://localhost:4000/api/v1/barchart/${month}`);
      const pieChartResponse = await axios.get(`http://localhost:4000/api/v1/piechart/${month}`);

      // Combine the responses into a single JSON object
      const combinedData = {
         statistics: statisticsResponse.data,
         barChart: barChartResponse.data,
         pieChart: pieChartResponse.data
      };

      res.status(500).json({
         success: true,
         combinedData
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message,
      });
   }
}
