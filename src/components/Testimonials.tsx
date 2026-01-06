import React from 'react'

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Project Manager",
      company: "Tech Solutions Ltd",
      content: "Obed delivered exceptional work on our web application. His attention to detail and problem-solving skills are outstanding.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Startup Founder",
      company: "InnovateLab",
      content: "Working with Obed was a game-changer for our project. He understood our vision and brought it to life perfectly.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "CTO",
      company: "Digital Dynamics",
      content: "Obed's technical expertise and communication skills make him an ideal developer for any project. Highly recommended!",
      rating: 5
    }
  ]

  return (
    <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700">
      <h3 className="text-xl font-medium text-slate-200 mb-6">Client Testimonials</h3>
      
      <div className="space-y-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="border border-slate-600 rounded-lg p-6">
            <div className="flex items-center mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            
            <p className="text-slate-300 mb-4 italic">"{testimonial.content}"</p>
            
            <div className="text-sm">
              <div className="font-medium text-slate-200">{testimonial.name}</div>
              <div className="text-slate-400">{testimonial.role} at {testimonial.company}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonials