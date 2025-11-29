import {
    ArrowUpRight,
    Zap,    
    Building2,
    Clock,
    Users,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Grid3X3,
    List,
    BookOpen,
    Target,
    ShoppingCart,
    Calendar,
} from "lucide-react"
import { useRef, useState, useEffect } from "react"
import PageRequest from "./PageRequest"
import { PageCategory, PageResponse } from "../../types/pageCategory"

interface ApiPageData {
    id: number;
    title: string | null;
    imageUrl: string | null;
    pageUrl: string | null;
    status: string;
    owner: {
        username: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

const Service = () => {
    const gridRef = useRef<HTMLDivElement>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(6)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [allCmsOptions, setAllCmsOptions] = useState<PageResponse[]>([])
    const [loading, setLoading] = useState(true)

    const getCategoryFromUrl = (url: string | null): string => {
        if (!url) return "Other"
        
        const urlLower = url.toLowerCase()
        if (urlLower.includes('/lms/') || urlLower.includes('lms')) {
            return "Learning Management System"
        } else if (urlLower.includes('/bms/') || urlLower.includes('bms') || urlLower.includes('/booking/')) {
            return "Booking System"
        } else if (urlLower.includes('/ecommerce/') || urlLower.includes('/ecs-') || urlLower.includes('ecommerce')) {
            return "E-Commerce System"
        } else {
            return "Other"
        }
    }

    const getCategoryStyle = (category: string, index: number) => {
        const categoryMap: Record<string, PageCategory> = {
            "Learning Management System": {
                colors: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-50",
                icon: BookOpen,
            },
            "E-Commerce System": {
                colors: "from-green-500 to-emerald-500",
                bgColor: "bg-green-50",
                icon: ShoppingCart,
            },
            "Booking System": {
                colors: "from-purple-500 to-violet-500",
                bgColor: "bg-purple-50",
                icon: Calendar,
            },
            "Agency Management System": {
                colors: "from-orange-500 to-red-500",
                bgColor: "bg-orange-50",
                icon: Building2,
            },
        }

        if (categoryMap[category]) {
            return categoryMap[category]
        }

        const fallbackColors = [
            { colors: "from-slate-500 to-gray-500", bgColor: "bg-slate-50", icon: Building2 },
            { colors: "from-red-500 to-pink-500", bgColor: "bg-red-50", icon: Target },
            { colors: "from-amber-500 to-yellow-500", bgColor: "bg-amber-50", icon: Zap },
            { colors: "from-lime-500 to-green-500", bgColor: "bg-lime-50", icon: BookOpen },
        ]

        return fallbackColors[index % fallbackColors.length]
    }

    useEffect(() => {
        const fetchPages = async () => {
            try {
                setLoading(true)
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
                // Filter only published pages and map to PageResponse format
                const publishedPages = (result.data || [])
                    .filter((page: ApiPageData) => page.status === 'Published' && page.pageUrl)
                    .map((page: ApiPageData) => {
                        const category = getCategoryFromUrl(page.pageUrl)
                        const updatedDate = new Date(page.updatedAt || page.createdAt)
                        const formattedDate = updatedDate.toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                        })
                        
                        return {
                            id: page.id,
                            title: page.title || "Untitled Service",
                            category: category,
                            description: page.owner?.username 
                                ? `Managed by ${page.owner.username}. Professional ${category.toLowerCase()} platform.`
                                : `Professional ${category.toLowerCase()} platform.`,
                            updated: formattedDate,
                            logo: page.imageUrl || "https://i.pinimg.com/736x/48/06/7f/48067f233fdfc65f3c73dd166af75e39.jpg",
                            stats: { users: "1K+", completion: "95%" }, // Default stats, can be enhanced later
                            pageUrl: page.pageUrl,
                        } as PageResponse
                    })
                
                setAllCmsOptions(publishedPages)
            } catch (error) {
                console.error('Error fetching pages:', error)
                // Keep empty array on error
                setAllCmsOptions([])
            } finally {
                setLoading(false)
            }
        }

        fetchPages()
    }, [])

