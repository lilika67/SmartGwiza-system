"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Calendar, Clock, User, ArrowLeft, Share2 } from "lucide-react"
import { blogArticles } from "../../../../lib/blog-data"

export default function ArticlePage() {
    const params = useParams()
    const article = blogArticles.find((a) => a.slug === params.slug)

    if (!article) {
        return (
            <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4" style={{ color: "#598216" }}>
                        Article Not Found
                    </h1>
                    <Link href="/blog" className="text-[#598216] hover:underline">
                        Back to Blog
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
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
                            href="/blog"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105"
                            style={{ color: "#598216", backgroundColor: "rgba(89, 130, 22, 0.1)" }}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Blog
                        </Link>
                    </div>
                </div>
            </header>

            {/* Article Hero */}
            <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="container mx-auto max-w-4xl">
                        <div
                            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white mb-4"
                            style={{ backgroundColor: "#598216" }}
                        >
                            {article.category}
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90">
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                <span>{article.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                <span>
                                    {new Date(article.date).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <article className="py-12 md:py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <div
                                className="article-content"
                                dangerouslySetInnerHTML={{
                                    __html: article.content
                                        .split("\n")
                                        .map((line) => {
                                            if (line.startsWith("# ")) {
                                                return `<h1 class="text-3xl md:text-4xl font-bold mb-6 mt-8" style="color: #598216">${line.substring(2)}</h1>`
                                            }
                                            if (line.startsWith("## ")) {
                                                return `<h2 class="text-2xl md:text-3xl font-bold mb-4 mt-6" style="color: #598216">${line.substring(3)}</h2>`
                                            }
                                            if (line.startsWith("### ")) {
                                                return `<h3 class="text-xl md:text-2xl font-bold mb-3 mt-5" style="color: #598216">${line.substring(4)}</h3>`
                                            }
                                            if (line.startsWith("**") && line.endsWith("**")) {
                                                return `<p class="font-bold mb-3 mt-4">${line.substring(2, line.length - 2)}</p>`
                                            }
                                            if (line.startsWith("- ")) {
                                                return `<li class="mb-2">${line.substring(2)}</li>`
                                            }
                                            if (line.trim() === "") {
                                                return ""
                                            }
                                            return `<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">${line}</p>`
                                        })
                                        .join(""),
                                }}
                            />
                        </div>

                       
                    </div>

                </div>
            </article>

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
