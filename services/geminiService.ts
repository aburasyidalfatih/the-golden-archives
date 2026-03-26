import { GoogleGenAI, Type } from "@google/genai";
import { PosterConcept } from "../types";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey: apiKey });

// --- AMERICAN GOLD ARCHIVES ENGINE ---
// EXPANDED TO INCLUDE SCIENTIFIC & TECHNICAL TOPICS
const themes = [
  // --- HISTORICAL LEGENDS (5) ---
  "The Lost Dutchman's Mine (Arizona Superstition Mountains)",
  "Sutter's Mill: The Spark of 1848 (California)",
  "The Confederate Gold: Missing Civil War Treasury",
  "Butch Cassidy's Buried Loot (Wyoming/Utah)",
  "The SS Central America: Ship of Gold (Carolina Coast)",
  
  // --- GEOLOGICAL SCIENCE (10) ---
  "Reading the River: Hydraulic Traps & Eddies (Fluid Dynamics)",
  "Vein Valuation: Distinguishing Ore from Sterile Quartz",
  "Bedrock Secrets: Crevices, Cracks, and Natural Riffles",
  "The Geochemistry of Gold: Pyrite, Sulfides, and Iron Caps",
  "Paleoplacer Deposits: Tracing Ancient River Channels",
  "Specific Gravity: The Physics of Panning & Separation",
  "Mineral Indicators: Black Sands (Magnetite) & Garnets",
  "Glacial Gold: Moraines and Drift Mining Geology",
  "The Mother Lode: Understanding Orogenic Gold Belts",
  "Fools Gold vs. Real Gold: Field Identification Tests",

  // --- POPULAR AMERICAN CULTURE & HISTORY (8) ---
  "The Klondike Gold Rush: The Chilkoot Trail (Alaska)",
  "The Black Hills Rush: Deadwood & Wild Bill Hickok (South Dakota)",
  "The 1933 Double Eagle: America's Most Forbidden Coin",
  "Fort Knox: Inside the US Bullion Depository",
  "The Georgia Gold Belt: America's First Rush (Dahlonega)",
  "The Beale Ciphers: The Unsolved Virginia Treasure",
  "Modern Metal Detecting: Electronic Prospecting in the Desert",
  "River Dredging: Vacuuming the Bedrock for Placer Gold",

  // --- FAMOUS NUGGETS & MINERALOGY (5) ---
  "The 16-to-1 Mine: High Grade Pocket Gold (California)",
  "The Dogtown Nugget: Magalia's Monster (California)",
  "Crystalline Gold: The Rarest Form of Natural Gold",
  "Wire Gold: The Delicate Structure of Native Metal",
  "Electrum: The Natural Gold-Silver Alloy",

  // --- MINING TECHNOLOGY & TECHNIQUES (5) ---
  "The Long Tom: Sluicing Efficiency",
  "The Cornish Pump: Draining the Deep Mines",
  "The Assay Office: Determining Purity and Value",
  "Dry Washing: Winnowing Gold in the Desert",
  "The Stamp Mill: Thunder of the Mining Camps",

  // --- LOST MINES & GHOST TOWNS (6) ---
  "Bodie, California: The Ghost Town Frozen in Time",
  "The Lost Cement Mine: Gold in Red Lava (Sierra Nevada)",
  "The Lost Pegleg Mine: Black Gold of the Desert (California)",
  "The Lost Breyfogle Mine: Death Valley's Secret (Nevada)",
  "The Kokoweef Cave: River of Gold Under the Mojave",
  "The Lost Adams Diggings: Canyon of Gold (New Mexico)",

  // --- ADVANCED GEOLOGY (6) ---
  "Epithermal Deposits: Hot Springs Gold",
  "Skarn Deposits: Gold Near Granite Intrusions",
  "Indicator Plants: Sagebrush and Gold Soil",
  "Desert Varnish: Reading Rocks in Arid Lands",
  "Fault Lines & Gold: The San Andreas Connection",
  "Placer vs. Lode: The Geological Difference",

  // --- HISTORICAL FIGURES & EVENTS (5) ---
  "The California Gold Rush: The 49ers Journey",
  "The Yukon Trail: Perilous Journey to Dawson",
  "Emperor Norton: The Gold Rush Eccentric",
  "Black Bart: The Gentleman Bandit of the Gold Fields",
  "The Pinkertons: Guarding the Gold Shipments",

  // --- INDUSTRIAL MINING & HEAVY TECH (NEW) ---
  "Hydraulic Monitors: The Water Cannons that Moved Mountains",
  "The Bucket Line Dredge: Floating Factories of the Yuba River",
  "Square Set Timbering: Engineering the Comstock Lode Caverns",
  "The Widowmaker: Pneumatic Drills and Silicosis History",
  "The Arrastra: Ancient Grinding Tech of the Spanish Miners",
  "Railroads & Gold: Narrow Gauge Lines to the Mines",

  // --- PROCESSING & REFINING SCIENCE (NEW) ---
  "Cyanide Heap Leaching: Extracting Microscopic Gold (Nevada)",
  "Mercury Amalgamation: The Toxic History of Quicksilver",
  "The Smelting Process: Flux, Slag, and the Gold Button",
  "Fire Assaying: The Crucible, The Cupel, and The Furnace",
  "Electrolytic Refining: The Wohlwill Process for 99.99% Purity",

  // --- GOLD ECONOMICS & MODERN TECH (NEW) ---
  "The San Francisco Mint: The Granite Lady of the West",
  "Gold Certificates: When Paper Was Worth Its Weight",
  "Pulse Induction vs. VLF: The Physics of Metal Detecting",
  "The Gold Standard Act: Economics of the Gilded Age",

  // --- JEWELRY ARTS & MODERN USES (NEW - DOWNSTREAM) ---
  "Lost Wax Casting: The Ancient Art of Jewelry Making",
  "Karat Standards: The Science of Gold Alloys (10k vs 24k)",
  "Gold in Technology: From Circuit Boards to Space Visors",
  "Gold Leaf Beating: Creating Sheets Thinner than Light",
  "Bullion Minting: The Process of Making Modern Investment Bars"
];