    const totalPages = Math.ceil(allCmsOptions.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = allCmsOptions.slice(startIndex, endIndex)

    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push("ellipsis")
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push("ellipsis")
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push("ellipsis")
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push("ellipsis")
                pages.push(totalPages)
            }
        }
        return pages
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        if (gridRef.current) {
            gridRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    const handleExploreLive = (platform: PageResponse) => {
        if (platform.pageUrl) {
            window.open(platform.pageUrl, '_blank', 'noopener,noreferrer')
        }
    }

    return (
        <div id="services" className="min-h-screen bg-white">
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50 py-20 px-4">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200 shadow-sm mb-8">
                        <Zap className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">Demo Platforms</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                        Experience Our
                        <br />
                        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            Learning Ecosystems
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Explore live demonstrations of our specialized content management platforms, each crafted for different
                        learning environments and organizational needs.
                    </p>
                </div>
            </div>

            <div ref={gridRef} className="max-w-7xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading platforms...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-4">
                                <p className="text-gray-600">
                                    Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
                                    <span className="font-semibold">{Math.min(endIndex, allCmsOptions.length)}</span> of{" "}
                                    <span className="font-semibold">{allCmsOptions.length}</span> platform{allCmsOptions.length !== 1 ? 's' : ''}
                                </p>
                            </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Show:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value))
                                    setCurrentPage(1)
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value={6}>6</option>
                                <option value={9}>9</option>
                                <option value={12}>12</option>
                                <option value={18}>18</option>
                            </select>
                        </div>

                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                <Grid3X3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-16">
                    <div className={`grid gap-8 ${viewMode === "grid" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
                        {currentItems.map((platform, index) => {
                        const categoryStyle = getCategoryStyle(platform.category, index)

                        const isEven = index % 2 === 0

                        return (
                            <div
                                key={platform.id}
                                className={`group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02] ${viewMode === "grid" && isEven ? "lg:translate-y-8" : viewMode === "grid" ? "lg:-translate-y-8" : ""
                                    }`}
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${categoryStyle.colors} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                                ></div>

                                <div className="relative bg-white border border-gray-200 p-8 h-full shadow-lg group-hover:shadow-2xl transition-all duration-300">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div
                                                    className={`absolute inset-0 bg-gradient-to-r ${categoryStyle.colors} rounded-xl blur-sm opacity-0 group-hover:opacity-20 transition-all duration-300`}
                                                ></div>
                                                <div className="relative bg-white p-3 rounded-xl border border-gray-200 group-hover:border-gray-300 transition-colors duration-300">
                                                    <img
                                                        src={platform.logo || "/placeholder.svg"}
                                                        alt={`${platform.title} logo`}
                                                        className="h-8 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                        <div className="text-right">
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    <span>{platform.stats.users}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="w-4 h-4" />
                                                    <span>{platform.stats.completion}</span>
                                                </div>
                                            </div>
                                            <span
                                                className={`inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${categoryStyle.colors} text-white`}
                                            >
                                                {platform.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                                            {platform.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed text-lg">{platform.description}</p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Clock className="w-4 h-4" />
                                            <span>Updated: {platform.updated}</span>
                                        </div>

                                        <button
                                            onClick={() => handleExploreLive(platform)}
                                            className={`group/btn relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${categoryStyle.colors} text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer`}
                                        >
                                            <span>Explore Live</span>
                                            <ArrowUpRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />

                                            <div
                                                className={`absolute inset-0 rounded-xl bg-gradient-to-r ${categoryStyle.colors} opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm -z-10`}
                                            ></div>
                                        </button>
                                    </div>

                                    <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                </div>

                                <div
                                    className={`absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r ${categoryStyle.colors} rounded-full animate-pulse opacity-60`}
                                ></div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-16">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-sm text-gray-600">
                        Page <span className="font-semibold">{currentPage}</span> of{" "}
                        <span className="font-semibold">{totalPages}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>

                        <div className="flex items-center gap-1">
                            {getPageNumbers().map((page, index) => (
                                <div key={index}>
                                    {page === "ellipsis" ? (
                                        <div className="px-3 py-2">
                                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handlePageChange(page as number)}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${currentPage === page
                                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Go to:</span>
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={currentPage}
                            onChange={(e) => {
                                const page = Number.parseInt(e.target.value)
                                if (page >= 1 && page <= totalPages) {
                                    handlePageChange(page)
                                }
                            }}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>
                </div>
                </>
                )}
            </div>

            <PageRequest />
        </div>
    )
}

export default Service