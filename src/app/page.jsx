"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  RefreshCw,
  X,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  ChevronRight,
  Database,
  FileUp,
  ArrowRight,
  Leaf,
  Sun,
  Cloud,
  Droplets,
  Thermometer,
  Loader2,
} from "lucide-react"
import FarmerSlideshow from "../components/farmer-slideshow"
import VisualizationSection from "../components/visualization-section"

export default function Home() {
  // State variables
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")
  const [error, setError] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false)
  const [isRetrainModalOpen, setIsRetrainModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    Area: "Rwanda",
    Item: "Maize",
    Year: "2037",
    average_rain_fall_mm_per_year: "56",
    pesticides_tonnes: "567.44",
    avg_temp: "24",
  })
  const [prediction, setPrediction] = useState(null)
  const [retrainResult, setRetrainResult] = useState(null)
  const [activeSection, setActiveSection] = useState("hero")
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [theme, setTheme] = useState("light")
  const [animateHero, setAnimateHero] = useState(false)
  
  const [isRetraining, setIsRetraining] = useState(false)

  const heroRef = useRef(null)
  const howItWorksRef = useRef(null)
  const visualizationRef = useRef(null)
  const uploadRef = useRef(null)
  const formRef = useRef(null)

  // Handle initial animations
  useEffect(() => {
    // Trigger hero animations after a short delay
    setTimeout(() => {
      setAnimateHero(true)
    }, 300)
  }, [])

  // Handle scroll events 
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const sections = [
        { id: "hero", ref: heroRef },
        { id: "how-it-works", ref: howItWorksRef },
        { id: "visualization", ref: visualizationRef },
        { id: "upload", ref: uploadRef },
      ]

      for (const section of sections) {
        if (!section.ref.current) continue

        const rect = section.ref.current.getBoundingClientRect()
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(section.id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // File handling functions
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile)
        setError("")
      } else {
        setError("Please upload a CSV file")
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.name.endsWith(".csv")) {
      setFile(droppedFile)
      setError("")
    } else {
      setError("Please upload a CSV file")
    }
  }

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // loading state
      const submitButton = e.target.querySelector('button[type="submit"]')
      if (submitButton) {
        submitButton.disabled = true
        submitButton.innerHTML =
          '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...'
      }

      const response = await fetch("https://ezanai.onrender.com/predict/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Area: formData.Area,
          Item: formData.Item,
          Year: Number.parseInt(formData.Year),
          average_rain_fall_mm_per_year: Number.parseFloat(formData.average_rain_fall_mm_per_year),
          pesticides_tonnes: Number.parseFloat(formData.pesticides_tonnes),
          avg_temp: Number.parseFloat(formData.avg_temp),
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setPrediction(result.prediction)
        setIsFormModalOpen(false)
        setIsResultsModalOpen(true)
        setError("")

        const successNotification = document.createElement("div")
        successNotification.className =
          "fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-slide-in-right"
        successNotification.innerHTML = `<svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 
        <div>
          <p class="font-medium">Model successfully retrained!</p>
          <p class="text-sm opacity-90">Accuracy: ${(result.metrics.accuracy * 100).toFixed(2)}%</p>
        </div>`
        document.body.appendChild(successNotification)

        setTimeout(() => setShowSuccessConfetti(false), 5000)
      } else {
        setError(result.detail || "Prediction failed.")
      }
    } catch (err) {
      setError("Error predicting: " + err.message)
    } finally {
      // Reset button state
      const submitButton = document.querySelector('button[type="submit"]')
      if (submitButton) {
        submitButton.disabled = false
        submitButton.innerHTML = "Predict Yield"
      }
    }
  }

  // Retrain model with existing data
  const handleRetrainWithExistingData = async () => {
    try {
      setIsRetraining(true)
      setError("")

      const response = await fetch("https://ezanai.onrender.com/retrain/", {
        method: "POST",
      })

      const result = await response.json()

      if (response.ok) {
        setRetrainResult(result)

        // Show success notification at the top
        const successNotification = document.createElement("div")
        successNotification.className =
          "fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-slide-in-right"
        successNotification.innerHTML = `<svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 
      <div>
        <p class="font-medium">Model successfully retrained!</p>
        <p class="text-sm opacity-90">Accuracy: ${(result.metrics.accuracy * 100).toFixed(2)}%</p>
      </div>`
        document.body.appendChild(successNotification)

        setTimeout(() => setShowSuccessConfetti(false), 5000)

        // Scroll to visualization section and switch to evaluation tab
        const visualizationSection = document.getElementById("visualization")
        if (visualizationSection) {
          visualizationSection.scrollIntoView({ behavior: "smooth" })

          setTimeout(() => {
            const evaluationTab = document.querySelector('[data-tab="evaluation"]')
            if (evaluationTab) {
              evaluationTab.click()
            }
          }, 1000)
        }

        setTimeout(() => {
          document.body.removeChild(successNotification)
        }, 5000)
      } else {
        setError(result.detail || "Retraining failed.")

        // Show error notification
        const errorNotification = document.createElement("div")
        errorNotification.className =
          "fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-slide-in-right"
        errorNotification.innerHTML =
          '<svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> Retraining failed. Please try again.'
        document.body.appendChild(errorNotification)

        // Remove error notification after 5 seconds
        setTimeout(() => {
          document.body.removeChild(errorNotification)
        }, 5000)
      }
    } catch (err) {
      setError("Error retraining: " + err.message)

      // Show error notification
      const errorNotification = document.createElement("div")
      errorNotification.className =
        "fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-slide-in-right"
      errorNotification.innerHTML = `<svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> ${err.message}`
      document.body.appendChild(errorNotification)

      setTimeout(() => {
        document.body.removeChild(errorNotification)
      }, 5000)
    } finally {
      setIsRetraining(false)
      setIsRetrainModalOpen(false)

      // Reset button state for any retrain buttons in the UI
      const heroRetrainButton = document.querySelector(".retrain-button")
      if (heroRetrainButton) {
        heroRetrainButton.disabled = false
        heroRetrainButton.innerHTML = `
        <svg class="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Retrain Model</span>
      `
      }
    }
  }

  // Upload and retrain with new data
  const handleUpload = async (e) => {
    if (e) e.preventDefault()

    if (!file) {
      setError("Please select a CSV file to upload")
      return
    }

    setIsUploading(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("https://ezanai.onrender.com/upload/", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadMessage(result.message || "File uploaded successfully! The model will be retrained with your data.")
        setError("")

        const successNotification = document.createElement("div")
        successNotification.className =
          "fixed bottom-4 right-4 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-slide-in-right"
        successNotification.innerHTML =
          '<svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> File uploaded and model retrained!'
        document.body.appendChild(successNotification)

        setTimeout(() => {
          document.body.removeChild(successNotification)
        }, 5000)

      } else {
        setError(result.detail || "Upload failed.")
      }
    } catch (err) {
      setError("Error uploading file: " + err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleBackToForm = () => {
    setIsResultsModalOpen(false)
    setIsFormModalOpen(true)
  }

  const openRetrainModal = () => {
    setIsRetrainModalOpen(true)
  }

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
    setShowMobileMenu(false)
  }

  
  return (
    <main className={`flex min-h-screen flex-col ${theme === "dark" ? "dark" : ""}`}>
     
      {/* Header with scroll effect */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`relative transition-all duration-500 ${isScrolled ? "scale-90" : "scale-100"}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full blur-md opacity-20"></div>
              <Leaf
                className={`h-7 w-7 relative ${isScrolled ? "text-green-600 dark:text-green-400" : "text-white"}`}
              />
            </div>
            <span
              className={`text-xl font-bold transition-colors duration-500 ${
                isScrolled ? "text-green-800 dark:text-white" : "text-white"
              }`}
            >
               EzanAI
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("hero")}
              className={`text-sm font-medium transition-all duration-300 relative ${
                activeSection === "hero"
                  ? isScrolled
                    ? "text-green-600 dark:text-green-400"
                    : "text-white"
                  : isScrolled
                    ? "text-green-600 dark:text-green-400"
                    : "text-white/80 hover:text-white"
              }`}
            >
              Home
              {activeSection === "hero" && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-current rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className={`text-sm font-medium transition-all duration-300 relative ${
                activeSection === "how-it-works"
                  ? isScrolled
                    ? "text-green-600 dark:text-green-400"
                    : "text-white"
                  : isScrolled
                    ? "text-green-600 dark:text-green-400"
                    : "text-white/80 hover:text-white"
              }`}
            >
              How It Works
              {activeSection === "how-it-works" && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-current rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => scrollToSection("visualization")}
              className={`text-sm font-medium transition-all duration-300 relative ${
                activeSection === "visualization"
                  ? isScrolled
                    ? "text-green-600 dark:text-green-400"
                    : "text-white"
                  : isScrolled
                    ? "text-green-600 dark:text-green-400"
                    : "text-white"
              }`}
            >
              
              {activeSection === "visualization" && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-current rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => scrollToSection("upload")}
              className={`text-sm font-medium transition-all duration-300 relative ${
                activeSection === "upload"
                  ? isScrolled
                    ? "text-green-600 dark:text-green-400"
                    : "text-white"
                  : isScrolled
                    ? "text-green-600 dark:text-green-400"
                    : "text-white/80 hover:text-white"
              }`}
            >
              Upload Data
              {activeSection === "upload" && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-current rounded-full"></span>
              )}
            </button>
          </nav>

          <div className="flex items-center gap-4">
            

            {/* Predict Button */}
            <button
              onClick={() => setIsFormModalOpen(true)}
              className={`px-5 py-2.5 text-sm rounded-full transition-all duration-300 shadow-md hover:shadow-lg ${
                isScrolled
                  ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white dark:from-green-500 dark:to-green-600"
                  : "bg-white text-green-800 hover:bg-green-50"
              }`}
            >
              <span className="flex items-center">
                Predict yield Now
                <ChevronRight className="h-4 w-4 ml-1" />
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg text-white"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transition-colors ${isScrolled ? "text-gray-800 dark:text-white" : "text-white"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg rounded-b-2xl mt-2 py-4 px-4 animate-slide-down">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("hero")}
                className={`text-left px-4 py-2 rounded-lg ${
                  activeSection === "hero"
                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className={`text-left px-4 py-2 rounded-lg ${
                  activeSection === "how-it-works"
                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("visualization")}
                className={`text-left px-4 py-2 rounded-lg ${
                  activeSection === "visualization"
                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                Visualization
              </button>
              
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="relative w-full h-screen overflow-hidden">
        <FarmerSlideshow />
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-6 bg-gradient-to-r from-black/70 via-black/50 to-black/40 text-white">
          <div className="max-w-4xl px-4 text-center relative z-10">
            <div
              className={`transition-all duration-1000 transform ${animateHero ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Predict Your Crop Yield with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">AI</span>
              </h1>
            </div>

            <div
              className={`transition-all duration-1000 delay-300 transform ${animateHero ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90">
                Helping farmers make data-driven decisions for better harvests and sustainable agriculture
              </p>
            </div>

            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 transform ${animateHero ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <button
                onClick={() => setIsFormModalOpen(true)}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30"
              >
                {/* <BarChart3 className="h-5 w-5" /> */}
                <span>Predict Yield</span>
                <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                onClick={openRetrainModal}
                className="retrain-button group flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <RefreshCw className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" />
                <span>Retrain Model</span>
              </button>
            </div>

            <div
              className={`mt-16 transition-all duration-1000 delay-700 transform ${animateHero ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-white/80 hover:text-white group relative"
              >
                <span className="flex flex-col items-center">
                  <span className="mb-2">Explore More</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 animate-bounce group-hover:animate-none group-hover:translate-y-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/5 animate-float-slow">
              <Sun className="h-8 w-8 text-yellow-400/70" />
            </div>
            <div className="absolute top-1/3 right-1/4 animate-float-slow animation-delay-1000">
              <Cloud className="h-10 w-10 text-white/50" />
            </div>
            <div className="absolute bottom-1/3 left-1/4 animate-float-slow animation-delay-2000">
              <Droplets className="h-8 w-8 text-blue-400/70" />
            </div>
            <div className="absolute bottom-1/4 right-1/5 animate-float-slow animation-delay-3000">
              <Thermometer className="h-8 w-8 text-red-400/70" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" ref={howItWorksRef} className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="relative mb-6">
              <h2 className="text-3xl md:text-5xl font-bold text-green-900 dark:text-green-400 relative z-10">
                How It Works
              </h2>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-green-500 rounded-full blur-md opacity-50"></div>
            </div>
            <p className="text-amber-900 dark:text-amber-200 max-w-2xl text-lg">
              Our AI-powered platform analyzes multiple factors to provide accurate crop yield predictions and helps you
              optimize your farming practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-green-100 dark:border-green-900 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group">
              <div className="rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 w-20 h-20 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-green-800 dark:text-green-300 text-center">Input Your Data</h3>
              <p className="text-amber-800 dark:text-amber-200 text-center mb-6">
                Enter details about your location, crop type, year , weather conditions, and other farming practices
                like the amount of pesticides you will use.
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setIsFormModalOpen(true)}
                  className="text-green-600 dark:text-green-400 font-medium flex items-center hover:text-green-800 dark:hover:text-green-300 group"
                >
                  Try it now{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-green-100 dark:border-green-900 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group">
              <div className="rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 w-20 h-20 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-green-800 dark:text-green-300 text-center">AI Analysis</h3>
              <p className="text-amber-800 dark:text-amber-200 text-center mb-6">
                Our machine learning model processes your data and compares it with historical patterns.
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => scrollToSection("visualization")}
                  className="text-green-600 dark:text-green-400 font-medium flex items-center hover:text-green-800 dark:hover:text-green-300 group"
                >
                  View analytics{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-green-100 dark:border-green-900 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group">
              <div className="rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 w-20 h-20 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-green-600 dark:text-green-400"
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
              </div>
              <h3 className="text-xl font-bold mb-4 text-green-800 dark:text-green-300 text-center">Get Predictions</h3>
              <p className="text-amber-800 dark:text-amber-200 text-center mb-6">
                Receive detailed yield predictions and yield class either low, medium or low.
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setIsFormModalOpen(true)}
                  className="text-green-600 dark:text-green-400 font-medium flex items-center hover:text-green-800 dark:hover:text-green-300 group"
                >
                  Get started{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visualization Dashboard Section */}
      <section
        id="visualization"
        ref={visualizationRef}
        className="py-24 bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="relative mb-6">
              <h2 className="text-3xl md:text-5xl font-bold text-green-900 dark:text-green-400 relative z-10">
                Visualization Dashboard
              </h2>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-green-500 rounded-full blur-md opacity-50"></div>
            </div>
            <p className="text-amber-800 dark:text-amber-200 max-w-2xl text-lg">
              Track your predictions, compare historical data, and visualize trends to make informed decisions.
            </p>
          </div>

          <VisualizationSection retrainResult={retrainResult} />
        </div>
      </section>

      {/* Upload Training Data Section */}
      <section id="upload" ref={uploadRef} className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <div className="relative mb-6">
                <h2 className="text-3xl md:text-5xl font-bold text-green-900 dark:text-green-800 relative z-10">
                  Upload Training Data
                </h2>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-green-500 rounded-full blur-md opacity-50"></div>
              </div>
              <p className="text-amber-800 dark:text-amber-200 max-w-2xl mx-auto text-lg">
                Improve prediction accuracy by uploading your historical crop data. The model will be retrained to
                better match your specific farming conditions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-green-100 dark:border-green-900">
              <div className="p-8">
                <div
                  className={`border-2 border-dashed rounded-xl ${
                    isDragging
                      ? "border-green-900 bg-green-50 dark:bg-green-900/30"
                      : "border-green-200 dark:border-green-800"
                  } ${error ? "border-red-300 dark:border-red-800" : ""} transition-colors duration-200`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="p-8 text-center">
                    <div className="mb-6 flex justify-center">
                      {file ? (
                        <div className="h-24 w-24 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                          <FileText size={40} />
                        </div>
                      ) : (
                        <div className="h-24 w-24 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                          <Upload size={40} />
                        </div>
                      )}
                    </div>

                    {file ? (
                      <div className="animate-fade-in">
                        <h3 className="text-xl font-medium text-green-900 dark:text-green-300 mb-2">File Selected</h3>
                        <p className="text-amber-700 dark:text-amber-300 mb-2 text-lg">{file.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                        <div className="flex justify-center gap-4">
                          <input
                            type="file"
                            id="file-upload-change"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <label
                            htmlFor="file-upload-change"
                            className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200"
                          >
                            Change File
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {/* <h3 className="text-xl font-medium text-green-900  mb-2">Drag & Drop Your CSV File</h3> */}
                        <p className="text-amber-700 dark:text-amber-300 mb-6"> click to browse from your computer</p>

                        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-sm text-green-800 dark:text-green-300 mb-6 max-w-md mx-auto">
                          <p className="font-medium mb-2">Your CSV should include:</p>
                          <ul className="list-disc list-inside mt-1 space-y-2 text-left">
                            <li>Crop type</li>
                            <li>Area</li>
                            <li>Yield data (kg/ha)</li>
                            <li>Weather conditions</li>
                          </ul>
                        </div>

                        <input
                          type="file"
                          id="file-upload"
                          accept=".csv"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <label
                          htmlFor="file-upload"
                          className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-green-500/30 font-medium"
                        >
                          Browse Files
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 text-red-700 dark:text-red-300 animate-fade-in">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                {uploadMessage && !error && (
                  <div className="mt-6 p-4 dark:bg-green-900/30 border rounded-lg flex items-start gap-3 text-green-700 ">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>{uploadMessage}</p>
                  </div>
                )}

                <div className="mt-8">
                  <button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className={`w-full py-4 px-6 rounded-full font-medium text-white transition-all duration-300 ${
                      !file || isUploading
                        ? "bg-green-900  cursor-not-allowed"
                        : "bg-gradient-to-r from-green-900 hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] shadow-md hover:shadow-green-500/30"
                    }`}
                  >
                    {isUploading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Upload Bulk data"
                    )}
                  </button>
                </div>

                <div className="mt-4 text-center text-sm text-amber-700 dark:text-amber-300">
                  <p>Only CSV files are supported.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-amber-800 dark:text-amber-300">
              <h3 className="font-semibold mb-3 flex items-center text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
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
                Training Process
              </h3>
              <p className="text-sm leading-relaxed">
                After uploading your data, EzanAI will automatically retrain the prediction model. This process
                typically takes 3-5 minutes. You will receive a notification when the retraining is complete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Modal - Redesigned for better usability */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 w-full max-w-md relative shadow-2xl animate-scale-in overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsFormModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="area-input"
                  className="block text-sm font-medium text-green-800 dark:text-green-300 mb-1"
                >
                  Area/Location
                </label>
                <input
                  id="area-input"
                  type="text"
                  name="Area"
                  value={formData.Area}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-300 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="e.g., Algeria"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="crop-type"
                  className="block text-sm font-medium text-green-800 dark:text-green-300 mb-1"
                >
                  Crop Type
                </label>
                <div className="relative">
                  <select
                    id="crop-type"
                    name="Item"
                    value={formData.Item}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-green-300 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 pr-10"
                  >
                    {[
                      "Maize",
                      "Potatoes",
                      "Rice, paddy",
                      "Sorghum",
                      "Soybeans",
                      "Wheat",

                      "Sweet potatoes",
                      "Plantains",
                      "Yams",
                    ].map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-green-700 dark:text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="year-input"
                  className="block text-sm font-medium text-green-800 dark:text-green-300 mb-1"
                >
                  Year
                </label>
                <input
                  id="year-input"
                  type="number"
                  name="Year"
                  value={formData.Year}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-300 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="e.g., 2037"
                  min="1990"
                  max="2050"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="rainfall-input"
                  className="block text-sm font-medium text-green-800 dark:text-green-300 mb-1"
                >
                  Average Rainfall (mm)
                </label>
                <input
                  id="rainfall-input"
                  type="number"
                  name="average_rain_fall_mm_per_year"
                  value={formData.average_rain_fall_mm_per_year}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-300 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="e.g., 56"
                  min="51"
                  max="3240"
                  step="0.1"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="pesticides-input"
                  className="block text-sm font-medium text-green-800 dark:text-green-300 mb-1"
                >
                  Pesticides Used (tonnes)
                </label>
                <input
                  id="pesticides-input"
                  type="number"
                  name="pesticides_tonnes"
                  value={formData.pesticides_tonnes}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-300 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="e.g., 567"
                  min="0.04"
                  max="36778"
                  step="0.1"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="temp-input"
                  className="block text-sm font-medium text-green-800 dark:text-green-300 mb-1"
                >
                  Average Temperature (°C)
                </label>
                <input
                  id="temp-input"
                  type="number"
                  name="avg_temp"
                  value={formData.avg_temp}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-300 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="e.g., 24"
                  min="1.3"
                  max="30.65"
                  step="0.1"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3 mt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="order-2 sm:order-1 px-5 py-3 text-sm text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="order-1 sm:order-2 px-5 py-3 text-sm bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-colors shadow-md hover:shadow-green-500/30"
                >
                  Predict Yield
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {isResultsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in overflow-y-auto py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto relative shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsResultsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="mb-6 text-center">
              <div className="h-20 w-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-green-900 dark:text-green-300">Yield classification Prediction Results</h2>
              <p className="text-amber-700 dark:text-amber-300 mt-2">Based on your input data</p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-green-200 dark:border-green-800">
                  
                  <div>
                    <p className="text-xs text-green-700 dark:text-green-400 uppercase font-semibold">Crop Type : </p>
                    <p className="text-green-900 dark:text-green-300 font-medium">{formData.Item}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-3 border-b border-green-200 dark:border-green-800">
                  
                  <div>
                    <p className="text-xs text-green-700 dark:text-green-400 uppercase font-semibold">Year :</p>
                    <p className="text-green-900 dark:text-green-300 font-medium">{formData.Year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-3 border-b border-green-200 dark:border-green-800">
                  
                  <div>
                    <p className="text-xs text-green-700 dark:text-green-400 uppercase font-semibold">
                      Average Rainfall :
                    </p>
                    <p className="text-green-900 dark:text-green-300 font-medium">
                      {formData.average_rain_fall_mm_per_year} mm
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-3 border-b border-green-200 dark:border-green-800">
                  
                  <div>
                    <p className="text-xs text-green-700 dark:text-green-400 uppercase font-semibold">
                      Pesticides Used :
                    </p>
                    <p className="text-green-900 dark:text-green-300 font-medium">
                      {formData.pesticides_tonnes} tonnes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-3 border-b border-green-200 dark:border-green-800">
                  
                  <div>
                    <p className="text-xs text-green-700 dark:text-green-400 uppercase font-semibold">
                      Average Temperature :
                    </p>
                    <p className="text-green-900 dark:text-green-300 font-medium">{formData.avg_temp}°C</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white dark:bg-gray-700 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <p className="text-xs text-green-700 dark:text-green-400 uppercase font-semibold mb-1">
                  Predicted Yield Category
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400 text-2xl">📊</span>
                  <p className="text-green-900 dark:text-green-300 font-bold text-xl">{prediction} yield</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBackToForm}
                className="px-5 py-3 text-sm bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900 transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Edit Data
              </button>

              <button
                onClick={() => setIsResultsModalOpen(false)}
                className="px-5 py-3 text-sm bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-colors shadow-md hover:shadow-green-500/30"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retrain Model Modal */}
      {isRetrainModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md relative shadow-2xl animate-scale-in">
            <button
              onClick={() => setIsRetrainModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              disabled={isRetraining}
            >
              <X className="h-6 w-6" />
            </button>

            <div className="mb-6 text-center">
              <div className="h-20 w-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-4">
                {isRetraining ? <Loader2 size={32} className="animate-spin" /> : <RefreshCw size={32} />}
              </div>
              <h2 className="text-2xl font-bold text-green-900 dark:text-green-300">
                {isRetraining ? "Retraining Model..." : "Retrain Model"}
              </h2>
              <p className="text-amber-700 dark:text-amber-300 mt-2">
                {isRetraining ? "Please wait while we process your request" : "Choose your retraining method"}
              </p>
            </div>

            <div className="space-y-4">
              <div
                id="retrain-existing-data-button"
                onClick={!isRetraining ? handleRetrainWithExistingData : undefined}
                className={`border-2 border-green-200 dark:border-green-800 rounded-xl p-5 ${
                  isRetraining
                    ? "opacity-70 cursor-not-allowed"
                    : "cursor-pointer hover:border-green-500 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/30"
                } transition-all duration-200 group`}
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 p-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {isRetraining ? (
                      <Loader2 className="h-6 w-6 text-green-600 dark:text-green-400 animate-spin" />
                    ) : (
                      <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-green-900 dark:text-green-300 text-lg">Use Existing Data</h3>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                      {isRetraining
                        ? "Retraining in progress..."
                        : "Retrain the model with data already in our database"}
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={
                  !isRetraining
                    ? () => {
                        setIsRetrainModalOpen(false)
                        scrollToSection("upload")
                      }
                    : undefined
                }
                className={`border-2 border-green-200 dark:border-green-800 rounded-xl p-5 ${
                  isRetraining
                    ? "opacity-70 cursor-not-allowed"
                    : "cursor-pointer hover:border-green-500 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/30"
                } transition-all duration-200 group`}
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-gradient-to-br dark:from-green-900 dark:to-green-800 p-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <FileUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-900 dark:text-green-300 text-lg">Upload New Data</h3>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                      Upload a CSV file with new training data
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-amber-800 dark:text-amber-300 text-sm">
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
                  {isRetraining
                    ? "Retraining is in progress. Please don't close this window."
                    : "Retraining the model may take a few minutes. You'll be notified when the process is complete."}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-amber-950 to-green-950 dark:from-gray-900 dark:to-gray-950 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full blur-md opacity-20"></div>
                  <Leaf className="h-7 w-7 relative text-amber-400" />
                </div>
                <span className="text-xl font-bold">CropYield AI</span>
              </div>
              <p className="text-amber-300 dark:text-amber-400 mb-4">
                Empowering farmers with AI-driven crop yield predictions for sustainable agriculture.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-amber-300 dark:text-amber-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-amber-300 dark:text-amber-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="#" className="text-amber-300 dark:text-amber-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-amber-300 dark:text-amber-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>

                <li>
                  <Link
                    href="https://ezanai.onrender.com/docs"
                    className="text-amber-300 dark:text-amber-400 hover:text-white transition-colors"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-900 dark:border-gray-800 mt-12 pt-8 text-center text-amber-400">
            <p>© {new Date().getFullYear()} CropYield AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      
    </main>
  )
}

