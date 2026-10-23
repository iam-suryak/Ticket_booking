import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowUpRight, Compass, Star } from 'lucide-react';

export const DestinationCard = ({ destination }) => {
  return (
    <Link
      to={`/destinations?search=${encodeURIComponent(destination.name)}`}
      className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-end aspect-[4/5] sm:aspect-[3/4]"
    >
      {/* Background Image with Zoom */}
      <img
        src={destination.image}
        alt={destination.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        loading="lazy"
      />

      {/* Multi-step Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20 group-hover:via-slate-950/50 transition-colors" />

      {/* Top Details: Continent & Packages Count */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
          {destination.continent}
        </span>

        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/90 backdrop-blur-md text-white shadow-sm">
          {destination.packagesCount} {destination.packagesCount === 1 ? 'Package' : 'Packages'}
        </span>
      </div>

      {/* Bottom Content */}
      <div className="relative p-5 sm:p-6 text-white transform transition-transform duration-300">
        <div className="flex items-center gap-1.5 text-xs text-sky-300 font-semibold uppercase tracking-wider mb-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{destination.country}</span>
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-white flex items-center justify-between group-hover:text-sky-300 transition-colors">
          <span>{destination.name}</span>
          <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-sky-500 flex items-center justify-center transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </h3>

        <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
          {destination.tagline}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {destination.popularTags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-sm text-slate-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};
