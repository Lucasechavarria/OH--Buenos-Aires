"use client";

import React from "react";

export const InstagramIcon = ({ className }: { className?: string }) => (
  <div className={`relative group/insta ${className}`} style={{ width: '1em', height: '1em' }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full transition-opacity duration-300 group-hover/insta:opacity-0">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.51"/>
    </svg>
    
    {/* Liquid Fill Version */}
    <div className="absolute inset-0 opacity-0 group-hover/insta:opacity-100 transition-opacity duration-500 overflow-hidden rounded-[25%]">
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <defs>
          <linearGradient id="insta-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#f09433' }} />
            <stop offset="25%" style={{ stopColor: '#e6683c' }} />
            <stop offset="50%" style={{ stopColor: '#dc2743' }} />
            <stop offset="75%" style={{ stopColor: '#cc2366' }} />
            <stop offset="100%" style={{ stopColor: '#bc1888' }} />
          </linearGradient>
          <clipPath id="insta-shape">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </clipPath>
        </defs>
        
        {/* Fill Area with Liquid Animation */}
        <g clipPath="url(#insta-shape)">
          <rect width="100%" height="100%" fill="url(#insta-gradient)" className="translate-y-full group-hover/insta:translate-y-0 transition-transform duration-1000 ease-out" />
          
          {/* Animated Wave */}
          <path 
            d="M0 20 C 5 15, 10 15, 15 20 C 20 25, 25 25, 30 20 L 30 30 L 0 30 Z" 
            fill="url(#insta-gradient)" 
            className="animate-insta-wave translate-y-full group-hover/insta:-translate-y-1 transition-transform duration-700 delay-100"
            style={{ width: '200%', transform: 'scale(2)' }}
          />
        </g>
      </svg>
    </div>

    <style jsx>{`
      @keyframes insta-wave {
        0% { transform: translateX(0) translateY(100%); }
        50% { transform: translateX(-25%) translateY(10%); }
        100% { transform: translateX(-50%) translateY(0%); }
      }
      .animate-insta-wave {
        animation: insta-wave 2s infinite linear;
        display: none;
      }
      .group-hover\/insta .animate-insta-wave,
      .animate-insta-active .animate-insta-wave {
        display: block;
      }

      /* Mobile Auto-Animation Cycle */
      @media (hover: none) {
        .group-hover\/insta .translate-y-full,
        .animate-insta-active .translate-y-full {
          animation: mobile-insta-fill 8s infinite ease-in-out;
        }
        .group-hover\/insta .animate-insta-wave,
        .animate-insta-active .animate-insta-wave {
          animation: insta-wave 2s infinite linear, mobile-insta-wave-opacity 8s infinite ease-in-out;
        }
      }

      @keyframes mobile-insta-fill {
        0%, 10%, 90%, 100% { transform: translateY(100%); }
        30%, 70% { transform: translateY(0%); }
      }

      @keyframes mobile-insta-wave-opacity {
        0%, 15%, 85%, 100% { opacity: 0; display: none; }
        30%, 70% { opacity: 1; display: block; }
      }
    `}</style>
  </div>
);

export const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
