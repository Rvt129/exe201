import React from "react";
import Navbar from "../../components/layout/Navbar";
import "./SizeGuide.css";

const dogSizes = [
  { size: "S", weight: "1-3kg" },
  { size: "M", weight: "3-6kg" },
  { size: "L", weight: "6-10kg" },
  { size: "XL", weight: "10-15kg" },
  { size: "Big size", weight: ">15kg" },
];

const catSizes = [
  { size: "S", weight: "1-3kg" },
  { size: "M", weight: "3-5kg" },
  { size: "L", weight: "5-7kg" },
  { size: "XL", weight: "7-9kg" },
  { size: "Big size", weight: ">9kg" },
];

export default function SizeGuide() {
  return (
    <>
      <Navbar />
      <div className="size-guide-container">
        <h1>Bảng Size Áo Thú Cưng</h1>
        <div className="size-table-section">
          <h2>Chó (DOG)</h2>
          <table className="size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Cân nặng</th>
              </tr>
            </thead>
            <tbody>
              {dogSizes.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.size}</td>
                  <td>{row.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="size-table-section">
          <h2>Mèo (CAT)</h2>
          <table className="size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Cân nặng</th>
              </tr>
            </thead>
            <tbody>
              {catSizes.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.size}</td>
                  <td>{row.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="size-guide-note">
          <h3>Hướng dẫn chọn size:</h3>
          <ul>
            <li>Đo cân nặng thú cưng để chọn size phù hợp.</li>
            <li>
              Nếu thú cưng ở giữa 2 size, nên chọn size lớn hơn để thoải mái
              hơn.
            </li>
            <li>Liên hệ hỗ trợ nếu cần tư vấn thêm về size.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
