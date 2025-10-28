import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReportTable from './ReportTable';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);

  const categoryIdToName = {
    1: 'Grains',
    2: 'Fruits',
  };

  const categoryIcons = {
    Grains: "🌾",
    Fruits: "🍎",
  };

  const seedTypes = {
    Grains: ['Wheat', 'Rice', 'Sorghum', 'Corn'],
    Fruits: ['Sugarcane', 'Watermelon', 'Strawberry']
  };

  const cropStages = [
    { stage: 'Germination', icon: '🌱' },
    { stage: 'Vegetative', icon: '🌿' },
    { stage: 'Flowering', icon: '🌸' },
    { stage: 'Maturity', icon: '🌾' },
    { stage: 'Harvest', icon: '🚜' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8082/api/reports', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const reportsData = Array.isArray(res.data)
          ? res.data
          : res.data.reports || res.data.data || [];

        const processedReports = reportsData.map(report => {
          if (report.reportType?.toLowerCase().includes('crop') && Array.isArray(report.rows)) {
            const updatedRows = report.rows.map(row => ({
              ...row,
              categoryName: categoryIdToName[row.category_id] || `Category ${row.category_id}`
            }));
            return { ...report, rows: updatedRows };
          }
          return report;
        });

        setReports(processedReports);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching reports:", err);
        setLoading(false);
      });
  }, []);

  const handleDownload = () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8082/api/reports/download', {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'report.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(err => {
        console.error("Error downloading report:", err);
      });
  };

  const normalizeReportType = (type = '') => {
    const lower = type.toLowerCase();
    if (lower.includes('farmer') && !lower.includes('schedule')) return 'farmer';
    if (lower.includes('cropstage') || lower.includes('stage')) return 'cropstage';
    if (lower.includes('seed')) return 'seedtype';
    if (lower.includes('farmercropschedule') || lower.includes('schedule')) return 'farmercropschedule';
    if (lower.includes('crop')) return 'crop';
    return 'unknown';
  };

  const grouped = Array.isArray(reports)
    ? reports.reduce((acc, r) => {
        const table = normalizeReportType(r.reportType);
        if (!acc[table]) acc[table] = [];
        acc[table].push(r);
        return acc;
      }, {})
    : {};

  const prepareChartData = (rows) => {
    const districtCountMap = {};
    rows.forEach(row => {
      if (row.district) {
        districtCountMap[row.district] = (districtCountMap[row.district] || 0) + 1;
      }
    });
    return Object.entries(districtCountMap).map(([district, count]) => ({ district, count }));
  };

  const cropStageRows = (grouped['cropstage']?.flatMap(r => r.rows || []) || []).map(row => ({
    ...row,
    categoryName: categoryIdToName[row.category_id] || `Category ${row.category_id}`
  }));

  return (
    <div className="lg:ml-64 p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📊 Admin Report Dashboard</h1>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={handleDownload}
        >
          ⬇ Download Excel
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : Object.keys(grouped).length === 0 ? (
        <p>No reports found.</p>
      ) : selectedTable === null ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {['farmer', 'crop'].map((type, idx) => {
              const reportsList = grouped[type] || [];
              const rows = reportsList.flatMap(r => r.rows || []);

              if (type === 'farmer') {
                const totalEntries = rows.length;
                const districtCount = new Set(rows.map(r => r.district).filter(Boolean)).size;

                return (
                  <div
                    key={idx}
                    className="cursor-pointer p-6 bg-white shadow-md rounded-lg hover:shadow-lg border border-gray-200 flex flex-col justify-between"
                    onClick={() => setSelectedTable(type)}
                    style={{ minHeight: '260px' }}
                  >
                    <h2 className="text-xl font-bold text-green-700">👨‍🌾 Farmer Report</h2>
                    <p className="text-sm text-gray-700 mt-2">Total entries: <strong>{totalEntries}</strong></p>
                    <p className="text-sm text-gray-700">Districts: <strong>{districtCount}</strong></p>
                    <div style={{ width: '100%', height: 120, marginTop: '1rem' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={prepareChartData(rows)}>
                          <XAxis dataKey="district" tick={{ fontSize: 12 }} />
                          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#16a34a" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Click to view full table ➡</p>
                  </div>
                );
              }

              if (type === 'crop') {
                return (
                  <div
                    key={idx}
                    className="cursor-pointer p-6 bg-white shadow-md rounded-lg hover:shadow-lg border border-gray-200 flex flex-col justify-between"
                    onClick={() => setSelectedTable(type)}
                    style={{ minHeight: '260px' }}
                  >
                    <h2 className="text-xl font-bold text-green-700">🌱 Crop Report</h2>
                    <p className="text-sm text-gray-700 mt-2">Total Crops: <strong>{rows.length}</strong></p>
                    <div className="mt-2 flex flex-wrap">
                      {Object.entries(categoryIcons).map(([cat, icon]) => (
                        <div
                          key={cat}
                          className="inline-flex items-center border border-gray-300 rounded-md px-4 py-3 mr-3 mb-3 text-green-700 font-medium text-lg justify-center"
                          style={{ minWidth: '90px', height: '90px' }}
                        >
                          <span className="mr-2">{icon}</span>
                          <span>{cat}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Click to view full table ➡</p>
                  </div>
                );
              }

              return null;
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div
              className="cursor-pointer p-6 bg-white shadow-md rounded-lg hover:shadow-lg border border-gray-200 flex flex-col justify-between"
              style={{ minHeight: '260px' }}
              onClick={() => setSelectedTable('seedtype')}
            >
              <h2 className="text-xl font-bold text-green-700 mb-4">🌾 Seed Type Report</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
                {Object.entries(seedTypes).map(([category, seeds]) => (
                  <div key={category} className="border border-green-300 rounded-lg p-4">
                    <h3 className="text-green-700 font-semibold text-lg mb-2">{categoryIcons[category]} {category}</h3>
                    <ul className="list-disc pl-4">
                      {seeds.map((seed, idx) => (
                        <li key={idx}>{seed}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </>
      ) : (
        <ReportTable
          reports={grouped[selectedTable]}
          categoryIdToName={categoryIdToName}
          categoryIcons={categoryIcons}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
