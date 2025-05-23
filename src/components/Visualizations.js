// src/components/Visualizations.js
"use client"; // VERY IMPORTANT: Must be the first line

/* eslint-disable @next/next/no-img-element */
// The above comment disables a specific Next.js linting rule for the <img> tag.
// For production, Next.js <Image> component is often preferred for optimization,
// but for simplicity with static IPFS exports, <img> can be easier to manage initially.

export default function Visualizations() {
  // Replace these with the actual paths to your images in the /public folder
  // For now, these placeholders will likely show broken image icons or your onError message.
  const mathSchemeImagePath = "/placeholder-math-scheme.png";
  const otherImagePath = "/placeholder-other-image.png";

  return (
    <div className="my-6 space-y-8">
      <div className="p-4 border border-gray-200 rounded-lg bg-white shadow">
        <h2 className="text-xl font-semibold mb-3 text-center text-gray-700">How It Works (The Math)</h2>
        <img
          src={mathSchemeImagePath}
          alt="Mathematical scheme of the gambling machine"
          className="w-full h-auto rounded-md object-contain"
          onError={(e) => { e.target.style.display='none'; e.target.parentElement.innerHTML += '<p class=\'text-red-500 text-center\'>Math scheme image not found. Create placeholder-math-scheme.png in /public or update path.</p>'; }}
        />
      </div>

      <div className="p-4 border border-gray-200 rounded-lg bg-white shadow">
        <h2 className="text-xl font-semibold mb-3 text-center text-gray-700">Important Visual</h2>
        <img
          src={otherImagePath}
          alt="Important informational image"
          className="w-full h-auto rounded-md object-contain"
          onError={(e) => { e.target.style.display='none'; e.target.parentElement.innerHTML += '<p class=\'text-red-500 text-center\'>Other image not found. Create placeholder-other-image.png in /public or update path.</p>'; }}
        />
      </div>
    </div>
  );
}