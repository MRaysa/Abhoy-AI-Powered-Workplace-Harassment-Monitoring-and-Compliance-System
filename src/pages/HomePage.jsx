import React, { useState, useEffect, useRef } from 'react';
import { Shield, Lock, FileText, Scale, MessageCircle, Users, ChevronRight, Check, Menu, X } from 'lucide-react';

const HomePage = () => {

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }

    let waveOffset = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Animated wave layers
      waveOffset += 0.01;
      
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        
        for (let x = 0; x < canvas.width; x++) {
          const y = Math.sin(x * 0.01 + waveOffset + i) * 30 + 
                    Math.sin(x * 0.02 + waveOffset * 1.5 + i) * 20 + 
                    canvas.height / 2 + i * 100;
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        const opacity = 0.03 - i * 0.01;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections between nearby particles
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsSection = document.getElementById('stats-section');
    if (statsSection) observer.observe(statsSection);

    return () => observer.disconnect();
  }, []);

  const handleNewsletterSubmit = () => {
    if (email && email.includes('@')) {
      alert(`Thank you for joining our mission! We'll contact ${email} soon.`);
      setEmail('');
    } else {
      alert('Please enter a valid email address.');
    }
  };

  const features = [
    {
      icon: <Lock className="w-12 h-12" />,
      title: 'Anonymous Complaint System',
      description: 'Report without fear – unique ID tracking ensures your identity remains completely confidential throughout the process.'
    },
    {
      icon: <FileText className="w-12 h-12" />,
      title: 'Evidence-Based Verification',
      description: 'Strengthen your voice with supporting proof or validation from 5+ witnesses to build a credible case.'
    },
    {
      icon: <Scale className="w-12 h-12" />,
      title: 'Law Guidance & Awareness',
      description: 'Instant legal insights tailored to your country\'s harassment laws, empowering informed decisions.'
    },
    {
      icon: <MessageCircle className="w-12 h-12" />,
      title: 'Lawyer Consultation Panel',
      description: 'Connect anonymously with verified legal experts via secure, encrypted chat for personalized guidance.'
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Public Harassment Forum',
      description: 'Build community support through moderated, anonymous stories and find solidarity with others.'
    }
  ];

  const steps = [
    { title: 'Submit Anonymously', icon: <FileText />, description: 'Fill out a secure form with your incident details' },
    { title: 'Verify with Evidence', icon: <Shield />, description: 'Upload supporting documents or gather witness validation' },
    { title: 'Get Guidance & Support', icon: <MessageCircle />, description: 'Access legal resources and expert consultation' },
    { title: 'Join the Forum', icon: <Users />, description: 'Share your story and connect with the community' }
  ];

  const stats = [
    { value: '10,000+', label: 'Safe Reports Filed' },
    { value: '100%', label: 'Anonymity Guaranteed' },
    { value: '50+', label: 'Legal Experts' },
    { value: '4.8/5', label: 'User Rating' }
  ];

  const testimonials = [
    {
      quote: 'SafeReport gave me the courage to speak up - anonymously and effectively. I finally felt heard without fear.',
      author: 'Anonymous User',
      role: 'University Student',
      rating: 5
    },
    {
      quote: 'The legal guidance feature helped me understand my rights. This platform is a lifeline for survivors.',
      author: 'Anonymous User',
      role: 'Corporate Employee',
      rating: 5
    },
    {
      quote: 'Being able to verify my report with evidence made all the difference. SafeReport restored my voice.',
      author: 'Anonymous User',
      role: 'Healthcare Worker',
      rating: 5
    }
  ];

  return (
    <>

    <div className={darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}>
      {/* Hero Section */}
      <section>
        <div className="relative w-full h-screen overflow-hidden">
          {/* Static gradient base */}
          <div className="absolute inset-0 bg-gradient-to-br  from-[#617C88]  to-[#F8F8F6]"></div>
        
          {/* Animated canvas overlay */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ opacity: 0.9 }}
          />
        
          {/* Content area */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-[#0B2B37]">
              <h1 className="text-6xl font-bold mb-4 drop-shadow-lg">Break the Silence Safely - Report Harassment Anonymously</h1>
              <p className="text-xl opacity-90">Empower yourself and others. Secure, verified, and supported reporting for workplaces and universities.
              </p>
            </div>
          </div>
        </div>
      </section>
        {/* Feature Section */}
        <section id="features" className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose SafeReport?</h2>
              <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Our Core Safeguards for Your Protection</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl shadow-lg transition transform hover:scale-105 hover:shadow-2xl ${
                    darkMode ? 'bg-gray-800' : 'bg-gray-50'
                  }`}
                >
                  <div className="text-[#0B2B37] mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
              {/* How It Works Section */}
        <section id="how-it-works" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
              <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Four Simple Steps to Empowerment</p>
            </div>
            <div className="hidden md:flex justify-between items-start space-x-4">
              {steps.map((step, index) => (
                <div key={index} className="flex-1 text-center">
                  <div className={`w-20 h-20 rounded-full ${darkMode ? 'bg-[#0B2B37]' : 'bg-[#0B2B37]'} text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold`}>
                    {index + 1}
                  </div>
                  <div className="text-[#0B2B37] mb-4 flex justify-center">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{step.description}</p>
                </div>
              ))}
            </div>
            <div className="md:hidden space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-16 h-16 rounded-full ${darkMode ? 'bg-[#0B2B37]' : 'bg-[#0B2B37]'} text-white flex items-center justify-center flex-shrink-0 text-xl font-bold`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-[#0B2B37] mb-2">{step.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <p className="text-xl font-semibold mb-6">Ready to Take the First Step?</p>
              <button className="bg-[#0B2B37] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#0B2B37] transition transform hover:scale-105 shadow-lg">
                Begin Your Report
              </button>
            </div>
          </div>
        </section>
        {/* Trust & Impact Section */}
        <section id="impact" className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Impact</h2>
              <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Making a Difference Together</p>
            </div>
            <div id="stats-section" className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className={`text-4xl sm:text-5xl font-bold text-[#0B2B37] mb-2 ${statsVisible ? 'animate-pulse' : ''}`}>
                    {stat.value}
                  </div>
                  <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-center mb-8">What Users Say</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                    <p className={`mb-4 italic ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>"{testimonial.quote}"</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#0B2B37] flex items-center justify-center text-white font-bold">
                        {testimonial.author[0]}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <div className={`px-6 py-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center space-x-2`}>
                <Check className="text-green-500" />
                <span className="font-semibold">GDPR Compliant</span>
              </div>
              <div className={`px-6 py-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center space-x-2`}>
                <Check className="text-green-500" />
                <span className="font-semibold">256-bit Encryption</span>
              </div>
              <div className={`px-6 py-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center space-x-2`}>
                <Check className="text-green-500" />
                <span className="font-semibold">ISO 27001 Certified</span>
              </div>
            </div>
          </div>
        </section>
        {/* About/CTA Section */}
        <section id="contact" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">Join Our Mission</h2>
                <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  SafeReport is built to end harassment cycles through technology and empathy. We believe every voice deserves to be heard safely and every survivor deserves support without fear of retaliation.
                </p>
                <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Our platform combines cutting-edge security with human-centered design to create a space where reporting harassment is not only safe but empowering. Together, we can build workplaces and campuses free from harassment.
                </p>
                <div className="flex items-center space-x-4">
                  <Shield className="w-16 h-16 text-[#0B2B37]" />
                  <div>
                    <div className="font-semibold text-lg">100% Anonymous</div>
                    <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Your identity is never revealed</div>
                  </div>
                </div>
              </div>
              <div className={`p-8 rounded-xl shadow-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
                <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Subscribe to our newsletter for updates, resources, and stories of hope.
                </p>
                <div className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-[#0B2B37]`}
                  />
                  <button
                    onClick={handleNewsletterSubmit}
                    className="w-full bg-[#0B2B37] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0B2B37] transition transform hover:scale-105"
                  >
                    Join Our Mission
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>
      </>
  );
};

export default HomePage;
