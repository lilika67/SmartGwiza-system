"use client"
import { useState, useEffect } from "react"

export default function FarmerSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = ["/images/maize.jpg", "/images/farm4.jpg", "/images/farme.jpg"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div className="absolute inset-0 w-full h-full">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
        >
          <img src={slide || "/placeholder.svg"} alt={`Farmer ${index + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Slideshow indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
