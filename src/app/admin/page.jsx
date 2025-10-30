"use client"

import { useState } from "react"
import Link from "next/link"

const mockFarmers = [
    {
        id: 1,
        name: "Jean Baptiste Mugabo",
        phone: "+250 788 123 456",
        lastPrediction: "2025-01-15",
        yield: "1.501 tons/ha (Medium)",
        location: "Kigali",
        status: "Active",
        country: "Rwanda",
        pesticides: "1200 tonnes",
        temperature: "22°C",
        year: 2025,
        cropType: "Maize",
        soilType: "Loamy",
        rainfall: "850mm",
        fertilizer: "NPK 15-15-15",
        farmSize: "2.5 hectares",
    },
    {
        id: 2,
        name: "Marie Claire Uwase",
        phone: "+250 788 234 567",
        lastPrediction: "2025-01-14",
        yield: "1.501 tons/ha (Medium)",
        location: "Musanze",
        status: "Active",
        country: "Rwanda",
        pesticides: "1200 tonnes",
        temperature: "20°C",
        year: 2025,
        cropType: "Maize",
        soilType: "Clay",
        rainfall: "920mm",
        fertilizer: "Urea",
        farmSize: "1.8 hectares",
    },
    {
        id: 3,
        name: "Patrick Niyonzima",
        phone: "+250 788 345 678",
        lastPrediction: "2025-01-13",
        yield: "1.501 tons/ha (Medium)",
        location: "Huye",
        status: "Active",
        country: "Rwanda",
        pesticides: "1200 tonnes",
        temperature: "21°C",
        year: 2025,
        cropType: "Maize",
        soilType: "Sandy Loam",
        rainfall: "780mm",
        fertilizer: "Compost + DAP",
        farmSize: "3.2 hectares",
    },
    {
        id: 4,
        name: "Grace Mukamana",
        phone: "+250 788 456 789",
        lastPrediction: "2025-01-12",
        yield: "1.501 tons/ha (Medium)",
        location: "Rubavu",
        status: "Active",
        country: "Rwanda",
        pesticides: "1200 tonnes",
        temperature: "23°C",
        year: 2025,
        cropType: "Maize",
        soilType: "Loamy",
        rainfall: "1100mm",
        fertilizer: "NPK 20-10-10",
        farmSize: "2.0 hectares",
    },
    {
        id: 5,
        name: "Emmanuel Habimana",
        phone: "+250 788 567 890",
        lastPrediction: "2025-01-11",
        yield: "1.501 tons/ha (Medium)",
        location: "Nyagatare",
        status: "Active",
        country: "Rwanda",
        pesticides: "1200 tonnes",
        temperature: "24°C",
        year: 2025,
        cropType: "Maize",
        soilType: "Sandy",
        rainfall: "650mm",
        fertilizer: "Organic Manure",
        farmSize: "4.5 hectares",
    },
    {
        id: 6,
        name: "Claudine Uwimana",
        phone: "+250 788 678 901",
        lastPrediction: "2025-01-10",
        yield: "1.501 tons/ha (Medium)",
        location: "Karongi",
        status: "Active",
        country: "Rwanda",
        pesticides: "1200 tonnes",
        temperature: "22°C",
        year: 2025,
        cropType: "Maize",
        soilType: "Clay Loam",
        rainfall: "950mm",
        fertilizer: "NPK 17-17-17",
        farmSize: "2.8 hectares",
    },
    {
        id: 7,
        name: "Eric Nsabimana",
        phone: "+250 788 789 012",
        lastPrediction: "2025-01-09",
        yield: "1.501 tons/ha (Medium)",
        location: "Rwamagana",
        status: "Active",
        country: "Rwanda",
        pesticides: "1200 tonnes",
        temperature: "21°C",
        year: 2025,
        cropType: "Maize",
        soilType: "Loamy",
        rainfall: "820mm",
        fertilizer: "TSP + Urea",
        farmSize: "3.0 hectares",
    },
    {
        id: 8,
        name: "Jeanne Mukeshimana",
        phone: "+250 788 890 123",
        lastPrediction: "2025-01-08",
        yield: "1.501 tons/ha (Medium)",
        location: "Muhanga",
        status: "Inactive",
        country: "Rwanda",
        pesticides: "1200 tonnes",
        temperature: "20°C",
        year: 2025,
        cropType: "Maize",
        soilType: "Clay",
        rainfall: "880mm",
        fertilizer: "Compost",
        farmSize: "1.5 hectares",
    },
]