// Visual Styles - GEOLOGICAL FIELD GUIDES & DIAGRAMS
const visualStyles = [
  "Geological Cross-Section: A vertical cutaway view showing distinct layers of soil, bedrock cracks, and gold deposits hidden underground.",
  "Comparative Field Guide: A split-screen illustration comparing 'Sterile Rock' vs 'Ore-Bearing Rock' side-by-side.",
  "Hydraulic Flow Diagram: A 3D perspective of a river stream showing water flow arrows (vectors) and where gold gets trapped behind boulders.",
  "Vein System Blueprint: An illustration of a mountain face showing how quartz veins travel through metamorphic host rock.",
  "Prospector's Identification Chart: A central rock specimen with several 'magnifying glass' circular inserts showing microscopic details.",
  "Stratigraphic Column: A vertical diagram showing the timeline of soil layers from surface grass down to ancient bedrock.",
  "Topographic Survey Map: A contour-line map showing elevation changes, ancient river channels, and potential dig sites.",
  "Mining Patent Drawing: A technical, engineering-style schematic of mining equipment (like a sluice box) with labeled parts.",
  "Mineralogical Micro-Structure: An extreme close-up view of crystalline gold structures, showing the geometric beauty of the metal.",
  "Historical Photo-Overlay: A sepia-toned landscape with hand-drawn geological annotations and sketches layered over it."
];

