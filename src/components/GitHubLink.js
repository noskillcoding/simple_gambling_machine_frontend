// src/components/GitHubLink.js
export default function GitHubLink({ repoUrl }) {
  // Styles for a "bigger" button appearance, using viewport units
  const paddingClasses = "px-[2vw] py-[1vh] md:px-[1.5vw] md:py-[0.75vh]"; // More padding
  const textSizeClasses = "text-[1.5vh] sm:text-[1.8vh]"; // Larger text

  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block ${paddingClasses} bg-gray-700 text-white ${textSizeClasses} font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-md truncate focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50`}
    >
      View on GitHub
    </a>
  );
}