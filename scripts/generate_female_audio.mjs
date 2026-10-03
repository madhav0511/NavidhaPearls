import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const stages = [
  {
    filename: '01-voice-design.wav',
    text: 'The story begins on paper. The chitera hand-draws intricate sketches inspired by Mughal royalty: blooming gulab roses, graceful peacocks, and flowing floral vines. Drafted at an exact one-to-one scale on fine silver or gold, every motif is measured with traditional dividers to guarantee perfect symmetry.'
  },
  {
    filename: '02-voice-chilai.wav',
    text: 'The silversmith hammers pure metal into shape, filling hollow structures with warm natural resin for support. Then, the engraver uses micro-chisels to carve deep channels into the surface, cross-hatching the metal base so light can refract beneath the glass.'
  },
  {
    filename: '03-voice-safed-meena.wav',
    text: 'Crushed glass stones, ground fine with water, form the backdrop. The enameler uses delicate copper needles to pack this wet white enamel into the carved grooves, blotting away excess moisture with meticulous care.'
  },
  {
    filename: '04-voice-bhatti.wav',
    text: 'Surrendering to the flame, the piece is placed inside an intense 800-degree kiln. The white glass powder melts, fusing seamlessly into every engraved contour of the metal.'
  },
  {
    filename: '05-voice-gulabi-chitra.wav',
    text: 'The defining signature of Varanasi. Using a brush made from a single squirrel hair, the master painter hand-renders delicate rose petals over the white glazed base. The pink pigment, a secret blend of crushed enamel, sandalwood oil, and gold oxides, is refired at lower heat, blooming into a soft watercolor gradient.'
  },
  {
    filename: '06-voice-jadai-gotai.wav',
    text: 'Ancient art meets precious stones. Hyper-purified gold foil is hand-pressed around rubies, pearls, and uncut diamonds, securing them without a single prong. The piece is then burnished with an agate stone, polishing the silver to a brilliant mirror shine.'
  },
  {
    filename: '07-voice-showcase.wav',
    text: 'Enamelled beads, pendants, and pearls are strung together on hand-twisted silk. Inspected under magnification for absolute perfection, the finished heirloom comes to life, bridging 18th-century royal heritage with modern luxury.'
  }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateAll() {
  const outDir = path.resolve('public/audio');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const stage of stages) {
    const filePath = path.join(outDir, stage.filename);
    if (fs.existsSync(filePath)) {
      console.log(`Skipping already generated: ${stage.filename}`);
      continue;
    }

    console.log(`Generating female narration audio for ${stage.filename}...`);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: stage.text,
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: 'Aoede' // Regal, refined, studio-grade female voice
              }
            }
          }
        }
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData?.data) {
        const buffer = Buffer.from(part.inlineData.data, 'base64');
        fs.writeFileSync(filePath, buffer);
        console.log(`Saved ${stage.filename} (${buffer.length} bytes)`);
      } else {
        console.error(`Failed to get audio data for ${stage.filename}`);
      }
    } catch (err) {
      console.error(`Error generating ${stage.filename}:`, err);
    }
    console.log('Sleeping 12s to respect rate limit...');
    await sleep(12000);
  }
}

generateAll();
