// app/lib/translations.ts

interface Translations {
  [key: string]: {
    app: {
        name: string;
        tagline: string;
        description: string;
    };
    auth: {
      welcome: string;
      tagline: string;
      signIn: string;
      signUp: 'string';
      signOut: string;
      alreadyHaveAccount: string;
      dontHaveAccount: string;
      continueWithGoogle: string;
      continueWithPhone: 'string';
    };
    features: {
      storyMaker: {
        title: string;
        description: string;
        placeholder: string;
        generate: string;
        voiceInput: string;
        readAloud: string;
        download: string;
        shareWhatsApp: string;
      };
      worksheetCreator: {
        title: string;
        description: string;
        uploadImage: string;
        selectGrades: string;
        generate: string;
        preview: string;
        copyToBoard: string;
      };
      gyanKosh: {
        title: string;
        description: string;
      };
      rupdrishti: {
        title: string;
        description: string;
      };
    };
    common: {
      save: string;
      copy: string;
      copied: string;
      welcome: string;
      print: string;
      download: string;
      share: string;
      backToHome: string;
      downloadPdf: string;
    };
    worksheetCreator: {
        uploadContent: string;
        dragAndDrop: string;
        customizeOptions: string;
        optionsComingSoon: string;
        generate: string;
        generating: string;
        generatedWorksheet: string;
        selectGrades: string;
    };
  };
}


