// src/components/DataDisplayCard.js
export default function DataDisplayCard({ label, value, unit = "", prominent = false }) {
  // Define styles based on the 'prominent' prop
  const containerPadding = prominent ? "p-[1.5vh]" : "p-[1vh]";
  const labelSize = prominent ? "text-[1.4vh] sm:text-[1.7vh]" : "text-[1.2vh] sm:text-[1.4vh]";
  const valueSize = prominent ? "text-[2.2vh] sm:text-[2.8vh]" : "text-[1.8vh] sm:text-[2vh]";
  const labelMarginBottom = prominent ? "mb-[0.75vh]" : "mb-[0.5vh]";

  let valueContent;
  if (value === null || typeof value === 'undefined') {
    valueContent = "Loading...";
  } else if (typeof value === 'string' || typeof value === 'number') {
    // If value is string or number, append unit if it exists
    valueContent = <>{value}{unit ? ` ${unit}` : ''}</>;
  } else {
    // If value is already a JSX element (like our link), render it as is
    valueContent = value;
  }

  return (
    <div 
      className={`${containerPadding} border border-gray-300 rounded-md bg-white shadow-sm flex flex-col justify-center flex-shrink min-h-0`}
    >
      <h3 
        className={`${labelSize} ${labelMarginBottom} font-medium text-gray-600 truncate`} // Label can still truncate
      >
        {label}
      </h3>
      {/* Removed 'truncate' from the value paragraph to allow wrapping for full addresses */}
      {/* Added 'break-all' to help long strings (like addresses) wrap aggressively */}
      <p 
        className={`${valueSize} font-semibold text-gray-800 break-all`} 
      >
        {valueContent}
      </p>
    </div>
  );
}