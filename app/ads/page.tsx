"use client"

import React, { useState } from 'react'
import { ArrowUpRight, Trophy, Globe, Smartphone, FileText, ChevronRight } from 'lucide-react'

// Mock Data representing the highest bidders at the top
const initialListings = [
  { id: 1, type: 'web', title: 'Aeternexus Network', description: 'The next generation professional builder hub.', url: 'aeternexus.com', bid: 1500, category: 'Websites' },
  { id: 2, type: 'mobile', title: 'FocusFlow', description: 'Productivity app to keep your deep work sessions uninterrupted.', url: 'App Store', bid: 850, category: 'Mobile Apps' },
  { id: 3, type: 'post', title: 'How to build an AI agent from scratch', description: 'A comprehensive guide on modern agentic frameworks.', url: 'Medium', bid: 450, category: 'Posts' },
  { id: 4, type: 'web', title: 'DesignJoy Clone', description: 'Unlimited design subscriptions for everyone.', url: 'design.io', bid: 320, category: 'Websites' },
  { id: 5, type: 'mobile', title: 'RunTracker Pro', description: 'Track your marathons with GPS precision.', url: 'Google Play', bid: 210, category: 'Mobile Apps' },
  { id: 6, type: 'web', title: 'Minimalist Note', description: 'Just start typing. No sign up required.', url: 'mininote.com', bid: 95, category: 'Websites' },
]

export default function AdsDirectoryPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  
  const categories = ['All', 'Websites', 'Mobile Apps', 'Posts']
  
  const filteredListings = initialListings
    .filter(item => activeCategory === 'All' || item.category === activeCategory)
    .sort((a, b) => b.bid - a.bid) // Sort by highest bid

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-black">
          Top Sponsored Projects
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          Discover the most prominent websites, mobile apps, and posts. Rankings are powered by our open bidding system. The higher the bid, the higher the rank.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-800 rounded-full font-medium text-sm border border-yellow-200">
          <Trophy className="w-4 h-4" />
          Ranked by highest USD bid
        </div>
      </section>

      {/* Category Filter */}
      <div className="flex justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat 
              ? 'bg-black text-white shadow-lg shadow-black/10' 
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing, index) => {
          
          const Icon = listing.type === 'web' ? Globe : (listing.type === 'mobile' ? Smartphone : FileText)
          
          // Top 3 items get special styling
          const isTop3 = index < 3 && activeCategory === 'All';

          return (
            <div 
              key={listing.id} 
              className={`group relative p-6 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white flex flex-col h-full ${
                isTop3 ? 'border-yellow-200 shadow-sm shadow-yellow-100' : 'border-gray-100 shadow-sm'
              }`}
            >
              {/* Bid Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full text-xs font-semibold text-gray-700 border border-gray-100">
                <span className="text-green-600 font-bold">$</span>
                {listing.bid.toLocaleString('en-US')}
              </div>

              <div className="w-12 h-12 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center mb-5 group-hover:bg-black group-hover:text-white transition-colors">
                <Icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              
              <div className="mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 block">
                  {listing.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {listing.title}
                </h3>
              </div>
              
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                {listing.description}
              </p>

              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm font-medium">
                <span className="text-gray-400 truncate pr-4">{listing.url}</span>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              
            </div>
          )
        })}
      </div>

      {/* CTA Bottom */}
      <div className="mt-20 p-8 rounded-[2rem] bg-gradient-to-br from-gray-900 to-black text-white text-center flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Want your project here?</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          Place a bid to get featured in our directory. Outbid others to secure the top spot and maximize your visibility.
        </p>
        <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
          Place a Bid
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </main>
  )
}
