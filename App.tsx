import React, { useState, useEffect } from 'react';
import { AppState, PosterConcept } from './types';
import * as GeminiService from './services/geminiService';
import Button from './components/Button';
import ConceptCard from './components/ConceptCard';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [concept, setConcept] = useState<PosterConcept | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  // API Key State
  const [hasApiKey, setHasApiKey] = useState(false);
  const [checkingKey, setCheckingKey] = useState(true);

  // PWA & Notification State
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // Initialize App
  useEffect(() => {
    // PWA Prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Check API Key
    const checkApiKey = async () => {
      try {
        if (window.aistudio) {
          const hasSelected = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(hasSelected);
        } else {
          setHasApiKey(true);
        }
      } catch (e) {
        console.error("Error checking API key:", e);
      } finally {
        setCheckingKey(false);
      }
    };
    checkApiKey();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setHasApiKey(true);
        setErrorMsg(null);
      } catch (e) {
        console.error("Error selecting key:", e);
        setErrorMsg("Access Denied: Key selection failed.");
      }
    }
  };

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        setShowInstallBtn(false);
      }
      setInstallPrompt(null);
    });
  };

  const sendNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: 'https://cdn-icons-png.flaticon.com/512/2534/2534204.png'
        });
      } catch (e) {
        console.log('Notification error', e);
      }
    }
  };

  const handleGenerateConcept = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    setAppState(AppState.GENERATING_CONCEPT);
    setErrorMsg(null);
    setConcept(null);
    setImageUrl(null);
    
    try {
      const result = await GeminiService.generatePosterConcept();
      setConcept(result);
      setAppState(AppState.REVIEW_CONCEPT);
    } catch (err: any) {
      console.error(err);
      
      if (err.message && (err.message.includes("403") || err.message.includes("Permission denied"))) {
        setErrorMsg("Access Denied: The archives require a valid Paid API Key.");
        setHasApiKey(false); 
        setAppState(AppState.IDLE);
        return;
      }

      setErrorMsg(err.message || "Connection lost to the archives.");
      setAppState(AppState.ERROR);
    }
  };

  const handleGenerateImage = async () => {
    if (!concept) return;
    
    setAppState(AppState.GENERATING_IMAGE);
    setErrorMsg(null);

    try {
      const base64Image = await GeminiService.generatePosterImage(concept);
      setImageUrl(base64Image);
      
      // Save History
      try {
        const historyKey = 'golden_history'; // Updated Key
        const rawHistory = localStorage.getItem(historyKey);
        const history = rawHistory ? JSON.parse(rawHistory) : [];
        const newEntry = {
          title: concept.title,
          tagline: concept.tagline,
          timestamp: Date.now()
        };
        const updatedHistory = [newEntry, ...history].slice(0, 20);
        localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
      } catch (e) {
        console.warn("Could not record discovery in history ledger", e);
      }

      setAppState(AppState.FINISHED);
      sendNotification("Discovery Complete", "The document has been fully restored.");
      
    } catch (err: any) {
      console.error(err);
      if (err.message && (err.message.includes("403") || err.message.includes("Permission denied"))) {
         setErrorMsg("Access Denied: Paid API Key required for restoration.");
         setHasApiKey(false);
         setAppState(AppState.REVIEW_CONCEPT);
         return;
      }
      setErrorMsg(err.message || "Restoration failed.");
      setAppState(AppState.REVIEW_CONCEPT); 
    }
  };

  const handleCopyCaption = () => {
    if (concept?.socialCaption) {
      navigator.clipboard.writeText(concept.socialCaption);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleShareToFacebook = async () => {
    if (!imageUrl || !concept) return;

    // Helper to convert data URI to Blob
    const dataURItoBlob = (dataURI: string) => {
      const byteString = atob(dataURI.split(',')[1]);
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], {type: mimeString});
    };

    const blob = dataURItoBlob(imageUrl);
    const file = new File([blob], "gold-archive.png", { type: "image/png" });
    const text = `${concept.title}\n\n${concept.socialCaption} #GoldRush #History`;

    // 1. Try Native Share (Mobile)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: concept.title,
          text: text
        });
        return;
      } catch (e) {
        console.log("Share failed or cancelled", e);
      }
    }

    // 2. Desktop Fallback
    try {
      // Copy caption
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      
      // Download image
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `gold-archive-${Date.now()}.png`;
      link.click();

      // Open Facebook
      window.open('https://www.facebook.com', '_blank');
      
      alert("Caption copied & Image downloaded! You can now paste them into your Facebook post.");
    } catch (e) {
      console.error("Fallback share failed", e);
    }
  };

  const reset = () => {
    setAppState(AppState.IDLE);
    setConcept(null);
    setImageUrl(null);
    setErrorMsg(null);
  };

  // --- RENDER LOGIC ---

  if (checkingKey) {
    return (
      <div className="min-h-screen bg-ink-800 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-parchment-400 border-t-ink-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. API Key Selection Screen
  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-ink-800 bg-wood-grain flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-vignette pointer-events-none"></div>
         
         <div className="max-w-md w-full bg-parchment-100 p-12 shadow-2xl relative z-10 rounded-sm">
             <div className="w-16 h-16 bg-ink-gold rounded-full flex items-center justify-center shadow-lg border-4 border-white mx-auto mb-6">
                 <span className="text-white font-accent text-2xl font-bold">G</span>
             </div>

             <h1 className="text-4xl font-display font-bold text-ink-900 mb-2">Restricted Access</h1>
             <p className="text-ink-600 font-body mb-8">
               Access to the Golden Archives requires verified credentials.
             </p>

             <div className="bg-parchment-200/50 p-4 mb-8 text-left border-l-4 border-ink-gold rounded-r">
               <p className="text-xs text-ink-900 font-bold uppercase tracking-wider mb-1">System Requirement</p>
               <p className="text-sm text-ink-800 font-body">
                 Please connect a <span className="font-bold">Paid API Key</span> (Gemini 3 Pro) to proceed.
               </p>
             </div>

             <Button onClick={handleSelectKey} className="w-full !bg-ink-gold !border-ink-gold hover:!bg-yellow-700">
               Connect API Key
             </Button>
             
             {errorMsg && (
               <p className="text-ink-red text-sm mt-4 font-body">{errorMsg}</p>
             )}
         </div>
      </div>
    );
  }

  // 2. Main App Screen
  return (
    <div className="flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative min-h-screen">
      
      {showInstallBtn && (
        <button
          onClick={handleInstallClick}
          className="fixed top-4 right-4 z-50 bg-parchment-100 text-ink-900 text-xs font-bold px-4 py-2 border border-ink-200 shadow-lg font-accent tracking-widest uppercase hover:bg-white"
        >
          Install App
        </button>
      )}

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-parchment-100 mb-3 tracking-tight drop-shadow-md">
          The Golden Archives
        </h1>
        <div className="flex items-center justify-center gap-4 text-parchment-400 font-accent text-sm tracking-[0.3em] uppercase opacity-80">
          <span className="h-px w-8 bg-parchment-400"></span>
          <span>Lost Treasures & Gold</span>
          <span className="h-px w-8 bg-parchment-400"></span>
        </div>
      </div>

      <div className="w-full max-w-5xl z-10">
        
        {/* Error Message */}
        {errorMsg && (
          <div className="mb-8 mx-auto max-w-lg bg-red-900/90 text-white p-6 rounded shadow-lg text-center border border-red-700">
             <p className="font-body mb-4">{errorMsg}</p>
             <button 
               onClick={() => setAppState(AppState.IDLE)} 
               className="text-xs uppercase tracking-widest border-b border-white/50 hover:border-white pb-1"
             >
               Try Again
             </button>
          </div>
        )}

        {/* State: Idle */}
        {appState === AppState.IDLE && (
          <div className="bg-parchment-100 shadow-2xl max-w-2xl mx-auto rounded overflow-hidden">
             <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 text-ink-gold opacity-80">
                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                   </svg>
                </div>
                <h2 className="text-3xl font-display font-bold text-ink-900 mb-4">Uncover the Wealth</h2>
                <p className="text-ink-600 font-body text-lg mb-10 leading-relaxed max-w-md mx-auto">
                  The archives contain secrets of lost mines, sunken galleons, and ancient alchemy. Reveal a new artifact now.
                </p>
                <Button onClick={handleGenerateConcept} className="mx-auto text-sm px-10 py-4 !bg-ink-gold !border-ink-gold hover:!bg-yellow-700">
                  Search for Gold
                </Button>
             </div>
          </div>
        )}

        {/* State: Loading Concept */}
        {appState === AppState.GENERATING_CONCEPT && (
          <div className="text-center py-32">
            <div className="w-16 h-16 border-4 border-parchment-400 border-t-ink-gold rounded-full animate-spin mx-auto mb-8"></div>
            <p className="text-parchment-200 font-accent text-xl tracking-widest animate-pulse">
              Deciphering Maps...
            </p>
          </div>
        )}

        {/* State: Review Concept */}
        {(appState === AppState.REVIEW_CONCEPT || appState === AppState.GENERATING_IMAGE) && concept && (
          <div className="space-y-12 animate-fade-in-up">
            <ConceptCard concept={concept} />
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pb-20">
              <Button 
                variant="secondary" 
                onClick={handleGenerateConcept}
                disabled={appState === AppState.GENERATING_IMAGE}
              >
                Burn & Retry
              </Button>
              <div className="h-8 w-px bg-parchment-500/30 hidden sm:block"></div>
              <Button 
                onClick={handleGenerateImage}
                isLoading={appState === AppState.GENERATING_IMAGE}
                className="min-w-[240px] !bg-ink-gold !border-ink-gold hover:!bg-yellow-700"
              >
                Restore Artifact
              </Button>
            </div>
          </div>
        )}

        {/* State: Finished */}
        {appState === AppState.FINISHED && imageUrl && concept && (
          <div className="flex flex-col items-center space-y-12 animate-fade-in-up pb-20">
            
            {/* THE RESTORED ARTIFACT - NO FRAME / FULL BLEED */}
            <div className="relative shadow-2xl rounded-sm overflow-hidden border border-ink-900/20 max-w-md mx-auto">
               <img 
                  src={imageUrl} 
                  alt="Restored Historical Document" 
                  className="w-full h-auto object-cover block"
                />
            </div>

            {/* Action Card */}
            <div className="bg-parchment-100 w-full max-w-lg shadow-lg rounded-sm overflow-hidden">
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-display font-bold text-ink-900 mb-2">Restoration Complete</h3>
                  <p className="text-ink-600 font-body text-sm mb-6">
                     Artifact successfully retrieved from the archives.
                  </p>

                  <div className="bg-parchment-200 p-4 mb-6 text-left rounded border border-parchment-300">
                      <div className="flex justify-between items-center mb-2">
                          <span className="font-accent font-bold text-ink-500 text-[10px] uppercase tracking-widest">Archive Note</span>
                          <button 
                            onClick={handleCopyCaption}
                            className="text-[10px] font-bold text-ink-gold hover:text-ink-900 uppercase tracking-widest"
                          >
                             {isCopied ? "Copied" : "Copy Note"}
                          </button>
                      </div>
                      <p className="text-ink-800 text-sm font-body leading-relaxed whitespace-pre-wrap">
                          {concept.socialCaption}
                      </p>
                  </div>

                  {/* Video Prompt Section */}
                  <div className="bg-ink-800 p-4 mb-4 text-left rounded-t border border-ink-700 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                         <svg className="w-12 h-12 text-white/5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                      </div>
                      <div className="flex justify-between items-center mb-2 relative z-10">
                          <span className="font-accent font-bold text-parchment-400 text-[10px] uppercase tracking-widest">AI Video Prompt (Visuals)</span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(concept.videoPrompt);
                              alert("Video prompt copied!");
                            }}
                            className="text-[10px] font-bold text-ink-gold hover:text-white uppercase tracking-widest"
                          >
                             Copy Visuals
                          </button>
                      </div>
                      <p className="text-parchment-200 text-xs font-mono leading-relaxed relative z-10">
                          "{concept.videoPrompt}"
                      </p>
                  </div>

                  {/* Voice Over Script Section */}
                  <div className="bg-ink-900 p-4 mb-8 text-left rounded-b border-x border-b border-ink-700 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                         <svg className="w-10 h-10 text-white/5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.66 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                      </div>
                      <div className="flex justify-between items-center mb-2 relative z-10">
                          <span className="font-accent font-bold text-parchment-400 text-[10px] uppercase tracking-widest">Voice Over Script (Audio)</span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(concept.voiceOverScript);
                              alert("Script copied!");
                            }}
                            className="text-[10px] font-bold text-ink-gold hover:text-white uppercase tracking-widest"
                          >
                             Copy Script
                          </button>
                      </div>
                      <p className="text-parchment-200 text-xs font-serif italic leading-relaxed relative z-10 pl-3 border-l-2 border-ink-gold/50">
                          "{concept.voiceOverScript}"
                      </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                     <Button 
                      className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700 text-white flex items-center justify-center"
                      onClick={handleShareToFacebook}
                    >
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Share to Facebook
                    </Button>

                     <Button 
                      className="!bg-ink-gold !border-ink-gold hover:!bg-yellow-700"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = imageUrl;
                        link.download = `gold-archive-${Date.now()}.png`;
                        link.click();
                      }}
                    >
                      Collect Artifact
                    </Button>
                    <Button variant="secondary" onClick={reset}>
                      New Expedition
                    </Button>
                  </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;