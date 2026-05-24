import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import SalesChart from "../components/SalesChart";
import api from "../services/api";
import "../styles/style.css";

function Dashboard() {
  const monthlyTarget = 100000;

  const [dashboardData, setDashboardData] = useState({
    total_sales: 0,
    total_revenue: 0,
    total_quantity: 0,
    average_sale: 0,
  });

  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const dashboardResponse = await api.get("/dashboard");
      const monthlyResponse = await api.get("/analytics/monthly");
      const categoryResponse = await api.get("/analytics/category");

      setDashboardData(dashboardResponse.data);
      setMonthlyData(monthlyResponse.data);
      setCategoryData(categoryResponse.data);
    } catch (error) {
      console.log("Dashboard error:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const goalProgress = Math.min(
    (dashboardData.total_revenue / monthlyTarget) * 100,
    100
  );

  const topCategory =
    categoryData.length > 0
      ? categoryData.reduce((max, item) =>
          item.revenue > max.revenue ? item : max
        )
      : null;

  const getMotivationMessage = () => {
    if (dashboardData.total_revenue === 0) {
      return "Start adding sales to track your goal progress.";
    }

    if (goalProgress < 40) {
      return "Keep going! You are building momentum.";
    }

    if (goalProgress < 75) {
      return "Good progress! You are getting closer to your target.";
    }

    if (goalProgress < 100) {
      return "Excellent! You are very close to reaching your goal.";
    }

    return "Amazing! You have achieved your sales target.";
  };

  return (
    <div>
      <Navbar />

      <main className="main-container">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>View your sales summary, analytics, and monthly goal progress</p>
        </div>

        <div className="stats-grid">
          <StatCard title="Total Sales" value={dashboardData.total_sales} />

          <StatCard
            title="Total Revenue"
            value={`₹${dashboardData.total_revenue.toFixed(2)}`}
          />

          <StatCard
            title="Total Quantity"
            value={dashboardData.total_quantity}
          />

          <StatCard
            title="Average Sale"
            value={`₹${dashboardData.average_sale.toFixed(2)}`}
          />
        </div>

        <div className="goal-card">
          <div className="goal-header">
            <div>
              <h2>Monthly Sales Goal</h2>
              <p>{getMotivationMessage()}</p>
            </div>

            <div className="goal-percent">{goalProgress.toFixed(0)}%</div>
          </div>

          <div className="goal-info">
            <span>
              Current Revenue: ₹{dashboardData.total_revenue.toFixed(2)}
            </span>
            <span>Target: ₹{monthlyTarget.toLocaleString("en-IN")}</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${goalProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="insight-card">
          <div>
            <h2>Smart Sales Insight</h2>

            {topCategory ? (
              <p>
                Your best-performing category is{" "}
                <strong>{topCategory.category}</strong> with revenue of{" "}
                <strong>₹{topCategory.revenue.toFixed(2)}</strong>.
              </p>
            ) : (
              <p>Add sales records to generate smart insights.</p>
            )}
          </div>

          <div className="insight-badge">
            {topCategory ? topCategory.category : "No Data"}
          </div>
        </div>

        <SalesChart monthlyData={monthlyData} categoryData={categoryData} />
      </main>
    </div>
  );
}

export default Dashboard;