// Mock data for yield trends over time
const yieldTrendsData = [
    { month: "Jan", yield: 3.2 },
    { month: "Feb", yield: 3.5 },
    { month: "Mar", yield: 3.8 },
    { month: "Apr", yield: 4.1 },
    { month: "May", yield: 4.3 },
    { month: "Jun", yield: 4.5 },
]

// Mock data for before/after yield comparisons
const beforeAfterData = [
    { name: "Jean Baptiste", before: 2.8, after: 4.2 },
    { name: "Marie Claire", before: 2.5, after: 3.8 },
    { name: "Patrick", before: 3.2, after: 5.1 },
    { name: "Grace", before: 3.0, after: 4.5 },
    { name: "Emmanuel", before: 2.6, after: 3.9 },
]

export default function AdminDashboard() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("All")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectedFarmer, setSelectedFarmer] = useState(null)

    // Filter farmers based on search and status
    const filteredFarmers = mockFarmers.filter((farmer) => {
        const matchesSearch =
            farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmer.phone.includes(searchTerm) ||
            farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmer.country.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === "All" || farmer.status === filterStatus
        return matchesSearch && matchesStatus
    })

    // Calculate statistics
    const totalFarmers = mockFarmers.length
    const activeFarmers = mockFarmers.filter((f) => f.status === "Active").length
    const totalPredictions = mockFarmers.length
    const avgYield = (
        mockFarmers.reduce((sum, f) => sum + Number.parseFloat(f.yield.split(" ")[0]), 0) / mockFarmers.length
    ).toFixed(1)

    const maxYield = Math.max(...yieldTrendsData.map((d) => d.yield))
    const maxBeforeAfter = Math.max(...beforeAfterData.flatMap((d) => [d.before, d.after]))

    const downloadCSV = () => {
        // Define CSV headers
        const headers = [
            "Farmer Name",
            "Phone Number",
            "Location",
            "Country",
            "Crop Type",
            "Year",
            "Pesticides (tonnes)",
            "Temperature",
            "Soil Type",
            "Rainfall",
            "Fertilizer",
            "Farm Size",
            "Predicted Yield",
            "Last Prediction Date",
            "Status",
        ]

        // Convert farmer data to CSV rows
        const rows = filteredFarmers.map((farmer) => [
            farmer.name,
            farmer.phone,
            farmer.location,
            farmer.country,
            farmer.cropType,
            farmer.year,
            farmer.pesticides,
            farmer.temperature,
            farmer.soilType,
            farmer.rainfall,
            farmer.fertilizer,
            farmer.farmSize,
            farmer.yield,
            farmer.lastPrediction,
            farmer.status,
        ])

        // Combine headers and rows
        const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

        // Create blob and download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `farmers_data_${new Date().toISOString().split("T")[0]}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
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
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                                <img
                                    src="/images/smartgwizalogo"
                                    alt="SmartGwiza Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900">SmartGwiza</h1>
                                <p className="text-xs text-slate-500">Admin Panel</p>
                            </div>
                        </div>
                        {/* </CHANGE> */}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        <a
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white rounded-lg"
                            style={{ backgroundColor: "#598216" }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            Dashboard
                        </a>

                        <a
                            href="/admin/farmers"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0l2 2m-2-2v10a1 1 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            Farmers
                        </a>

                        <a
                            href="/admin/predictions"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            Predictions
                        </a>

                        <a
                            href="/admin/analytics"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            Analytics
                        </a>

                        <a
                            href="/admin/settings"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            Settings
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
                                    <h1 className="text-xl font-bold text-slate-900">Farmer Management</h1>
                                    <p className="text-sm text-slate-500 mt-1">Overview and analytics</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
                                    <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        />
                                    </svg>
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                                    style={{ backgroundColor: "#598216" }}
                                >
                                    AD
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Total Farmers</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{totalFarmers}</p>
                                </div>
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: "#e8f3dc" }}
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        style={{ color: "#598216" }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs mt-2 font-medium" style={{ color: "#598216" }}>
                                ↑ {activeFarmers} active
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Total Predictions</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{totalPredictions}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">This month</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Average Yield</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{avgYield}</p>
                                </div>
                                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">tons/hectare</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Active Rate</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">
                                        {Math.round((activeFarmers / totalFarmers) * 100)}%
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Engagement metric</p>
                        </div>
                    </div>

                    {/* Analytics Section with Before/After and Trends Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Before/After Yield Comparison */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-slate-900">Before/After Yield Comparison</h3>
                                <p className="text-sm text-slate-500 mt-1">Impact of AI predictions on crop yields</p>
                            </div>
                            <div className="space-y-4">
                                {beforeAfterData.map((farmer, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-slate-700">{farmer.name}</span>
                                            <div className="flex items-center gap-3 text-xs">
                                                <span className="text-slate-500">Before: {farmer.before} t/ha</span>
                                                <span className="font-semibold" style={{ color: "#598216" }}>
                                                    After: {farmer.after} t/ha
                                                </span>
                                                <span className="font-bold" style={{ color: "#598216" }}>
                                                    +{Math.round(((farmer.after - farmer.before) / farmer.before) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {/* Before bar */}
                                            <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                                                <div
                                                    className="bg-slate-400 h-full rounded-full flex items-center justify-end pr-2"
                                                    style={{ width: `${(farmer.before / maxBeforeAfter) * 100}%` }}
                                                >
                                                    <span className="text-xs font-medium text-white">{farmer.before}</span>
                                                </div>
                                            </div>
                                            <div
                                                className="flex-1 rounded-full h-8 relative overflow-hidden"
                                                style={{ backgroundColor: "#e8f3dc" }}
                                            >
                                                <div
                                                    className="h-full rounded-full flex items-center justify-end pr-2"
                                                    style={{ width: `${(farmer.after / maxBeforeAfter) * 100}%`, backgroundColor: "#598216" }}
                                                >
                                                    <span className="text-xs font-medium text-white">{farmer.after}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-700">Average Improvement</span>
                                    <span className="text-2xl font-bold" style={{ color: "#598216" }}>
                                        +
                                        {Math.round(
                                            beforeAfterData.reduce((sum, d) => sum + ((d.after - d.before) / d.before) * 100, 0) /
                                            beforeAfterData.length,
                                        )}
                                        %
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Yield Trends Over Time */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-slate-900">Yield Trends Over Time</h3>
                                <p className="text-sm text-slate-500 mt-1">Average yield progression (tons/hectare)</p>
                            </div>
                            <div className="relative h-64">
                                {/* Y-axis labels */}
                                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-slate-500 pr-2">
                                    <span>{maxYield.toFixed(1)}</span>
                                    <span>{(maxYield * 0.75).toFixed(1)}</span>
                                    <span>{(maxYield * 0.5).toFixed(1)}</span>
                                    <span>{(maxYield * 0.25).toFixed(1)}</span>
                                    <span>0</span>
                                </div>

                                {/* Chart area */}
                                <div className="ml-8 h-full flex items-end justify-between gap-4 pb-8">
                                    {yieldTrendsData.map((data, index) => {
                                        const height = (data.yield / maxYield) * 100
                                        const prevData = index > 0 ? yieldTrendsData[index - 1] : null
                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center">
                                                {/* Bar */}
                                                <div className="w-full relative" style={{ height: "200px" }}>
                                                    <div
                                                        className="absolute bottom-0 w-full rounded-t-lg transition-all duration-500 cursor-pointer group"
                                                        style={{
                                                            height: `${height}%`,
                                                            background: `linear-gradient(to top, #598216, #6fa01e)`,
                                                        }}
                                                    >
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                            {data.yield} t/ha
                                                        </div>
                                                    </div>
                                                    {prevData && (
                                                        <svg
                                                            className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                                            style={{ overflow: "visible" }}
                                                        >
                                                            <line
                                                                x1="-50%"
                                                                y1={`${100 - (prevData.yield / maxYield) * 100}%`}
                                                                x2="50%"
                                                                y2={`${100 - height}%`}
                                                                stroke="#598216"
                                                                strokeWidth="2"
                                                                strokeDasharray="4 2"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                                {/* Month label */}
                                                <span className="text-xs font-medium text-slate-600 mt-2">{data.month}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-700">Growth Rate</span>
                                    <span className="text-2xl font-bold" style={{ color: "#598216" }}>
                                        +
                                        {Math.round(
                                            ((yieldTrendsData[yieldTrendsData.length - 1].yield - yieldTrendsData[0].yield) /
                                                yieldTrendsData[0].yield) *
                                            100,
                                        )}
                                        %
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Farmers Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        {/* Table Header */}
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Farmer List</h2>
                                    <p className="text-sm text-slate-500 mt-1">Manage and view all registered farmers</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={downloadCSV}
                                        className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
                                        style={{ backgroundColor: "#598216" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4a6b12")}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#598216")}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        Download CSV
                                    </button>

                                    {/* Status Filter */}
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2"
                                        style={{ "--tw-ring-color": "#598216" }}
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>

                                    {/* Search */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search farmers..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 w-64"
                                            style={{ "--tw-ring-color": "#598216" }}
                                        />
                                        <svg
                                            className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Farmer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Phone Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Last Prediction
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Yield Result
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {filteredFarmers.map((farmer) => (
                                        <tr key={farmer.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                                                        style={{ backgroundColor: "#598216" }}
                                                    >
                                                        {farmer.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-slate-900">{farmer.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-900">{farmer.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-900">{farmer.location}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-900">{farmer.lastPrediction}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold" style={{ color: "#598216" }}>
                                                    {farmer.yield}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${farmer.status === "Active" ? "" : "bg-slate-100 text-slate-800"
                                                        }`}
                                                    style={farmer.status === "Active" ? { backgroundColor: "#e8f3dc", color: "#598216" } : {}}
                                                >
                                                    {farmer.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => setSelectedFarmer(farmer)}
                                                    className="font-medium"
                                                    style={{ color: "#598216" }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.color = "#4a6b12")}
                                                    onMouseLeave={(e) => (e.currentTarget.style.color = "#598216")}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Empty State */}
                        {filteredFarmers.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 00-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                    />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-slate-900">No farmers found</h3>
                                <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filter criteria.</p>
                            </div>
                        )}

                        {/* Table Footer */}
                        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-700">
                                    Showing <span className="font-medium">{filteredFarmers.length}</span> of{" "}
                                    <span className="font-medium">{totalFarmers}</span> farmers
                                </p>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition-colors">
                                        Previous
                                    </button>
                                    <button className="px-3 py-1 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition-colors">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal */}
            {selectedFarmer && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Farmer Details</h2>
                                <p className="text-sm text-slate-500 mt-1">Prediction information</p>
                            </div>
                            <button
                                onClick={() => setSelectedFarmer(null)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {/* Farmer Profile */}
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-semibold"
                                    style={{ backgroundColor: "#598216" }}
                                >
                                    {selectedFarmer.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">{selectedFarmer.name}</h3>
                                    <p className="text-sm text-slate-500">{selectedFarmer.phone}</p>
                                    <span
                                        className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${selectedFarmer.status === "Active" ? "" : "bg-slate-100 text-slate-800"
                                            }`}
                                        style={selectedFarmer.status === "Active" ? { backgroundColor: "#e8f3dc", color: "#598216" } : {}}
                                    >
                                        {selectedFarmer.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Country */}
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            style={{ color: "#598216" }}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium text-slate-500">Country</span>
                                    </div>
                                    <p className="text-lg font-semibold text-slate-900">{selectedFarmer.country}</p>
                                </div>

                                {/* Crop Type */}
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            style={{ color: "#598216" }}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium text-slate-500">Crop</span>
                                    </div>
                                    <p className="text-lg font-semibold text-slate-900">{selectedFarmer.cropType}</p>
                                </div>

                                {/* Year */}
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium text-slate-500">Year</span>
                                    </div>
                                    <p className="text-lg font-semibold text-slate-900">{selectedFarmer.year}</p>
                                </div>

                                {/* Pesticides */}
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium text-slate-500">Pesticides Used</span>
                                    </div>
                                    <p className="text-lg font-semibold text-slate-900">{selectedFarmer.pesticides}</p>
                                </div>

                                {/* Predicted Yield - Highlighted */}
                                <div className="rounded-lg p-4 border-2" style={{ backgroundColor: "#e8f3dc", borderColor: "#c5dba8" }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            style={{ color: "#598216" }}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium" style={{ color: "#4a6b12" }}>
                                            Predicted Yield
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold" style={{ color: "#4a6b12" }}>
                                        {selectedFarmer.yield}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedFarmer(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                                style={{ backgroundColor: "#598216" }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4a6b12")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#598216")}
                            >
                                Export Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
