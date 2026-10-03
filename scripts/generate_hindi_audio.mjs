import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const hindiStages = [
  {
    filename: '01-voice-design-hi.wav',
    text: 'कहानी कागज़ पर शुरू होती है। चितेरा मुग़ल वास्तुकला, खिलते गुलाब और मोरों से प्रेरित होकर सोने या चाँदी पर बारीक नक़्शे खींचता है, ताकि हर डिज़ाइन में पूर्ण समरूपता हो।'
  },
  {
    filename: '02-voice-chilai-hi.wav',
    text: 'सुनार धातु को पीटकर आकार देता है और मज़बूती के लिए उसमें लाख भरता है। फिर छिलाई-कार सूक्ष्म छेनियों से धातु पर गहरी लकीरें उकेरता है, जिससे रोशनी मीने के नीचे चमक सके।'
  },
  {
    filename: '03-voice-safed-meena-hi.wav',
    text: 'पिसा हुआ काँच और पानी का लेप आधार बनाता है। मीनाकार तांबे की सुइयों से गीला सफ़ेद मीना धातु की लकीरों में सावधानी से भरता है।'
  },
  {
    filename: '04-voice-bhatti-hi.wav',
    text: 'आठ सौ डिग्री की भट्टी में तपाने पर काँच का चूर्ण पिघलकर धातु के साथ एकाकार हो जाता है और एक चमकीला आधार बनाता है।'
  },
  {
    filename: '05-voice-gulabi-chitra-hi.wav',
    text: 'यह वाराणसी की पहचान है—गुलाबी मीनाकारी। गिलहरी के एक बाल के ब्रश से सफ़ेद सतह पर गुलाबी ऑक्साइड से गुलाब की पंखुड़ियाँ उकेरी जाती हैं, जो धीमी आँच पर फिर पककर गुलाबी रंग बिखेरती हैं।'
  },
  {
    filename: '06-voice-jadai-gotai-hi.wav',
    text: 'शुद्ध सोने के वर्क से बिना किसी कुंडी के रत्नों और मोतियों की जड़ाई की जाती है, और फिर अकीक पत्थर से घोटाई करके दर्पण जैसी चमक लाई जाती है।'
  },
  {
    filename: '07-voice-showcase-hi.wav',
    text: 'हाथ से बंटे रेशमी धागों में मीनाकारी के मनके और बसरा मोती पिरोए जाते हैं। इस तरह सदियों पुरानी शाही विरासत एक आधुनिक आभूषण के रूप में जीवंत हो उठती है।'
  }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateAllHindi() {
  const outDir = path.resolve('public/audio/hi');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const stage of hindiStages) {
    const filePath = path.join(outDir, stage.filename);
    if (fs.existsSync(filePath)) {
      console.log(`Skipping already generated: ${stage.filename}`);
      continue;
    }

    console.log(`Generating Hindi female narration for ${stage.filename}...`);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: stage.text,
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: 'Aoede'
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

generateAllHindi();
