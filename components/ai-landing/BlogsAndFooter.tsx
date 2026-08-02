"use client"

import React, { useState } from "react"

export function BlogsAndFooter() {
  const [cookieVisible, setCookieVisible] = useState(true)

  const blogs = [
    {
      id: 1,
      title: "Gemini 3.6 Flash in Google Antigravity",
      date: "Jul 21, 2026",
      category: "Product",
      img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80"
    },
    {
      id: 2,
      title: "Google Antigravity @ I/O 2026",
      date: "May 19, 2026",
      category: "Product",
      img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
    },
    {
      id: 3,
      title: "Introducing Google Antigravity 2.0",
      date: "May 19, 2026",
      category: "Product",
      img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80"
    },
    {
      id: 4,
      title: "Google Antigravity Built an OS (and more)",
      date: "May 19, 2026",
      category: "Product",
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
    }
  ]

  return (
    <>
      <section className="landing-latest-blogs bg-white py-24">
        <div className="grid-container">
          <div className="blogs-header mb-12 flex justify-between items-end">
            <h2 className="heading-3 text-[#171717]">Latest Blogs</h2>
            <a href="#" className="arrow-link font-medium text-[#1a73e8]">View blog</a>
          </div>

          <div className="grid-row blogs-list">
            {blogs.map((blog) => (
              <div key={blog.id} className="grid-col col-md-3 col-sm-4 col-xs-4 mb-8">
                <a href="#" className="blog-card block group">
                  <div className="blog-image-wrapper w-full aspect-square rounded-[32px] overflow-hidden mb-6 bg-[#f5f5f5]">
                    <img 
                      src={blog.img} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="heading-5 text-[#171717] mb-4 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-[#737373] mt-auto">
                    <span>{blog.date}</span>
                    <span>{blog.category}</span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cookie Notification */}
      {cookieVisible && (
        <div className="glue-cookie-notification-bar" aria-hidden="false">
          <p className="glue-cookie-notification-bar__text">
            We use cookies to analyse our traffic.
            <a href="#" className="glue-cookie-notification-bar__more">Learn more</a>
          </p>
          <button 
            className="glue-cookie-notification-bar__accept button button-primary"
            onClick={() => setCookieVisible(false)}
          >
            Got it
          </button>
        </div>
      )}
    </>
  )
}
