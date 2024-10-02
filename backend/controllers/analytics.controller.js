import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

// Function to retrieve general analytics data: total users, total products, total sales, and total revenue
export const getAnalyticsData = async () => {
  // Count the total number of users in the User collection
  const totalUsers = await User.countDocuments();

  // Count the total number of products in the Product collection
  const totalProducts = await Product.countDocuments();

  // Aggregation pipeline to calculate total sales and total revenue from the Order collection
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // No grouping criteria, meaning all documents are grouped together
        totalSales: { $sum: 1 }, // Count the number of orders (1 per order)
        totalRevenue: { $sum: "$totalAmount" }, // Sum the total amount for all orders
      },
    },
  ]);

  // Destructure totalSales and totalRevenue from the result, providing defaults if no data is found
  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  // Return an object with the analytics data
  return {
    users: totalUsers, // Total users
    products: totalProducts, // Total products
    totalSales, // Total sales (number of orders)
    totalRevenue, // Total revenue from sales
  };
};

// Function to get daily sales and revenue data for a specific date range
export const getDailySalesData = async (startDate, endDate) => {
  try {
    // Aggregation pipeline to match orders within the specified date range and group by day
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate, // Match orders created on or after the start date
            $lte: endDate, // Match orders created on or before the end date
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group orders by day (YYYY-MM-DD format)
          sales: { $sum: 1 }, // Count the number of orders for each day
          revenue: { $sum: "$totalAmount" }, // Sum the total revenue for each day
        },
      },
      { $sort: { _id: 1 } }, // Sort the results by date in ascending order
    ]);

    // Return the daily sales data (array of objects containing sales and revenue for each day)
    //return dailySalesData;

    //example od dailySalesData
    // [
    //   {
    //     _id: "2024-09-30",
    //     sales: 20,
    //     revenue: 1000.50,
    //   }
    // ]
    const dateArray = getDatesInRange(startDate, endDate);
    //console.log(dateArray) // ['2024-08-18', '2024-08-19', ...]

    return dateArray.map((date) => {
      const foundData = dailySalesData.find((item) => item._id === date);

      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0,
      };
    });
  } catch (error) {
    throw error;
  }
};

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}