// Layout Structures - SCIENTIFIC & DIAGRAMMATIC
const layoutStructures = [
  "CUTAWAY DIAGRAM: A slice through the earth showing hidden layers (Bedrock, Clay, Gravel).",
  "SPLIT COMPARISON: Left side shows 'The Decoy', Right side shows 'The Real Treasure'.",
  "PROCESS FLOW: Arrows showing the movement from Source (Lode) to Deposit (Placer).",
  "ANNOTATED LANDSCAPE: A wide view of a terrain with clear lines pointing to specific geological traps.",
  "MACRO ANALYSIS: Large central object (Rock/Nugget) with callout lines pointing to specific textures.",
  "TIMELINE STRIP: A chronological sequence showing geological formation or historical progression.",
  "GRID SPECIMEN: A structured grid displaying multiple varieties of ore or gold types for comparison.",
  "RADIAL CYCLE: A circular diagram illustrating the cycle of erosion, transport, and deposition.",
  "EXPLODED VIEW: A technical breakdown separating parts of a machine or geological structure.",
  "MAP & INSET: A dominant regional map with small, detailed inset boxes highlighting specific rich zones."
];

const getPreviousTopics = (): string => {
  if (typeof window === 'undefined') return "";
  try {
    const history = localStorage.getItem('golden_history'); 
    if (!history) return "";
    const parsed = JSON.parse(history);
    return parsed.map((item: any) => item.title).slice(0, 10).join(", ");
  } catch (e) {
    return "";
  }
};

