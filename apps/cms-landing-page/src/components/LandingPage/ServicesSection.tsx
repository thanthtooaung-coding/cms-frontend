import {
    ArrowUpRight,
    Building2,
    BookOpen,
    ShoppingCart,
    Calendar,
} from "lucide-react"
import { useState, useEffect } from "react"

interface PageData {
    id: number;
    title: string | null;
    imageUrl: string | null;
    pageUrl: string | null;
    status: string;
    owner: {
        username: string;
        email: string;
    };
}

interface ServicesSectionProps {
    showFullSection?: boolean;
}

const ServicesSection = ({ showFullSection = false }: ServicesSectionProps) => {
    const [pages, setPages] = useState<PageData[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(6)
    const [viewMode] = useState<"grid" | "list">("grid")

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api'
                const response = await fetch(`${API_BASE_URL}/cms/pages?page=1&limit=100`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch pages')
                }

                const result = await response.json()
                // Filter only published pages
                const publishedPages = (result.data || []).filter(
                    (page: PageData) => page.status === 'Published' && page.pageUrl
                )
                setPages(publishedPages)
            } catch (error) {
                console.error('Error fetching pages:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPages()
    }, [])

    const getCategoryFromUrl = (url: string | null): { category: string; style: any } => {
        if (!url) {
            return {
                category: "Other",
                style: { colors: "from-slate-500 to-gray-500", bgColor: "bg-slate-50", icon: Building2 }
            }
        }

        const urlLower = url.toLowerCase()
        if (urlLower.includes('/lms/') || urlLower.includes('lms')) {
            return {
                category: "Learning Management System",
                style: { colors: "from-blue-500 to-cyan-500", bgColor: "bg-blue-50", icon: BookOpen }
            }
        } else if (urlLower.includes('/bms/') || urlLower.includes('bms') || urlLower.includes('/booking/')) {
            return {
                category: "Booking System",
                style: { colors: "from-purple-500 to-violet-500", bgColor: "bg-purple-50", icon: Calendar }
            }
        } else if (urlLower.includes('/ecommerce/') || urlLower.includes('/ecs-') || urlLower.includes('ecommerce')) {
            return {
                category: "E-Commerce System",
                style: { colors: "from-green-500 to-emerald-500", bgColor: "bg-green-50", icon: ShoppingCart }
            }
        } else {
            return {
                category: "Other",
                style: { colors: "from-slate-500 to-gray-500", bgColor: "bg-slate-50", icon: Building2 }
            }
        }
    }

    const handleExploreLive = (page: PageData) => {
        if (!page.pageUrl) return

        // Open the client page in a new tab
        // pageUrl format: http://localhost:5176/lms/tenant-slug or similar
        window.open(page.pageUrl, '_blank', 'noopener,noreferrer')
    }

    const totalPages = Math.ceil(pages.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = pages.slice(startIndex, endIndex)

    if (loading) {
        return (
            <div className="py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading services...</p>
            </div>
        )
    }

    if (pages.length === 0) {
        return null // Don't show section if no pages
    }

    return (
        <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
                    <p className="text-lg text-gray-600">Explore our platform solutions</p>
                </div>

                <div className={`grid gap-8 ${viewMode === "grid" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
                    {currentItems.map((platform, index) => {
                        const { category, style } = getCategoryFromUrl(platform.pageUrl)
                        const CategoryIcon = style.icon
                        const isEven = index % 2 === 0

                        return (
                            <div
                                key={platform.id}
                                className={`group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02] ${viewMode === "grid" && isEven ? "lg:translate-y-8" : viewMode === "grid" ? "lg:-translate-y-8" : ""
                                    }`}
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${style.colors} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                                ></div>

                                <div className="relative p-8 bg-white border border-gray-100 rounded-3xl">
                                    <div className="flex items-start gap-6 mb-6">
                                        {platform.imageUrl ? (
                                            <img
                                                src={platform.imageUrl}
                                                alt={platform.title || "Service"}
                                                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100"
                                            />
                                        ) : (
                                            <div className={`w-16 h-16 rounded-xl ${style.bgColor} flex items-center justify-center`}>
                                                <CategoryIcon className={`w-8 h-8 text-gray-600`} />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                {platform.title || "Untitled Service"}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${style.colors} text-white`}>
                                                    {category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-6 line-clamp-2">
                                        {platform.owner?.username ? `Managed by ${platform.owner.username}` : "Professional service platform"}
                                    </p>

                                    <button
                                        onClick={() => handleExploreLive(platform)}
                                        className={`w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r ${style.colors} hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn`}
                                    >
                                        Explore Live
                                        <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {showFullSection && totalPages > 1 && (
                    <div className="mt-12 flex justify-center items-center gap-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <span className="text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ServicesSection

