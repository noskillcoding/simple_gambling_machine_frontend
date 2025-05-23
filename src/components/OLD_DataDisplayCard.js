// src/components/DataDisplayCard.js
export default function DataDisplayCard({ label, value, unit = "" }) {
    const displayValue = value === null || typeof value === 'undefined' ? "Loading..." : `${value} ${unit}`;
    return (
      <div className="p-4 my-2 border border-gray-200 rounded-lg bg-white shadow">
        <h3 className="text-md font-medium text-gray-500">{label}</h3>
        <p className="text-2xl font-semibold text-gray-800">
          {displayValue}
        </p>
      </div>
    );
  }