"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Add a new component to display retraining metrics

// const RetrainingMetrics = ({ metrics }) => {
//   if (!metrics) return null

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-green-100 dark:border-green-900 shadow-sm mb-6 animate-fade-in">
//       <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">Model Retraining Metrics</h3>

//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
//         <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 text-center">
//           <p className="text-xs text-green-700 dark:text-green-400 uppercase font-semibold mb-1">Accuracy</p>
//           <p className="text-2xl font-bold text-green-900 dark:text-green-300">
//             {(metrics.accuracy * 100).toFixed(2)}%
//           </p>
//         </div>
//         <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 text-center">
//           <p className="text-xs text-green-700 dark:text-green-400 uppercase font-semibold mb-1">F1 Score</p>
//           <p className="text-2xl font-bold text-green-900 dark:text-green-300">
//             {(metrics.f1_score * 100).toFixed(2)}%
//           </p>
//         </div>
//         <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 text-center">
//           <p className="text-xs text-green-700 dark:text-green-400 uppercase font-semibold mb-1">Precision</p>
//           <p className="text-2xl font-bold text-green-900 dark:text-green-300">
//             {(metrics.precision * 100).toFixed(2)}%
//           </p>
//         </div>
//         <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 text-center">
//           <p className="text-xs text-green-700 dark:text-green-400 uppercase font-semibold mb-1">Recall</p>
//           <p className="text-2xl font-bold text-green-900 dark:text-green-300">{(metrics.recall * 100).toFixed(2)}%</p>
//         </div>
//       </div>

//       <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-green-100 dark:border-green-800">
//         <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-3">Confusion Matrix</h4>
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wider"></th>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wider">
//                   Predicted Low
//                 </th>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wider">
//                   Predicted Medium
//                 </th>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wider">
//                   Predicted High
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-green-800 dark:text-green-300">
//                   Actual Low
//                 </td>
//                 <td className="px-4 py-2 whitespace-nowrap text-sm text-green-900 dark:text-green-200 bg-green-100/50 dark:bg-green-900/20">
//                   {metrics.confusion_matrix[0][0]}
//                 </td>
//                 <td className="px-4 py-2 whitespace-nowrap text-sm text-amber-700 dark:text-amber-300">
//                   {metrics.confusion_matrix[0][1]}
//                 </td>
//                 <td className="px-4 py-2 whitespace-nowrap text-sm text-amber-700 dark:text-amber-300">
//                   {metrics.confusion_matrix[0][2]}
//                 </td>
//               </tr>
//               <tr>
//                 <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-green-800 dark:text-green-300">
//                   Actual Medium
//                 </td>
//                 <td className="px-4 py-2 whitespace-nowrap text-sm text-amber-700 dark:text-amber-300">
//                   {metrics.confusion_matrix[1][0]}
//                 </td>
//                 <td className="px-4 py-2 whitespace-nowrap text-sm text-green-900 dark:text-green-200 bg-green-100/50 dark:bg-green-900/20">
//                   {metrics.confusion_matrix[1][1]}
//                 </td>
//                 <td className="px-4 py-2 whitespace-nowrap text-sm text-amber-700 dark:text-amber-300">
//                   {metrics.confusion_matrix[1][2]}
//                 </td>
//               </tr>
//               <tr>
//                 <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-green-800 dark:text-green-300">
//                   Actual High
//                 </td>
//                 <td className="px-4 py-2 whitespace-nowrap text-sm text-amber-700 dark:text-amber-300">
//                   {metrics.confusion_matrix[2][0]}
//                 </td>
//                 <td className="px-4 py-2 whitespace-nowrap text-sm text-amber-700 dark:text-amber-300">
//                   {metrics.confusion_matrix[2][1]}
//                 </td>
//                 <td className="px-4 py-2 whitespace-nowrap text-sm text-green-900 dark:text-green-200 bg-green-100/50 dark:bg-green-900/20">
//                   {metrics.confusion_matrix[2][2]}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// Define the visualization images
const visualizationImages = [
  {
    src: "/images/confusion-ran.png",
    alt: "Confusion Matrix from Random Forest Model",
    label: "Confusion Matrix",
    description: "Shows the accuracy of predictions across different yield categories",
  },
  {
    src: "/images/important.png",
    alt: "Feature Importance Chart",
    label: "Feature Importance",
    description: "Highlights which factors most influence crop yield predictions",
  },
  {
    src: "/images/visua.png",
    alt: "Correlation Heat Map",
    label: "Correlation Heat Map",
    description: "Visualizes relationships between different agricultural variables",
  },
]