export const generatePosterConcept = async (): Promise<PosterConcept> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); 

  // 1. Get History
  const previouslyGeneratedTitles = getPreviousTopics().split(", ");
  
  // 2. Filter available themes
  const availableThemes = themes.filter(t => !previouslyGeneratedTitles.includes(t));
  
  // 3. Select Theme (Smart Random or Fallback)
  let selectedTheme;
  if (availableThemes.length > 0) {
    selectedTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
  } else {
    // If all topics seen, reset pool (pick from full list)
    selectedTheme = themes[Math.floor(Math.random() * themes.length)];
  }

  const randomStyle = visualStyles[Math.floor(Math.random() * visualStyles.length)];
  const randomLayout = layoutStructures[Math.floor(Math.random() * layoutStructures.length)];
  
  const previouslyGenerated = getPreviousTopics();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Design a VINTAGE GEOLOGICAL FIELD GUIDE concept about AMERICAN GOLD PROSPECTING & HISTORY.
      
      THEME: "${selectedTheme}"
      STYLE: "${randomStyle}"
      LAYOUT: "${randomLayout}"
      
      HISTORY EXCLUSION: [${previouslyGenerated}]
      
      GOAL: Create an image that looks like a 19th-Century Mining Manual or Scientific Chart.
      
      CRITICAL REFERENCE STYLE:
      - Use "Cross-Sections" (cutaway views of the earth).
      - Use "Magnifying Glass" inserts to show details.
      - Use "Arrows" to show movement or pointers.
      - Use "Paper/Parchment" background.
      - **Focus on SCIENCE and GEOLOGY over just stories.**
      
      AUDIENCE: Prospectors, Geologists, & History Enthusiasts.
      
      CRITICAL RULES:
      1. LANGUAGE: Use American English.
      2. UNITS: Use IMPERIAL UNITS only.
      3. VISUALS: Hand-drawn scientific illustration style (Ink & Watercolor).
      4. DATA: 5-7 Points. Concise technical/historical facts.
      
      Requirements:
      1. Title: Bold, Scientific Headline (e.g., "IDENTIFYING VEIN QUARTZ").
      2. Visual Prompt: Describe a TECHNICAL ILLUSTRATION. Mention "Cross-section", "Cutaway", "Labels", "Geological layers", "Specific Gravity".
      3. Infographic Points: 5-7 concise facts explaining the *science* (geology/physics) or *history* shown.
      4. Social Caption: COMPREHENSIVE EDUCATIONAL NARRATIVE (200-250 words). Must include:
         - The "Hook": Why this topic is fascinating.
         - The "Science/History": Deep dive into how it works (mechanism/process).
         - The "Significance": Why it was a game-changer or crucial for prospectors.
         - A "Pro Tip" or "Did You Know?" fact.
         - Hashtags.
      `,
      config: {
        systemInstruction: "You are a 19th-Century Geologist and Historian creating a deep-dive educational field guide. You use technical terms but explain them clearly. Your goal is to educate the audience thoroughly.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Main Headline (Scientific/Bold)" },
            tagline: { type: Type.STRING, description: "Subheader" },
            description: { type: Type.STRING, description: "Short rationale" },
            visualPrompt: { type: Type.STRING, description: "Detailed instruction describing a GEOLOGICAL DIAGRAM with cross-sections and labels." },
            videoPrompt: { 
              type: Type.STRING, 
              description: "A highly detailed text-to-video prompt (for Sora/Runway). Focus on: Camera Movement (Drone/Macro), Lighting (Golden Hour/Cinematic), and Action (Panning/Mining). Style: Photorealistic Documentary." 
            },
            voiceOverScript: {
              type: Type.STRING,
              description: "A compelling 30-45 second narration script for a documentary video. Tone: Mysterious, Educational, and Epic. Start with a hook."
            },
            colorPalette: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Earthy, Geological colors (Slate Grey, Iron Red, Gold, River Blue, Parchment)." 
            },
            infographicTitle: { type: Type.STRING, description: "Header for the data section" },
            infographicPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "5 to 7 short facts tailored to be labels on a diagram."
            },
            socialCaption: {
              type: Type.STRING,
              description: "A comprehensive educational post (200-250 words) with deep technical/historical detail, structured with paragraphs. Include a Hook, Deep Dive, Significance, and Pro Tip. End with hashtags."
            }
          },
          required: ["title", "tagline", "description", "visualPrompt", "videoPrompt", "voiceOverScript", "colorPalette", "infographicTitle", "infographicPoints", "socialCaption"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as PosterConcept;
    }
    throw new Error("The archives are silent (API Error).");
  } catch (error: any) {
    console.error("Error generating concept:", error);
    throw error;
  }
};

export const generatePosterImage = async (concept: PosterConcept): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `
      Create a VINTAGE CHROMOLITHOGRAPH / SCIENTIFIC ILLUSTRATION POSTER.
      
      --- VISUAL STYLE (CRITICAL) ---
      Style: Late 19th Century Chromolithograph, Botanical/Geological Plate style.
      Aesthetic: "Museum Quality Print", "Vintage Educational Chart", "Richly Colored Lithograph".
      Background: Aged Paper, Cream or Light Tan (not overly dark).
      
      --- SPECIFIC ELEMENTS TO INCLUDE ---
      ${concept.visualPrompt}
      
      - **CROSS-SECTION**: Show a cutaway view of the earth/river/mountain to reveal layers (Bedrock, Gravel, Clay).
      - **ARROWS & LABELS**: Use arrows to point to specific features (e.g., "Bedrock Trap", "Iron Stain").
      - **MAGNIFYING INSERTS**: Include circular zoomed-in views of rock textures or gold nuggets.
      - **TEXT**: Include the title "${concept.title}" in vintage Victorian block typography.
      
      --- DATA POINTS (Embed as Labels) ---
      ${concept.infographicPoints.map((p, i) => `Label ${i+1}: ${p}`).join('\n')}
      
      **NEGATIVE PROMPT**:
      Neon colors, fluorescent, digital glitch, low resolution, blurry, photograph, 3D render, anime, cartoon, modern vector art, minimalist, black and white only.
      
      --- COLORS ---
      Use RICH, SATURATED VINTAGE COLORS: Deep Indigo, Crimson Red, Emerald Green, Burnt Sienna, Antique Gold.
      Avoid neon or electric colors. Think "Old Encyclopedia Plate".
      Palette: ${concept.colorPalette.join(", ")}.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview", 
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
            aspectRatio: "9:16",
            imageSize: "1K" 
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("The visual reconstruction failed.");
  } catch (error: any) {
    console.error("Error generating image:", error);
    throw error;
  }
};