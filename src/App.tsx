import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { 
  Phone, 
  Calendar, 
  Clock, 
  User, 
  MessageSquare, 
  Scissors, 
  MapPin, 
  Instagram, 
  Facebook, 
  Menu, 
  X,
  ChevronRight,
  CheckCircle2,
  Lock,
  Download,
  Filter,
  LogOut,
  Star,
  ArrowUp,
  Plus,
  Minus,
  ChevronDown,
  Award,
  Sparkles,
  Heart,
  Image as ImageIcon,
  Tag,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  LayoutDashboard,
  Settings,
  Percent
} from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { cn } from './lib/utils';
import { format } from 'date-fns';
import { Toaster, toast } from 'react-hot-toast';

// --- Constants ---
const SALON_PHONE = "9167676133";
const SALON_ADDRESS = "Shop No. 7, White Rose Bldg., Near RTO & LIC Office, Louiswadi, Eastern Express Highway, Thane (W) 400604";

const FALLBACK_SERVICES = [
  { name: "Haircut & Styling", price: "₹500+", icon: Scissors, desc: "Precision cuts tailored to your face shape and style." },
  { name: "Hair Coloring", price: "₹1500+", icon: Sparkles, desc: "Vibrant shades and professional techniques for a stunning look." },
  { name: "Facial & Skincare", price: "₹1200+", icon: Heart, desc: "Rejuvenating treatments for glowing, healthy skin." },
  { name: "Manicure & Pedicure", price: "₹800+", icon: Award, desc: "Pamper your hands and feet with our premium spa services." }
];

const FALLBACK_GALLERY = [
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800"
];

const FALLBACK_FAQS = [
  { q: "What are your opening hours?", a: "We are open from 10:00 AM to 9:00 PM, Tuesday to Sunday. We are closed on Mondays." },
  { q: "Do I need to book in advance?", a: "While we accept walk-ins, we highly recommend booking in advance to ensure your preferred slot." },
  { q: "Do you offer home services?", a: "Currently, we only offer services at our studio in Thane to ensure the highest quality experience." },
  { q: "What products do you use?", a: "We use only premium, professional-grade products from brands like L'Oréal, Schwarzkopf, and O3+." }
];

const FALLBACK_TESTIMONIALS = [
  { name: "Priya Sharma", role: "Regular Client", text: "The best salon in Thane! The staff is professional and the ambiance is truly luxury.", rating: 5 },
  { name: "Rahul Mehta", role: "Business Owner", text: "Excellent beard grooming and haircut. Highly recommend for men who want a sharp look.", rating: 5 },
  { name: "Anjali Gupta", role: "Fashion Blogger", text: "Their bridal makeup is out of this world. I felt like a queen on my wedding day!", rating: 5 }
];

