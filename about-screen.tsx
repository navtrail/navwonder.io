"use client"

import { motion } from "framer-motion"

export function AboutScreen() {
  const teamMembers = [
    {
      name: "Sattu",
      role: "Founder & CEO",
      bio: "Passionate traveler and tech enthusiast with a vision to make travel planning easier for everyone.",
      avatar: "/placeholder.svg?height=100&width=100",
      social: {
        twitter: "https://twitter.com/sattu",
        linkedin: "https://linkedin.com/in/sattu",
        github: "https://github.com/sattu",
      },
    },
    {
      name: "Jane Smith",
      role: "CTO",
      bio: "Software engineer with 10+ years of experience in building location-based applications.",
      avatar: "/placeholder.svg?height=100&width=100",
      social: {
        twitter: "https://twitter.com/janesmith",
        linkedin: "https://linkedin.com/in/janesmith",
        github: "https://github.com/janesmith",
      },
    },
    {
      name: "Michael Johnson",
      role: "Head of Design",
      bio: "UX/UI designer focused on creating intuitive and accessible travel experiences.",
      avatar: "/placeholder.svg?height=100&width=100",
      social: {
        twitter: "https://twitter.com/michaelj",
        linkedin: "https://linkedin.com/in/michaelj",
        github: "https://github.com/michaelj",
      },
    },
  ]

  const features = [
    {
      title: "Interactive Maps",
      description:
        "Explore destinations with our detailed interactive maps featuring points of interest, routes, and local recommendations.",
    },
    {
      title: "Trip Planning",
      description:
        "Create comprehensive travel itineraries with our intuitive trip planning tools, including scheduling, budgeting, and activity suggestions.",
    },
    {
      title: "Offline Access",
      description:
        "Download maps and travel information for offline access, ensuring you're never lost even without an internet connection.",
    },
    {
      title: "Hotel & Restaurant Discovery",
      description: "Find the best places to stay and dine with our curated recommendations and user reviews.",
    },
    {
      title: "Real-time Navigation",
      description:
        "Get turn-by-turn directions and real-time traffic updates to navigate efficiently to your destinations.",
    },
    {
      title: "Travel Packages",
      description: "Browse and book pre-designed travel packages with exclusive discounts and benefits.",
    },
  ]

  return (
    <motion.div
      className="container py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="mb-12">
        <motion.h1
          className="text-4xl font-bold mb-4 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          About NavTrail
        </motion.h1>
        <motion.p
          className="text-xl text-muted-foreground text-center max-w-3xl mx-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your AI-powered navigation and trip-planning companion for seamless travel experiences.
        </motion.p>
      </section>

      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              At NavTrail, we're on a mission to transform the way people explore the world. We believe that travel
              should be accessible, enjoyable, and stress-free for everyone.
            </p>
            <p className="text-muted-foreground mb-4">
              Our platform combines cutting-edge AI technology with user-friendly design to create a comprehensive
              travel companion that helps you plan, navigate, and discover with ease.
            </p>
            <p className="text-muted-foreground">
              Whether you're a seasoned traveler or planning your first adventure, NavTrail provides the tools and
              information you need to make the most of your journey.
            </p>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <img
              src="/placeholder.svg?height=400&width=500"
              alt="NavTrail App"
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      <section className="mb-12">
        <motion.h2
          className="text-3xl font-bold mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Key Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-card p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <motion.h2
          className="text-3xl font-bold mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Our Team
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="bg-card p-6 rounded-lg shadow-sm text-center"
            >
              <img
                src={member.avatar || "/placeholder.svg"}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-primary mb-2">{member.role}</p>
              <p className="text-muted-foreground mb-4">{member.bio}</p>
              <div className="flex justify-center space-x-4">
                <a href={member.social.twitter} className="text-muted-foreground hover:text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href={member.social.linkedin} className="text-muted-foreground hover:text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a href={member.social.github} className="text-muted-foreground hover:text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <motion.h2
          className="text-3xl font-bold mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          Contact Us
        </motion.h2>
        <motion.div
          className="max-w-2xl mx-auto bg-card p-8 rounded-lg shadow-sm"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <p className="text-center mb-6">Have questions or feedback? We'd love to hear from you!</p>
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>contact@navtrail.in</span>
            </div>
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>123 Tech Park, Bengaluru, Karnataka, India</span>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  )
}