export default function VisualizationSection({ retrainResult }) {
  // const [selectedCrop, setSelectedCrop] = useState("Wheat")
  const [activeTab, setActiveTab] = useState("visualizations")
  const [selectedImage, setSelectedImage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const section = document.getElementById("visualization")
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [])

  return (
    <div
      className={`w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-green-100 dark:border-green-900 overflow-hidden transition-all duration-700 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
    >
      <div className="p-6 border-b border-green-100 dark:border-green-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-green-900 dark:text-green-300">Crop Yield Analysis</h3>
            <p className="text-amber-700 dark:text-amber-300">Compare actual and predicted yields for your crops</p>
          </div>
         
        </div>
      </div>

      <div className="p-6">
        <div className="flex space-x-1 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("visualizations")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "visualizations"
                ? "bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-800 dark:text-green-300"
                : "text-amber-700 dark:text-amber-300 hover:bg-green-50 dark:hover:bg-green-900/30"
            }`}
          >
            <span className="flex items-center">
              <svg
                className="h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Visualizations
            </span>
          </button>
          
         
          <button
            data-tab="evaluation"
            onClick={() => setActiveTab("evaluation")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "evaluation"
                ? "bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-800 dark:text-green-300"
                : "text-amber-700 dark:text-amber-300 hover:bg-green-50 dark:hover:bg-green-900/30"
            } ${!retrainResult?.metrics ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!retrainResult?.metrics}
          >
            <span className="flex items-center">
              <svg
                className="h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Evaluation after retraining
              {retrainResult?.metrics && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs rounded-full">
                  New
                </span>
              )}
            </span>
          </button>
        </div>

        {activeTab === "visualizations" && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visualizationImages.map((image, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-green-100 dark:border-green-900 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-1 group cursor-pointer"
                  onClick={() => {
                    setSelectedImage(index)
                    setIsModalOpen(true)
                  }}
                >
                  <div className="relative h-48 w-full bg-green-50 dark:bg-green-900/30 overflow-hidden">
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                      onError={() => console.log(`Error loading image: ${image.src}`)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                      <button className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                        View Full Size
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-medium text-green-800 dark:text-green-300 mb-1">{image.label}</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">{image.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-amber-800 dark:text-amber-300 text-sm">
              <p className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Click on any visualization to view it in full size. </span>
              </p>
            </div>
          </div>
        )}


        {activeTab === "evaluation" && retrainResult?.metrics && (
          <div className="animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-green-100 dark:border-green-900 shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Model Evaluation Metrics</h3>
                <div className="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                  Last retrained: {new Date().toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 text-center">
                  <p className="text-xs text-green-700 dark:text-green-400 uppercase font-semibold mb-1">Accuracy</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                    {(retrainResult.metrics.accuracy * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 text-center">
                  <p className="text-xs text-green-700 dark:text-green-400 uppercase font-semibold mb-1">F1 Score</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                    {(retrainResult.metrics.f1_score * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 text-center">
                  <p className="text-xs text-green-700 dark:text-green-400 uppercase font-semibold mb-1">Precision</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                    {(retrainResult.metrics.precision * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 text-center">
                  <p className="text-xs text-green-700 dark:text-green-400 uppercase font-semibold mb-1">Recall</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                    {(retrainResult.metrics.recall * 100).toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-green-100 dark:border-green-800">
                <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-3">Confusion Matrix</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wider"></th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wider">
                          Predicted Low
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wider">
                          Predicted Medium
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wider">
                          Predicted High
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-green-800 dark:text-green-300">
                          Actual Low
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-green-900 dark:text-green-200 bg-green-100/50 dark:bg-green-900/20">
                          {retrainResult.metrics.confusion_matrix[0][0]}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-amber-700 dark:text-amber-300">
                          {retrainResult.metrics.confusion_matrix[0][1]}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-amber-700 dark:text-amber-300">
                          {retrainResult.metrics.confusion_matrix[0][2]}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-green-800 dark:text-green-300">
                          Actual Medium
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-amber-700 dark:text-amber-300">
                          {retrainResult.metrics.confusion_matrix[1][0]}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-green-900 dark:text-green-200 bg-green-100/50 dark:bg-green-900/20">
                          {retrainResult.metrics.confusion_matrix[1][1]}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-amber-700 dark:text-amber-300">
                          {retrainResult.metrics.confusion_matrix[1][2]}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-green-800 dark:text-green-300">
                          Actual High
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-amber-700 dark:text-amber-300">
                          {retrainResult.metrics.confusion_matrix[2][0]}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-amber-700 dark:text-amber-300">
                          {retrainResult.metrics.confusion_matrix[2][1]}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-green-900 dark:text-green-200 bg-green-100/50 dark:bg-green-900/20">
                          {retrainResult.metrics.confusion_matrix[2][2]}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-green-100 dark:border-green-900 shadow-sm">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">
                Model Performance Analysis
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-green-800 dark:text-green-300 mb-2">
                    Accuracy Interpretation
                  </h4>
                  <p className="text-amber-800 dark:text-amber-300 text-sm">
                    The model correctly predicts {(retrainResult.metrics.accuracy * 100).toFixed(2)}% of all crop yield
                    categories. This indicates {retrainResult.metrics.accuracy > 0.75 ? "strong" : "moderate"} overall
                    performance across all yield classes.
                  </p>
                </div>

                <div>
                  <h4 className="text-md font-medium text-green-800 dark:text-green-300 mb-2">Class Performance</h4>
                  <p className="text-amber-800 dark:text-amber-300 text-sm mb-3">
                    Looking at the confusion matrix, we can see:
                  </p>
                  <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 dark:bg-green-900 p-0.5 mt-0.5">
                        <svg
                          className="h-3 w-3 text-green-600 dark:text-green-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>
                        Low yield predictions are accurate{" "}
                        {Math.round(
                          (retrainResult.metrics.confusion_matrix[0][0] /
                            (retrainResult.metrics.confusion_matrix[0][0] +
                              retrainResult.metrics.confusion_matrix[0][1] +
                              retrainResult.metrics.confusion_matrix[0][2])) *
                            100,
                        )}
                        % of the time
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 dark:bg-green-900 p-0.5 mt-0.5">
                        <svg
                          className="h-3 w-3 text-green-600 dark:text-green-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>
                        Medium yield predictions are accurate{" "}
                        {Math.round(
                          (retrainResult.metrics.confusion_matrix[1][1] /
                            (retrainResult.metrics.confusion_matrix[1][0] +
                              retrainResult.metrics.confusion_matrix[1][1] +
                              retrainResult.metrics.confusion_matrix[1][2])) *
                            100,
                        )}
                        % of the time
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 dark:bg-green-900 p-0.5 mt-0.5">
                        <svg
                          className="h-3 w-3 text-green-600 dark:text-green-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>
                        High yield predictions are accurate{" "}
                        {Math.round(
                          (retrainResult.metrics.confusion_matrix[2][2] /
                            (retrainResult.metrics.confusion_matrix[2][0] +
                              retrainResult.metrics.confusion_matrix[2][1] +
                              retrainResult.metrics.confusion_matrix[2][2])) *
                            100,
                        )}
                        % of the time
                      </span>
                    </li>
                  </ul>
                </div>

                
              </div>
            </div>
          </div>
        )}
      </div>
      
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full mx-4 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-white/20 backdrop-blur-sm text-white rounded-full p-2 hover:bg-white/30 transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative h-[70vh] w-full bg-green-50 dark:bg-green-900/30">
              <Image
                src={visualizationImages[selectedImage].src || "/placeholder.svg"}
                alt={visualizationImages[selectedImage].alt}
                fill
                className="object-contain p-4"
              />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-2">
                {visualizationImages[selectedImage].label}
              </h3>
              <p className="text-amber-700 dark:text-amber-300">{visualizationImages[selectedImage].description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

