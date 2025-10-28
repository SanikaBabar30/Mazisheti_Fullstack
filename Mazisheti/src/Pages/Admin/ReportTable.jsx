import React from 'react';

const ReportTable = ({ reports }) => {
  if (!reports || reports.length === 0) {
    return <p>No reports found.</p>;
  }

  const filteredReports = reports.filter(report =>
    Object.values(report).some(value => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      return true;
    })
  );

  if (filteredReports.length === 0) {
    return <p>No reports found.</p>;
  }

  const headers = Object.keys(filteredReports[0]).filter(h => h !== 'categoryName');

  return (
    <section className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">📋 Reports Table</h2>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-green-600 text-white"> {/* ✅ Header color only */}
          <tr>
            {headers.map(header => (
              <th key={header} className="border border-gray-300 px-4 py-2 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report, idx) => (
            <tr key={idx} className="hover:bg-gray-100 bg-white">
              {headers.map(header => (
                <td key={header} className="border border-gray-300 px-4 py-2">
                  {report[header] == null ? '-' : String(report[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ReportTable;
