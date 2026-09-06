import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { NEWSLETTER_IMAGE } from '../data/furnitureData';

interface NewsletterSectionProps {
  onSubscribe: (email: string) => void;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    onSubscribe(email);
    setIsSubmitted(true);
    setTimeout(() => {
      setEmail('');
    }, 3000);
  };

  return (
    <section id="newsletter" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative bg-[#EFE9DF] border border-stone-300/60 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs sm:shadow-sm p-5 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center relative z-10">
          {/* Left Column: Icon + Text */}
          <div className="lg:col-span-6 flex items-center sm:items-start gap-3.5 sm:gap-5">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#C08251] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Mail className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                Stay Updated
              </h3>
              <p className="text-stone-600 text-xs sm:text-base font-normal mt-0.5 sm:mt-1 leading-relaxed max-w-md">
                Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
              </p>
            </div>
          </div>

          {/* Center Column: Subscription Form */}
          <div className="lg:col-span-4">
            {isSubmitted ? (
              <div className="bg-white/90 border border-green-200 rounded-full px-4 sm:px-5 py-2.5 sm:py-3.5 flex items-center gap-2.5 sm:gap-3 text-stone-800 shadow-xs sm:shadow-sm animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Thank you! Check your inbox for 15% off.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  id="newsletter-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-white text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm rounded-full pl-4 sm:pl-5 pr-28 sm:pr-36 py-3 sm:py-3.5 border border-stone-300/80 focus:outline-none focus:ring-2 focus:ring-[#C08251]/40 shadow-inner"
                />
                <button
                  id="newsletter-submit-btn"
                  type="submit"
                  className="absolute right-1 sm:right-1.5 inline-flex items-center gap-1 sm:gap-1.5 bg-[#C08251] hover:bg-[#a96d3e] text-white font-semibold text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all shadow-xs sm:shadow-sm cursor-pointer"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Decorative Armchair Cutout */}
          <div className="hidden lg:block lg:col-span-2 relative h-36">
            <div className="absolute -right-4 -bottom-12 w-48 h-48 pointer-events-none">
              <img
                src={NEWSLETTER_IMAGE}
                alt="Decorative Designer Armchair"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
