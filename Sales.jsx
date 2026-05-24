import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "../styles/style.css";

function Sales() {
  const [sales, setSales] = useState([]);

  const [formData, setFormData] = useState({
    product_name: "",
    category: "",
    quantity: "",
    price: "",
    sale_date: "",
  });

  const [message, setMessage] = useState("");

  const fetchSales = async () => {
    try {
      const response = await api.get("/sales");
      setSales(response.data);
    } catch (error) {
      console.log("Sales fetch error:", error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSale = async (e) => {
    e.preventDefault();

    const saleData = {
      product_name: formData.product_name,
      category: formData.category,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      sale_date: formData.sale_date,
    };

    try {
      await api.post("/sales", saleData);

      setMessage("Sale added successfully!");

      setFormData({
        product_name: "",
        category: "",
        quantity: "",
        price: "",
        sale_date: "",
      });

      fetchSales();
    } catch (error) {
      setMessage(error.response?.data?.detail || "Failed to add sale");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/sales/${id}`);
      fetchSales();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  const downloadCSV = () => {
    if (sales.length === 0) {
      alert("No sales records available to download.");
      return;
    }

    const headers = [
      "Product Name",
      "Category",
      "Quantity",
      "Price",
      "Sale Date",
      "Total",
    ];

    const rows = sales.map((sale) => [
      sale.product_name,
      sale.category,
      sale.quantity,
      sale.price,
      sale.sale_date,
      sale.quantity * sale.price,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "salespulse_sales_report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Navbar />

      <main className="main-container">
        <div className="page-header sales-header">
          <div>
            <h1>Sales</h1>
            <p>Add, manage, and download your sales records</p>
          </div>

          <button className="download-btn" onClick={downloadCSV}>
            Download Report
          </button>
        </div>

        <div className="sales-layout">
          <div className="form-card">
            <h2>Add Sale</h2>

            <form onSubmit={handleAddSale}>
              <input
                type="text"
                name="product_name"
                placeholder="Product name"
                value={formData.product_name}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
              />

              <input
                type="date"
                name="sale_date"
                value={formData.sale_date}
                onChange={handleChange}
                required
              />

              <button type="submit">Add Sale</button>
            </form>

            {message && <p className="message">{message}</p>}
          </div>

          <div className="table-card">
            <h2>Sales Records</h2>

            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {sales.length > 0 ? (
                  sales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.product_name}</td>
                      <td>{sale.category}</td>
                      <td>{sale.quantity}</td>
                      <td>₹{sale.price}</td>
                      <td>{sale.sale_date}</td>
                      <td>₹{sale.quantity * sale.price}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(sale.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="empty-text">
                      No sales records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Sales;