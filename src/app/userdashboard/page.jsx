"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function UserDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("predict")
    const [districts, setDistricts] = useState([])
    const [loadingDistricts, setLoadingDistricts] = useState(false)

    const [formData, setFormData] = useState({
        country: "Rwanda",
        crop: "Maize",
        district: "",
        rainfall_mm: "",
        temperature_c: "",
        soil_ph: "",
        fertilizer_used_kg_per_ha: "",
        pesticide_l_per_ha: "",
        irrigation_type: "Rainfed",
    })

    const [yieldForm, setYieldForm] = useState({
        district: "",
        rainfall_mm: "",
        temperature_c: "",
        soil_ph: "",
        fertilizer_kg_per_ha: "",
        pesticide_l_per_ha: "",
        irrigation_type: "Rainfed",
        actual_yield_tons_per_ha: "",
        planting_date: "",
        harvest_date: "",
        notes: "",
    })

    const [prediction, setPrediction] = useState(null)
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [yieldError, setYieldError] = useState("")

    // Authentication token
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIrMjUwNzg4MTEyMjMzIiwicm9sZSI6ImZhcm1lciIsImV4cCI6MTc2MTg2NjcxMH0.C6sww7XLUNlUNmuLwV-CM0Li9fJd4UPDAJXR90FtatI"

    // Auth headers utility function
    const getAuthHeaders = () => {
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }

    // Fetch Rwanda districts from API
    useEffect(() => {
        const fetchDistricts = async () => {
            setLoadingDistricts(true)
            try {
                // You can replace this with your actual API endpoint for Rwanda districts
                const response = await fetch("https://restcountries.com/v3.1/name/rwanda?fullText=true")
                const data = await response.json()

                // Since the restcountries API doesn't provide districts, we'll use a fallback list
                // In a real application, you would use your own API endpoint that returns Rwanda districts
                const rwandaDistricts = [
                    "Kigali City", "Gasabo", "Nyarugenge", "Kicukiro",
                    "Eastern Province", "Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana",
                    "Northern Province", "Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo",
                    "Southern Province", "Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango",
                    "Western Province", "Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro"
                ]

                setDistricts(rwandaDistricts.sort())
            } catch (error) {
                console.error("Error fetching districts:", error)
                // Fallback districts in case API fails
                const fallbackDistricts = [
                    "Kigali City", "Gasabo", "Nyarugenge", "Kicukiro",
                    "Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana",
                    "Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo",
                    "Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango",
                    "Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro"
                ]
                setDistricts(fallbackDistricts.sort())
            } finally {
                setLoadingDistricts(false)
            }
        }

        fetchDistricts()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleYieldInputChange = (e) => {
        const { name, value } = e.target
        setYieldForm((prev) => ({ ...prev, [name]: value }))
    }

    const handlePredictionSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        try {
            console.log("📤 Starting prediction submission...")

            const payload = {
                district: formData.district,
                rainfall_mm: Number.parseFloat(formData.rainfall_mm),
                temperature_c: Number.parseFloat(formData.temperature_c),
                soil_ph: Number.parseFloat(formData.soil_ph),
                fertilizer_used_kg_per_ha: Number.parseFloat(formData.fertilizer_used_kg_per_ha),
                pesticide_l_per_ha: Number.parseFloat(formData.pesticide_l_per_ha),
                irrigation_type: formData.irrigation_type,
            }

            console.log("📦 Prediction Payload:", payload)
            console.log("🔑 Using token:", token)

            const response = await fetch("http://0.0.0.0:8000/api/predict", {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            })

            console.log("📥 Prediction Response Status:", response.status)

            if (!response.ok) {
                let errorMessage = `HTTP error ${response.status}`
                try {
                    const errorData = await response.json()
                    console.log("❌ Prediction Error Data:", errorData)
                    errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData)
                } catch (parseError) {
                    console.log("❌ Could not parse error response")
                    const errorText = await response.text()
                    console.log("❌ Prediction Error Text:", errorText)
                    errorMessage = errorText || errorMessage
                }
                throw new Error(errorMessage)
            }

            const result = await response.json()
            console.log("✅ Prediction Success:", result)

            const yieldTonsHa = result.predicted_yield_kg_per_ha / 1000 // Convert kg/ha to tons/ha

            setPrediction({
                value: yieldTonsHa.toFixed(3),
                warning: result.warning || null,
            })
        } catch (err) {
            console.error("💥 Prediction Error:", err)
            setError(`Error predicting: ${err.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleYieldSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setYieldError("")

        try {
            console.log("📤 Starting yield submission...")

            // Prepare payload matching API requirements
            const payload = {
                district: yieldForm.district,
                rainfall_mm: Number.parseFloat(yieldForm.rainfall_mm),
                temperature_c: Number.parseFloat(yieldForm.temperature_c),
                soil_ph: Number.parseFloat(yieldForm.soil_ph),
                fertilizer_kg_per_ha: Number.parseFloat(yieldForm.fertilizer_kg_per_ha),
                pesticide_l_per_ha: Number.parseFloat(yieldForm.pesticide_l_per_ha),
                irrigation_type: yieldForm.irrigation_type,
                actual_yield_tons_per_ha: Number.parseFloat(yieldForm.actual_yield_tons_per_ha),
                planting_date: yieldForm.planting_date,
                harvest_date: yieldForm.harvest_date,
                notes: yieldForm.notes,
            }

            console.log("📦 Yield Payload:", payload)
            console.log("🔑 Using token:", token)

            const response = await fetch("http://0.0.0.0:8000/api/data/submit", {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            })

            console.log("📥 Yield Response Status:", response.status)

            if (!response.ok) {
                let errorMessage = `HTTP error ${response.status}`
                try {
                    const errorData = await response.json()
                    console.log("❌ Yield Error Data:", errorData)
                    errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData)
                } catch (parseError) {
                    console.log("❌ Could not parse error response")
                    const errorText = await response.text()
                    console.log("❌ Yield Error Text:", errorText)
                    errorMessage = errorText || errorMessage
                }
                throw new Error(errorMessage)
            }

            const result = await response.json()
            console.log("✅ Yield Success:", result)

            // Success - show message and reset form
            setShowSuccessMessage(true)
            setTimeout(() => {
                setShowSuccessMessage(false)
                setYieldForm({
                    district: "",
                    rainfall_mm: "",
                    temperature_c: "",
                    soil_ph: "",
                    fertilizer_kg_per_ha: "",
                    pesticide_l_per_ha: "",
                    irrigation_type: "Rainfed",
                    actual_yield_tons_per_ha: "",
                    planting_date: "",
                    harvest_date: "",
                    notes: "",
                })
            }, 3000)
        } catch (err) {
            console.error("💥 Yield Error:", err)
            const errorMessage = err.message || err.toString() || "Unknown error occurred"
            setYieldError(`Error submitting yield data: ${errorMessage}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full overflow-y-auto">
                    {/* Logo */}
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden">
                                <img
                                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/smartgwizalogo-1PAtBScv6f0g56hdJZOC9kTecrK36y.png"
                                    alt="SmartGwiza Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900">SmartGwiza</h1>
                                <p className="text-xs text-slate-500">Farmer Dashboard</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        <button
                            onClick={() => setActiveTab("predict")}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "predict" ? "text-white" : "text-slate-700 hover:bg-slate-100"
                                }`}
                            style={activeTab === "predict" ? { backgroundColor: "#598216" } : {}}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            Predict Yield
                        </button>

                        <button
                            onClick={() => setActiveTab("feedback")}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "feedback" ? "text-white" : "text-slate-700 hover:bg-slate-100"
                                }`}
                            style={activeTab === "feedback" ? { backgroundColor: "#598216" } : {}}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            Submit Actual Yield
                        </button>

                        <a
                            href="/dashboard/history"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Prediction History
                        </a>

                        <a
                            href="/dashboard/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            My Profile
                        </a>
                    </nav>

                    {/* Bottom Section */}
                    <div className="p-4 border-t border-slate-200">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Back to Home
                        </Link>
                        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full mt-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                    <div className="px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <div className="flex items-center gap-3">
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900">
                                        {activeTab === "predict" ? "Crop Yield Prediction" : "Submit Actual Yield"}
                                    </h1>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {activeTab === "predict"
                                            ? "Get AI-powered predictions for your farm"
                                            : "Help improve our model with your harvest data"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                                    style={{ backgroundColor: "#598216" }}
                                >
                                    {/* User initial */}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                    {activeTab === "predict" && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <form onSubmit={handlePredictionSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="country-input"
                                            className="block text-sm font-medium mb-2"
                                            style={{ color: "#598216" }}
                                        >
                                            Country
                                        </label>
                                        <input
                                            id="country-input"
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            disabled
                                            className="w-full p-3 border rounded-lg bg-gray-100 text-gray-900 cursor-not-allowed"
                                            style={{ borderColor: "rgba(89, 130, 22, 0.3)" }}
                                            placeholder="Rwanda"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="crop-input" className="block text-sm font-medium mb-2" style={{ color: "#598216" }}>
                                            Crop
                                        </label>
                                        <input
                                            id="crop-input"
                                            type="text"
                                            name="crop"
                                            value={formData.crop}
                                            disabled
                                            className="w-full p-3 border rounded-lg bg-gray-100 text-gray-900 cursor-not-allowed"
                                            style={{ borderColor: "rgba(89, 130, 22, 0.3)" }}
                                            placeholder="Maize"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="district-input" className="block text-sm font-medium mb-2" style={{ color: "#598216" }}>
                                            District *
                                        </label>
                                        <select
                                            id="district-input"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all bg-white text-gray-900"
                                            style={{ borderColor: "rgba(89, 130, 22, 0.3)" }}
                                            onFocus={(e) => (e.target.style.borderColor = "#598216")}
                                            onBlur={(e) => (e.target.style.borderColor = "rgba(89, 130, 22, 0.3)")}
                                            required
                                        >
                                            <option value="">Select District</option>
                                            {loadingDistricts ? (
                                                <option disabled>Loading districts...</option>
                                            ) : (
                                                districts.map((district) => (
                                                    <option key={district} value={district}>
                                                        {district}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="rainfall-input" className="block text-sm font-medium mb-2" style={{ color: "#598216" }}>
                                            Rainfall (mm) *
                                        </label>
                                        <input
                                            id="rainfall-input"
                                            type="number"
                                            name="rainfall_mm"
                                            value={formData.rainfall_mm}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all bg-white text-gray-900"
                                            style={{ borderColor: "rgba(89, 130, 22, 0.3)" }}
                                            onFocus={(e) => (e.target.style.borderColor = "#598216")}
                                            onBlur={(e) => (e.target.style.borderColor = "rgba(89, 130, 22, 0.3)")}
                                            placeholder="e.g., 1200"
                                            min="500"
                                            max="2000"
                                            step="0.1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="temp-input" className="block text-sm font-medium mb-2" style={{ color: "#598216" }}>
                                            Temperature (°C) *
                                        </label>
                                        <input
                                            id="temp-input"
                                            type="number"
                                            name="temperature_c"
                                            value={formData.temperature_c}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all bg-white text-gray-900"
                                            style={{ borderColor: "rgba(89, 130, 22, 0.3)" }}
                                            onFocus={(e) => (e.target.style.borderColor = "#598216")}
                                            onBlur={(e) => (e.target.style.borderColor = "rgba(89, 130, 22, 0.3)")}
                                            placeholder="e.g., 19.5"
                                            min="15"
                                            max="30"
                                            step="0.1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="soil-ph-input" className="block text-sm font-medium mb-2" style={{ color: "#598216" }}>
                                            Soil pH *
                                        </label>
                                        <input
                                            id="soil-ph-input"
                                            type="number"
                                            name="soil_ph"
                                            value={formData.soil_ph}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all bg-white text-gray-900"
                                            style={{ borderColor: "rgba(89, 130, 22, 0.3)" }}
                                            onFocus={(e) => (e.target.style.borderColor = "#598216")}
                                            onBlur={(e) => (e.target.style.borderColor = "rgba(89, 130, 22, 0.3)")}
                                            placeholder="e.g., 6.5"
                                            min="0"
                                            max="14"
                                            step="0.1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="fertilizer-input"
                                            className="block text-sm font-medium mb-2"
                                            style={{ color: "#598216" }}
                                        >
                                            NPK Fertilizer Used (kg/ha) *
                                        </label>
                                        <input
                                            id="fertilizer-input"
                                            type="number"
                                            name="fertilizer_used_kg_per_ha"
                                            value={formData.fertilizer_used_kg_per_ha}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all bg-white text-gray-900"
                                            style={{ borderColor: "rgba(89, 130, 22, 0.3)" }}
                                            onFocus={(e) => (e.target.style.borderColor = "#598216")}
                                            onBlur={(e) => (e.target.style.borderColor = "rgba(89, 130, 22, 0.3)")}
                                            placeholder="e.g., 150"
                                            min="0"
                                            step="0.1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="pesticide-input"
                                            className="block text-sm font-medium mb-2"
                                            style={{ color: "#598216" }}
                                        >
                                            Pesticide Used (L/ha) *
                                        </label>
                                        <input
                                            id="pesticide-input"
                                            type="number"
                                            name="pesticide_l_per_ha"
                                            value={formData.pesticide_l_per_ha}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all bg-white text-gray-900"
                                            style={{ borderColor: "rgba(89, 130, 22, 0.3)" }}
                                            onFocus={(e) => (e.target.style.borderColor = "#598216")}
                                            onBlur={(e) => (e.target.style.borderColor = "rgba(89, 130, 22, 0.3)")}
                                            placeholder="e.g., 2.5"
                                            min="0"
                                            step="0.1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="irrigation-input" className="block text-sm font-medium mb-2" style={{ color: "#598216" }}>
                                            Irrigation Type *
                                        </label>
                                        <select
                                            id="irrigation-input"
                                            name="irrigation_type"
                                            value={formData.irrigation_type}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all bg-white text-gray-900"
                                            style={{ borderColor: "rgba(89, 130, 22, 0.3)" }}
                                            onFocus={(e) => (e.target.style.borderColor = "#598216")}
                                            onBlur={(e) => (e.target.style.borderColor = "rgba(89, 130, 22, 0.3)")}
                                            required
                                        >
                                            <option value="Rainfed">Rainfed</option>
                                            <option value="Irrigated">Irrigated</option>
                                        </select>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                        <div className="flex items-start gap-2">
                                            <svg className="h-5 w-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <p>{error}</p>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 px-6 text-white font-medium rounded-lg transition-opacity disabled:opacity-50"
                                    style={{ backgroundColor: "#598216" }}
                                >
                                    {isSubmitting ? "Processing..." : "Predict Yield"}
                                </button>
                            </form>

                            {prediction && (
                                <div className="mt-8 rounded-xl p-6" style={{ backgroundColor: "rgba(89, 130, 22, 0.1)" }}>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Prediction Result</h3>
                                    <div className="space-y-4">
                                        <div
                                            className="flex items-center gap-3 pb-3 border-b"
                                            style={{ borderColor: "rgba(89, 130, 22, 0.2)" }}
                                        >
                                            <div>
                                                <p className="text-xs uppercase font-semibold" style={{ color: "#598216" }}>
                                                    Country
                                                </p>
                                                <p className="font-medium" style={{ color: "#598216" }}>
                                                    {formData.country}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="flex items-center gap-3 pb-3 border-b"
                                            style={{ borderColor: "rgba(89, 130, 22, 0.2)" }}
                                        >
                                            <div>
                                                <p className="text-xs uppercase font-semibold" style={{ color: "#598216" }}>
                                                    Crop
                                                </p>
                                                <p className="font-medium" style={{ color: "#598216" }}>
                                                    {formData.crop}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="flex items-center gap-3 pb-3 border-b"
                                            style={{ borderColor: "rgba(89, 130, 22, 0.2)" }}
                                        >
                                            <div>
                                                <p className="text-xs uppercase font-semibold" style={{ color: "#598216" }}>
                                                    District
                                                </p>
                                                <p className="font-medium" style={{ color: "#598216" }}>
                                                    {formData.district}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="flex items-center gap-3 pb-3 border-b"
                                            style={{ borderColor: "rgba(89, 130, 22, 0.2)" }}
                                        >
                                            <div>
                                                <p className="text-xs uppercase font-semibold" style={{ color: "#598216" }}>
                                                    Rainfall
                                                </p>
                                                <p className="font-medium" style={{ color: "#598216" }}>
                                                    {formData.rainfall_mm} mm
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="flex items-center gap-3 pb-3 border-b"
                                            style={{ borderColor: "rgba(89, 130, 22, 0.2)" }}
                                        >
                                            <div>
                                                <p className="text-xs uppercase font-semibold" style={{ color: "#598216" }}>
                                                    Irrigation Type
                                                </p>
                                                <p className="font-medium" style={{ color: "#598216" }}>
                                                    {formData.irrigation_type}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="mt-6 bg-white rounded-lg p-4 border"
                                            style={{ borderColor: "rgba(89, 130, 22, 0.2)" }}
                                        >
                                            <p className="text-xs uppercase font-semibold mb-1" style={{ color: "#598216" }}>
                                                Predicted Yield
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-xl" style={{ color: "#598216" }}>
                                                    {prediction.value} tons/ha
                                                </p>
                                            </div>
                                        </div>
                                        {prediction.warning && (
                                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                                                <div className="flex items-start gap-2">
                                                    <svg className="h-5 w-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <p>{prediction.warning}</p>
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setPrediction(null)}
                                            className="w-full mt-6 py-3 px-6 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                                            style={{ backgroundColor: "#598216" }}
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "feedback" && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            {showSuccessMessage && (
                                <div
                                    className="mb-6 p-4 rounded-lg border"
                                    style={{ borderColor: "#598216", backgroundColor: "#f0f7e6" }}
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" style={{ color: "#598216" }} fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 11.586 7.707 10.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <p className="text-sm font-medium" style={{ color: "#598216" }}>
                                            Thank you! Your yield data has been submitted successfully.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {yieldError && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    <div className="flex items-start gap-2">
                                        <svg className="h-5 w-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <p>{yieldError}</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleYieldSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">District *</label>
                                        <select
                                            name="district"
                                            value={yieldForm.district}
                                            onChange={handleYieldInputChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none"
                                            required
                                        >
                                            <option value="">Select District</option>
                                            {loadingDistricts ? (
                                                <option disabled>Loading districts...</option>
                                            ) : (
                                                districts.map((district) => (
                                                    <option key={district} value={district}>
                                                        {district}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Rainfall (mm) *</label>
                                        <input
                                            type="number"
                                            name="rainfall_mm"
                                            value={yieldForm.rainfall_mm}
                                            onChange={handleYieldInputChange}
                                            placeholder="e.g., 1200"
                                            min="500"
                                            max="2000"
                                            step="0.1"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Temperature (°C) *</label>
                                        <input
                                            type="number"
                                            name="temperature_c"
                                            value={yieldForm.temperature_c}
                                            onChange={handleYieldInputChange}
                                            placeholder="e.g., 19.5"
                                            min="15"
                                            max="30"
                                            step="0.1"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Soil pH *</label>
                                        <input
                                            type="number"
                                            name="soil_ph"
                                            value={yieldForm.soil_ph}
                                            onChange={handleYieldInputChange}
                                            placeholder="e.g., 6.5"
                                            min="0"
                                            max="14"
                                            step="0.1"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Fertilizer (kg/ha) *</label>
                                        <input
                                            type="number"
                                            name="fertilizer_kg_per_ha"
                                            value={yieldForm.fertilizer_kg_per_ha}
                                            onChange={handleYieldInputChange}
                                            placeholder="e.g., 150"
                                            min="0"
                                            step="0.1"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Pesticide (L/ha) *</label>
                                        <input
                                            type="number"
                                            name="pesticide_l_per_ha"
                                            value={yieldForm.pesticide_l_per_ha}
                                            onChange={handleYieldInputChange}
                                            placeholder="e.g., 2.5"
                                            min="0"
                                            step="0.1"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Irrigation Type *</label>
                                        <select
                                            name="irrigation_type"
                                            value={yieldForm.irrigation_type}
                                            onChange={handleYieldInputChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none"
                                            required
                                        >
                                            <option value="Rainfed">Rainfed</option>
                                            <option value="Irrigated">Irrigated</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Actual Yield (tons/ha) *</label>
                                        <input
                                            type="number"
                                            step="0.001"
                                            name="actual_yield_tons_per_ha"
                                            value={yieldForm.actual_yield_tons_per_ha}
                                            onChange={handleYieldInputChange}
                                            placeholder="e.g., 1.501"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Planting Date *</label>
                                        <input
                                            type="date"
                                            name="planting_date"
                                            value={yieldForm.planting_date}
                                            onChange={handleYieldInputChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Harvest Date *</label>
                                        <input
                                            type="date"
                                            name="harvest_date"
                                            value={yieldForm.harvest_date}
                                            onChange={handleYieldInputChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes (Optional)</label>
                                        <textarea
                                            name="notes"
                                            value={yieldForm.notes}
                                            onChange={handleYieldInputChange}
                                            placeholder="Any challenges faced, weather conditions, or other observations..."
                                            rows={4}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none resize-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 px-6 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                                    style={{ backgroundColor: "#598216" }}
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Yield Data"}
                                </button>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}