import { Link } from "react-router"
import { ArrowUpRight, Sparkles, Zap, Clock, CheckCircle } from "lucide-react"

export default function PageRequest() {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/30"></div>

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 right-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full border border-purple-200">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Custom Page Builder</span>
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Vision,
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Our Craft
                </span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Skip the templates. Get a page that's uniquely yours, built by experts who understand your vision.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">48h</div>
                <div className="text-sm text-gray-500">Avg. Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-500">Pages Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-500">Satisfaction</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                to="/page-request"
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 cursor-pointer hover:bg-purple-700 hover:to-pink-700"
              >
                <span>Start Your Project</span>
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>

              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free consultation • No strings attached</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-sm opacity-20"></div>

            <div className="relative bg-white rounded-3xl border border-gray-200 shadow-2xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-xs text-gray-500">Custom Page Preview</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition-all duration-300 cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium">Tell us your vision</div>
                    <div className="text-sm text-gray-600">Share your ideas and requirements</div>
                  </div>
                  <Zap className="w-5 h-5 text-purple-600 ml-auto" />
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all duration-300 cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium">We design & build</div>
                    <div className="text-sm text-gray-600">Expert craftsmanship meets your vision</div>
                  </div>
                  <Sparkles className="w-5 h-5 text-blue-600 ml-auto" />
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition-all duration-300 cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium">Launch & celebrate</div>
                    <div className="text-sm text-gray-600">Your custom page goes live</div>
                  </div>
                  <Clock className="w-5 h-5 text-green-600 ml-auto" />
                </div>
              </div>

              <div className="h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full"></div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500 rounded-full animate-bounce delay-300 shadow-lg"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-500 rounded-full animate-bounce delay-700 shadow-lg"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