export const translations: Translations = {
  en: {
    app: {
      name: 'Sahachari',
      tagline: 'Your AI companion in the teaching journey',
      description: 'An AI-powered teaching assistant for multi-grade classrooms in India',
    },
    auth: {
      welcome: 'Welcome to Sahachari',
      tagline: 'Your AI companion in the teaching journey',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: 'Don’t have an account?',
      continueWithGoogle: 'Continue with Google',
      continueWithPhone: 'Continue with Phone',
    },
    features: {
      storyMaker: {
        title: 'Kahani-Kār (The Story Maker)',
        description: 'Create culturally relevant stories in your local language',
        placeholder: 'Create a story about farmers to explain soil types...',
        generate: 'Generate Story',
        voiceInput: 'Voice Input',
        readAloud: 'Read Aloud',
        download: 'Download',
        shareWhatsApp: 'Share on WhatsApp',
      },
      worksheetCreator: {
        title: 'Path-Prakriya (Worksheet Creator)',
        description: 'Create differentiated worksheets for multiple grades',
        uploadImage: 'Upload textbook page',
        selectGrades: 'Select Grades',
        generate: 'Generate Worksheets',
        preview: 'Preview',
        copyToBoard: 'Copy to Board',
      },
      gyanKosh: {
        title: 'Gyan-Kosh (Knowledge Base)',
        description: 'Ask questions from your textbook chapters',
      },
      rupdrishti: {
        title: 'Rupdrishti (Visual Insight)',
        description: 'Generate simple diagrams for your blackboard',
      },
    },
    common: {
      save: 'Save',
      copy: 'Copy',
      copied: 'Copied!',
      welcome: 'Welcome',
      print: 'Print',
      download: 'Download',
      share: 'Share',
      backToHome: 'Back to Home',
      downloadPdf: 'Download as PDF',
    },
    worksheetCreator: {
        uploadContent: 'Upload Content',
        dragAndDrop: 'Drag and drop your files here',
        customizeOptions: 'Customize Options',
        optionsComingSoon: 'Customization options coming soon!',
        generate: 'Generate Worksheet',
        generating: 'Generating...',
        generatedWorksheet: 'Generated Worksheet',
        selectGrades: 'Select Grades',
    },
  },
  hi: {
    app: {
      name: 'सहचारी',
      tagline: 'शिक्षण यात्रा में आपका AI साथी',
      description: 'भारत में बहु-श्रेणी कक्षाओं के लिए एक AI-संचालित शिक्षण सहायक',
    },
    auth: {
      welcome: 'सहचारी में आपका स्वागत है',
      tagline: 'शिक्षण यात्रा में आपका AI साथी',
      signIn: 'साइन इन करें',
      signUp: 'साइन अप करें',
      signOut: 'साइन आउट करें',
      alreadyHaveAccount: 'क्या आपके पास पहले से खाता है?',
      dontHaveAccount: 'खाता नहीं है?',
      continueWithGoogle: 'Google से जारी रखें',
      continueWithPhone: 'फ़ोन से जारी रखें',
    },
    features: {
      storyMaker: {
        title: 'कहानी-कार',
        description: 'अपनी स्थानीय भाषा में सांस्कृतिक रूप से प्रासंगिक कहानियाँ बनाएं',
        placeholder: 'मिट्टी के प्रकार समझाने के लिए किसानों के बारे में कहानी बनाएं...',
        generate: 'कहानी बनाएं',
        voiceInput: 'आवाज इनपुट',
        readAloud: 'जोर से पढ़ें',
        download: 'डाउनलोड',
        shareWhatsApp: 'WhatsApp पर साझा करें',
      },
      worksheetCreator: {
        title: 'पथ-प्रक्रिया',
        description: 'कई कक्षाओं के लिए विभेदित वर्कशीट बनाएं',
        uploadImage: 'पाठ्यपुस्तक पृष्ठ अपलोड करें',
        selectGrades: 'कक्षाएं चुनें',
        generate: 'वर्कशीट बनाएं',
        preview: 'पूर्वावलोकन',
        copyToBoard: 'बोर्ड पर कॉपी करें',
      },
      gyanKosh: {
        title: 'ज्ञान-कोश',
        description: 'अपने पाठ्यपुस्तक अध्यायों से प्रश्न पूछें',
      },
      rupdrishti: {
        title: 'रूपदृष्टि',
        description: 'अपने ब्लैकबोर्ड के लिए सरल चित्र बनाएं',
      },
    },
    common: {
      save: 'सहेजें',
      copy: 'कॉपी करें',
      copied: 'कॉपी किया गया!',
      welcome: 'स्वागत है',
      print: 'प्रिंट',
      download: 'डाउनलोड',
      share: 'शेयर',
      backToHome: 'होम पर वापस जाएं',
      downloadPdf: 'पीडीएफ के रूप में डाउनलोड करें',
    },
    worksheetCreator: {
        uploadContent: 'सामग्री अपलोड करें',
        dragAndDrop: 'अपनी फाइलें यहां खींचें और छोड़ें',
        customizeOptions: 'विकल्प अनुकूलित करें',
        optionsComingSoon: 'अनुकूलन विकल्प जल्द ही आ रहे हैं!',
        generate: 'वर्कशीट बनाएं',
        generating: 'बना रहा है...',
        generatedWorksheet: 'बनाई गई वर्कशीट',
        selectGrades: 'ग्रेड चुनें',
    },
  },
  kn: {
    app: {
        name: 'ಸಹಚಾರಿ',
        tagline: 'ಬೋಧನಾ ಪಯಣದಲ್ಲಿ ನಿಮ್ಮ AI ಸಂಗಾತಿ',
        description: 'ಭಾರತದಲ್ಲಿ ಬಹು-ದರ್ಜೆಯ ತರಗತಿಗಳಿಗೆ AI-ಚಾಲಿತ ಬೋಧನಾ ಸಹಾಯಕ',
    },
    auth: {
        welcome: 'ಸಹಚಾರಿಗೆ ಸುಸ್ವಾಗತ',
        tagline: 'ಬೋಧನಾ ಪಯಣದಲ್ಲಿ ನಿಮ್ಮ AI ಸಂಗಾತಿ',
        signIn: 'ಸೈನ್ ಇನ್ ಮಾಡಿ',
        signUp: 'ಸೈನ್ ಅಪ್ ಮಾಡಿ',
        signOut: 'ಸೈನ್ ಔಟ್ ಮಾಡಿ',
        alreadyHaveAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?',
        dontHaveAccount: 'ಖಾತೆ ಇಲ್ಲವೇ?',
        continueWithGoogle: 'Google ಮೂಲಕ ಮುಂದುವರಿಯಿರಿ',
        continueWithPhone: 'ಫೋನ್ ಮೂಲಕ ಮುಂದುವರಿಯಿರಿ',
      },
      features: {
        storyMaker: {
          title: 'ಕಹಾನಿ-ಕಾರ್ (ಕಥೆಗಾರ)',
          description: 'ನಿಮ್ಮ ಸ್ಥಳೀಯ ಭಾಷೆಯಲ್ಲಿ ಸಾಂಸ್ಕೃತಿಕವಾಗಿ ಸಂಬಂಧಿತ ಕಥೆಗಳನ್ನು ರಚಿಸಿ',
          placeholder: 'ಮಣ್ಣಿನ ಪ್ರಕಾರಗಳನ್ನು ವಿವರಿಸಲು ರೈತರ ಬಗ್ಗೆ ಕಥೆ ರಚಿಸಿ...',
          generate: 'ಕಥೆ ರಚಿಸಿ',
          voiceInput: 'ಧ್ವನಿ ಇನ್ಪುಟ್',
          readAloud: 'ಗಟ್ಟಿಯಾಗಿ ಓದಿ',
          download: 'ಡೌನ್‌ಲೋಡ್',
          shareWhatsApp: 'WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ',
        },
        worksheetCreator: {
          title: 'ಪಥ-ಪ್ರಕ್ರಿಯಾ (ಕಾರ್ಯಹಾಳೆ ರಚನೆಕಾರ)',
          description: 'பல வகுப்புகளுக்கு வேறுபடுத்தப்பட்ட பணித்தாள்களை உருவாக்கவும்',
          uploadImage: 'ಪಠ್ಯಪುಸ್ತಕ ಪುಟವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
          selectGrades: 'ಗ್ರೇಡ್‌ಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
          generate: 'ಕಾರ್ಯಹಾಳೆಗಳನ್ನು ರಚಿಸಿ',
          preview: 'ಮುನ್ನೋಟ',
          copyToBoard: 'ಬೋರ್ಡ್‌ಗೆ ನಕಲಿಸಿ',
        },
        gyanKosh: {
            title: 'ಜ್ಞಾನ-ಕೋಶ (ಜ್ಞಾನದ ಆಧಾರ)',
            description: 'ನಿಮ್ಮ ಪಠ್ಯಪುಸ್ತಕದ ಅಧ್ಯಾಯಗಳಿಂದ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ',
        },
        rupdrishti: {
            title: 'ರೂಪದೃಷ್ಟಿ (ದೃಶ್ಯ ಒಳನೋಟ)',
            description: 'ನಿಮ್ಮ ಕಪ್ಪು ಹಲಗೆಗೆ ಸುಲಭವಾದ ಚಿತ್ರಗಳನ್ನು ರಚಿಸಿ',
        },
    },
    common: {
        save: 'ಉಳಿಸಿ',
        copy: 'ನಕಲಿಸಿ',
        copied: 'ನಕಲಿಸಲಾಗಿದೆ!',
        welcome: 'ಸ್ವಾಗತ',
        print: 'ಮುದ್ರಿಸು',
        download: 'ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
        share: 'ಹಂಚಿಕೊಳ್ಳಿ',
        backToHome: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
        downloadPdf: 'ಪಿಡಿಎಫ್ ಆಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
      },
    worksheetCreator: {
        uploadContent: 'ವಿಷಯವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
        dragAndDrop: 'ನಿಮ್ಮ ಫೈಲ್‌ಗಳನ್ನು ಇಲ್ಲಿ ಎಳೆದು ಬಿಡಿ',
        customizeOptions: 'ಆಯ್ಕೆಗಳನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ',
        optionsComingSoon: 'ಕಸ್ಟಮೈಸ್ ಆಯ್ಕೆಗಳು ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿವೆ!',
        generate: 'ಕಾರ್ಯಪಟ್ಟಿಯನ್ನು ರಚಿಸಿ',
        generating: 'ರಚಿಸಲಾಗುತ್ತಿದೆ...',
        generatedWorksheet: 'ರಚಿಸಲಾದ ಕಾರ್ಯಪಟ್ಟಿ',
        selectGrades: 'ಗ್ರೇಡ್‌ಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    },
  },
  mr: {
    app: {
        name: 'सहचारी',
        tagline: 'शिकवण्याच्या प्रवासात तुमचा AI सोबती',
        description: 'भारतातील बहु-श्रेणी वर्गांसाठी AI-शक्तीशाली शिक्षण सहाय्यक',
    },
    auth: {
      welcome: 'सहचारीमध्ये आपले स्वागत आहे',
      tagline: 'शिकवण्याच्या प्रवासात तुमचा AI सोबती',
      signIn: 'साइन इन करा',
      signUp: 'साइन अप करा',
      signOut: 'साइन आउट करा',
      alreadyHaveAccount: 'आधीच खाते आहे?',
      dontHaveAccount: 'खाते नाही?',
      continueWithGoogle: 'Google सह सुरू ठेवा',
      continueWithPhone: 'फोनसह सुरू ठेवा',
    },
    features: {
      storyMaker: {
        title: 'कहाणी-कार (कथा निर्माता)',
        description: 'तुमच्या स्थानिक भाषेत सांस्कृतिकदृष्ट्या संबंधित कथा तयार करा',
        placeholder: 'मातीचे प्रकार स्पष्ट करण्यासाठी शेतकऱ्यांबद्दल कथा तयार करा...',
        generate: 'कथा तयार करा',
        voiceInput: 'आवाज इनपुट',
        readAloud: 'मोठ्याने वाचा',
        download: 'डाउनलोड',
        shareWhatsApp: 'WhatsApp वर शेअर करा',
      },
      worksheetCreator: {
        title: 'पथ-प्रक्रिया (कार्यपत्रक निर्माता)',
        description: 'अनेक वर्गांसाठी विभिन्न कार्यपत्रके तयार करा',
        uploadImage: 'पाठ्यपुस्तक पृष्ठ अपलोड करा',
        selectGrades: 'वर्ग निवडा',
        generate: 'कार्यपत्रके तयार करा',
        preview: 'पूर्वावलोकन',
        copyToBoard: 'बोर्डवर कॉपी करा',
      },
      gyanKosh: {
        title: 'ज्ञान-कोश (ज्ञान भांडार)',
        description: 'तुमच्या पाठ्यपुस्तकातील अध्यायांमधून प्रश्न विचारा',
      },
      rupdrishti: {
        title: 'रूपदृष्टी (दृश्य अंतर्दृष्टी)',
        description: 'तुमच्या ब्लॅकबोर्डसाठी सोपी रेखाचित्रे तयार करा',
      },
    },
    common: {
      save: 'जतन करा',
      copy: 'कॉपी करा',
      copied: 'कॉपी केले!',
      welcome: 'स्वागत आहे',
      print: 'प्रिंट',
      download: 'डाउनलोड',
      share: 'शेअर करा',
      backToHome: 'घरी परत जा',
      downloadPdf: 'पीडीएफ म्हणून डाउनलोड करा',
    },
    worksheetCreator: {
        uploadContent: 'सामग्री अपलोड करा',
        dragAndDrop: 'तुमच्या फायली येथे ड्रॅग आणि ड्रॉप करा',
        customizeOptions: 'पर्याय सानुकूलित करा',
        optionsComingSoon: 'सानुकूलन पर्याय लवकरच येत आहेत!',
        generate: 'वर्कशीट तयार करा',
        generating: 'तयार होत आहे...',
        generatedWorksheet: 'तयार केलेली वर्कशीट',
        selectGrades: 'ग्रेड निवडा',
    },
  },
};

export const t = (lang: string, key: string) => {
    const keys = key.split('.');
    let result: any = translations[lang] || translations.en;
  
    for (const k of keys) {
      result = result[k];
      if (!result) {
        // Fallback to English if key not found in selected language
        let fallbackResult: any = translations.en;
        for (const fk of keys) {
          fallbackResult = fallbackResult[fk];
          if (!fallbackResult) return key; // Return the key itself if not found in English either
        }
        return fallbackResult;
      }
    }
  
    return result;
};
