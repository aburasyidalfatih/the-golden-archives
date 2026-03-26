import React from 'react';
import { PosterConcept } from '../types';

interface ConceptCardProps {
  concept: PosterConcept;
}

const ConceptCard: React.FC<ConceptCardProps> = ({ concept }) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto my-8">
      
      {/* The Paper Container - Clean, Straight, High Contrast */}
      <div className="relative bg-parchment-100 text-ink-900 shadow-paper rounded-sm overflow-hidden border border-parchment-400">
        
        {/* Subtle texture only */}
        <div className="absolute inset-0 bg-paper-texture opacity-30 pointer-events-none"></div>
        
        {/* Content Area */}
        <div className="relative p-8 md:p-12">
          
          {/* Top Stamp - Americanized */}
          <div className="flex justify-between items-start mb-8 border-b border-ink-800/10 pb-6">
             <div>
                <span className="font-accent text-ink-500 text-xs tracking-[0.2em] font-bold block mb-2">
                   U.S. DEPT. OF ARCHIVES - FILE #{Math.floor(Math.random() * 10000)}
                </span>
                <span className="inline-block bg-ink-800 text-parchment-100 text-[10px] px-2 py-1 font-accent tracking-widest uppercase">
                  Declassified / Public Domain
                </span>
             </div>
             
             <div className="hidden md:block opacity-80">
                 <div className="border border-ink-red text-ink-red px-3 py-1 font-accent text-xs font-bold uppercase tracking-widest rotate-[-10deg]">
                    Federal Records
                 </div>
             </div>
          </div>

          {/* HEADER: Clean Editorial Style */}
          <div className="mb-10">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-ink-900 leading-tight mb-4">
              {concept.title}
            </h2>
            <p className="text-xl md:text-2xl text-ink-600 font-display italic leading-relaxed">
              {concept.tagline}
            </p>
          </div>

          {/* CONTENT: Two Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Left Column (2/3): Key Findings */}
            <div className="md:col-span-2 space-y-6">
               <h3 className="font-accent font-bold text-ink-900 text-sm uppercase tracking-widest border-b border-ink-900 pb-2 mb-4">
                 {concept.infographicTitle}
               </h3>
               
               <ul className="space-y-6">
                {concept.infographicPoints.map((point, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <span className="font-display font-bold text-2xl text-ink-red leading-none mt-1">{idx + 1}.</span>
                    <span className="font-body text-lg text-ink-800 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column (1/3): Visual Notes */}
            <div className="bg-parchment-200/50 p-6 rounded border border-ink-800/5">
               <h4 className="font-accent font-bold text-ink-600 text-xs uppercase tracking-widest mb-4">Curator's Notes</h4>
               <p className="font-body text-ink-700 italic leading-relaxed mb-6 text-sm">
                 "{concept.visualPrompt}"
               </p>

               <div className="space-y-3">
                 <h4 className="font-accent font-bold text-ink-600 text-xs uppercase tracking-widest">Period Colors</h4>
                 <div className="flex gap-2 flex-wrap">
                    {concept.colorPalette.map((color, idx) => (
                      <div key={idx} className="group relative">
                        <div className="w-8 h-8 rounded-full border border-ink-900/10 shadow-sm transition-transform hover:scale-110" style={{ backgroundColor: color }}></div>
                      </div>
                    ))}
                 </div>
               </div>
            </div>

          </div>

          {/* Footer / Caption */}
          <div className="mt-12 pt-6 border-t border-ink-800/10 bg-parchment-200/30 -mx-8 -mb-12 p-8 md:-mx-12 md:-mb-12 md:p-12">
             <div className="max-w-3xl mx-auto">
               <span className="font-accent font-bold text-ink-500 text-xs uppercase tracking-widest block mb-2 text-center">Library of Congress - Catalog Entry</span>
               <p className="font-body text-base text-ink-800 text-center leading-relaxed">
                 {concept.socialCaption}
               </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ConceptCard;