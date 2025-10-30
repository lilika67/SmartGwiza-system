"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, Calendar, Clock, ArrowRight, BookOpen } from "lucide-react"
import { blogArticles, blogCategories } from "../../../lib/blog-data"

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")

    const filteredArticles = blogArticles.filter((article) => {
        const matchesCategory = selectedCategory === "All" || article.category === selectedCategory
        const matchesSearch =
            searchQuery === "" ||
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.category.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group">
                            <img
                                src="/images/smartgwizalogo.png"
                                alt="SmartGwiza Logo"
                                className="h-12 w-12 rounded-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                            />
                            <span className="text-xl font-bold text-gray-800 dark:text-white">
                                Smart<span style={{ color: "#598216" }}>Gwiza</span>
                            </span>
                        </Link>
                        <Link
                            href="/"
                            className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105"
                            style={{ color: "#598216", backgroundColor: "rgba(89, 130, 22, 0.1)" }}
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16 md:py-24" style={{ background: "linear-gradient(135deg, #598216 0%, #4a6f12 100%)" }}>
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <BookOpen className="h-12 w-12" />
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">AgriBlog</h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8">
                            Expert guidance, best practices, and insights for Rwandan farmers
                        </p>
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {blogCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${selectedCategory === category
                                        ? "text-white shadow-lg"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                                style={{
                                    backgroundColor: selectedCategory === category ? "#598216" : undefined,
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {filteredArticles.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-xl text-gray-600 dark:text-gray-400">
                                No articles found. Try adjusting your search or category filter.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredArticles.map((article) => (
                                <Link
                                    key={article.slug}
                                    href={`/blog/${article.slug}`}
                                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={article.image || "/placeholder.svg"}
                                            alt={article.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div
                                            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
                                            style={{ backgroundColor: "#598216" }}
                                        >
                                            {article.category}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-[#598216] dark:group-hover:text-[#6a9a1a] transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{article.excerpt}</p>
                                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {new Date(article.date).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">By {article.author}</span>
                                            <div
                                                className="flex items-center gap-1 font-medium group-hover:gap-2 transition-all"
                                                style={{ color: "#598216" }}
                                            >
                                                Read More
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="text-white py-12" style={{ background: "linear-gradient(to right, #2d4010, #3d5515)" }}>
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <img
                            src="/images/smartgwizalogo.png"
                            alt="SmartGwiza Logo"
                            className="h-10 w-10 rounded-full object-contain"
                        />
                        <span className="text-xl font-bold">SmartGwiza</span>
                    </div>
                    <p className="text-gray-300 mb-4">Empowering Rwandan farmers with knowledge and technology</p>
                    <p className="text-gray-400">© {new Date().getFullYear()} SmartGwiza. All rights reserved.</p>
                </div>
            </footer>
        </main>
    )
}