const ICON_MAP: Record<string, any> = {
  Scissors, Sparkles, Heart, Award, Star, ScissorsIcon: Scissors
};

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdmin) return null;

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Offers', href: '#offers' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Find Us', href: '#find-us' }
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500",
      scrolled ? "glass-nav py-4" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex flex-col items-center group">
            <span className="text-2xl font-serif font-bold tracking-[0.2em] text-gold group-hover:scale-105 transition-transform">GLOWUP</span>
            <span className="text-[8px] tracking-[0.4em] text-gold/60 uppercase">Unisex Salon</span>
          </Link>
          
          <div className="hidden md:flex space-x-10 items-center">
            {navLinks.map(link => (
              <a 
                key={link.name}
                href={link.href} 
                className="text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-gold transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <a href="#book" className="luxury-button">Book Now</a>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-gold p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-12 flex flex-col space-y-8 text-center">
              {navLinks.map(link => (
                <a 
                  key={link.name}
                  href={link.href} 
                  onClick={() => setIsOpen(false)} 
                  className="text-lg uppercase tracking-[0.3em] text-white/80 hover:text-gold transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a href="#book" onClick={() => setIsOpen(false)} className="luxury-button inline-block mx-auto">Book Now</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1920" 
          className="w-full h-full object-cover scale-110"
          alt="Salon Interior"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block text-gold tracking-[0.6em] uppercase text-xs mb-6 border-b border-gold/30 pb-2">
            Thane's Premier Luxury Studio
          </span>
          <h1 className="text-5xl md:text-8xl font-serif mb-8 leading-tight">
            Elevate Your <br /> 
            <span className="gold-gradient-text italic font-normal">Natural Radiance</span>
          </h1>
          <p className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto mb-12 tracking-wide font-light">
            Experience world-class grooming and rejuvenation in an atmosphere of pure luxury. 
            Where every detail is crafted for your elegance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#book" className="luxury-button min-w-[200px]">
              Reserve Your Slot
            </a>
            <a href="#services" className="text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-gold transition-colors flex items-center gap-2 group">
              Explore Services <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold/30"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold/50 to-transparent mx-auto" />
      </motion.div>
    </section>
  );
};

const AppointmentForm = ({ services }: { services: any[] }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .insert([{
          name: formData.name,
          phone: formData.phone,
          service: formData.service,
          appointment_date: formData.date,
          appointment_time: formData.time,
          notes: formData.notes
        }]);

      if (error) throw error;

      toast.success("Appointment booked successfully!");

      const message = `Hi GlowUp, I want to book an appointment.
Name: ${formData.name}
Phone: ${formData.phone}
Service: ${formData.service}
Date: ${formData.date}
Time: ${formData.time}
Notes: ${formData.notes || 'N/A'}`;

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${SALON_PHONE}?text=${encodedMessage}`, '_blank');

      setFormData({ name: '', phone: '', service: '', date: '', time: '', notes: '' });
    } catch (error: any) {
      toast.error(error.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="book" className="py-32 bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-serif mb-6">Reserve Your Experience</h2>
            <p className="text-gold/60 uppercase tracking-[0.4em] text-xs">Personalized care awaits you</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-16 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold/80 font-medium">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 group-focus-within:text-gold transition-colors" />
                <input 
                  required
                  type="text" 
                  placeholder="Enter your name"
                  className="luxury-input pl-12"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold/80 font-medium">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 group-focus-within:text-gold transition-colors" />
                <input 
                  required
                  type="tel" 
                  placeholder="10-digit mobile number"
                  className="luxury-input pl-12"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold/80 font-medium">Desired Service</label>
              <div className="relative group">
                <Scissors className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 group-focus-within:text-gold transition-colors" />
                <select 
                  required
                  className="luxury-input pl-12 appearance-none cursor-pointer"
                  value={formData.service}
                  onChange={e => setFormData({...formData, service: e.target.value})}
                >
                  <option value="" className="bg-zinc-900">Select a service</option>
                  {services.map(s => <option key={s.id || s.name} value={s.name} className="bg-zinc-900">{s.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gold/80 font-medium">Date</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 group-focus-within:text-gold transition-colors" />
                  <input 
                    required
                    type="date" 
                    className="luxury-input pl-12 [color-scheme:dark]"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gold/80 font-medium">Time</label>
                <div className="relative group">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 group-focus-within:text-gold transition-colors" />
                  <input 
                    required
                    type="time" 
                    className="luxury-input pl-12 [color-scheme:dark]"
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold/80 font-medium">Special Requests</label>
              <div className="relative group">
                <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-gold/40 group-focus-within:text-gold transition-colors" />
                <textarea 
                  rows={4}
                  placeholder="Tell us more about your preferences..."
                  className="luxury-input pl-12 resize-none"
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit" 
              className="md:col-span-2 luxury-button py-5 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Confirm Booking</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

const MapSection = () => (
  <section id="find-us" className="py-32 bg-black">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-serif">Visit Our Studio</h2>
            <p className="text-white/40 font-light tracking-widest uppercase text-xs">Experience the luxury in person</p>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 glass-card flex items-center justify-center shrink-0 group-hover:border-gold/50 transition-colors">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="text-gold uppercase tracking-widest text-[10px] mb-2">Location</h4>
                <p className="text-white/70 text-lg font-light leading-relaxed max-w-md">
                  {SALON_ADDRESS}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 glass-card flex items-center justify-center shrink-0 group-hover:border-gold/50 transition-colors">
                <Phone className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="text-gold uppercase tracking-widest text-[10px] mb-2">Contact</h4>
                <p className="text-white/70 text-lg font-light">+91 {SALON_PHONE}</p>
              </div>
            </div>
          </div>

          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SALON_ADDRESS)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="luxury-button inline-flex items-center gap-3"
          >
            <span>Get Directions</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="h-[500px] relative group"
        >
          <div className="absolute -inset-4 border border-gold/10 -z-10 group-hover:border-gold/30 transition-colors duration-700" />
          <div className="w-full h-full glass-card overflow-hidden p-2">
            <iframe 
              title="GlowUp Salon Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.876123456789!2d72.96!3d19.19!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b9!2sShop%20No.%207%2C%20White%20Rose%20Bldg.%2C%20Near%20RTO%20%26%20LIC%20Office%2C%20Louiswadi%2C%20Eastern%20Express%20Highway%2C%20Thane%20(W)%20400604!5e0!3m2!1sen!2sin!4v1234567890123" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              className="grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
            />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Services = ({ services }: { services: any[] }) => (
  <section id="services" className="py-32 bg-black relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-serif mb-6">Artistry in Every Detail</h2>
          <p className="text-gold/60 uppercase tracking-[0.4em] text-xs">Exquisite services for the discerning individual</p>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, idx) => {
          const Icon = ICON_MAP[service.icon] || Scissors;
          return (
            <motion.div 
              key={service.id || service.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group glass-card p-10 hover:border-gold/50 transition-all duration-700 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className="w-20 h-20" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 glass-card flex items-center justify-center mb-8 group-hover:bg-gold transition-all duration-500">
                  <Icon className="w-6 h-6 text-gold group-hover:text-black" />
                </div>
                <h3 className="text-2xl font-serif mb-4 group-hover:text-gold transition-colors">{service.name}</h3>
                <p className="text-white/40 text-sm font-light leading-relaxed mb-6">{service.description || service.desc}</p>
                <div className="text-gold font-mono text-sm tracking-widest">{service.price}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

const Pricing = ({ services }: { services: any[] }) => (
  <section id="pricing" className="py-32 bg-zinc-950">
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-24">
        <h2 className="text-4xl md:text-6xl font-serif mb-6">Service Menu</h2>
        <p className="text-gold/60 uppercase tracking-[0.4em] text-xs">Transparent luxury pricing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
        {services.map((s, idx) => (
          <motion.div 
            key={s.id || s.name}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end border-b border-white/10 pb-4 group hover:border-gold/30 transition-colors"
          >
            <div className="space-y-1">
              <h4 className="text-lg font-serif group-hover:text-gold transition-colors">{s.name}</h4>
              <p className="text-white/30 text-xs font-light tracking-wide">{(s.description || s.desc).split('.')[0]}.</p>
            </div>
            <div className="text-gold font-mono text-sm mb-1">{s.price}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Offers = ({ offers }: { offers: any[] }) => {
  if (!offers || offers.length === 0) return null;
  return (
    <section id="offers" className="py-32 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-serif mb-6">Exclusive Offers</h2>
          <p className="text-gold/60 uppercase tracking-[0.4em] text-xs">Limited time luxury deals</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, idx) => (
            <motion.div 
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4">
                <Percent className="w-12 h-12 text-gold/10 group-hover:text-gold/20 transition-colors" />
              </div>
              <h3 className="text-2xl font-serif mb-4 text-gold">{offer.title}</h3>
              <p className="text-white/50 text-sm font-light leading-relaxed mb-8">{offer.description}</p>
              <div className="flex items-center justify-between">
                <div className="bg-gold/10 border border-gold/20 px-4 py-2 rounded text-gold font-mono text-xs tracking-widest">
                  {offer.discount_code}
                </div>
                {offer.expiry_date && (
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">
                    Exp: {format(new Date(offer.expiry_date), 'MMM dd')}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Gallery = ({ gallery }: { gallery: any[] }) => (
  <section id="gallery" className="py-32 bg-zinc-950">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-24">
        <h2 className="text-4xl md:text-6xl font-serif mb-6">The Studio</h2>
        <p className="text-gold/60 uppercase tracking-[0.4em] text-xs">A glimpse into our world</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((img, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="aspect-[4/5] overflow-hidden glass-card p-2 group"
          >
            <div className="w-full h-full overflow-hidden relative">
              <img 
                src={typeof img === 'string' ? img : img.image_url} 
                alt="Gallery" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Testimonials = ({ reviews }: { reviews: any[] }) => {
  const displayReviews = reviews.length > 0 ? reviews : [
    { name: "Priya Sharma", role: "Regular Client", text: "The best salon in Thane! The staff is professional and the ambiance is truly luxury.", rating: 5 },
    { name: "Rahul Mehta", role: "Business Owner", text: "Excellent beard grooming and haircut. Highly recommend for men who want a sharp look.", rating: 5 },
    { name: "Anjali Gupta", role: "Fashion Blogger", text: "Their bridal makeup is out of this world. I felt like a queen on my wedding day!", rating: 5 }
  ];

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-serif mb-6">Voices of Elegance</h2>
          <p className="text-gold/60 uppercase tracking-[0.4em] text-xs">Stories from our cherished clients</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayReviews.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-10 relative"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-gold text-gold" />)}
              </div>
              <p className="text-white/70 text-lg font-light italic leading-relaxed mb-8">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-1 h-[1px] bg-gold/30" />
                <div>
                  <h5 className="text-sm font-serif">{t.name}</h5>
                  <p className="text-[10px] text-gold/50 uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="py-32 bg-black">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-serif mb-6">Common Inquiries</h2>
          <p className="text-gold/60 uppercase tracking-[0.4em] text-xs">Everything you need to know</p>
        </div>

        <div className="space-y-4">
          {FALLBACK_FAQS.map((faq, idx) => (
            <div key={idx} className="glass-card overflow-hidden">
              <button 
                onClick={() => setActive(active === idx ? null : idx)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-serif text-lg">{faq.q}</span>
                {active === idx ? <Minus className="w-4 h-4 text-gold" /> : <Plus className="w-4 h-4 text-gold" />}
              </button>
              <AnimatePresence>
                {active === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-white/50 font-light leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Admin Pages ---

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!res.ok) throw new Error('Invalid credentials');
      
      const { token } = await res.json();
      localStorage.setItem('admin_token', token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[100px] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 glass-card flex items-center justify-center mx-auto mb-6 border-gold/30">
            <Lock className="w-6 h-6 text-gold" />
          </div>
          <h1 className="text-3xl font-serif mb-2">Admin Portal</h1>
          <p className="text-white/40 text-[10px] uppercase tracking-widest">Authorized Access Only</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-[10px] uppercase tracking-widest text-gold/80 font-medium">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 group-focus-within:text-gold transition-colors" />
              <input 
                type="text" 
                className="luxury-input pl-12"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="block text-[10px] uppercase tracking-widest text-gold/80 font-medium">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 group-focus-within:text-gold transition-colors" />
              <input 
                type="password" 
                className="luxury-input pl-12"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <button type="submit" className="w-full luxury-button py-5">
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ service: '', status: '', date: '' });
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }

    try {
      const res = await fetch('/api/admin/appointments', {
        headers: { 'Authorization': `Basic ${token}` }
      });
      if (!res.ok) throw new Error('Session expired');
      const data = await res.json();
      setAppointments(data);
    } catch (err: any) {
      toast.error(err.message);
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success("Status updated");
      fetchAppointments();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Phone', 'Service', 'Date', 'Time', 'Status'];
    const rows = appointments.map(a => [
      a.name, a.phone, a.service, a.appointment_date, a.appointment_time, a.status
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const filtered = appointments.filter(a => {
    return (!filter.service || a.service === filter.service) &&
           (!filter.status || a.status === filter.status) &&
           (!filter.date || a.appointment_date === filter.date);
  });

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif">Management Console</h1>
            <p className="text-white/40 font-light tracking-widest uppercase text-[10px]">GlowUp Salon Appointments</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button onClick={exportCSV} className="flex items-center gap-3 glass-card px-6 py-3 text-xs uppercase tracking-widest hover:border-gold/50 transition-all">
              <Download className="w-4 h-4 text-gold" />
              <span>Export CSV</span>
            </button>
            <button 
              onClick={() => { localStorage.removeItem('admin_token'); navigate('/admin'); }}
              className="flex items-center gap-3 bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-3 text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 space-y-3">
            <label className="block text-[10px] uppercase tracking-widest text-gold/60 font-medium">Service Type</label>
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
              <select 
                className="luxury-input pl-12 py-3 text-sm appearance-none"
                value={filter.service}
                onChange={e => setFilter({...filter, service: e.target.value})}
              >
                <option value="" className="bg-zinc-900">All Services</option>
                {SERVICES.map(s => <option key={s.name} value={s.name} className="bg-zinc-900">{s.name}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 pointer-events-none" />
            </div>
          </div>
          <div className="glass-card p-6 space-y-3">
            <label className="block text-[10px] uppercase tracking-widest text-gold/60 font-medium">Booking Status</label>
            <div className="relative group">
              <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
              <select 
                className="luxury-input pl-12 py-3 text-sm appearance-none"
                value={filter.status}
                onChange={e => setFilter({...filter, status: e.target.value})}
              >
                <option value="" className="bg-zinc-900">All Status</option>
                <option value="Pending" className="bg-zinc-900">Pending</option>
                <option value="Confirmed" className="bg-zinc-900">Confirmed</option>
                <option value="Completed" className="bg-zinc-900">Completed</option>
                <option value="Cancelled" className="bg-zinc-900">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 pointer-events-none" />
            </div>
          </div>
          <div className="glass-card p-6 space-y-3">
            <label className="block text-[10px] uppercase tracking-widest text-gold/60 font-medium">Appointment Date</label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
              <input 
                type="date"
                className="luxury-input pl-12 py-3 text-sm [color-scheme:dark]"
                value={filter.date}
                onChange={e => setFilter({...filter, date: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-6 text-[10px] uppercase tracking-widest text-gold font-semibold">Schedule</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest text-gold font-semibold">Client Details</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest text-gold font-semibold">Service</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest text-gold font-semibold">Status</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest text-gold font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((a, idx) => (
                  <motion.tr 
                    key={a.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-6">
                      <div className="font-serif text-lg">{format(new Date(a.appointment_date), 'MMM dd, yyyy')}</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{a.appointment_time}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-medium text-white/90">{a.name}</div>
                      <div className="text-xs text-gold/60 font-mono mt-1">{a.phone}</div>
                    </td>
                    <td className="p-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/5 border border-gold/20 rounded-full">
                        <Scissors className="w-3 h-3 text-gold" />
                        <span className="text-[10px] uppercase tracking-widest text-gold">{a.service}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={cn(
                        "text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border font-medium",
                        a.status === 'Pending' && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                        a.status === 'Confirmed' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                        a.status === 'Completed' && "bg-green-500/10 text-green-500 border-green-500/20",
                        a.status === 'Cancelled' && "bg-red-500/10 text-red-500 border-red-500/20"
                      )}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="relative group/select">
                        <select 
                          className="bg-black/50 border border-white/10 text-[10px] uppercase tracking-widest p-2 pr-8 outline-none focus:border-gold transition-all appearance-none cursor-pointer"
                          value={a.status}
                          onChange={e => updateStatus(a.id, e.target.value)}
                        >
                          <option value="Pending" className="bg-zinc-900">Pending</option>
                          <option value="Confirmed" className="bg-zinc-900">Confirmed</option>
                          <option value="Completed" className="bg-zinc-900">Completed</option>
                          <option value="Cancelled" className="bg-zinc-900">Cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40 pointer-events-none" />
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 glass-card flex items-center justify-center opacity-20">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <p className="text-white/20 uppercase tracking-[0.3em] text-xs">No records found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const WhatsAppFloating = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
      <AnimatePresence>
        {showBackToTop && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-14 h-14 glass-card flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all duration-500 shadow-2xl rounded-full"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
      <a 
        href={`https://wa.me/${SALON_PHONE}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] flex items-center justify-center rounded-full shadow-2xl hover:scale-110 transition-transform"
      >
        <svg className="w-7 h-7 text-white fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
};

const HomePage = () => {
  const [data, setData] = useState({
    services: [],
    offers: [],
    gallery: [],
    reviews: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const [s, o, g, r] = await Promise.all([
        supabase.from('services').select('*').eq('is_active', true),
        supabase.from('offers').select('*').eq('is_active', true),
        supabase.from('gallery').select('*'),
        supabase.from('reviews').select('*')
      ]);
      
      setData({
        services: s.data?.length ? s.data : FALLBACK_SERVICES,
        offers: o.data || [],
        gallery: g.data?.length ? g.data : FALLBACK_GALLERY,
        reviews: r.data || []
      });
    };
    fetchData();
  }, []);

  return (
    <main>
      <Hero />
      <Services services={data.services} />
      <Pricing services={data.services} />
      <Offers offers={data.offers} />
      <Gallery gallery={data.gallery} />
      <AppointmentForm services={data.services} />
      <Testimonials reviews={data.reviews} />
      <FAQ />
      <MapSection />
      <footer className="py-20 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <Link to="/" className="flex flex-col items-start group">
                <span className="text-3xl font-serif font-bold tracking-[0.2em] text-gold">GLOWUP</span>
                <span className="text-[10px] tracking-[0.4em] text-gold/60 uppercase">Unisex Salon</span>
              </Link>
              <p className="text-white/40 font-light leading-relaxed max-w-sm">
                Dedicated to the art of luxury grooming. We combine traditional techniques with modern style to create your perfect look.
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Star].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 glass-card flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/50 transition-all">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="text-gold uppercase tracking-widest text-[10px] mb-8">Quick Links</h5>
              <ul className="space-y-4">
                {['Services', 'Offers', 'Gallery', 'Find Us'].map(l => (
                  <li key={l}>
                    <a href={`#${l.toLowerCase().replace(' ', '-')}`} className="text-white/40 hover:text-gold text-sm transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-gold uppercase tracking-widest text-[10px] mb-8">Hours</h5>
              <ul className="space-y-4 text-sm text-white/40 font-light">
                <li className="flex justify-between"><span>Tue - Sun</span> <span>10am - 9pm</span></li>
                <li className="flex justify-between text-gold/40"><span>Mon</span> <span>Closed</span></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/20 text-[10px] uppercase tracking-widest">
              &copy; {new Date().getFullYear()} GlowUp Unisex Salon. All Rights Reserved.
            </p>
            <p className="text-white/20 text-[10px] uppercase tracking-widest flex items-center gap-2">
              Crafted with <Heart className="w-3 h-3 text-gold/40" /> for Elegance
            </p>
          </div>
        </div>
      </footer>
      <WhatsAppFloating />
    </main>
  );
};

export default function App() {
  return (
    <Router>
      <div className="font-sans">
        <Toaster position="top-center" toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }
        }} />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
