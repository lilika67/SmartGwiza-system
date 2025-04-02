"use client"
import { useEffect, useRef } from "react"
import Image from "next/image"

const heroImage = {
  src: "/images/fam.jpg",
  alt: "Farmer inspecting crops in a wheat field at sunset",
}

export default function FarmerSlideshow() {
  const imageRef = useRef(null)

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return
      const scrollY = window.scrollY
      const translateY = scrollY * 0.3 
      imageRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 z-10"></div>

      {/* Hero Image with Parallax */}
      <div ref={imageRef} className="h-[120%] w-full absolute top-0 left-0">
        <Image
          src={heroImage.src || "/placeholder.svg"}
          alt={heroImage.alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
    </div>
  )
}

