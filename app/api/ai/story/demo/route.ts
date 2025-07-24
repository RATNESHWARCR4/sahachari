import { NextRequest, NextResponse } from 'next/server';

// Demo stories for different languages
const demoStories = {
  en: {
    'soil types': `Once upon a time, in a small village, there lived a wise farmer named Raju. He had three fields with different types of soil.

In his first field, the soil was dark and soft. "This is black soil," Raju explained to the village children. "It holds water like a sponge and is perfect for growing cotton."

The second field had red soil. "See how it looks like the color of bricks?" Raju asked. "This soil is good for growing groundnuts and pulses."

In the third field, the soil was light and sandy. "This sandy soil doesn't hold much water," Raju said, "but it's excellent for watermelons and cashew trees."

The children learned that just like people, each type of soil has its own special qualities and grows different crops. Raju smiled, "Understanding our soil helps us grow better food for everyone!"

Moral: Every type of soil is valuable and has its own purpose in nature.`,
    
    'water cycle': `Little Meera loved playing in the rain. One day, she asked her grandmother, "Where does all this rain come from?"

Her grandmother took her to the village well. "See this water? When the sun shines bright, it becomes invisible and flies up to the sky, just like steam from our tea!"

"Really?" Meera's eyes widened.

"Yes! Up in the sky, it becomes cool again and forms clouds, like cotton balls. When many tiny drops come together, they become heavy and fall as rain."

"So the water goes round and round?" Meera asked excitedly.

"Exactly! From the earth to the sky and back again. That's why we must keep our water clean - it's the same water going on a journey!"

Meera now understood why every drop of water was precious.`,
  },
  
  hi: {
    'soil types': `एक छोटे से गाँव में राजू नाम का एक बुद्धिमान किसान रहता था। उसके पास तीन खेत थे जिनमें अलग-अलग प्रकार की मिट्टी थी।

पहले खेत में मिट्टी काली और मुलायम थी। "यह काली मिट्टी है," राजू ने गाँव के बच्चों को समझाया। "यह पानी को स्पंज की तरह सोखती है और कपास उगाने के लिए बहुत अच्छी है।"

दूसरे खेत में लाल मिट्टी थी। "देखो यह ईंट के रंग जैसी कैसे दिखती है?" राजू ने पूछा। "यह मिट्टी मूंगफली और दालें उगाने के लिए अच्छी है।"

तीसरे खेत में मिट्टी हल्की और रेतीली थी। "यह रेतीली मिट्टी ज्यादा पानी नहीं रोकती," राजू ने कहा, "लेकिन तरबूज और काजू के पेड़ों के लिए बहुत अच्छी है।"

बच्चों ने सीखा कि जैसे लोग अलग होते हैं, वैसे ही हर प्रकार की मिट्टी की अपनी विशेषताएं होती हैं।

शिक्षा: प्रकृति में हर प्रकार की मिट्टी का अपना महत्व और उद्देश्य है।`,
  },
  
  kn: {
    'soil types': `ಒಂದು ಚಿಕ್ಕ ಹಳ್ಳಿಯಲ್ಲಿ ರಾಜು ಎಂಬ ಬುದ್ಧಿವಂತ ರೈತ ವಾಸಿಸುತ್ತಿದ್ದ. ಅವನಿಗೆ ವಿವಿಧ ರೀತಿಯ ಮಣ್ಣಿನ ಮೂರು ಹೊಲಗಳಿದ್ದವು.

ಮೊದಲ ಹೊಲದಲ್ಲಿ ಮಣ್ಣು ಕಪ್ಪು ಮತ್ತು ಮೃದುವಾಗಿತ್ತು. "ಇದು ಕಪ್ಪು ಮಣ್ಣು," ರಾಜು ಹಳ್ಳಿಯ ಮಕ್ಕಳಿಗೆ ವಿವರಿಸಿದ. "ಇದು ಸ್ಪಂಜಿನಂತೆ ನೀರನ್ನು ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳುತ್ತದೆ ಮತ್ತು ಹತ್ತಿ ಬೆಳೆಯಲು ಪರಿಪೂರ್ಣವಾಗಿದೆ."

ಪಾಠ: ಪ್ರಕೃತಿಯಲ್ಲಿ ಪ್ರತಿಯೊಂದು ರೀತಿಯ ಮಣ್ಣು ಮೌಲ್ಯಯುತವಾಗಿದೆ ಮತ್ತು ತನ್ನದೇ ಆದ ಉದ್ದೇಶವನ್ನು ಹೊಂದಿದೆ.`,
  },
  
  mr: {
    'soil types': `एका छोट्या गावात राजू नावाचा एक शहाणा शेतकरी राहत होता. त्याच्याकडे वेगवेगळ्या प्रकारच्या मातीची तीन शेते होती.

पहिल्या शेतात माती काळी आणि मऊ होती. "ही काळी माती आहे," राजूने गावातील मुलांना समजावले. "ही पाणी स्पंजसारखे शोषून घेते आणि कापूस पिकवण्यासाठी उत्तम आहे."

शिकवण: निसर्गात प्रत्येक प्रकारची माती मौल्यवान आहे आणि तिचा स्वतःचा उद्देश आहे.`,
  },
};

export async function POST(request: NextRequest) {
  try {
    // Get request data
    const { prompt, language = 'en', topic = 'soil types', ageGroup } = await request.json();
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get demo story based on language and topic
    const languageStories = demoStories[language as keyof typeof demoStories] || demoStories.en;
    const story = languageStories[topic as keyof typeof languageStories] || languageStories['soil types'];
    
    // Add some variation based on the prompt
    const customizedStory = prompt 
      ? story + `\n\n(Teacher's note: This story can be adapted based on: "${prompt}")` 
      : story;
    
    return NextResponse.json({
      success: true,
      story: customizedStory,
      metadata: {
        language,
        topic,
        ageGroup,
        generatedAt: new Date().toISOString(),
        isDemo: true,
      },
    });
    
  } catch (error: any) {
    console.error('Demo story generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate demo story', details: error.message },
      { status: 500 }
    );
  }
} 