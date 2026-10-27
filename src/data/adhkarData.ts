import { DhikrItem } from '../types/adhkar.ts';

/**
 * Morning Adhkar (أذكار الصباح)
 * Includes all 23 numbered supplications and Quranic verses from the authentic
 * booklet "الأذكار التي تقال صباحاً ومساءً" compiled by Shaykh Muhammad ibn Salih al-Uthaymeen
 * (dated 20-1-1418 AH), with precise Arabic vocalization, transliteration, English,
 * and Malayalam translations, and authentic citations.
 */
export const MORNING_ADHKAR: DhikrItem[] = [
  {
    id: 'm-1',
    category: 'morning',
    uthaymeenNumber: 1,
    arabic:
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالم (١) ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ (٢) الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ (٣) وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ (٤) أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ (٥)',
    transliteration:
      "Bismillahir-Rahmanir-Raheem. Alif-Lam-Meem. Dhalikal-Kitabu la rayba feeh, hudal-lil-muttaqeen. Alladheena yu'minoona bil-ghaybi wa yuqeemoonas-Salata wa mimma razaqnahum yunfiqoon. Walladheena yu'minoona bima unzila ilayka wa ma unzila min qablika wa bil-Akhirati hum yooqinoon. Ula'ika 'ala hudam-mir-Rabbihim wa ula'ika humul-muflihoon.",
    translation:
      'In the name of Allah, the Entirely Merciful, the Especially Merciful. Alif, Lam, Meem. This is the Book about which there is no doubt, a guidance for those conscious of Allah - Who believe in the unseen, establish prayer, and spend out of what We have provided for them, and who believe in what has been revealed to you, [O Muhammad], and what was revealed before you, and of the Hereafter they are certain [in faith]. Those are upon [right] guidance from their Lord, and it is those who are the successful.',
    malayalamTranslation:
      'പരമകാരുണികനും കരുണാനിധിയുമായ അല്ലാഹുവിന്റെ നാമത്തിൽ. അലിഫ്-ലാം-മീം. ഇത് അല്ലാഹുവിന്റെ വേദഗ്രന്ഥമാകുന്നു; ഇതിൽ യാതൊരു സംശയവുമില്ല, ഭയഭക്തിയുള്ളവർക്ക് (മുത്തഖികൾക്ക്) മാർഗദർശനമാണിത്. അദൃശ്യകാര്യങ്ങളിൽ വിശ്വസിക്കുകയും, നമസ്കാരം മുറപ്രകാരം നിർവ്വഹിക്കുകയും, നാം അവർക്ക് നൽകിയതിൽ നിന്ന് ചെലവഴിക്കുകയും ചെയ്യുന്നവരാണവർ. നിനക്ക് അവതരിപ്പിച്ചു കിട്ടിയതിലും നിനക്ക് മുമ്പ് അവതരിപ്പിക്കപ്പെട്ടതിലും അവർ വിശ്വസിക്കുന്നു; പരലോകത്തിൽ അവർ ദൃഢമായി വിശ്വസിക്കുകയും ചെയ്യുന്നു. അവരാകുന്നു തങ്ങളുടെ നാഥനിൽ നിന്നുള്ള സന്മാർഗത്തിലുള്ളവർ. അവർ തന്നെയാണ് വിജയികൾ.',
    target: 1,
    source: 'Surah Al-Baqarah (2:1-5) • Shaykh Ibn Uthaymeen Collection #1',
    virtue:
      'Reciting the opening of Surah Al-Baqarah brings divine guidance, firm faith in the unseen, and spiritual protection for the day.',
    malayalamVirtue:
      'സൂറത്തുൽ ബഖറയുടെ ആദ്യ അഞ്ച് ആയത്തുകൾ പാരായണം ചെയ്യുന്നത് ദിവ്യമായ സന്മാർഗ്ഗദർശനവും, അദൃശ്യകാര്യങ്ങളിൽ ദൃഢവിശ്വാസവും, ആ ദിവസത്തെ സംരക്ഷണവും നേടിത്തരുന്നു.',
    repeatNote: '1 time (Surah Al-Baqarah 1-5)',
    isQuranic: true,
    reciter: 'Sheikh Mishary Rashid Alafasy',
    audioClipType: 'tajweed',
    audioUrls: [
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/8.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/9.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/10.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/11.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/12.mp3',
    ],
  },
  {
    id: 'm-2',
    category: 'morning',
    uthaymeenNumber: 2,
    arabic:
      'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration:
      "Allahu la ilaha illa Huwal-Hayyul-Qayyum, la ta'khudhuhu sinatuw-wa la nawm, lahu ma fis-samawati wa ma fil-ard, man dhal-ladhi yashfa'u 'indahu illa bi'idhnih, ya'lamu ma bayna aydihim wa ma khalfahum, wa la yuhitoona bishay'im-min 'ilmihi illa bima sha', wasi'a Kursiyyuhus-samawati wal-ard, wa la ya'ooduhu hifzuhuma, wa Huwal-'Aliyyul-'Azeem.",
    translation:
      'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    malayalamTranslation:
      'അല്ലാഹു, അവനല്ലാതെ യാതൊരു ദൈവവുമില്ല, അവൻ എന്നെന്നും ജീവിച്ചിരിക്കുന്നവനും സർവ്വലോക പരിപാലകനുമാണ്. അവനെ മയക്കമോ ഉറക്കമോ ബാധിക്കുകയില്ല. ആകാശഭൂമികളിലുള്ളതെല്ലാം അവന്റെതാണ്. അവന്റെ അനുവാദമില്ലാതെ അവന്റെയടുക്കൽ ശുപാർശ ചെയ്യാൻ കഴിയുന്നവൻ ആരാണ്? അവരുടെ മുന്നിലുള്ളതും പിന്നിലുള്ളതും അവൻ അറിയുന്നു. അവന്റെ അറിവിൽ നിന്ന് അവൻ ഉദ്ദേശിക്കുന്നതല്ലാതെ മറ്റൊന്നും അവർക്ക് ഗ്രഹിക്കാനാവില്ല. അവന്റെ കുർസിയ്യ് ആകാശങ്ങളെയും ഭൂമിയെയും ഉൾക്കൊള്ളുന്നതാണ്. അവ രണ്ടിന്റെയും സംരക്ഷണം അവനൊരു ഭാരമേയല്ല. അവൻ പരമോന്നതനും അതിമഹാനുമാകുന്നു.',
    target: 1,
    source: 'Surah Al-Baqarah (2:255) • Al-Hakim (1/562) & At-Tabarani • Shaykh Ibn Uthaymeen #2',
    virtue:
      'Whoever recites this when waking up in the morning will be shielded from jinn and harm until evening.',
    malayalamVirtue:
      'പ്രഭാതത്തിൽ ആയത്തുൽ കുർസിയ്യ് ഓതുന്നവൻ വൈകുന്നേരം വരെ ജിന്നുകളിൽ നിന്നും എല്ലാവിധ ദോഷങ്ങളിൽ നിന്നും അല്ലാഹുവിന്റെ കാവലിലായിരിക്കും (ഹാകിം, ത്വബ്റാനി).',
    repeatNote: '1 time (Ayat al-Kursi)',
    isQuranic: true,
    reciter: 'Sheikh Mishary Rashid Alafasy',
    audioClipType: 'tajweed',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3',
  },
  {
    id: 'm-3',
    category: 'morning',
    uthaymeenNumber: 3,
    arabic:
      'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ، كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ، وَقَالُوا سَمِعْنَا وَأَطَعْنَا غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ (٢٨٥) لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا، لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ، رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا، رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا، رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ، وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا، أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ (٢٨٦)',
    transliteration:
      "Amanar-Rasoolu bima unzila ilayhi mir-Rabbihi wal-mu'minoon, kullun amana billahi wa mala'ikatihi wa kutubihi wa rusulih, la nufarriqu bayna ahadim-mir-rusulih, wa qaloo sami'na wa ata'na ghufranaka Rabbana wa-ilaykal-maseer. La yukallifullahu nafsan illa wus'aha, laha ma kasabat wa 'alayha maktasabat, Rabbana la tu'akhidhna in-naseena aw akhta'na, Rabbana wa la tahmil 'alayna isran kama hamaltahu 'alalladheena min qablina, Rabbana wa la tuhammilna ma la taqata lana bih, wa'fu 'anna waghfir lana warhamna, Anta mawlana fansurna 'alal-qawmil-kafireen.",
    translation:
      'The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers, [saying], "We make no distinction between any of His messengers." And they say, "We hear and we obey. [We seek] Your forgiveness, our Lord, and to You is the [final] destination." Allah does not charge a soul except [with that within] its capacity... "Our Lord, do not impose blame upon us if we have forgotten or erred... and pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people."',
    malayalamTranslation:
      'റസൂൽ തനിക്ക് തന്റെ രക്ഷിതാവിങ്കൽ നിന്ന് അവതരിപ്പിക്കപ്പെട്ടതിൽ വിശ്വസിച്ചിരിക്കുന്നു; സത്യവിശ്വാസികളും. അവരെല്ലാവരും അല്ലാഹുവിലും അവന്റെ മലക്കുകളിലും അവന്റെ വേദഗ്രന്ഥങ്ങളിലും അവന്റെ ദൂതന്മാരിലും വിശ്വസിച്ചിരിക്കുന്നു. അവന്റെ ദൂതന്മാരിൽ ആർക്കുമിടയിലും ഞങ്ങൾ ഒരു വിവേചനവും കൽപ്പിക്കുന്നില്ല (എന്നവർ പറയുന്നു). അവർ പറഞ്ഞു: ഞങ്ങൾ കേൾക്കുകയും അനുസരിക്കുകയും ചെയ്തിരിക്കുന്നു. ഞങ്ങളുടെ രക്ഷിതാവേ, ഞങ്ങൾ നിന്നോട് പാപമോചനം തേടുന്നു, നിന്നിലേക്കാണ് ഞങ്ങളുടെ മടക്കം. അല്ലാഹു ഒരാളോടും അയാളുടെ കഴിവിൽ കവിഞ്ഞത് ശാസിക്കുന്നില്ല... ഞങ്ങളുടെ നാഥാ, ഞങ്ങൾ മറന്നുപോകുകയോ തെറ്റുപറ്റുകയോ ചെയ്തിട്ടുണ്ടെങ്കിൽ ഞങ്ങളെ നീ പിടികൂടരുതേ... ഞങ്ങൾക്ക് നീ വിട്ടുതരികയും, പാപങ്ങൾ പൊറുത്തുതരികയും, ഞങ്ങളോട് കരുണ കാണിക്കുകയും ചെയ്യേണമേ. നീയാണ് ഞങ്ങളുടെ രക്ഷാധികാരി; അതിനാൽ സത്യനിഷേധികളായ ജനതയ്ക്കെതിരിൽ ഞങ്ങൾക്ക് നീ വിജയം നൽകേണമേ.',
    target: 1,
    source:
      'Surah Al-Baqarah (2:285-286) • Sahih al-Bukhari 5009 & Muslim 807 • Shaykh Ibn Uthaymeen #3',
    virtue:
      'The Prophet (ﷺ) said: "Whoever recites the last two verses of Surah Al-Baqarah at night/day, they will suffice him for all protection and blessing."',
    malayalamVirtue:
      'നബി (ﷺ) അരുളി: "ആരെങ്കിലും സൂറത്തുൽ ബഖറയിലെ അവസാനത്തെ രണ്ട് ആയത്തുകൾ പാരായണം ചെയ്താൽ, എല്ലാവിധ ദോഷങ്ങളിൽ നിന്നുമുള്ള കാവലിന് അവ അവന് മതിയാകുന്നതാണ്" (ബുഖാരി, മുസ്ലിം).',
    repeatNote: '1 time (Last two verses of Al-Baqarah)',
    isQuranic: true,
    reciter: 'Sheikh Mishary Rashid Alafasy',
    audioClipType: 'tajweed',
    audioUrls: [
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/292.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/293.mp3',
    ],
  },
  {
    id: 'm-4',
    category: 'morning',
    uthaymeenNumber: 4,
    arabic:
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nحم (١) تَنزِيلُ الْكِتَابِ مِنَ اللَّهِ الْعَزِيزِ الْعَلِيمِ (٢) غَافِرِ الذَّنبِ وَقَابِلِ التَّوْبِ شَدِيدِ الْعِقَابِ ذِي الطَّوْلِ، لَا إِلَٰهَ إِلَّا هُوَ، إِلَيْهِ الْمَصِيرُ (٣)',
    transliteration:
      "Ha-Meem. Tanzeelul-Kitabi minallahil-'Azeezil-'Aleem. Ghafiridh-dhambi wa qabilit-tawbi shadeedil-'iqabi dhit-tawli la ilaha illa Huwa ilayhil-maseer.",
    translation:
      'Ha, Meem. The revelation of the Book is from Allah, the Exalted in Might, the Knowing. The forgiver of sin, acceptor of repentance, severe in punishment, owner of abundance. There is no deity except Him; to Him is the final destination.',
    malayalamTranslation:
      'ഹാ-മീം. പ്രതാപശാലിയും സർവ്വജ്ഞനുമായ അല്ലാഹുവിങ്കൽ നിന്ന് അവതരിപ്പിക്കപ്പെട്ട വേദഗ്രന്ഥമാണിത്. പാപം പൊറുക്കുന്നവനും പശ്ചാത്താപം സ്വീകരിക്കുന്നവനും കഠിനമായി ശിക്ഷിക്കുന്നവനും ഔദാര്യവാനുമായുള്ളവൻ. അവനല്ലാതെ യാതൊരു ആരാധ്യനുമില്ല, അവങ്കലേക്ക് തന്നെയാണ് മടക്കം.',
    target: 1,
    source: 'Surah Ghafir (40:1-3) • Sunan at-Tirmidhi 2879 • Shaykh Ibn Uthaymeen #4',
    virtue:
      'The Prophet (ﷺ) stated that reciting Ha-Meem (Ghafir 1-3) together with Ayat al-Kursi in the morning preserves a person until evening.',
    malayalamVirtue:
      'പ്രഭാതത്തിൽ ആയത്തുൽ കുർസിയ്യോടൊപ്പം സൂറത്തു ഗാഫിറിലെ ആദ്യ മൂന്ന് ആയത്തുകൾ കൂടി ഓതുന്നവൻ വൈകുന്നേരം വരെ സകല തിന്മകളിൽ നിന്നും സംരക്ഷിക്കപ്പെടുമെന്ന് നബി (ﷺ) അരുളിയിരിക്കുന്നു (തിർമിദി).',
    repeatNote: '1 time (Surah Ghafir 1-3)',
    isQuranic: true,
    reciter: 'Sheikh Mishary Rashid Alafasy',
    audioClipType: 'tajweed',
    audioUrls: [
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4134.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4135.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4136.mp3',
    ],
  },
  {
    id: 'm-5',
    category: 'morning',
    uthaymeenNumber: 5,
    arabic:
      'هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ، عَالِمُ الْغَيْبِ وَالشَّهَادَةِ، هُوَ الرَّحْمَٰنُ الرَّحِيمُ (٢٢) هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ، سُبْحَانَ اللَّهِ عَمَّا يُشْرِكُونَ (٢٣) هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ، لَهُ الْأَسْمَاءُ الْحُسْنَىٰ، يُسَبِّحُ لَهُ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ، وَهُوَ الْعَزِيزُ الْحَكِيمُ (٢٤)',
    transliteration:
      "Huwallahul-ladhi la ilaha illa Huwa, 'Alimul-ghaybi wash-shahadah, Huwar-Rahmanur-Raheem. Huwallahul-ladhi la ilaha illa Huwal-Malikul-Quddoosus-Salamul-Mu'minul-Muhayminul-'Azeezul-Jabbarul-Mutakabbir, Subhanallahi 'amma yushrikoon. Huwallahul-Khaliqul-Bari'ul-Musawwiru lahul-Asma'ul-Husna, yusabbihu lahu ma fis-samawati wal-ard, wa Huwal-'Azeezul-Hakeem.",
    translation:
      'He is Allah, other than whom there is no deity, Knower of the unseen and the witnessed. He is the Entirely Merciful, the Especially Merciful. He is Allah, other than whom there is no deity, the Sovereign, the Pure, the Perfection, the Bestower of Faith, the Overseer, the Exalted in Might, the Compeller, the Superior. Exalted is Allah above whatever they associate with Him. He is Allah, the Creator, the Inventor, the Fashioner; to Him belong the best names. Whatever is in the heavens and earth is exalting Him. And He is the Exalted in Might, the Wise.',
    malayalamTranslation:
      'യാതൊരു ദൈവവുമില്ലാത്ത അല്ലാഹുവാണ് അവൻ. അദൃശ്യവും ദൃശ്യവും അറിയുന്നവൻ. അവൻ പരമകാരുണികനും കരുണാനിധിയുമാകുന്നു. യാതൊരു ദൈവവുമില്ലാത്ത അല്ലാഹുവാണ് അവൻ. അവൻ രാജാവും, പരമപരിശുദ്ധനും, സമാധാനം നൽകുന്നവനും, അഭയം നൽകുന്നവനും, മേൽനോട്ടം വഹിക്കുന്നവനും, പ്രതാപശാലിയും, പരമാധികാരിയും, സർവ്വോന്നതനുമാകുന്നു. അവർ പങ്കുചേർക്കുന്നതിൽ നിന്നെല്ലാം അല്ലാഹു എത്രയോ പരിശുദ്ധൻ! സൃഷ്ടികർത്താവും, ശൂന്യതയിൽ നിന്ന് ഉണ്ടാക്കിയവനും, രൂപം നൽകിയവനുമായ അല്ലാഹുവാണ് അവൻ. അവന്നാണ് ഏറ്റവും ഉത്കൃഷ്ടമായ നാമങ്ങളുള്ളത്. ആകാശങ്ങളിലുള്ളതും ഭൂമിയിലുള്ളതുമെല്ലാം അവന്റെ പരിശുദ്ധിയെ വാഴ്ത്തുന്നു. അവൻ പ്രതാപശാലിയും യുക്തിമാനുമാകുന്നു.',
    target: 1,
    source: 'Surah Al-Hashr (59:22-24) • Sunan at-Tirmidhi 2922 • Shaykh Ibn Uthaymeen #5',
    virtue:
      'Reciting these concluding verses of Surah Al-Hashr prompts seventy thousand angels to supplicate for Allah’s mercy and forgiveness upon the reciter until evening.',
    malayalamVirtue:
      'സൂറത്തുൽ ഹശ്റിലെ അവസാനത്തെ ഈ ആയത്തുകൾ പ്രഭാതത്തിൽ പാരായണം ചെയ്യുന്നയാൾക്കായി വൈകുന്നേരം വരെ എഴുപതിനായിരം മലക്കുകൾ കാരുണ്യത്തിനും പാപമോചനത്തിനുമായി പ്രാർത്ഥിച്ചുകൊണ്ടിരിക്കുന്നതാണ് (തിർമിദി).',
    repeatNote: '1 time (Surah Al-Hashr 22-24)',
    isQuranic: true,
    reciter: 'Sheikh Mishary Rashid Alafasy',
    audioClipType: 'tajweed',
    audioUrls: [
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5148.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5149.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5150.mp3',
    ],
  },
  {
    id: 'm-6',
    category: 'morning',
    uthaymeenNumber: 6,
    arabic:
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ (١) اللَّهُ الصَّمَدُ (٢) لَمْ يَلِدْ وَلَمْ يُولَدْ (٣) وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ (٤)\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (١) مِن شَرِّ مَا خَلَقَ (٢) وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ (٣) وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ (٤) وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ (٥)\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ (١) مَلِكِ النَّاسِ (٢) إِلَٰهِ النَّاسِ (٣) مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ (٤) الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ (٥) مِنَ الْجِنَّةِ وَالنَّاسِ (٦)',
    transliteration:
      "Qul Huwallahu Ahad. Allahus-Samad. Lam yalid wa lam yoolad. Wa lam yakun lahu kufuwan ahad. / Qul a'oodhu bi-Rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-'uqad. Wa min sharri hasidin idha hasad. / Qul a'oodhu bi-Rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fee sudoorin-nas. Minal-jinnati wan-nas.",
    translation:
      'Say, "He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent." / Say, "I seek refuge in the Lord of daybreak from the evil of that which He created and from the evil of darkness when it settles and from the evil of the blowers in knots and from the evil of an envier when he envies." / Say, "I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer who whispers into the breasts of mankind - from among the jinn and mankind."',
    malayalamTranslation:
      'പറയുക: അവൻ അല്ലാഹു ഏകനാകുന്നു. അല്ലാഹു സർവ്വരുടെയും ആശ്രയമാകുന്നു. അവൻ ആർക്കും ജന്മം നൽകിയിട്ടില്ല, അവന് ആരും ജന്മം നൽകിയിട്ടുമില്ല, അവന് തുല്യനായി ആരുമില്ല. / പറയുക: പ്രഭാതത്തിന്റെ നാഥനോട് ഞാൻ ശരണം തേടുന്നു; അവൻ സൃഷ്ടിച്ച ജീവികളുടെ ദോഷങ്ങളിൽ നിന്നും, ഇരുളടയുമ്പോൾ രാത്രിയുടെ കെടുതികളിൽ നിന്നും, കെട്ടുകളിൽ ഊതുന്ന മന്ത്രവാദികളുടെ ഉപദ്രവങ്ങളിൽ നിന്നും, അസൂയപ്പെടുന്നവൻ അസൂയ വെക്കുമ്പോൾ അവന്റെ കെടുതികളിൽ നിന്നും. / പറയുക: മനുഷ്യരുടെ രക്ഷിതാവിനോട് ഞാൻ അഭയം തേടുന്നു; മനുഷ്യരുടെ രാജാവിനോട്, മനുഷ്യരുടെ ആരാധ്യനോട്, ദുർബോധനം നടത്തി പിൻവാങ്ങിക്കളയുന്ന പിശാചിന്റെ ഉപദ്രവങ്ങളിൽ നിന്നും; മനുഷ്യരുടെ ഹൃദയങ്ങളിൽ ദുർബോധനം നടത്തുന്നവനായ, മനുഷ്യരിലും ജിന്നുകളിലും പെട്ടവനായ പിശാചിൽ നിന്നും.',
    target: 3,
    source: 'Abu Dawud 5082 & Tirmidhi 3575 • Shaykh Ibn Uthaymeen #6',
    virtue:
      'The Prophet (ﷺ) said: "Recite Qul Huwallahu Ahad and the Mu\'awwidhatayn three times every morning and evening; they will suffice you against every single evil."',
    malayalamVirtue:
      'നബി (ﷺ) അരുളി: "സൂറത്തുൽ ഇഖ്ലാസും മുഅവ്വിദതൈനിയും (ഫലഖ്, നാസ്) രാവിലെയും വൈകുന്നേരവും 3 തവണ വീതം ഓതുക; എല്ലാവിധ ദോഷങ്ങളിൽ നിന്നുമുള്ള കാവലിന് അത് നിനക്ക് മതിയാകും" (അബൂദാവൂദ്, തിർമിദി).',
    repeatNote: '3 times each (Al-Ikhlas, Al-Falaq, An-Nas)',
    isQuranic: true,
    reciter: 'Sheikh Mishary Rashid Alafasy',
    audioClipType: 'tajweed',
    audioUrls: [
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6221.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6222.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6223.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6224.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6225.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6226.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6227.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6228.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6229.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6230.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6231.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6232.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6233.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6234.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6235.mp3',
    ],
  },
  {
    id: 'm-7',
    category: 'morning',
    uthaymeenNumber: 7,
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'oodhu bi-kalimatillahit-tammati min sharri ma khalaq",
    translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    malayalamTranslation:
      'അല്ലാഹു സൃഷ്ടിച്ച സർവ്വ സൃഷ്ടികളുടെയും ദോഷങ്ങളിൽ നിന്നും അവന്റെ സമ്പൂർണ്ണ വചനങ്ങളെക്കൊണ്ട് ഞാൻ രക്ഷതേടുന്നു.',
    target: 3,
    source: 'Sahih Muslim 2709 • Shaykh Ibn Uthaymeen #7',
    virtue:
      'Whoever recites this 3 times in the evening and morning will be protected against poisonous stings, venomous creatures, and malicious harm.',
    malayalamVirtue:
      'രാവിലെയും വൈകുന്നേരവും ഇത് 3 തവണ ചൊല്ലുന്നവനെ വിഷജന്തുക്കളുടെ കുത്തോ കടയോ മറ്റു ദോഷങ്ങളോ ബാധിക്കുകയില്ല (മുസ്ലിം).',
    repeatNote: '3 times',
    type: 'adhkar',
    title: 'വിഷജന്തുക്കളിൽ നിന്നും ഉപദ്രവങ്ങളിൽ നിന്നുമുള്ള കാവൽ',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/97.mp3',
  },
  {
    id: 'm-8',
    category: 'morning',
    uthaymeenNumber: 8,
    arabic:
      'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration:
      "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Samee'ul-'Aleem",
    translation:
      'In the name of Allah, with Whose name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
    malayalamTranslation:
      'ആരുടെ നാമത്തോടൊപ്പം ഭൂമിയിലോ ആകാശത്തോ ഉള്ള യാതൊരു വസ്തുവും ഉപദ്രവം വരുത്തുകയില്ലയോ, ആ അല്ലാഹുവിന്റെ നാമത്തിൽ. അവൻ എല്ലാം കേൾക്കുന്നവനും അറിയുന്നവനുമാകുന്നു.',
    target: 3,
    source: 'Abu Dawud 5088 & Tirmidhi 3388 • Shaykh Ibn Uthaymeen #8',
    virtue:
      'Whoever recites this 3 times in the morning will not be afflicted by any unexpected calamity until evening, and whoever recites it in the evening will not be afflicted until morning.',
    malayalamVirtue:
      'പ്രഭാതത്തിൽ ഇത് 3 തവണ ചൊല്ലുന്നവന് വൈകുന്നേരം വരെയും, വൈകുന്നേരം ചൊല്ലുന്നവന് പ്രഭാതം വരെയും പെട്ടെന്നുണ്ടാകുന്ന യാതൊരു വിപത്തും ഭവിഷ്യത്തും ഏൽക്കുകയില്ല (അബൂദാവൂദ്, തിർമിദി).',
    repeatNote: '3 times',
    type: 'adhkar',
    title: 'ആകസ്മിക വിപത്തുകളിൽ നിന്നുള്ള സംരക്ഷണം',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/86.mp3',
  },
  {
    id: 'm-9',
    category: 'morning',
    uthaymeenNumber: 9,
    arabic:
      'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    transliteration:
      "Radeetu billahi Rabban, wa bil-Islami deenan, wa bi-Muhammadin sallallahu 'alayhi wa sallama Nabiyya",
    translation:
      'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (peace and blessings of Allah be upon him) as my Prophet.',
    malayalamTranslation:
      'അല്ലാഹുവിനെ രക്ഷിതാവായും, ഇസ്ലാമിനെ ദീനായും, മുഹമ്മദ് നബി (സ്വ) യെ പ്രവാചകനായും ഞാൻ തൃപ്തിപ്പെട്ടിരിക്കുന്നു.',
    target: 3,
    source: 'Abu Dawud 5072 & Tirmidhi 3389 • Shaykh Ibn Uthaymeen #9',
    virtue:
      'Allah has promised that whoever recites this 3 times morning and evening, He will surely please him on the Day of Resurrection.',
    malayalamVirtue:
      'രാവിലെയും വൈകുന്നേരവും ഇത് 3 തവണ ചൊല്ലുന്നയാളെ അന്ത്യദിനത്തിൽ തൃപ്തിപ്പെടുത്തൽ അല്ലാഹുവിന്റെ ബാധ്യതയായിരിക്കുന്നുവെന്ന് നബി (ﷺ) അരുളി (അബൂദാവൂദ്, തിർമിദി).',
    repeatNote: '3 times',
    type: 'adhkar',
    title: 'അല്ലാഹുവിന്റെ പ്രീതി ലഭിക്കാനുള്ള പ്രാർത്ഥന',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/87.mp3',
  },
  {
    id: 'm-10',
    category: 'morning',
    uthaymeenNumber: 10,
    arabic:
      'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    transliteration:
      "Asbahna wa-asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in qadeer. Rabbi as'aluka khayra ma fee hadhal-yawmi wa khayra ma ba'dahu, wa a'oodhu bika min sharri ma fee hadhal-yawmi wa sharri ma ba'dah, Rabbi a'oodhu bika minal-kasali wa soo'il-kibar, Rabbi a'oodhu bika min 'adhabin fin-nari wa 'adhabin fil-qabr.",
    translation:
      'We have entered the morning and the kingdom belongs to Allah, and all praise is for Allah. None has the right to be worshipped except Allah alone, without partner. To Him belongs all sovereignty and to Him belongs all praise, and He has power over all things. My Lord, I ask You for the good of what is in this day and the good of what follows it, and I seek refuge in You from the evil of what is in this day and the evil of what follows it. My Lord, I seek refuge in You from laziness and the hardships of old age. My Lord, I seek refuge in You from punishment in the Fire and punishment in the grave.',
    malayalamTranslation:
      'ഞങ്ങളിതാ പ്രഭാതത്തിലേക്ക് പ്രവേശിച്ചിരിക്കുന്നു; സർവ്വാധിപത്യവും അല്ലാഹുവിന്നുള്ളതായി പ്രഭാതമായിരിക്കുന്നു. സർവ്വസ്തുതിയും അല്ലാഹുവിന്നാണ്. അല്ലാഹുവല്ലാതെ യാതൊരു ആരാധ്യനുമില്ല, അവൻ ഏകനാണ്, അവന് യാതൊരു പങ്കുകാരനുമില്ല. അവന്നാണ് സർവ്വാധികാരവും സർവ്വസ്തുതിയും, അവൻ എല്ലാ കാര്യത്തിനും കഴിവുള്ളവനാണ്. എന്റെ രക്ഷിതാവേ, ഈ ദിവസത്തിലുള്ള നന്മയും ഇതിനുശേഷമുള്ള നന്മയും നിന്നോട് ഞാൻ ചോദിക്കുന്നു; ഈ ദിവസത്തിലുള്ള തിന്മയിൽ നിന്നും ഇതിനുശേഷമുള്ള തിന്മയിൽ നിന്നും നിന്നിൽ ഞാൻ അഭയം തേടുന്നു. എന്റെ നാഥാ, മടിയിൽ നിന്നും വാർദ്ധക്യത്തിന്റെ അവശതകളിൽ നിന്നും നിന്നിൽ ഞാൻ ശരണം തേടുന്നു. എന്റെ നാഥാ, നരകശിക്ഷയിൽ നിന്നും ഖബർ ശിക്ഷയിൽ നിന്നും നിന്നിൽ ഞാൻ കാവൽ ചോദിക്കുന്നു.',
    target: 1,
    source: 'Sahih Muslim 2723 • Shaykh Ibn Uthaymeen #10',
    virtue:
      'Affirms complete submission to Allah’s dominion, asking for the blessings of the new day while seeking sanctuary from the Fire, laziness, and the grave.',
    malayalamVirtue:
      'അല്ലാഹുവിന്റെ സർവ്വാധിപത്യം ഏറ്റുപറയുകയും, പുതിയ ദിനത്തിന്റെ എല്ലാ നന്മകളും ചോദിക്കുകയും, മടി, വാർദ്ധക്യത്തിന്റെ ദുരിതങ്ങൾ, നരകശിക്ഷ, ഖബർശിക്ഷ എന്നിവയിൽ നിന്ന് സമ്പൂർണ്ണ കാവൽ നേടുകയും ചെയ്യുന്നു (മുസ്ലിം).',
    repeatNote: '1 time',
    type: 'adhkar',
    title: 'പ്രഭാതത്തിൽ നന്മ തേടിയുള്ള പ്രാർത്ഥന',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/77.mp3',
  },
  {
    id: 'm-11',
    category: 'morning',
    uthaymeenNumber: 11,
    arabic:
      'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    transliteration:
      'Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namootu wa-ilaykan-nushoor.',
    translation:
      'O Allah, by You we have entered the morning, and by You we enter the evening, and by You we live, and by You we die, and to You is the final resurrection.',
    malayalamTranslation:
      'അല്ലാഹുവേ, നിന്റെ കാരുണ്യത്താൽ നാം പ്രഭാതത്തിലെത്തി, നിന്റെ അനുഗ്രഹത്താൽ നാം സന്ധ്യയിലെത്തുന്നു, നിന്റെ കൽപ്പനയാൽ നാം ജീവിക്കുന്നു, നിന്റെ വിധിയാൽ നാം മരിക്കുന്നു, നിന്നിലേക്കാണ് പുനരുത്ഥാനം.',
    target: 1,
    source: 'Abu Dawud 5068 & Tirmidhi 3391 • Shaykh Ibn Uthaymeen #11',
    virtue:
      'Entrusts life, death, and resurrection into the divine keeping of Allah at daybreak.',
    malayalamVirtue:
      'പ്രഭാതവേളയിൽ ജീവനും മരണവും പുനരുത്ഥാനവും പൂർണ്ണമായും അല്ലാഹുവിൽ ഭരമേൽപ്പിക്കുന്ന സുന്ദരമായ പ്രാർത്ഥന (അബൂദാവൂദ്, തിർമിദി).',
    repeatNote: '1 time',
    type: 'adhkar',
    title: 'പ്രഭാതത്തിൽ അല്ലാഹുവിൽ ഭരമേൽപ്പിക്കുന്ന പ്രാർത്ഥന',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/78.mp3',
  },
  {
    id: 'm-12',
    category: 'morning',
    uthaymeenNumber: 12,
    arabic:
      'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ، فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
    transliteration:
      'Allahumma ma asbaha bee min ni\'matin aw bi-ahadim-min khalqik, faminka wahdaka la shareeka lak, falakal-hamdu wa lakash-shukr.',
    translation:
      'O Allah, whatever blessing has reached me or any of Your creation this morning is from You alone, without partner. To You belongs all praise and to You belongs all gratitude.',
    malayalamTranslation:
      'അല്ലാഹുവേ, ഈ പ്രഭാതത്തിൽ എനിക്കോ നിന്റെ സൃഷ്ടികളിൽ മറ്റാർക്കെങ്കിലുമോ എന്തെങ്കിലും അനുഗ്രഹം ലഭിച്ചിട്ടുണ്ടെങ്കിൽ അത് നിന്നിൽ നിന്ന് മാത്രമുള്ളതാണ്, നിനക്ക് യാതൊരു പങ്കുകാരനുമില്ല. അതിനാൽ സർവ്വസ്തുതിയും നിനക്കാണ്, സർവ്വ നന്ദിയും നിനക്കാണ്.',
    target: 1,
    source: "Abu Dawud 5073 & An-Nasa'i • Shaykh Ibn Uthaymeen #12",
    virtue:
      'The Prophet (ﷺ) said: "Whoever recites this in the morning has fulfilled his gratitude for that day, and whoever says it in the evening has fulfilled his gratitude for that night."',
    malayalamVirtue:
      'നബി (ﷺ) അരുളി: "ആരെങ്കിലും പ്രഭാതത്തിൽ ഇത് ചൊല്ലിയാൽ ആ ദിവസത്തെ ശുക്റ് (നന്ദി) അവൻ നിറവേറ്റി; ആരെങ്കിലും വൈകുന്നേരം ഇത് ചൊല്ലിയാൽ ആ രാത്രിയിലെ ശുക്റ് അവൻ നിറവേറ്റി" (അബൂദാവൂദ്, നസാഈ).',
    repeatNote: '1 time (Fulfilling Daily Gratitude)',
    type: 'adhkar',
    title: 'പ്രതിദിന ശുക്റ് (നന്ദി) നിർവ്വഹിക്കുന്ന പ്രാർത്ഥന',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/81.mp3',
  },
  {
    id: 'm-13',
    category: 'morning',
    uthaymeenNumber: 13,
    arabic:
      'اللَّهُمَّ إِنِّي أَصْبَحْتُ فِي نِعْمَةٍ وَعَافِيَةٍ وَسِتْرٍ، فَأَتِمَّ نِعْمَتَكَ عَلَيَّ وَعَافِيَتَكَ وَسِتْرَكَ فِي الدُّنْيَا وَالْآخِرَةِ',
    transliteration:
      "Allahumma inni asbahtu fee ni'matiw-wa 'afiyatiw-wa sitr, fa'atimma ni'mataka 'alayya wa 'afiyataka wa sitraka fid-dunya wal-akhirah.",
    translation:
      'O Allah, I have entered the morning enjoying favor, well-being, and protection from You. Therefore, complete Your favor upon me, Your well-being, and Your protection in this world and the Hereafter.',
    malayalamTranslation:
      'അല്ലാഹുവേ, നിന്നിൽ നിന്നുള്ള അനുഗ്രഹത്തിലും സൗഖ്യത്തിലും കാവലിലും ആയാണ് ഞാൻ പ്രഭാതത്തിലേക്ക് പ്രവേശിച്ചിരിക്കുന്നത്. അതിനാൽ ഇഹത്തിലും പരത്തിലും നിന്റെ അനുഗ്രഹവും സൗഖ്യവും കാവലും നീ എനിക്ക് പൂർത്തിയാക്കി തരേണമേ.',
    target: 3,
    source: 'Ibn as-Sunni 55 & Kitab al-Adhkar • Shaykh Ibn Uthaymeen #13',
    virtue:
      'Reciting this 3 times morning and evening guarantees that Allah will complete His bounty, health, and covering of human faults in both worlds.',
    malayalamVirtue:
      'രാവിലെയും വൈകുന്നേരവും ഇത് 3 തവണ ചൊല്ലുന്നയാൾക്ക് ഇഹത്തിലും പരത്തിലും അല്ലാഹു തന്റെ അനുഗ്രഹവും ആരോഗ്യവും പാപങ്ങൾ മറച്ചുവെക്കലും പൂർത്തിയാക്കി നൽകുന്നതാണ് (ഇബ്നുസ്സുന്നി).',
    repeatNote: '3 times',
    type: 'adhkar',
    title: 'അനുഗ്രഹവും സൗഖ്യവും പൂർത്തിയാക്കാനുള്ള പ്രാർത്ഥന',
  },
  {
    id: 'm-14',
    category: 'morning',
    uthaymeenNumber: 14,
    arabic:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ',
    transliteration:
      "Allahumma inni a'oodhu bika minal-hammi wal-hazan, wa a'oodhu bika minal-'ajzi wal-kasal, wa a'oodhu bika minal-jubni wal-bukhl, wa a'oodhu bika min ghalabatid-dayni wa qahrir-rijal.",
    translation:
      'O Allah, I seek refuge in You from worry and grief, and I seek refuge in You from incapacity and laziness, and I seek refuge in You from cowardice and stinginess, and I seek refuge in You from being overwhelmed by debt and oppressed by men.',
    malayalamTranslation:
      'അല്ലാഹുവേ, ഉത്കണ്ഠയിൽ നിന്നും ദുഃഖത്തിൽ നിന്നും ഞാൻ നിന്നിൽ ശരണം തേടുന്നു; കഴിവുകേടിൽ നിന്നും മടിയിൽ നിന്നും ഞാൻ നിന്നിൽ ശരണം തേടുന്നു; ഭീരുത്വത്തിൽ നിന്നും പിശുക്കിൽ നിന്നും നിന്നിൽ ഞാൻ കാവൽ ചോദിക്കുന്നു; കടം പെരുകുന്നതിൽ നിന്നും മനുഷ്യരുടെ അടിച്ചമർത്തലിൽ (മേൽക്കോയ്മയിൽ) നിന്നും നിന്നിൽ ഞാൻ അഭയം തേടുന്നു.',
    target: 1,
    source: 'Sahih al-Bukhari 2893 & Abu Dawud 1555 • Shaykh Ibn Uthaymeen #14',
    virtue:
      'The Prophet (ﷺ) taught this supplication to Abu Umamah; reciting it morning and evening relieves anxiety and removes heavy debt.',
    malayalamVirtue:
      'നബി (ﷺ) അബൂ ഉമാമ (റ) ക്ക് പഠിപ്പിച്ചുകൊടുത്ത പ്രാർത്ഥനയാണിത്; രാവിലെയും വൈകുന്നേരവും ഇത് ചൊല്ലിയാൽ മനോവിഷമങ്ങളും സങ്കടങ്ങളും നീങ്ങുകയും കടങ്ങൾ വീടുകയും ചെയ്യുന്നതാണ് (ബുഖാരി, അബൂദാവൂദ്).',
    repeatNote: '1 time (Relief from Anxiety & Debt)',
    type: 'adhkar',
    title: 'മനോവിഷമവും കടബാധ്യതയും നീങ്ങാനുള്ള പ്രാർത്ഥന',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/121.mp3',
  },
  {
    id: 'm-15',
    category: 'morning',
    uthaymeenNumber: 15,
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
    transliteration:
      "Allahumma inni as'alukal-'afiyata fid-dunya wal-akhirah, Allahumma inni as'alukal-'afwa wal-'afiyata fee deeni wa dunyaya wa ahli wa mali, Allahummas-tur 'awrati wa amin raw'ati, Allahummah-fazni mim-bayni yadayya wa min khalfi wa 'an yameeni wa 'an shimali wa min fawqi, wa a'oodhu bi'azamatika an ughtala min tahti.",
    translation:
      'O Allah, I ask You for well-being in this world and the Hereafter. O Allah, I ask You for pardon and well-being in my religion, my worldly affairs, my family and my wealth. O Allah, conceal my faults and calm my fears. O Allah, protect me from in front of me, from behind me, from my right, from my left, and from above me; and I seek refuge in Your greatness from being assassinated from beneath me.',
    malayalamTranslation:
      'അല്ലാഹുവേ, ഇഹത്തിലും പരത്തിലും ഞാൻ നിന്നോട് സൗഖ്യം (ആരോഗ്യവും സമാധാനവും) ചോദിക്കുന്നു. അല്ലാഹുവേ, എന്റെ ദീനിലും ദുനിയാവിലും കുടുംബത്തിലും സമ്പത്തിലും നിന്നോട് ഞാൻ മാപ്പും സൗഖ്യവും ചോദിക്കുന്നു. അല്ലാഹുവേ, എന്റെ കുറവുകൾ നീ മറച്ചുവെക്കേണമേ, എന്റെ ഭയങ്ങളിൽ എനിക്ക് ശാന്തി നൽകേണമേ. അല്ലാഹുവേ, എന്റെ മുന്നിലൂടെയും പിന്നിലൂടെയും വലത്തുഭാഗത്തുനിന്നും ഇടത്തുഭാഗത്തുനിന്നും മുകളിൽ നിന്നും എന്നെ നീ കാത്തുരക്ഷിക്കേണമേ. എന്റെ അടിയിലൂടെ വഞ്ചനാപരമായി ഞാൻ നശിപ്പിക്കപ്പെടുന്നതിൽ നിന്ന് നിന്റെ മഹത്വത്താൽ ഞാൻ കാവൽ തേടുന്നു.',
    target: 1,
    source: 'Abu Dawud 5074 & Ibn Majah 3871 • Shaykh Ibn Uthaymeen #15',
    virtue:
      'The Messenger of Allah (ﷺ) never omitted these words morning and evening, wrapping the reciter in a fortress of divine protection on all six sides.',
    malayalamVirtue:
      'നബി (ﷺ) പ്രഭാതത്തിലും സന്ധ്യയിലും ഒരിക്കലും ഒഴിവാക്കാതിരുന്ന പ്രാർത്ഥനയാണിത്. ആറ് ദിശകളിൽ നിന്നും അല്ലാഹുവിന്റെ ശക്തമായ സംരക്ഷണക്കോട്ട ഇത് ചൊല്ലുന്നയാൾക്ക് ലഭിക്കുന്നു (അബൂദാവൂദ്).',
    repeatNote: '1 time (All-Direction Protection)',
    type: 'adhkar',
    title: 'ഇഹപര സൗഖ്യത്തിനും സർവ്വദിശാ സംരക്ഷണത്തിനുമുള്ള പ്രാർത്ഥന',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/84.mp3',
  },
  {
    id: 'm-16',
    category: 'morning',
    uthaymeenNumber: 16,
    arabic:
      'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration:
      "Allahumma Anta Rabbi la ilaha illa Ant, khalaqtani wa ana 'abduk, wa ana 'ala 'ahdika wa wa'dika mastata't, a'oodhu bika min sharri ma sana't, abu'u laka bini'matika 'alay, wa abu'u bidhanbi faghfir li fa'innahu la yaghfirudh-dhunooba illa Ant.",
    translation:
      'O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, and I abide by Your covenant and promise as much as I am able. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me, and I acknowledge my sin, so forgive me, for none can forgive sins except You.',
    malayalamTranslation:
      'അല്ലാഹുവേ, നീ എന്റെ രക്ഷിതാവാണ്, നീയല്ലാതെ യാതൊരു ആരാധ്യനുമില്ല. നീ എന്നെ സൃഷ്ടിച്ചു, ഞാൻ നിന്റെ ദാസനാണ്. എന്റെ കഴിവിനനുസരിച്ച് നിന്നോടുള്ള കരാറിലും വാഗ്ദാനത്തിലും ഞാൻ നിലകൊള്ളുന്നു. ഞാൻ ചെയ്തുപോയ തിന്മകളിൽ നിന്ന് നിന്നിൽ ഞാൻ ശരണം തേടുന്നു. എനിക്ക് നീ നൽകിയ അനുഗ്രഹങ്ങൾ ഞാൻ ഏറ്റുപറയുന്നു, എന്റെ പാപങ്ങളും ഞാൻ സമ്മതിക്കുന്നു. അതിനാൽ എനിക്ക് നീ പൊറുത്തുതരേണമേ, തീർച്ചയായും നീയല്ലാതെ പാപങ്ങൾ പൊറുത്തുതരുവാൻ മറ്റാരുമില്ല.',
    target: 1,
    source: 'Sahih al-Bukhari 6306 (Sayyid al-Istighfar) • Shaykh Ibn Uthaymeen #16',
    virtue:
      'The Master Supplication for Forgiveness. Whoever says it with certainty in the morning and dies before evening will be among the people of Paradise.',
    malayalamVirtue:
      'സയ്യിദുൽ ഇസ്തിഗ്ഫാർ (പാപമോചന പ്രാർത്ഥനകളുടെ നായകൻ). ദൃഢവിശ്വാസത്തോടെ പ്രഭാതത്തിൽ ഇത് ചൊല്ലി അന്ന് വൈകുന്നേരത്തിന് മുമ്പ് മരണപ്പെട്ടാൽ അവൻ സ്വർഗ്ഗാവകാശിയാകും (ബുഖാരി).',
    repeatNote: '1 time (Chief of Prayers for Forgiveness)',
    type: 'adhkar',
    title: 'സയ്യിദുൽ ഇസ്തിഗ്ഫാർ (പാപമോചന പ്രാർത്ഥനകളുടെ നായകൻ)',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/79.mp3',
  },
  {
    id: 'm-17',
    category: 'morning',
    uthaymeenNumber: 17,
    arabic:
      'اللَّهُمَّ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ',
    transliteration:
      "Allahumma Fatiras-samawati wal-ard, 'Alimal-ghaybi wash-shahadah, Rabba kulli shay'iw-wa maleekah, ash-hadu al-la ilaha illa Ant, a'oodhu bika min sharri nafsi wa min sharrish-shaytani wa shirkih, wa an aqtarifa 'ala nafsi soo'an aw ajurrahu ila Muslim.",
    translation:
      'O Allah, Creator of the heavens and the earth, Knower of the unseen and seen, Lord of everything and its Sovereign, I testify that none has the right to be worshipped except You. I seek refuge in You from the evil of my soul, from the evil of Satan and his trap of idolatry, and from committing evil against myself or bringing it upon any Muslim.',
    malayalamTranslation:
      'ആകാശങ്ങളുടെയും ഭൂമിയുടെയും സ്രഷ്ടാവായ, അദൃശ്യവും ദൃശ്യവും അറിയുന്നവനായ, സർവ്വ വസ്തുക്കളുടെയും രക്ഷിതാവും ഉടമസ്ഥനുമായ അല്ലാഹുവേ! നീയല്ലാതെ യാതൊരു ആരാധ്യനുമില്ലെന്ന് ഞാൻ സാക്ഷ്യം വഹിക്കുന്നു. എന്റെ സ്വന്തം മനസ്സിന്റെ തിന്മയിൽ നിന്നും, പിശാചിന്റെയും അവന്റെ ശിർക്കൻ കെണികളുടെയും തിന്മയിൽ നിന്നും, എന്റെ സ്വന്തത്തിന് എന്തെങ്കിലും ദോഷം ചെയ്യുന്നതിൽ നിന്നും അല്ലെങ്കിൽ ഒരു മുസ്ലിമിന് തിന്മ വരുത്തിവെക്കുന്നതിൽ നിന്നും ഞാൻ നിന്നിൽ ശരണം തേടുന്നു.',
    target: 1,
    source: 'Sunan at-Tirmidhi 3529 & Abu Dawud 5067 • Shaykh Ibn Uthaymeen #17',
    virtue:
      'The Prophet (ﷺ) instructed Abu Bakr as-Siddiq to recite this every morning, evening, and before sleep to protect against internal evil and devilish snares.',
    malayalamVirtue:
      'മനസ്സിന്റെ തിന്മകളിൽ നിന്നും പിശാചിന്റെയും അവന്റെ ശിർക്കൻ കെണികളിൽ നിന്നും കാവൽ ലഭിക്കുന്നതിനായി അബൂബക്കർ സിദ്ദീഖ് (റ) വിന് നബി (ﷺ) പഠിപ്പിച്ചുകൊടുത്ത പ്രാർത്ഥന (തിർമിദി, അബൂദാവൂദ്).',
    repeatNote: '1 time',
    type: 'adhkar',
    title: 'മനസ്സിന്റെയും പിശാചിന്റെയും തിന്മകളിൽ നിന്നുള്ള കാവൽ',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/85.mp3',
  },
  {
    id: 'm-18',
    category: 'morning',
    uthaymeenNumber: 18,
    arabic:
      'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
    transliteration:
      "Allahumma inni asbahtu ushhiduka wa ushhidu hamalata 'arshika wa mala'ikataka wa jamee'a khalqik, annaka Antallahu la ilaha illa Anta wahdaka la shareeka lak, wa anna Muhammadan 'abduka wa rasooluk.",
    translation:
      'O Allah, I have entered the morning calling You to bear witness, and calling the bearers of Your Throne, Your angels, and all of Your creation to bear witness, that You are Allah, none has the right to be worshipped except You alone without partner, and that Muhammad is Your servant and Messenger.',
    malayalamTranslation:
      'അല്ലാഹുവേ, ഈ പ്രഭാതത്തിൽ നിന്നെയും, നിന്റെ സിംഹാസനം വഹിക്കുന്ന മലക്കുകളെയും, മറ്റു മലക്കുകളെയും, നിന്റെ സർവ്വ സൃഷ്ടികളെയും ഞാൻ സാക്ഷിനിർത്തുന്നു: തീർച്ചയായും നീ മാത്രമാണ് അല്ലാഹു, നീയല്ലാതെ യാതൊരു ആരാധ്യനുമില്ല, നീ ഏകനാണ്, നിനക്ക് യാതൊരു പങ്കുകാരനുമില്ല. മുഹമ്മദ് നബി (സ്വ) നിന്റെ ദാസനും ദൂതനുമാകുന്നു എന്നും ഞാൻ സാക്ഷ്യം വഹിക്കുന്നു.',
    target: 4,
    source: 'Abu Dawud 5069 • Shaykh Ibn Uthaymeen #18',
    virtue:
      'The Prophet (ﷺ) said: "Whoever recites this four times in the morning or evening, Allah will emancipate him completely from the Fire of Hell."',
    malayalamVirtue:
      'നബി (ﷺ) അരുളി: "രാവിലെയോ വൈകുന്നേരമോ ആരെങ്കിലും ഇത് നാല് തവണ ചൊല്ലിയാൽ അല്ലാഹു അവനെ നരകാഗ്നിയിൽ നിന്നും പൂർണ്ണമായി മോചിപ്പിക്കുന്നതാണ്" (അബൂദാവൂദ്).',
    repeatNote: '4 times (Deliverance from Hellfire)',
    type: 'adhkar',
    title: 'നരകമോചനം ലഭിക്കാനുള്ള സാക്ഷ്യപ്രാർത്ഥന',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/80.mp3',
  },
  {
    id: 'm-19',
    category: 'morning',
    uthaymeenNumber: 19,
    arabic:
      'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      "La ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in qadeer.",
    translation:
      'None has the right to be worshipped except Allah alone, without partner. To Him belongs all sovereignty and praise, and He has power over all things.',
    malayalamTranslation:
      'അല്ലാഹുവല്ലാതെ യാതൊരു ആരാധ്യനുമില്ല, അവൻ ഏകനാണ്, അവന് യാതൊരു പങ്കുകാരനുമില്ല. സർവ്വാധിപത്യവും സർവ്വസ്തുതിയും അവന്നാണ്, അവൻ എല്ലാ കാര്യത്തിനും കഴിവുള്ളവനാണ്.',
    target: 100,
    source: 'Sahih al-Bukhari 3293 & Sahih Muslim 2691 • Shaykh Ibn Uthaymeen #19',
    virtue:
      'Recited 100 times daily: reward equal to freeing 10 slaves, 100 good deeds credited, 100 sins erased, and serves as an impenetrable shield against Satan all day.',
    malayalamVirtue:
      'പ്രതിദിനം 100 തവണ ചൊല്ലിയാൽ: 10 അടിമകളെ മോചിപ്പിച്ച പ്രതിഫലം ലഭിക്കും, 100 നന്മകൾ രേഖപ്പെടുത്തും, 100 തിന്മകൾ മായ്ച്ചു കളയും, ആ ദിവസം മുഴുവൻ പിശാചിൽ നിന്നുള്ള സുരക്ഷിത കാവലുമായിരിക്കും (ബുഖാരി, മുസ്ലിം).',
    repeatNote: '100 times (or 10 times minimum)',
    type: 'adhkar',
    title: 'തൗഹീദിന്റെ മഹത്തായ ദിക്റ്',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/92.mp3',
  },
  {
    id: 'm-20',
    category: 'morning',
    uthaymeenNumber: 20,
    arabic:
      'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration:
      "Hasbiyallahu la ilaha illa Huwa, 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Azeem.",
    translation:
      'Allah is sufficient for me. None has the right to be worshipped except Him. In Him I put my trust, and He is the Lord of the Mighty Throne.',
    malayalamTranslation:
      'എനിക്ക് അല്ലാഹു മതി; അവനല്ലാതെ യാതൊരു ആരാധ്യനുമില്ല. അവനിൽ ഞാൻ ഭരമേൽപ്പിച്ചിരിക്കുന്നു, അവൻ മഹത്തായ അർശിന്റെ (സിംഹാസനത്തിന്റെ) നാഥനാകുന്നു.',
    target: 7,
    source: 'Abu Dawud 5081 (Surah At-Tawbah 9:129) • Shaykh Ibn Uthaymeen #20',
    virtue:
      'The Prophet (ﷺ) said: "Whoever recites this 7 times in the morning and evening, Allah will suffice him in all matters that distress him of this world and the Hereafter."',
    malayalamVirtue:
      'നബി (ﷺ) അരുളി: "രാവിലെയും വൈകുന്നേരവും ഇത് 7 തവണ ചൊല്ലുന്നവന് ഇഹലോകത്തെയും പരലോകത്തെയും സകല മനോവിഷമങ്ങൾക്കും അല്ലാഹു തന്നെ മതിയാകുന്നതാണ്" (അബൂദാവൂദ്).',
    repeatNote: '7 times',
    type: 'adhkar',
    title: 'ഇഹപര വിഷമങ്ങൾക്ക് അല്ലാഹു മതിയാകാനുള്ള പ്രാർത്ഥന',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/83.mp3',
  },
  {
    id: 'm-21',
    category: 'morning',
    uthaymeenNumber: 21,
    arabic: 'حَسْبِيَ اللَّهُ وَكَفَى، سَمِعَ اللَّهُ لِمَنْ دَعَا، لَيْسَ وَرَاءَ اللَّهِ مَرْمَى',
    transliteration:
      "Hasbiyallahu wa kafa, sami'allahu liman da'a, laysa wara'allahi marma.",
    translation:
      'Allah is sufficient for me and He is enough; Allah hears whoever calls upon Him; beyond Allah there is no final aim or refuge.',
    malayalamTranslation:
      'എനിക്ക് അല്ലാഹു മതി, അവൻ സർവ്വതിനും മതിയായവനാണ്. പ്രാർത്ഥിച്ചവന്റെ വിളി അല്ലാഹു കേട്ടിരിക്കുന്നു. അല്ലാഹുവിന് അതീതമായി മറ്റൊരു അഭയസ്ഥാനമോ ലക്ഷ്യമോ ഇല്ല.',
    target: 1,
    source: "Bayhaqi (Shu'ab al-Iman) & Ibn Abi ad-Dunya • Shaykh Ibn Uthaymeen #21",
    virtue:
      'A deep affirmation of complete reliance on the Almighty, acknowledging that He answers all earnest supplications and that all sanctuary ends with Him.',
    malayalamVirtue:
      'അല്ലാഹുവിൽ സമ്പൂർണ്ണമായി ഭരമേൽപ്പിക്കുകയും, അവൻ പ്രാർത്ഥനകൾക്ക് ഉത്തരം നൽകുന്നവനാണെന്നും അവനല്ലാതെ മറ്റൊരു അഭയകേന്ദ്രമില്ലെന്നും പ്രഖ്യാപിക്കുന്ന ഉന്നത ദിക്റ് (ബൈഹഖി).',
    repeatNote: '1 time',
    type: 'adhkar',
    title: 'അല്ലാഹുവിൽ സമ്പൂർണ്ണമായി ഭരമേൽപ്പിക്കുന്ന ദിക്റ്',
  },
  {
    id: 'm-22',
    category: 'morning',
    uthaymeenNumber: 22,
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'Subhanallahi wa bihamdih',
    translation: 'Glory is to Allah and praise is to Him.',
    malayalamTranslation: 'അല്ലാഹു എത്ര പരിശുദ്ധൻ, അവന്ന് സർവ്വസ്തുതിയും.',
    target: 100,
    source: 'Sahih Muslim 2692 • Shaykh Ibn Uthaymeen #22',
    virtue:
      'Whoever recites this 100 times in the morning and evening, his sins will be forgiven even if they were like the foam of the sea, and none will bring better deeds on Judgment Day except one who said more.',
    malayalamVirtue:
      'രാവിലെയും വൈകുന്നേരവും ഇത് 100 തവണ ചൊല്ലുന്നവന്റെ പാപങ്ങൾ കടൽനുരയോളം ഉണ്ടെങ്കിലും പൊറുക്കപ്പെടുന്നതാണ്. അന്ത്യദിനത്തിൽ ഇതിനേക്കാൾ ശ്രേഷ്ഠമായ കർമ്മവുമായി മറ്റാരും വരികയില്ല, ഇത് കൂടുതൽ ചൊല്ലിയവനല്ലാതെ (മുസ്ലിം).',
    repeatNote: '100 times',
    type: 'adhkar',
    title: 'തസ്ബീഹും തഹ്മീദും (100 തവണ)',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/91.mp3',
  },
  {
    id: 'm-23',
    category: 'morning',
    uthaymeenNumber: 23,
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullaha wa atubu ilayh',
    translation: 'I seek the forgiveness of Allah and repent to Him.',
    malayalamTranslation:
      'ഞാൻ അല്ലാഹുവോട് പാപമോചനം തേടുകയും അവനിലേക്ക് പശ്ചാത്തപിച്ചു മടങ്ങുകയും ചെയ്യുന്നു.',
    target: 100,
    source: 'Sahih al-Bukhari 6307 & Sahih Muslim 2702 • Shaykh Ibn Uthaymeen #23',
    virtue:
      'The Prophet (ﷺ) said: "By Allah, I seek forgiveness of Allah and turn to Him in repentance more than seventy (and one hundred) times in a day."',
    malayalamVirtue:
      'നബി (ﷺ) അരുളി: "അല്ലാഹുവാണെ സത്യം, ഞാൻ ദിവസവും എഴുപതിലധികം (നൂറിലധികം) തവണ അല്ലാഹുവോട് പാപമോചനം തേടുകയും തൗബ ചെയ്ത് മടങ്ങുകയും ചെയ്യാറുണ്ട്" (ബുഖാരി, മുസ്ലിം).',
    repeatNote: '100 times',
    type: 'adhkar',
    title: 'ഇസ്തിഗ്ഫാറും തൗബയും (പാപമോചന പ്രാർത്ഥന)',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/96.mp3',
  },
  {
    id: 'm-24',
    category: 'morning',
    arabic:
      'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
    transliteration:
      "Ya Hayyu ya Qayyum, birahmatika astagheeth, aslih li sha'ni kullah, wa la takilni ila nafsi tarfata 'ayn",
    translation:
      'O Ever-Living, O Sustainer, by Your mercy I seek assistance. Rectify for me all of my affairs and do not leave me to myself even for the blink of an eye.',
    malayalamTranslation:
      'എന്നെന്നും ജീവിച്ചിരിക്കുന്നവനേ, സർവ്വലോക പരിപാലകനേ, നിന്റെ കാരുണ്യത്താൽ ഞാൻ നിന്നോട് സഹായം തേടുന്നു. എന്റെ എല്ലാ കാര്യങ്ങളും നീ എനിക്ക് നന്നാക്കിത്തരേണമേ, ഒരു കണ്ണിറുക്കുന്ന നേരത്തേക്ക് പോലും എന്നെ എന്റെ സ്വന്തം കൈകളിലേക്ക് ഏൽപ്പിക്കരുതേ.',
    target: 1,
    source: 'Al-Hakim 1/545 & Sahih at-Targhib 661',
    virtue: 'A heartfelt plea for total reliance on Allah for every detail and moment of life.',
    malayalamVirtue:
      'ജീവിതത്തിലെ ഓരോ നിമിഷവും സകല കാര്യങ്ങളും നേരെയാക്കിത്തരാനും, കണ്ണിറുക്കുന്ന നേരത്തേക്ക് പോലും അല്ലാഹു നമ്മെ കൈവിടരുതെന്നും കേണപേക്ഷിക്കുന്ന മഹത്തായ പ്രാർത്ഥന (ഹാകിം).',
    repeatNote: '1 time',
    type: 'adhkar',
    title: 'അല്ലാഹുവിന്റെ കാരുണ്യത്താൽ സഹായം തേടുന്ന പ്രാർത്ഥന',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/88.mp3',
  },
  {
    id: 'm-25',
    category: 'morning',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    transliteration: "Allahumma salli wa sallim 'ala Nabiyyina Muhammad",
    translation: 'O Allah, send peace and blessings upon our Prophet Muhammad.',
    malayalamTranslation:
      'അല്ലാഹുവേ, ഞങ്ങളുടെ പ്രവാചകൻ മുഹമ്മദ് നബിയുടെ മേൽ നീ അനുഗ്രഹവും ശാന്തിയും വർഷിക്കേണമേ.',
    target: 10,
    source: 'At-Tabarani & Sahih at-Targhib 656',
    virtue:
      'Whoever sends blessings upon the Prophet 10 times in the morning and evening will attain his intercession on the Day of Resurrection.',
    malayalamVirtue:
      'രാവിലെയും വൈകുന്നേരവും നബി (ﷺ) യുടെ മേൽ 10 തവണ സ്വലാത്ത് ചൊല്ലുന്നയാൾക്ക് അന്ത്യദിനത്തിൽ നബിയുടെ ശഫാഅത്ത് (ശുപാർശ) ലഭിക്കുന്നതാണ് (ത്വബ്റാനി).',
    repeatNote: '10 times',
    type: 'adhkar',
    title: 'തിരുനബി (ﷺ) യുടെ മേലുള്ള സ്വലാത്ത്',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/98.mp3',
  },
];

/**
 * Evening Adhkar (أذكار المساء)
 * Complete evening sequence containing the 23 items with appropriate evening adaptations
 * (e.g., أَمْسَيْنَا, أَمْسَيْتُ, هَذِهِ اللَّيْلَةِ, إِلَيْكَ الْمَصِيرُ) from the same authentic
 * booklet by Shaykh Muhammad ibn Salih al-Uthaymeen, plus supplementary Salawat.
 */
export const EVENING_ADHKAR: DhikrItem[] = [
  {
    id: 'e-1',
    category: 'evening',
    uthaymeenNumber: 1,
    arabic:
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالم (١) ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ (٢) الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ (٣) وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ (٤) أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ (٥)',
    transliteration:
      "Bismillahir-Rahmanir-Raheem. Alif-Lam-Meem. Dhalikal-Kitabu la rayba feeh, hudal-lil-muttaqeen. Alladheena yu'minoona bil-ghaybi wa yuqeemoonas-Salata wa mimma razaqnahum yunfiqoon. Walladheena yu'minoona bima unzila ilayka wa ma unzila min qablika wa bil-Akhirati hum yooqinoon. Ula'ika 'ala hudam-mir-Rabbihim wa ula'ika humul-muflihoon.",
    translation:
      'In the name of Allah, the Entirely Merciful, the Especially Merciful. Alif, Lam, Meem. This is the Book about which there is no doubt, a guidance for those conscious of Allah - Who believe in the unseen, establish prayer, and spend out of what We have provided for them...',
    malayalamTranslation:
      'പരമകാരുണികനും കരുണാനിധിയുമായ അല്ലാഹുവിന്റെ നാമത്തിൽ. അലിഫ്-ലാം-മീം. ഇത് അല്ലാഹുവിന്റെ വേദഗ്രന്ഥമാകുന്നു; ഇതിൽ യാതൊരു സംശയവുമില്ല, ഭയഭക്തിയുള്ളവർക്ക് (മുത്തഖികൾക്ക്) മാർഗദർശനമാണിത്...',
    target: 1,
    source: 'Surah Al-Baqarah (2:1-5) • Shaykh Ibn Uthaymeen Collection #1',
    virtue: 'Recited for nighttime steadfastness, guidance, and protection against misguidance.',
    malayalamVirtue:
      'രാത്രിയിലെ സന്മാർഗ്ഗദർശനത്തിനും വഴികേടുകളിൽ നിന്നുള്ള സംരക്ഷണത്തിനും ഉറച്ച വിശ്വാസത്തിനുമായി പാരായണം ചെയ്യുന്നു.',
    repeatNote: '1 time (Surah Al-Baqarah 1-5)',
    isQuranic: true,
    reciter: 'Sheikh Mishary Rashid Alafasy',
    audioClipType: 'tajweed',
    audioUrls: [
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/8.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/9.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/10.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/11.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/12.mp3',
    ],
  },
  {
    id: 'e-2',
    category: 'evening',
    uthaymeenNumber: 2,
    arabic:
      'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration:
      "Allahu la ilaha illa Huwal-Hayyul-Qayyum, la ta'khudhuhu sinatuw-wa la nawm, lahu ma fis-samawati wa ma fil-ard, man dhal-ladhi yashfa'u 'indahu illa bi'idhnih, ya'lamu ma bayna aydihim wa ma khalfahum, wa la yuhitoona bishay'im-min 'ilmihi illa bima sha', wasi'a Kursiyyuhus-samawati wal-ard, wa la ya'ooduhu hifzuhuma, wa Huwal-'Aliyyul-'Azeem.",
    translation:
      'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth... and their preservation tires Him not. And He is the Most High, the Most Great.',
    malayalamTranslation:
      'അല്ലാഹു, അവനല്ലാതെ യാതൊരു ദൈവവുമില്ല, അവൻ എന്നെന്നും ജീവിച്ചിരിക്കുന്നവനും സർവ്വലോക പരിപാലകനുമാണ്. അവനെ മയക്കമോ ഉറക്കമോ ബാധിക്കുകയില്ല. ആകാശഭൂമികളിലുള്ളതെല്ലാം അവന്റെതാണ്... അവൻ പരമോന്നതനും അതിമഹാനുമാകുന്നു.',
    target: 1,
    source: 'Surah Al-Baqarah (2:255) • Al-Hakim (1/562) & At-Tabarani • Shaykh Ibn Uthaymeen #2',
    virtue:
      'Whoever recites Ayat al-Kursi in the evening will be protected from jinn and harm all through the night until dawn.',
    malayalamVirtue:
      'സായാഹ്നത്തിൽ ആയത്തുൽ കുർസിയ്യ് ഓതുന്നവൻ പ്രഭാതം വരെ ജിന്നുകളുടെ ഉപദ്രവങ്ങളിൽ നിന്നും സകല തിന്മകളിൽ നിന്നും കാത്തുരക്ഷിക്കപ്പെടും (ഹാകിം, ത്വബ്റാനി).',
    repeatNote: '1 time (Ayat al-Kursi)',
    isQuranic: true,
    reciter: 'Sheikh Mishary Rashid Alafasy',
    audioClipType: 'tajweed',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3',
  },
  {
    id: 'e-3',
    category: 'evening',
    uthaymeenNumber: 3,
    arabic:
      'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ، كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ، وَقَالُوا سَمِعْنَا وَأَطَعْنَا غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ (٢٨٥) لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا، لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ، رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا، رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا، رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ، وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا، أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ (٢٨٦)',
    transliteration:
      "Amanar-Rasoolu bima unzila ilayhi mir-Rabbihi wal-mu'minoon... Rabbana wa la tuhammilna ma la taqata lana bih, wa'fu 'anna waghfir lana warhamna, Anta mawlana fansurna 'alal-qawmil-kafireen.",
    translation:
      'The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers... "Our Lord, and lay not upon us a burden like that which You laid upon those before us... and pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people."',
    malayalamTranslation:
      'റസൂൽ തനിക്ക് തന്റെ രക്ഷിതാവിങ്കൽ നിന്ന് അവതരിപ്പിക്കപ്പെട്ടതിൽ വിശ്വസിച്ചിരിക്കുന്നു; സത്യവിശ്വാസികളും... ഞങ്ങളുടെ നാഥാ, ഞങ്ങൾക്ക് താങ്ങാൻ കഴിയാത്ത ഭാരം ഞങ്ങളെ വഹിപ്പിക്കരുതേ. ഞങ്ങൾക്ക് നീ വിട്ടുതരികയും, പാപങ്ങൾ പൊറുത്തുതരികയും, ഞങ്ങളോട് കരുണ കാണിക്കുകയും ചെയ്യേണമേ. നീയാണ് ഞങ്ങളുടെ രക്ഷാധികാരി; അതിനാൽ സത്യനിഷേധികളായ ജനതയ്ക്കെതിരിൽ ഞങ്ങൾക്ക് നീ വിജയം നൽകേണമേ.',
    target: 1,
    source:
      'Surah Al-Baqarah (2:285-286) • Sahih al-Bukhari 5009 & Muslim 807 • Shaykh Ibn Uthaymeen #3',
    virtue:
      'The Prophet (ﷺ) said: "Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him (against every evil)."',
    malayalamVirtue:
      'നബി (ﷺ) അരുളി: "ആരെങ്കിലും രാത്രിയിൽ സൂറത്തുൽ ബഖറയിലെ അവസാനത്തെ രണ്ട് ആയത്തുകൾ ഓതിയാൽ, എല്ലാ ദോഷങ്ങളിൽ നിന്നുമുള്ള കാവലിന് അവ അവന് മതിയാകും" (ബുഖാരി, മുസ്ലിം).',
    repeatNote: '1 time (Last two verses of Al-Baqarah)',
    isQuranic: true,
    reciter: 'Sheikh Mishary Rashid Alafasy',
    audioClipType: 'tajweed',
    audioUrls: [
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/292.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/293.mp3',
    ],
  },
  {
    id: 'e-4',
    category: 'evening',
    uthaymeenNumber: 4,
    arabic:
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nحم (١) تَنزِيلُ الْكِتَابِ مِنَ اللَّهِ الْعَزِيزِ الْعَلِيمِ (٢) غَافِرِ الذَّنبِ وَقَابِلِ التَّوْبِ شَدِيدِ الْعِقَابِ ذِي الطَّوْلِ، لَا إِلَٰهَ إِلَّا هُوَ، إِلَيْهِ الْمَصِيرُ (٣)',
    transliteration:
      "Ha-Meem. Tanzeelul-Kitabi minallahil-'Azeezil-'Aleem. Ghafiridh-dhambi wa qabilit-tawbi shadeedil-'iqabi dhit-tawli la ilaha illa Huwa ilayhil-maseer.",
    translation:
      'Ha, Meem. The revelation of the Book is from Allah, the Exalted in Might, the Knowing. The forgiver of sin, acceptor of repentance, severe in punishment, owner of abundance. There is no deity except Him; to Him is the final destination.',
    malayalamTranslation:
      'ഹാ-മീം. പ്രതാപശാലിയും സർവ്വജ്ഞനുമായ അല്ലാഹുവിങ്കൽ നിന്ന് അവതരിപ്പിക്കപ്പെട്ട വേദഗ്രന്ഥമാണിത്. പാപം പൊറുക്കുന്നവനും പശ്ചാത്താപം സ്വീകരിക്കുന്നവനും കഠിനമായി ശിക്ഷിക്കുന്നവനും ഔദാര്യവാനുമായുള്ളവൻ. അവനല്ലാതെ യാതൊരു ആരാധ്യനുമില്ല, അവങ്കലേക്ക് തന്നെയാണ് മടക്കം.',
    target: 1,
    source: 'Surah Ghafir (40:1-3) • Sunan at-Tirmidhi 2879 • Shaykh Ibn Uthaymeen #4',
    virtue:
      'Whoever recites Ha-Meem (verses 1-3 of Surah Ghafir) and Ayat al-Kursi in the evening will be guarded by Allah until morning.',
    malayalamVirtue:
      'വൈകുന്നേരം ആയത്തുൽ കുർസിയ്യോടൊപ്പം സൂറത്തു ഗാഫിറിലെ ആദ്യ മൂന്ന് ആയത്തുകൾ ഓതുന്നവനെ പ്രഭാതം വരെ അല്ലാഹു സംരക്ഷിക്കുന്നതാണ് (തിർമിദി).',
    repeatNote: '1 time (Surah Ghafir 1-3)',
    isQuranic: true,
    reciter: 'Sheikh Mishary Rashid Alafasy',
    audioClipType: 'tajweed',
    audioUrls: [
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4134.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4135.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4136.mp3',
    ],
  },
  {
    id: 'e-5',
    category: 'evening',
    uthaymeenNumber: 5,
    arabic:
      'هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ، عَالِمُ الْغَيْبِ وَالشَّهَادَةِ، هُوَ الرَّحْمَٰنُ الرَّحِيمُ (٢٢) هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ، سُبْحَانَ اللَّهِ عَمَّا يُشْرِكُونَ (٢٣) هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ، لَهُ الْأَسْمَاءُ الْحُسْنَىٰ، يُسَبِّحُ لَهُ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ، وَهُوَ الْعَزِيزُ الْحَكِيمُ (٢٤)',
    transliteration:
      "Huwallahul-ladhi la ilaha illa Huwa, 'Alimul-ghaybi wash-shahadah, Huwar-Rahmanur-Raheem. Huwallahul-ladhi la ilaha illa Huwal-Malikul-Quddoosus-Salamul-Mu'minul-Muhayminul-'Azeezul-Jabbarul-Mutakabbir, Subhanallahi 'amma yushrikoon. Huwallahul-Khaliqul-Bari'ul-Musawwiru lahul-Asma'ul-Husna, yusabbihu lahu ma fis-samawati wal-ard, wa Huwal-'Azeezul-Hakeem.",
    translation:
      'He is Allah, other than whom there is no deity, Knower of the unseen and the witnessed. He is the Entirely Merciful, the Especially Merciful... Whatever is in the heavens and earth is exalting Him. And He is the Exalted in Might, the Wise.',
    malayalamTranslation:
      'യാതൊരു ദൈവവുമില്ലാത്ത അല്ലാഹുവാണ് അവൻ. അദൃശ്യവും ദൃശ്യവും അറിയുന്നവൻ... സൃഷ്ടികർത്താവും, ശൂന്യതയിൽ നിന്ന് ഉണ്ടാക്കിയവനും, രൂപം നൽകിയവനുമായ അല്ലാഹുവാണ് അവൻ. അവന്നാണ് ഏറ്റവും ഉത്കൃഷ്ടമായ നാമങ്ങളുള്ളത്. അവൻ പ്രതാപശാലിയും യുക്തിമാനുമാകുന്നു.',
    target: 1,
    source: 'Surah Al-Hashr (59:22-24) • Sunan at-Tirmidhi 2922 • Shaykh Ibn Uthaymeen #5',
    virtue:
      'Reciting these verses in the evening prompts seventy thousand angels to supplicate for Allah’s mercy and forgiveness upon the reciter until morning.',
    malayalamVirtue:
      'സൂറത്തുൽ ഹശ്റിലെ അവസാന ആയത്തുകൾ സായാഹ്നത്തിൽ ഓതുന്നയാൾക്കായി പ്രഭാതം വരെ എഴുപതിനായിരം മലക്കുകൾ പ്രാർത്ഥിച്ചുകൊണ്ടിരിക്കുന്നതാണ് (തിർമിദി).',
    repeatNote: '1 time (Surah Al-Hashr 22-24)',
    isQuranic: true,
    reciter: 'Sheikh Mishary Rashid Alafasy',
    audioClipType: 'tajweed',
    audioUrls: [
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5148.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5149.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5150.mp3',
    ],
  },
  {
    id: 'e-6',
    category: 'evening',
    uthaymeenNumber: 6,
    arabic:
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ (١) اللَّهُ الصَّمَدُ (٢) لَمْ يَلِدْ وَلَمْ يُولَدْ (٣) وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ (٤)\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (١) مِن شَرِّ مَا خَلَقَ (٢) وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ (٣) وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ (٤) وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ (٥)\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ (١) مَلِكِ النَّاسِ (٢) إِلَٰهِ النَّاسِ (٣) مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ (٤) الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ (٥) مِنَ الْجِنَّةِ وَالنَّاسِ (٦)',
    transliteration:
      "Qul Huwallahu Ahad. Allahus-Samad. Lam yalid wa lam yoolad. Wa lam yakun lahu kufuwan ahad. / Qul a'oodhu bi-Rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-'uqad. Wa min sharri hasidin idha hasad. / Qul a'oodhu bi-Rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fee sudoorin-nas. Minal-jinnati wan-nas.",
    translation:
      'Say, "He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent." / Say, "I seek refuge in the Lord of daybreak from the evil of that which He created and from the evil of darkness when it settles and from the evil of the blowers in knots and from the evil of an envier when he envies." / Say, "I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer who whispers into the breasts of mankind - from among the jinn and mankind."',
    malayalamTranslation:
      'പറയുക: അവൻ അല്ലാഹു ഏകനാകുന്നു. അല്ലാഹു സർവ്വരുടെയും ആശ്രയമാകുന്നു. അവൻ ആർക്കും ജന്മം നൽകിയിട്ടില്ല, അവന് ആരും ജന്മം നൽകിയിട്ടുമില്ല, അവന് തുല്യനായി ആരുമില്ല. / പറയുക: പ്രഭാതത്തിന്റെ നാഥനോട് ഞാൻ ശരണം തേടുന്നു; അവൻ സൃഷ്ടിച്ച ജീവികളുടെ ദോഷങ്ങളിൽ നിന്നും, ഇരുളടയുമ്പോൾ രാത്രിയുടെ കെടുതികളിൽ നിന്നും, കെട്ടുകളിൽ ഊതുന്ന മന്ത്രവാദികളുടെ ഉപദ്രവങ്ങളിൽ നിന്നും, അസൂയപ്പെടുന്നവൻ അസൂയ വെക്കുമ്പോൾ അവന്റെ കെടുതികളിൽ നിന്നും. / പറയുക: മനുഷ്യരുടെ രക്ഷിതാവിനോട് ഞാൻ അഭയം തേടുന്നു; മനുഷ്യരുടെ രാജാവിനോട്, മനുഷ്യരുടെ ആരാധ്യനോട്, ദുർബോധനം നടത്തി പിൻവാങ്ങിക്കളയുന്ന പിശാചിന്റെ ഉപദ്രവങ്ങളിൽ നിന്നും; മനുഷ്യരുടെ ഹൃദയങ്ങളിൽ ദുർബോധനം നടത്തുന്നവനായ, മനുഷ്യരിലും ജിന്നുകളിലും പെട്ടവനായ പിശാചിൽ നിന്നും.',
    target: 3,
    source: 'Abu Dawud 5082 & Tirmidhi 3575 • Shaykh Ibn Uthaymeen #6',
    virtue: 'Reciting them 3 times in the evening provides complete protection against all harm.',
    malayalamVirtue:
      'വൈകുന്നേരം ഈ മൂന്ന് സൂറത്തുകൾ 3 തവണ വീതം ഓതുന്നത് രാത്രിയിലെ സകല ദോഷങ്ങളിൽ നിന്നും സമ്പൂർണ്ണ കാവലാകുന്നു (അബൂദാവൂദ്, തിർമിദി).',
    repeatNote: '3 times each (Al-Ikhlas, Al-Falaq, An-Nas)',
    isQuranic: true,
    reciter: 'Sheikh Mishary Rashid Alafasy',
    audioClipType: 'tajweed',
    audioUrls: [
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6221.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6222.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6223.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6224.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6225.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6226.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6227.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6228.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6229.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6230.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6231.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6232.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6233.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6234.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6235.mp3',
    ],
  },
  {
    id: 'e-7',
    category: 'evening',
    uthaymeenNumber: 7,
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'oodhu bi-kalimatillahit-tammati min sharri ma khalaq",
    translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    malayalamTranslation:
      'അല്ലാഹു സൃഷ്ടിച്ച സർവ്വ സൃഷ്ടികളുടെയും ദോഷങ്ങളിൽ നിന്നും അവന്റെ സമ്പൂർണ്ണ വചനങ്ങളെക്കൊണ്ട് ഞാൻ രക്ഷതേടുന്നു.',
    target: 3,
    source: 'Sahih Muslim 2709 • Shaykh Ibn Uthaymeen #7',
    virtue:
      'Whoever recites this 3 times in the evening will not be harmed by any poison, sting, or creature during the night.',
    malayalamVirtue:
      'സായാഹ്നത്തിൽ ഇത് 3 തവണ ചൊല്ലുന്നവനെ ആ രാത്രിയിൽ യാതൊരു വിഷജന്തുക്കളുടെ കുത്തോ വിഷബാധയോ ഉപദ്രവിക്കുകയില്ല (മുസ്ലിം).',
    repeatNote: '3 times',
    type: 'adhkar',
    title: 'വിഷജന്തുക്കളിൽ നിന്നും ഉപദ്രവങ്ങളിൽ നിന്നുമുള്ള കാവൽ',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/97.mp3',
  },
  {
    id: 'e-8',
    category: 'evening',
    uthaymeenNumber: 8,
    arabic:
      'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration:
      "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Samee'ul-'Aleem",
    translation:
      'In the name of Allah, with Whose name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
    malayalamTranslation:
      'ആരുടെ നാമത്തോടൊപ്പം ഭൂമിയിലോ ആകാശത്തോ ഉള്ള യാതൊരു വസ്തുവും ഉപദ്രവം വരുത്തുകയില്ലയോ, ആ അല്ലാഹുവിന്റെ നാമത്തിൽ. അവൻ എല്ലാം കേൾക്കുന്നവനും അറിയുന്നവനുമാകുന്നു.',
    target: 3,
    source: 'Abu Dawud 5088 & Tirmidhi 3388 • Shaykh Ibn Uthaymeen #8',
    virtue: 'Recited 3 times in the evening shields against sudden misfortunes until morning.',
    malayalamVirtue:
      'വൈകുന്നേരം ഇത് 3 തവണ ചൊല്ലുന്നവന് പ്രഭാതം വരെ പെട്ടെന്നുണ്ടാകുന്ന യാതൊരു അത്യാഹിതമോ വിപത്തോ ഏൽക്കുകയില്ല (അബൂദാവൂദ്, തിർമിദി).',
    repeatNote: '3 times',
    type: 'adhkar',
    title: 'ആകസ്മിക വിപത്തുകളിൽ നിന്നുള്ള സംരക്ഷണം',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/86.mp3',
  },
  {
    id: 'e-9',
    category: 'evening',
    uthaymeenNumber: 9,
    arabic:
      'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    transliteration:
      "Radeetu billahi Rabban, wa bil-Islami deenan, wa bi-Muhammadin sallallahu 'alayhi wa sallama Nabiyya",
    translation:
      'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (peace and blessings of Allah be upon him) as my Prophet.',
    malayalamTranslation:
      'അല്ലാഹുവിനെ രക്ഷിതാവായും, ഇസ്ലാമിനെ ദീനായും, മുഹമ്മദ് നബി (സ്വ) യെ പ്രവാചകനായും ഞാൻ തൃപ്തിപ്പെട്ടിരിക്കുന്നു.',
    target: 3,
    source: 'Abu Dawud 5072 & Tirmidhi 3389 • Shaykh Ibn Uthaymeen #9',
    virtue:
      'Allah has taken upon Himself to please whoever recites this 3 times on the Day of Judgment.',
    malayalamVirtue:
      'ഇത് 3 തവണ സായാഹ്നത്തിൽ ചൊല്ലുന്നയാളെ അന്ത്യദിനത്തിൽ സന്തോഷിപ്പിക്കുകയും തൃപ്തിപ്പെടുത്തുകയും ചെയ്യൽ അല്ലാഹു ബാധ്യതയാക്കിയിരിക്കുന്നു (അബൂദാവൂദ്, തിർമിദി).',
    repeatNote: '3 times',
    type: 'adhkar',
    title: 'അല്ലാഹുവിന്റെ പ്രീതി ലഭിക്കാനുള്ള പ്രാർത്ഥന',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/87.mp3',
  },
  {
    id: 'e-10',
    category: 'evening',
    uthaymeenNumber: 10,
    arabic:
      'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    transliteration:
      "Amsayna wa-amsal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in qadeer. Rabbi as'aluka khayra ma fee hadhihil-laylati wa khayra ma ba'daha, wa a'oodhu bika min sharri ma fee hadhihil-laylati wa sharri ma ba'daha, Rabbi a'oodhu bika minal-kasali wa soo'il-kibar, Rabbi a'oodhu bika min 'adhabin fin-nari wa 'adhabin fil-qabr.",
    translation:
      'We have reached the evening and at this very time all sovereignty belongs to Allah, and all praise is for Allah. None has the right to be worshipped except Allah alone, without partner. To Him belongs all sovereignty and praise, and He has power over all things. My Lord, I ask You for the good of what is in this night and the good of what follows it, and I seek refuge in You from the evil of what is in this night and the evil of what follows it. My Lord, I seek refuge in You from laziness and the hardships of old age. My Lord, I seek refuge in You from punishment in the Fire and punishment in the grave.',
    malayalamTranslation:
      'ഞങ്ങളിതാ സായാഹ്നത്തിലേക്ക് പ്രവേശിച്ചിരിക്കുന്നു; സർവ്വാധിപത്യവും അല്ലാഹുവിന്നുള്ളതായി സന്ധ്യയായിരിക്കുന്നു. സർവ്വസ്തുതിയും അല്ലാഹുവിന്നാണ്. അല്ലാഹുവല്ലാതെ യാതൊരു ആരാധ്യനുമില്ല, അവൻ ഏകനാണ്, അവന് യാതൊരു പങ്കുകാരനുമില്ല. അവന്നാണ് സർവ്വാധികാരവും സർവ്വസ്തുതിയും, അവൻ എല്ലാ കാര്യത്തിനും കഴിവുള്ളവനാണ്. എന്റെ രക്ഷിതാവേ, ഈ രാത്രിയിലുള്ള നന്മയും ഇതിനുശേഷമുള്ള നന്മയും നിന്നോട് ഞാൻ ചോദിക്കുന്നു; ഈ രാത്രിയിലുള്ള തിന്മയിൽ നിന്നും ഇതിനുശേഷമുള്ള തിന്മയിൽ നിന്നും നിന്നിൽ ഞാൻ അഭയം തേടുന്നു. എന്റെ നാഥാ, മടിയിൽ നിന്നും വാർദ്ധക്യത്തിന്റെ അവശതകളിൽ നിന്നും നിന്നിൽ ഞാൻ ശരണം തേടുന്നു. എന്റെ നാഥാ, നരകശിക്ഷയിൽ നിന്നും ഖബർ ശിക്ഷയിൽ നിന്നും നിന്നിൽ ഞാൻ കാവൽ ചോദിക്കുന്നു.',
    target: 1,
    source: 'Sahih Muslim 2723 • Shaykh Ibn Uthaymeen #10',
    virtue:
      'Acknowledges Allah’s absolute sovereignty at dusk, seeking the goodness of the night and refuge from all torment.',
    malayalamVirtue:
      'സന്ധ്യാവേളയിൽ അല്ലാഹുവിന്റെ സർവ്വാധിപത്യം ഏറ്റുപറയുകയും, രാത്രിയുടെ നന്മകൾ ചോദിക്കുകയും, മടി, വാർദ്ധക്യത്തിന്റെ അവശതകൾ, നരക-ഖബർ ശിക്ഷകൾ എന്നിവയിൽ നിന്ന് കാവൽ തേടുകയും ചെയ്യുന്നു (മുസ്ലിം).',
    repeatNote: '1 time',
    type: 'adhkar',
    title: 'സായാഹ്നത്തിൽ നന്മ തേടിയുള്ള പ്രാർത്ഥന',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/77.mp3',
  },
  {
    id: 'e-11',
    category: 'evening',
    uthaymeenNumber: 11,
    arabic:
      'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    transliteration:
      'Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namootu, wa-ilaykal-maseer.',
    translation:
      'O Allah, by You we have entered the evening, and by You we entered the morning, and by You we live, and by You we die, and to You is our ultimate return.',
    malayalamTranslation:
      'അല്ലാഹുവേ, നിന്റെ കാരുണ്യത്താൽ നാം സന്ധ്യയിലെത്തി, നിന്റെ കാരുണ്യത്താൽ നാം പ്രഭാതത്തിലെത്തി, നിന്റെ കൽപ്പനയാൽ നാം ജീവിക്കുന്നു, നിന്റെ വിധിയാൽ നാം മരിക്കുന്നു, നിന്നിലേക്കാണ് നമ്മുടെ മടക്കം.',
    target: 1,
    source: 'Sunan at-Tirmidhi 3391 & Abu Dawud 5068 • Shaykh Ibn Uthaymeen #11',
    virtue: 'Committing every phase of evening, night, life, and death to the Creator.',
    malayalamVirtue:
      'രാത്രിയിലേക്കുള്ള പ്രവേശനവും ജീവിതവും മരണവും പുനരുത്ഥാനവും അല്ലാഹുവിൽ സമർപ്പിക്കുന്ന പ്രാർത്ഥന (തിർമിദി, അബൂദാവൂദ്).',
    repeatNote: '1 time',
    type: 'adhkar',
    title: 'സായാഹ്നത്തിൽ അല്ലാഹുവിൽ ഭരമേൽപ്പിക്കുന്ന പ്രാർത്ഥന',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/78.mp3',
  },
  {
    id: 'e-12',
    category: 'evening',
    uthaymeenNumber: 12,
    arabic:
      'اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ، فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
    transliteration:
      'Allahumma ma amsa bee min ni\'matin aw bi-ahadim-min khalqik, faminka wahdaka la shareeka lak, falakal-hamdu wa lakash-shukr.',
    translation:
      'O Allah, whatever blessing has reached me or any of Your creation this evening is from You alone, without partner. To You belongs all praise and to You belongs all gratitude.',
    malayalamTranslation:
      'അല്ലാഹുവേ, ഈ സന്ധ്യയിൽ എനിക്കോ നിന്റെ സൃഷ്ടികളിൽ മറ്റാർക്കെങ്കിലുമോ എന്തെങ്കിലും അനുഗ്രഹം ലഭിച്ചിട്ടുണ്ടെങ്കിൽ അത് നിന്നിൽ നിന്ന് മാത്രമുള്ളതാണ്, നിനക്ക് യാതൊരു പങ്കുകാരനുമില്ല. അതിനാൽ സർവ്വസ്തുതിയും നിനക്കാണ്, സർവ്വ നന്ദിയും നിനക്കാണ്.',
    target: 1,
    source: "Abu Dawud 5073 & An-Nasa'i • Shaykh Ibn Uthaymeen #12",
    virtue: 'Whoever recites this in the evening has fulfilled his gratitude for that entire night.',
    malayalamVirtue:
      'വൈകുന്നേരം ഇത് ചൊല്ലുന്നവൻ ആ രാത്രിയിലെ അല്ലാഹുവിനോടുള്ള നന്ദി (ശുക്റ്) പൂർണ്ണമായി നിർവ്വഹിച്ചിരിക്കുന്നു (അബൂദാവൂദ്, നസാഈ).',
    repeatNote: '1 time (Fulfilling Nightly Gratitude)',
    type: 'adhkar',
    title: 'രാത്രിയിലെ ശുക്റ് (നന്ദി) നിർവ്വഹിക്കുന്ന പ്രാർത്ഥന',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/81.mp3',
  },
  {
    id: 'e-13',
    category: 'evening',
    uthaymeenNumber: 13,
    arabic:
      'اللَّهُمَّ إِنِّي أَمْسَيْتُ فِي نِعْمَةٍ وَعَافِيَةٍ وَسِتْرٍ، فَأَتِمَّ نِعْمَتَكَ عَلَيَّ وَعَافِيَتَكَ وَسِتْرَكَ فِي الدُّنْيَا وَالْآخِرَةِ',
    transliteration:
      "Allahumma inni amsaytu fee ni'matiw-wa 'afiyatiw-wa sitr, fa'atimma ni'mataka 'alayya wa 'afiyataka wa sitraka fid-dunya wal-akhirah.",
    translation:
      'O Allah, I have entered the evening enjoying blessing, well-being, and protection from You. Therefore, complete Your blessing, Your well-being, and Your protection upon me in this world and the Hereafter.',
    malayalamTranslation:
      'അല്ലാഹുവേ, നിന്നിൽ നിന്നുള്ള അനുഗ്രഹത്തിലും സൗഖ്യത്തിലും കാവലിലും ആയാണ് ഞാൻ സന്ധ്യയിലേക്ക് പ്രവേശിച്ചിരിക്കുന്നത്. അതിനാൽ ഇഹത്തിലും പരത്തിലും നിന്റെ അനുഗ്രഹവും സൗഖ്യവും കാവലും നീ എനിക്ക് പൂർത്തിയാക്കി തരേണമേ.',
    target: 3,
    source: 'Ibn as-Sunni 55 & Kitab al-Adhkar • Shaykh Ibn Uthaymeen #13',
    virtue:
      'Recited 3 times; Allah fulfills His blessing, health, and covering of human sins and defects.',
    malayalamVirtue:
      '3 തവണ ചൊല്ലുക; ഇഹത്തിലും പരത്തിലും അല്ലാഹു തന്റെ അനുഗ്രഹവും സൗഖ്യവും പാപങ്ങൾ മറച്ചുവെക്കലും പൂർത്തിയാക്കി നൽകുന്നു (ഇബ്നുസ്സുന്നി).',
    repeatNote: '3 times',
    type: 'adhkar',
    title: 'അനുഗ്രഹവും സൗഖ്യവും പൂർത്തിയാക്കാനുള്ള പ്രാർത്ഥന',
  },
  {
    id: 'e-14',
    category: 'evening',
    uthaymeenNumber: 14,
    arabic:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ',
    transliteration:
      "Allahumma inni a'oodhu bika minal-hammi wal-hazan, wa a'oodhu bika minal-'ajzi wal-kasal, wa a'oodhu bika minal-jubni wal-bukhl, wa a'oodhu bika min ghalabatid-dayni wa qahrir-rijal.",
    translation:
      'O Allah, I seek refuge in You from worry and grief, and I seek refuge in You from incapacity and laziness, and I seek refuge in You from cowardice and miserliness, and I seek refuge in You from being overwhelmed by debt and oppressed by people.',
    malayalamTranslation:
      'അല്ലാഹുവേ, ഉത്കണ്ഠയിൽ നിന്നും ദുഃഖത്തിൽ നിന്നും ഞാൻ നിന്നിൽ ശരണം തേടുന്നു; കഴിവുകേടിൽ നിന്നും മടിയിൽ നിന്നും ഞാൻ നിന്നിൽ ശരണം തേടുന്നു; ഭീരുത്വത്തിൽ നിന്നും പിശുക്കിൽ നിന്നും നിന്നിൽ ഞാൻ കാവൽ ചോദിക്കുന്നു; കടം പെരുകുന്നതിൽ നിന്നും മനുഷ്യരുടെ അടിച്ചമർത്തലിൽ നിന്നും നിന്നിൽ ഞാൻ അഭയം തേടുന്നു.',
    target: 1,
    source: 'Sahih al-Bukhari 2893 & Abu Dawud 1555 • Shaykh Ibn Uthaymeen #14',
    virtue: 'Relieves heart sorrow, discouragement, and burden of debt.',
    malayalamVirtue:
      'മനോവേദനകൾ, ദുഃഖം, ഭീരുത്വം, അലസത, കടബാധ്യത എന്നിവയിൽ നിന്നുള്ള മോചനത്തിനായി നബി (ﷺ) പഠിപ്പിച്ച പ്രാർത്ഥന (ബുഖാരി, അബൂദാവൂദ്).',
    repeatNote: '1 time (Relief from Anxiety & Debt)',
    type: 'adhkar',
    title: 'മനോവിഷമവും കടബാധ്യതയും നീങ്ങാനുള്ള പ്രാർത്ഥന',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/121.mp3',
  },
  {
    id: 'e-15',
    category: 'evening',
    uthaymeenNumber: 15,
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
    transliteration:
      "Allahumma inni as'alukal-'afiyata fid-dunya wal-akhirah, Allahumma inni as'alukal-'afwa wal-'afiyata fee deeni wa dunyaya wa ahli wa mali, Allahummas-tur 'awrati wa amin raw'ati, Allahummah-fazni mim-bayni yadayya wa min khalfi wa 'an yameeni wa 'an shimali wa min fawqi, wa a'oodhu bi'azamatika an ughtala min tahti.",
    translation:
      'O Allah, I ask You for well-being in this world and the Hereafter. O Allah, I ask You for pardon and well-being in my religion, my worldly affairs, my family and my wealth. O Allah, conceal my faults and calm my fears. O Allah, protect me from in front of me, from behind me, from my right, from my left, and from above me; and I seek refuge in Your greatness from being assassinated from beneath me.',
    malayalamTranslation:
      'അല്ലാഹുവേ, ഇഹത്തിലും പരത്തിലും ഞാൻ നിന്നോട് സൗഖ്യം (ആരോഗ്യവും സമാധാനവും) ചോദിക്കുന്നു. അല്ലാഹുവേ, എന്റെ ദീനിലും ദുനിയാവിലും കുടുംബത്തിലും സമ്പത്തിലും നിന്നോട് ഞാൻ മാപ്പും സൗഖ്യവും ചോദിക്കുന്നു. അല്ലാഹുവേ, എന്റെ കുറവുകൾ നീ മറച്ചുവെക്കേണമേ, എന്റെ ഭയങ്ങളിൽ എനിക്ക് ശാന്തി നൽകേണമേ...',
    target: 1,
    source: 'Abu Dawud 5074 & Ibn Majah 3871 • Shaykh Ibn Uthaymeen #15',
    virtue: 'Comprehensive all-around protection through the night.',
    malayalamVirtue:
      'രാത്രി മുഴുവൻ എല്ലാ ദിശകളിൽ നിന്നുമുള്ള അല്ലാഹുവിന്റെ ദിവ്യസംരക്ഷണവും സൗഖ്യവും ഉറപ്പാക്കുന്ന പ്രാർത്ഥന (അബൂദാവൂദ്, ഇബ്നുമാജ).',
    repeatNote: '1 time (All-Direction Protection)',
    type: 'adhkar',
    title: 'ഇഹപര സൗഖ്യത്തിനും സർവ്വദിശാ സംരക്ഷണത്തിനുമുള്ള പ്രാർത്ഥന',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/84.mp3',
  },
  {
    id: 'e-16',
    category: 'evening',
    uthaymeenNumber: 16,
    arabic:
      'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration:
      "Allahumma Anta Rabbi la ilaha illa Ant, khalaqtani wa ana 'abduk, wa ana 'ala 'ahdika wa wa'dika mastata't, a'oodhu bika min sharri ma sana't, abu'u laka bini'matika 'alay, wa abu'u bidhanbi faghfir li fa'innahu la yaghfirudh-dhunooba illa Ant.",
    translation:
      'O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, and I abide by Your covenant and promise as much as I am able. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me, and I acknowledge my sin, so forgive me, for none can forgive sins except You.',
    malayalamTranslation:
      'അല്ലാഹുവേ, നീ എന്റെ രക്ഷിതാവാണ്, നീയല്ലാതെ യാതൊരു ആരാധ്യനുമില്ല. നീ എന്നെ സൃഷ്ടിച്ചു, ഞാൻ നിന്റെ ദാസനാണ്. എന്റെ കഴിവിനനുസരിച്ച് നിന്നോടുള്ള കരാറിലും വാഗ്ദാനത്തിലും ഞാൻ നിലകൊള്ളുന്നു. ഞാൻ ചെയ്തുപോയ തിന്മകളിൽ നിന്ന് നിന്നിൽ ഞാൻ ശരണം തേടുന്നു. എനിക്ക് നീ നൽകിയ അനുഗ്രഹങ്ങൾ ഞാൻ ഏറ്റുപറയുന്നു, എന്റെ പാപങ്ങളും ഞാൻ സമ്മതിക്കുന്നു. അതിനാൽ എനിക്ക് നീ പൊറുത്തുതരേണമേ, തീർച്ചയായും നീയല്ലാതെ പാപങ്ങൾ പൊറുത്തുതരുവാൻ മറ്റാരുമില്ല.',
    target: 1,
    source: 'Sahih al-Bukhari 6306 (Sayyid al-Istighfar) • Shaykh Ibn Uthaymeen #16',
    virtue:
      'Whoever recites this at night with firm faith and passes away during the night will enter Paradise.',
    malayalamVirtue:
      'സയ്യിദുൽ ഇസ്തിഗ്ഫാർ: ദൃഢവിശ്വാസത്തോടെ സന്ധ്യയിൽ ഇത് ചൊല്ലി ആ രാത്രി മരണപ്പെട്ടാൽ അവൻ സ്വർഗ്ഗാവകാശിയാകുന്നതാണ് (ബുഖാരി).',
    repeatNote: '1 time (Chief of Prayers for Forgiveness)',
    type: 'adhkar',
    title: 'സയ്യിദുൽ ഇസ്തിഗ്ഫാർ (പാപമോചന പ്രാർത്ഥനകളുടെ നായകൻ)',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/79.mp3',
  },
  {
    id: 'e-17',
    category: 'evening',
    uthaymeenNumber: 17,
    arabic:
      'اللَّهُمَّ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ',
    transliteration:
      "Allahumma Fatiras-samawati wal-ard, 'Alimal-ghaybi wash-shahadah, Rabba kulli shay'iw-wa maleekah, ash-hadu al-la ilaha illa Ant, a'oodhu bika min sharri nafsi wa min sharrish-shaytani wa shirkih, wa an aqtarifa 'ala nafsi soo'an aw ajurrahu ila Muslim.",
    translation:
      'O Allah, Creator of the heavens and the earth, Knower of the unseen and seen, Lord of everything and its Sovereign, I testify that none has the right to be worshipped except You. I seek refuge in You from the evil of my soul, from the evil of Satan and his trap of idolatry, and from committing evil against myself or bringing it upon any Muslim.',
    malayalamTranslation:
      'ആകാശങ്ങളുടെയും ഭൂമിയുടെയും സ്രഷ്ടാവായ, അദൃശ്യവും ദൃശ്യവും അറിയുന്നവനായ, സർവ്വ വസ്തുക്കളുടെയും രക്ഷിതാവും ഉടമസ്ഥനുമായ അല്ലാഹുവേ! നീയല്ലാതെ യാതൊരു ആരാധ്യനുമില്ലെന്ന് ഞാൻ സാക്ഷ്യം വഹിക്കുന്നു. എന്റെ സ്വന്തം മനസ്സിന്റെ തിന്മയിൽ നിന്നും, പിശാചിന്റെയും അവന്റെ ശിർക്കൻ കെണികളുടെയും തിന്മയിൽ നിന്നും, എന്റെ സ്വന്തത്തിന് എന്തെങ്കിലും ദോഷം ചെയ്യുന്നതിൽ നിന്നും അല്ലെങ്കിൽ ഒരു മുസ്ലിമിന് തിന്മ വരുത്തിവെക്കുന്നതിൽ നിന്നും ഞാൻ നിന്നിൽ ശരണം തേടുന്നു.',
    target: 1,
    source: 'Sunan at-Tirmidhi 3529 & Abu Dawud 5067 • Shaykh Ibn Uthaymeen #17',
    virtue: 'Sanctuary against demonic whispers and harmful intentions throughout the night.',
    malayalamVirtue:
      'രാത്രിയിൽ പിശാചിന്റെ കുതന്ത്രങ്ങളിൽ നിന്നും തിന്മകളിൽ നിന്നും സ്വന്തം മനസ്സിന്റെ ദോഷങ്ങളിൽ നിന്നും സമ്പൂർണ്ണ സംരക്ഷണം നൽകുന്നു (തിർമിദി, അബൂദാവൂദ്).',
    repeatNote: '1 time',
    type: 'adhkar',
    title: 'മനസ്സിന്റെയും പിശാചിന്റെയും തിന്മകളിൽ നിന്നുള്ള കാവൽ',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/85.mp3',
  },
  {
    id: 'e-18',
    category: 'evening',
    uthaymeenNumber: 18,
    arabic:
      'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
    transliteration:
      "Allahumma inni amsaytu ushhiduka wa ushhidu hamalata 'arshika wa mala'ikataka wa jamee'a khalqik, annaka Antallahu la ilaha illa Anta wahdaka la shareeka lak, wa anna Muhammadan 'abduka wa rasooluk.",
    translation:
      'O Allah, I have entered the evening calling You to bear witness, and calling the bearers of Your Throne, Your angels, and all of Your creation to bear witness, that You are Allah, none has the right to be worshipped except You alone without partner, and that Muhammad is Your servant and Messenger.',
    malayalamTranslation:
      'അല്ലാഹുവേ, ഈ സന്ധ്യയിൽ നിന്നെയും, നിന്റെ സിംഹാസനം വഹിക്കുന്ന മലക്കുകളെയും, മറ്റു മലക്കുകളെയും, നിന്റെ സർവ്വ സൃഷ്ടികളെയും ഞാൻ സാക്ഷിനിർത്തുന്നു: തീർച്ചയായും നീ മാത്രമാണ് അല്ലാഹു, നീയല്ലാതെ യാതൊരു ആരാധ്യനുമില്ല, നീ ഏകനാണ്, നിനക്ക് യാതൊരു പങ്കുകാരനുമില്ല. മുഹമ്മദ് നബി (സ്വ) നിന്റെ ദാസനും ദൂതനുമാകുന്നു എന്നും ഞാൻ സാക്ഷ്യം വഹിക്കുന്നു.',
    target: 4,
    source: 'Abu Dawud 5069 • Shaykh Ibn Uthaymeen #18',
    virtue:
      'Recited 4 times in the evening: Allah frees the servant completely from the Fire of Hell.',
    malayalamVirtue:
      'വൈകുന്നേരം 4 തവണ ചൊല്ലിയാൽ അല്ലാഹു ആ ദാസനെ നരകാഗ്നിയിൽ നിന്നും പൂർണ്ണമായി മോചിപ്പിക്കുന്നതാണ് (അബൂദാവൂദ്).',
    repeatNote: '4 times (Deliverance from Hellfire)',
    type: 'adhkar',
    title: 'നരകമോചനം ലഭിക്കാനുള്ള സാക്ഷ്യപ്രാർത്ഥന',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/80.mp3',
  },
  {
    id: 'e-19',
    category: 'evening',
    uthaymeenNumber: 19,
    arabic:
      'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      "La ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in qadeer.",
    translation:
      'None has the right to be worshipped except Allah alone, without partner. To Him belongs all sovereignty and praise, and He has power over all things.',
    malayalamTranslation:
      'അല്ലാഹുവല്ലാതെ യാതൊരു ആരാധ്യനുമില്ല, അവൻ ഏകനാണ്, അവന് യാതൊരു പങ്കുകാരനുമില്ല. സർവ്വാധിപത്യവും സർവ്വസ്തുതിയും അവന്നാണ്, അവൻ എല്ലാ കാര്യത്തിനും കഴിവുള്ളവനാണ്.',
    target: 100,
    source: 'Sahih al-Bukhari 3293 & Sahih Muslim 2691 • Shaykh Ibn Uthaymeen #19',
    virtue: 'Immense reward, sins expiated, and strong protective fortress.',
    malayalamVirtue:
      'മഹത്തായ പ്രതിഫലം, പാപമോചനം, രാത്രി മുഴുവൻ പിശാചിൽ നിന്നുള്ള ശക്തമായ സംരക്ഷണക്കോട്ട (ബുഖാരി, മുസ്ലിം).',
    repeatNote: '100 times (or 10 times minimum)',
    type: 'adhkar',
    title: 'തൗഹീദിന്റെ മഹത്തായ ദിക്റ്',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/92.mp3',
  },
  {
    id: 'e-20',
    category: 'evening',
    uthaymeenNumber: 20,
    arabic:
      'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration:
      "Hasbiyallahu la ilaha illa Huwa, 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Azeem.",
    translation:
      'Allah is sufficient for me. None has the right to be worshipped except Him. In Him I put my trust, and He is the Lord of the Mighty Throne.',
    malayalamTranslation:
      'എനിക്ക് അല്ലാഹു മതി; അവനല്ലാതെ യാതൊരു ആരാധ്യനുമില്ല. അവനിൽ ഞാൻ ഭരമേൽപ്പിച്ചിരിക്കുന്നു, അവൻ മഹത്തായ അർശിന്റെ (സിംഹാസനത്തിന്റെ) നാഥനാകുന്നു.',
    target: 7,
    source: 'Abu Dawud 5081 (Surah At-Tawbah 9:129) • Shaykh Ibn Uthaymeen #20',
    virtue: 'Recited 7 times: Allah suffices the servant for all his worldly and eternal concerns.',
    malayalamVirtue:
      'സായാഹ്നത്തിൽ 7 തവണ ചൊല്ലിയാൽ ഇഹപരകാര്യങ്ങളിലെ സകല ഉത്കണ്ഠകൾക്കും അല്ലാഹു പരിഹാരമേകും (അബൂദാവൂദ്).',
    repeatNote: '7 times',
    type: 'adhkar',
    title: 'ഇഹപര വിഷമങ്ങൾക്ക് അല്ലാഹു മതിയാകാനുള്ള പ്രാർത്ഥന',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/83.mp3',
  },
  {
    id: 'e-21',
    category: 'evening',
    uthaymeenNumber: 21,
    arabic: 'حَسْبِيَ اللَّهُ وَكَفَى، سَمِعَ اللَّهُ لِمَنْ دَعَا، لَيْسَ وَرَاءَ اللَّهِ مَرْمَى',
    transliteration:
      "Hasbiyallahu wa kafa, sami'allahu liman da'a, laysa wara'allahi marma.",
    translation:
      'Allah is sufficient for me and He is enough; Allah hears whoever calls upon Him; beyond Allah there is no final aim or refuge.',
    malayalamTranslation:
      'എനിക്ക് അല്ലാഹു മതി, അവൻ സർവ്വതിനും മതിയായവനാണ്. പ്രാർത്ഥിച്ചവന്റെ വിളി അല്ലാഹു കേട്ടിരിക്കുന്നു. അല്ലാഹുവിന് അതീതമായി മറ്റൊരു അഭയസ്ഥാനമോ ലക്ഷ്യമോ ഇല്ല.',
    target: 1,
    source: "Bayhaqi (Shu'ab al-Iman) & Ibn Abi ad-Dunya • Shaykh Ibn Uthaymeen #21",
    virtue: 'Affirmation of peace, complete reliance, and spiritual serenity.',
    malayalamVirtue:
      'മനസ്സിന് ശാന്തിയും അല്ലാഹുവിൽ പൂർണ്ണ ഭരമേല്പിക്കലും സമ്മാനിക്കുന്ന സായാഹ്ന ദിക്റ് (ബൈഹഖി).',
    repeatNote: '1 time',
    type: 'adhkar',
    title: 'അല്ലാഹുവിൽ സമ്പൂർണ്ണമായി ഭരമേൽപ്പിക്കുന്ന ദിക്റ്',
  },
  {
    id: 'e-22',
    category: 'evening',
    uthaymeenNumber: 22,
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'Subhanallahi wa bihamdih',
    translation: 'Glory is to Allah and praise is to Him.',
    malayalamTranslation: 'അല്ലാഹു എത്ര പരിശുദ്ധൻ, അവന്ന് സർവ്വസ്തുതിയും.',
    target: 100,
    source: 'Sahih Muslim 2692 • Shaykh Ibn Uthaymeen #22',
    virtue:
      'Forgiveness of sins even if they were like the foam of the sea, and supreme merit on the Day of Judgment.',
    malayalamVirtue:
      'കടൽനുരയോളം പാപങ്ങളുണ്ടെങ്കിലും പൊറുക്കപ്പെടും, പരലോകത്ത് അത്യുന്നത പദവികൾ നേടിത്തരും (മുസ്ലിം).',
    repeatNote: '100 times',
    type: 'adhkar',
    title: 'തസ്ബീഹും തഹ്മീദും (100 തവണ)',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/91.mp3',
  },
  {
    id: 'e-23',
    category: 'evening',
    uthaymeenNumber: 23,
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullaha wa atubu ilayh',
    translation: 'I seek the forgiveness of Allah and repent to Him.',
    malayalamTranslation:
      'ഞാൻ അല്ലാഹുവോട് പാപമോചനം തേടുകയും അവനിലേക്ക് പശ്ചാത്തപിച്ചു മടങ്ങുകയും ചെയ്യുന്നു.',
    target: 100,
    source: 'Sahih al-Bukhari 6307 & Sahih Muslim 2702 • Shaykh Ibn Uthaymeen #23',
    virtue: 'Continuous purification of heart and following the blessed Sunnah of the Prophet (ﷺ).',
    malayalamVirtue:
      'ഹൃദയശുദ്ധീകരണത്തിനും തിരുനബി (ﷺ) യുടെ ചര്യ പിൻപറ്റുന്നതിനുമുള്ള നിരന്തര തൗബയും ഇസ്തിഗ്ഫാറും (ബുഖാരി, മുസ്ലിം).',
    repeatNote: '100 times',
    type: 'adhkar',
    title: 'ഇസ്തിഗ്ഫാറും തൗബയും (പാപമോചന പ്രാർത്ഥന)',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/96.mp3',
  },
  {
    id: 'e-24',
    category: 'evening',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    transliteration: "Allahumma salli wa sallim 'ala Nabiyyina Muhammad",
    translation: 'O Allah, send peace and blessings upon our Prophet Muhammad.',
    malayalamTranslation:
      'അല്ലാഹുവേ, ഞങ്ങളുടെ പ്രവാചകൻ മുഹമ്മദ് നബിയുടെ മേൽ നീ അനുഗ്രഹവും ശാന്തിയും വർഷിക്കേണമേ.',
    target: 10,
    source: 'At-Tabarani & Sahih at-Targhib 656',
    virtue: 'Intercession of the Prophet (ﷺ) on the Day of Resurrection.',
    malayalamVirtue:
      'രാവിലെയും വൈകുന്നേരവും 10 തവണ സ്വലാത്ത് ചൊല്ലുന്നയാൾക്ക് അന്ത്യദിനത്തിൽ തിരുനബി (ﷺ) യുടെ ശഫാഅത്ത് ലഭിക്കും (ത്വബ്റാനി).',
    repeatNote: '10 times',
    type: 'adhkar',
    title: 'തിരുനബി (ﷺ) യുടെ മേലുള്ള സ്വലാത്ത്',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/98.mp3',
  },
];

/**
 * Adhkar after Obligatory Prayer (أذكار ما بعد الصلاة)
 */
export const PRAYER_ADHKAR: DhikrItem[] = [
  {
    id: 'p-1',
    category: 'prayer',
    type: 'adhkar',
    title: 'നമസ്കാര ശേഷമുള്ള ഇസ്തിഗ്ഫാർ (പാപമോചനം തേടൽ)',
    arabic: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah, Astaghfirullah, Astaghfirullah',
    translation: 'I seek forgiveness from Allah (3 times).',
    malayalamTranslation: 'ഞാൻ അല്ലാഹുവോട് പാപമോചനം തേടുന്നു (3 തവണ).',
    target: 3,
    source: 'Sahih Muslim 591',
    virtue: 'The Prophet (ﷺ) would seek forgiveness immediately upon concluding obligatory prayer.',
    malayalamVirtue:
      'ഫർദ് നമസ്കാരത്തിൽ സംഭവിച്ചുപോയേക്കാവുന്ന ന്യൂനതകൾ പരിഹരിക്കാൻ സലാം വീട്ടിയ ഉടനെ തിരുനബി (ﷺ) 3 തവണ പാപമോചനം തേടിയിരുന്നു (മുസ്ലിം).',
    repeatNote: '3 times',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/66.mp3',
  },
  {
    id: 'p-2',
    category: 'prayer',
    type: 'adhkar',
    title: 'സലാം വീട്ടിയ ശേഷമുള്ള പ്രാർത്ഥന',
    arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ',
    transliteration: "Allahumma Antas-Salamu wa minkas-salam, tabarakta ya Dhal-Jalali wal-Ikram",
    translation:
      'O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.',
    malayalamTranslation:
      'അല്ലാഹുവേ, നീ തന്നെയാണ് ശാന്തിയും സമാധാനവും, നിന്നിൽ നിന്നാണ് ശാന്തി വരുന്നത്. പ്രതാപവും ആദരവുമുള്ളവനേ, നീ അനുഗ്രഹപൂർണ്ണനായിരിക്കുന്നു.',
    target: 1,
    source: 'Sahih Muslim 591',
    virtue: 'Invocation immediately following the salam of prayer.',
    malayalamVirtue:
      'സലാം വീട്ടിയ ശേഷമുള്ള പ്രധാന പ്രാർത്ഥന; അല്ലാഹുവിന്റെ ശാന്തിയും അനുഗ്രഹങ്ങളും തേടുന്നു (മുസ്ലിം).',
    repeatNote: '1 time',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/66.mp3',
  },
  {
    id: 'p-3',
    category: 'prayer',
    type: 'adhkar',
    title: 'തസ്ബീഹ് (സുബ്ഹാനല്ലാഹ് - 33 തവണ)',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhanallah',
    translation: 'Glory is to Allah.',
    malayalamTranslation: 'അല്ലാഹു എത്രയോ പരിശുദ്ധൻ (33 തവണ).',
    target: 33,
    source: 'Sahih Muslim 597',
    virtue: 'Recited 33 times after each prayer followed by Alhamdulillah and Allahu Akbar.',
    malayalamVirtue:
      'നമസ്കാര ശേഷം 33 തവണ ചൊല്ലുന്ന തസ്ബീഹ്; അല്ലാഹുവിന്റെ പരിശുദ്ധിയെ വാഴ്ത്തുന്നു (മുസ്ലിം).',
    repeatNote: '33 times',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/69.mp3',
  },
  {
    id: 'p-4',
    category: 'prayer',
    type: 'adhkar',
    title: 'തഹ്മീദ് (അൽഹംദുലില്ലാഹ് - 33 തവണ)',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'Praise be to Allah.',
    malayalamTranslation: 'സർവ്വസ്തുതിയും അല്ലാഹുവിന്നാണ് (33 തവണ).',
    target: 33,
    source: 'Sahih Muslim 597',
    virtue: 'Part of the 100 post-prayer tasbih that expiates sins.',
    malayalamVirtue:
      'നമസ്കാര ശേഷം 33 തവണ അല്ലാഹുവിന് സ്തുതി അർപ്പിക്കുന്ന തഹ്മീദ് (മുസ്ലിം).',
    repeatNote: '33 times',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/69.mp3',
  },
  {
    id: 'p-5',
    category: 'prayer',
    type: 'adhkar',
    title: 'തക്ബീർ (അല്ലാഹു അക്ബർ - 33 തവണ)',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest.',
    malayalamTranslation: 'അല്ലാഹു ഏറ്റവും മഹാനാണ് (33 തവണ).',
    target: 33,
    source: 'Sahih Muslim 597',
    virtue: 'Concludes the 99 counts before the sealing affirmation.',
    malayalamVirtue:
      '33 തവണ തക്ബീർ ചൊല്ലി 99 എണ്ണം പൂർത്തിയാക്കുന്നു (മുസ്ലിം).',
    repeatNote: '33 times',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/69.mp3',
  },
  {
    id: 'p-6',
    category: 'prayer',
    type: 'adhkar',
    title: 'നൂറാമത്തെ തഹ്‌ലീൽ ദിക്റ്',
    arabic:
      'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in qadir",
    translation:
      'None has the right to be worshipped except Allah alone, without partner. To Him belongs all sovereignty and praise, and He has power over all things.',
    malayalamTranslation:
      'അല്ലാഹുവല്ലാതെ യാതൊരു ആരാധ്യനുമില്ല, അവൻ ഏകനാണ്, അവന് പങ്കുകാരില്ല. സർവ്വാധിപത്യവും സർവ്വസ്തുതിയും അവന്നാണ്. അവൻ എല്ലാ കാര്യത്തിനും കഴിവുള്ളവനാണ്.',
    target: 1,
    source: 'Sahih Muslim 597',
    virtue:
      'Complete the 100th count and one’s sins will be forgiven even if they were like the foam of the sea.',
    malayalamVirtue:
      'നൂറാമത്തെതായി ഇത് ചൊല്ലി 100 പൂർത്തിയാക്കുന്നവന്റെ പാപങ്ങൾ കടൽനുരയോളം ഉണ്ടെങ്കിലും പൊറുക്കപ്പെടുന്നതാണ് (മുസ്ലിം).',
    repeatNote: '1 time (Seals the 100 counts)',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/68.mp3',
  },
  {
    id: 'p-7',
    category: 'prayer',
    type: 'quran',
    title: 'ആയത്തുൽ കുർസിയ്യ് (നമസ്കാര ശേഷം)',
    arabic:
      'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration:
      "Allahu la ilaha illa Huwal-Hayyul-Qayyum, la ta'khudhuhu sinatun wa la nawm, lahu ma fis-samawati wa ma fil-ard, man dhal-ladhi yashfa'u 'indahu illa bi'idhnih, ya'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bishay'im-min 'ilmihi illa bima sha', wasi'a Kursiyyuhus-samawati wal-ard, wa la ya'uduhu hifzuhuma, wa Huwal-'Aliyyul-'Azim",
    translation:
      'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth... and He is the Most High, the Most Great.',
    malayalamTranslation:
      'അല്ലാഹു, അവനല്ലാതെ യാതൊരു ദൈവവുമില്ല, അവൻ എന്നെന്നും ജീവിച്ചിരിക്കുന്നവനും സർവ്വലോക പരിപാലകനുമാണ്. അവനെ മയക്കമോ ഉറക്കമോ ബാധിക്കുകയില്ല. ആകാശഭൂമികളിലുള്ളതെല്ലാം അവന്റെതാണ്... അവൻ പരമോന്നതനും അതിമഹാനുമാകുന്നു.',
    target: 1,
    source: "Surah Al-Baqarah 2:255 & An-Nasa'i in Al-Kubra",
    virtue:
      'The Prophet (ﷺ) said: "Whoever recites Ayat al-Kursi after every obligatory prayer, nothing stands between him and entering Paradise except death."',
    malayalamVirtue:
      'നബി (ﷺ) അരുളി: "ആരെങ്കിലും ഓരോ ഫർദ് നമസ്കാര ശേഷവും ആയത്തുൽ കുർസിയ്യ് ഓതിയാൽ അവനും സ്വർഗ്ഗപ്രവേശനത്തിനും ഇടയിൽ മരണം മാത്രമേ തടസ്സമായിട്ടുള്ളൂ" (നസാഈ, ഇബ്നു ഹിബ്ബാൻ).',
    repeatNote: '1 time (Ayat al-Kursi)',
    isQuranic: true,
    reciter: 'Sheikh Mishary Rashid Alafasy',
    audioClipType: 'tajweed',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3',
  },
];

/**
 * Adhkar before Sleep (أذكار النوم — ഉറങ്ങാൻ നേരമുള്ള ദിക്റുകൾ)
 * Authentic collection directly from Hisn al-Muslim (حصن المسلم — Chapter 28, Hadiths #99–#111)
 * with complete Arabic tashkeel (harakat), Malayalam & English translations, Hadith references,
 * Malayalam virtues (ഹദീസിന്റെ ശ്രേഷ്ഠത / ഫലം), and direct MP3 audio recitations.
 */
export const SLEEP_ADHKAR: DhikrItem[] = [
  {
    id: 'sleep-3quls',
    category: 'sleep',
    hisnNumber: 99,
    type: 'quran',
    isQuranic: true,
    reciter: 'Sheikh Mishary Rashid Alafasy',
    audioClipType: 'tajweed',
    title: 'മൂന്ന് ഖുൽ സൂറത്തുകൾ (ഇഖ്‌ലാസ്, ഫലഖ്, നാസ് — കൈകൾ കൂട്ടിപ്പിടിച്ച് ഊതി ശരീരത്തിൽ തടവുക)',
    arabic:
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ (١) اللَّهُ الصَّمَدُ (٢) لَمْ يَلِدْ وَلَمْ يُولَدْ (٣) وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ (٤)\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (١) مِن شَرِّ مَا خَلَقَ (٢) وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ (٣) وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ (٤) وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ (٥)\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ (١) مَلِكِ النَّاسِ (٢) إِلَٰهِ النَّاسِ (٣) مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ (٤) الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ (٥) مِنَ الْجِنَّةِ وَالنَّاسِ (٦)',
    transliteration:
      "Qul Huwallahu Ahad. Allahus-Samad. Lam yalid wa lam yoolad. Wa lam yakun lahu kufuwan ahad. / Qul a'oodhu bi-Rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-'uqad. Wa min sharri hasidin idha hasad. / Qul a'oodhu bi-Rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fee sudoorin-nas. Minal-jinnati wan-nas.",
    translation:
      'Say, "He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent." / Say, "I seek refuge in the Lord of daybreak from the evil of that which He created, from the evil of darkness when it settles, from the evil of the blowers in knots, and from the evil of an envier when he envies." / Say, "I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer who whispers into the breasts of mankind - from among the jinn and mankind."',
    malayalam:
      'പറയുക: അവൻ അല്ലാഹു ഏകനാകുന്നു. അല്ലാഹു സർവ്വരുടെയും ആശ്രയമാകുന്നു. അവൻ ആർക്കും ജന്മം നൽകിയിട്ടില്ല, അവന് ആരും ജന്മം നൽകിയിട്ടുമില്ല, അവന് തുല്യനായി ആരുമില്ല. / പറയുക: പ്രഭാതത്തിന്റെ നാഥനോട് ഞാൻ ശരണം തേടുന്നു; അവൻ സൃഷ്ടിച്ചവയുടെ ദോഷങ്ങളിൽ നിന്നും, ഇരുളടയുമ്പോൾ രാത്രിയുടെ കെടുതികളിൽ നിന്നും, കെട്ടുകളിൽ ഊതുന്ന മന്ത്രവാദികളുടെ ഉപദ്രവങ്ങളിൽ നിന്നും, അസൂയക്കാരൻ അസൂയ വെക്കുമ്പോൾ അവന്റെ കെടുതികളിൽ നിന്നും. / പറയുക: മനുഷ്യരുടെ രക്ഷിതാവിനോട് ഞാൻ അഭയം തേടുന്നു; മനുഷ്യരുടെ രാജാവിനോട്, മനുഷ്യരുടെ ആരാധ്യനോട്, ദുർബോധനം നടത്തി പിൻവാങ്ങിക്കളയുന്ന പിശാചിന്റെ ഉപദ്രവങ്ങളിൽ നിന്നും; മനുഷ്യരുടെ ഹൃദയങ്ങളിൽ ദുർബോധനം നടത്തുന്നവനായ, ജിന്നുകളിലും മനുഷ്യരിലും പെട്ടവനായ പിശാചിൽ നിന്നും.',
    malayalamTranslation:
      'പറയുക: അവൻ അല്ലാഹു ഏകനാകുന്നു. അല്ലാഹു സർവ്വരുടെയും ആശ്രയമാകുന്നു. അവൻ ആർക്കും ജന്മം നൽകിയിട്ടില്ല, അവന് ആരും ജന്മം നൽകിയിട്ടുമില്ല, അവന് തുല്യനായി ആരുമില്ല. / പറയുക: പ്രഭാതത്തിന്റെ നാഥനോട് ഞാൻ ശരണം തേടുന്നു; അവൻ സൃഷ്ടിച്ചവയുടെ ദോഷങ്ങളിൽ നിന്നും, ഇരുളടയുമ്പോൾ രാത്രിയുടെ കെടുതികളിൽ നിന്നും, കെട്ടുകളിൽ ഊതുന്ന മന്ത്രവാദികളുടെ ഉപദ്രവങ്ങളിൽ നിന്നും, അസൂയക്കാരൻ അസൂയ വെക്കുമ്പോൾ അവന്റെ കെടുതികളിൽ നിന്നും. / പറയുക: മനുഷ്യരുടെ രക്ഷിതാവിനോട് ഞാൻ അഭയം തേടുന്നു; മനുഷ്യരുടെ രാജാവിനോട്, മനുഷ്യരുടെ ആരാധ്യനോട്, ദുർബോധനം നടത്തി പിൻവാങ്ങിക്കളയുന്ന പിശാചിന്റെ ഉപദ്രവങ്ങളിൽ നിന്നും; മനുഷ്യരുടെ ഹൃദയങ്ങളിൽ ദുർബോധനം നടത്തുന്നവനായ, ജിന്നുകളിലും മനുഷ്യരിലും പെട്ടവനായ പിശാചിൽ നിന്നും.',
    target: 3,
    source: 'Sahih al-Bukhari 5017 (Fath al-Bari 9/62) & Sahih Muslim 2192 • Hisn al-Muslim Ch. 28, #99',
    virtue:
      'Aisha (RA) narrated: Every night when the Prophet (ﷺ) went to bed, he would cup his hands together, blow gently into them, recite Surah Al-Ikhlas, Surah Al-Falaq, and Surah An-Nas, and then wipe his hands over whatever he could reach of his body, starting with his head, face, and front of his body—doing that three times for complete divine protection through the night.',
    malayalamVirtue:
      'ആഇശ (റ) നിവേദനം: നബി (ﷺ) എല്ലാ രാത്രിയിലും ഉറങ്ങാൻ വിരിപ്പിലേക്ക് അണയുമ്പോൾ തന്റെ രണ്ട് കൈവെള്ളകളും ചേർത്തുപിടിച്ച് അതിൽ ചെറുതായി ഊതുകയും, സൂറത്തുൽ ഇഖ്‌ലാസ്, സൂറത്തുൽ ഫലഖ്, സൂറത്തുന്നാസ് എന്നിവ ഓതിയ ശേഷം തലയിലും മുഖത്തും ശരീരത്തിന്റെ മുൻഭാഗത്തും കൈയെത്തുന്നിടത്തെല്ലാം തടവുകയും ചെയ്യുമായിരുന്നു. ഇപ്രകാരം 3 തവണ ആവർത്തിക്കുന്നത് രാത്രി മുഴുവൻ സിഹ്ർ, കണ്ണേറ്, പിശാച് തുടങ്ങിയ സർവ്വ തിന്മകളിൽ നിന്നും സമ്പൂർണ്ണ കാവൽ നൽകുന്നു (സ്വഹീഹുൽ ബുഖാരി 5017, മുസ്ലിം 2192 • ഹിസ്നുൽ മുസ്ലിം #99).',
    repeatNote: '3 times (Cup hands, blow gently into palms & wipe over head, face, and body)',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112001.mp3',
    audioUrls: [
      'https://everyayah.com/data/Alafasy_128kbps/112001.mp3',
      'https://everyayah.com/data/Alafasy_128kbps/112002.mp3',
      'https://everyayah.com/data/Alafasy_128kbps/112003.mp3',
      'https://everyayah.com/data/Alafasy_128kbps/112004.mp3',
      'https://everyayah.com/data/Alafasy_128kbps/113001.mp3',
      'https://everyayah.com/data/Alafasy_128kbps/113002.mp3',
      'https://everyayah.com/data/Alafasy_128kbps/113003.mp3',
      'https://everyayah.com/data/Alafasy_128kbps/113004.mp3',
      'https://everyayah.com/data/Alafasy_128kbps/113005.mp3',
      'https://everyayah.com/data/Alafasy_128kbps/114001.mp3',
      'https://everyayah.com/data/Alafasy_128kbps/114002.mp3',
      'https://everyayah.com/data/Alafasy_128kbps/114003.mp3',
      'https://everyayah.com/data/Alafasy_128kbps/114004.mp3',
      'https://everyayah.com/data/Alafasy_128kbps/114005.mp3',
      'https://everyayah.com/data/Alafasy_128kbps/114006.mp3',
    ],
  },
  {
    id: 'sleep-kursi',
    category: 'sleep',
    hisnNumber: 100,
    type: 'quran',
    isQuranic: true,
    reciter: 'Sheikh Mishary Rashid Alafasy',
    audioClipType: 'tajweed',
    title: 'ആയത്തുൽ കുർസിയ്യ് (ഉറങ്ങാൻ നേരം ഓതേണ്ടത് — പ്രഭാതം വരെ മലക്കിന്റെ കാവൽ)',
    arabic:
      'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration:
      "Allahu la ilaha illa Huwal-Hayyul-Qayyum, la ta'khudhuhu sinatuw-wa la nawm, lahu ma fis-samawati wa ma fil-ard, man dhal-ladhi yashfa'u 'indahu illa bi'idhnih, ya'lamu ma bayna aydihim wa ma khalfahum, wa la yuhitoona bishay'im-min 'ilmihi illa bima sha', wasi'a Kursiyyuhus-samawati wal-ard, wa la ya'ooduhu hifzuhuma, wa Huwal-'Aliyyul-'Azeem.",
    translation:
      'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    malayalam:
      'അല്ലാഹു, അവനല്ലാതെ യാതൊരു ആരാധ്യനുമില്ല, അവൻ എന്നെന്നും ജീവിച്ചിരിക്കുന്നവനും സർവ്വലോക പരിപാലകനുമാണ്. അവനെ മയക്കമോ ഉറക്കമോ ബാധിക്കുകയില്ല. ആകാശങ്ങളിലുള്ളതും ഭൂമിയിലുള്ളതുമെല്ലാം അവന്റെതാണ്. അവന്റെ അനുവാദമില്ലാതെ അവന്റെയടുക്കൽ ശുപാർശ ചെയ്യാൻ കഴിയുന്നവൻ ആരാണ്? അവരുടെ മുന്നിലുള്ളതും പിന്നിലുള്ളതും അവൻ അറിയുന്നു. അവന്റെ അറിവിൽ നിന്ന് അവൻ ഉദ്ദേശിക്കുന്നതല്ലാതെ മറ്റൊന്നും അവർക്ക് ഗ്രഹിക്കാനാവില്ല. അവന്റെ കുർസിയ്യ് (അധികാരപീഠം) ആകാശങ്ങളെയും ഭൂമിയെയും ഉൾക്കൊള്ളുന്നതാണ്. അവ രണ്ടിന്റെയും സംരക്ഷണം അവനൊരു ഭാരമേയല്ല. അവൻ പരമോന്നതനും അതിമഹാനുമാകുന്നു.',
    malayalamTranslation:
      'അല്ലാഹു, അവനല്ലാതെ യാതൊരു ആരാധ്യനുമില്ല, അവൻ എന്നെന്നും ജീവിച്ചിരിക്കുന്നവനും സർവ്വലോക പരിപാലകനുമാണ്. അവനെ മയക്കമോ ഉറക്കമോ ബാധിക്കുകയില്ല. ആകാശങ്ങളിലുള്ളതും ഭൂമിയിലുള്ളതുമെല്ലാം അവന്റെതാണ്. അവന്റെ അനുവാദമില്ലാതെ അവന്റെയടുക്കൽ ശുപാർശ ചെയ്യാൻ കഴിയുന്നവൻ ആരാണ്? അവരുടെ മുന്നിലുള്ളതും പിന്നിലുള്ളതും അവൻ അറിയുന്നു. അവന്റെ അറിവിൽ നിന്ന് അവൻ ഉദ്ദേശിക്കുന്നതല്ലാതെ മറ്റൊന്നും അവർക്ക് ഗ്രഹിക്കാനാവില്ല. അവന്റെ കുർസിയ്യ് (അധികാരപീഠം) ആകാശങ്ങളെയും ഭൂമിയെയും ഉൾക്കൊള്ളുന്നതാണ്. അവ രണ്ടിന്റെയും സംരക്ഷണം അവനൊരു ഭാരമേയല്ല. അവൻ പരമോന്നതനും അതിമഹാനുമാകുന്നു.',
    target: 1,
    source: 'Sahih al-Bukhari 2311 & 5010 (Fath al-Bari 4/487) • Hisn al-Muslim Ch. 28, #100',
    virtue:
      'Whoever recites Ayat al-Kursi when going to bed, a guardian angel from Allah will remain with him to protect him throughout the night, and no devil (Shaytan) will come near him until he wakes up in the morning.',
    malayalamVirtue:
      'വിരിപ്പിലേക്ക് അണയുമ്പോൾ ആരെങ്കിലും ആയത്തുൽ കുർസിയ്യ് പാരായണം ചെയ്താൽ അല്ലാഹുവിങ്കൽ നിന്നുള്ള ഒരു സംരക്ഷകൻ (മലക്ക്) അവന് കാവലായി സദാ ഉണ്ടായിരിക്കും; നേരം പുലരുവോളം പിശാച് അവന്റെ സമീപത്ത് പോലും വരികയില്ല (സ്വഹീഹുൽ ബുഖാരി 2311 • ഹിസ്നുൽ മുസ്ലിം #100).',
    repeatNote: '1 time (Surah Al-Baqarah 2:255)',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002255.mp3',
  },
  {
    id: 'sleep-baqarah',
    category: 'sleep',
    hisnNumber: 101,
    type: 'quran',
    isQuranic: true,
    reciter: 'Sheikh Mishary Rashid Alafasy',
    audioClipType: 'tajweed',
    title: 'സൂറത്തുൽ ബഖറയിലെ അവസാനത്തെ രണ്ട് ആയത്തുകൾ (ആമന റസൂലു...)',
    arabic:
      'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ، كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ، وَقَالُوا سَمِعْنَا وَأَطَعْنَا غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ (٢٨٥) لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا، لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ، رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا، رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا، رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ، وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا، أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ (٢٨٦)',
    transliteration:
      "Amanar-Rasoolu bima unzila ilayhi mir-Rabbihi wal-mu'minoon, kullun amana billahi wa mala'ikatihi wa kutubihi wa rusulih, la nufarriqu bayna ahadim-mir-rusulih, wa qaloo sami'na wa ata'na ghufranaka Rabbana wa-ilaykal-maseer. La yukallifullahu nafsan illa wus'aha, laha ma kasabat wa 'alayha maktasabat, Rabbana la tu'akhidhna in-naseena aw akhta'na, Rabbana wa la tahmil 'alayna isran kama hamaltahu 'alalladheena min qablina, Rabbana wa la tuhammilna ma la taqata lana bih, wa'fu 'anna waghfir lana warhamna, Anta mawlana fansurna 'alal-qawmil-kafireen.",
    translation:
      'The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers, [saying], "We make no distinction between any of His messengers." And they say, "We hear and we obey. [We seek] Your forgiveness, our Lord, and to You is the [final] destination." Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned. "Our Lord, do not impose blame upon us if we have forgotten or erred. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people."',
    malayalam:
      'റസൂൽ തനിക്ക് തന്റെ രക്ഷിതാവിങ്കൽ നിന്ന് അവതരിപ്പിക്കപ്പെട്ടതിൽ വിശ്വസിച്ചിരിക്കുന്നു; സത്യവിശ്വാസികളും. അവരെല്ലാവരും അല്ലാഹുവിലും അവന്റെ മലക്കുകളിലും അവന്റെ വേദഗ്രന്ഥങ്ങളിലും അവന്റെ ദൂതന്മാരിലും വിശ്വസിച്ചിരിക്കുന്നു. അവന്റെ ദൂതന്മാരിൽ ആർക്കുമിടയിലും ഞങ്ങൾ ഒരു വിവേചനവും കൽപ്പിക്കുന്നില്ല (എന്നവർ പറയുന്നു). അവർ പറഞ്ഞു: ഞങ്ങൾ കേൾക്കുകയും അനുസരിക്കുകയും ചെയ്തിരിക്കുന്നു. ഞങ്ങളുടെ രക്ഷിതാവേ, നിന്നോട് ഞങ്ങൾ പാപമോചനം തേടുന്നു, നിന്നിലേക്കാണ് ഞങ്ങളുടെ മടക്കം. അല്ലാഹു ഒരാളോടും അയാളുടെ കഴിവിൽ കവിഞ്ഞത് ശാസിക്കുന്നില്ല. ഓരോരുത്തർക്കും താൻ പ്രവർത്തിച്ച നന്മയുടെ ഫലമുണ്ട്, താൻ ചെയ്ത തിന്മയുടെ ഭാരവുമുണ്ട്. ഞങ്ങളുടെ നാഥാ, ഞങ്ങൾ മറന്നുപോകുകയോ തെറ്റുപറ്റുകയോ ചെയ്തിട്ടുണ്ടെങ്കിൽ ഞങ്ങളെ നീ പിടികൂടരുതേ. ഞങ്ങളുടെ നാഥാ, ഞങ്ങളുടെ മുൻഗാമികളുടെ മേൽ ചുമത്തിയതുപോലുള്ള ഭാരം ഞങ്ങളുടെ മേൽ നീ ചുമത്തരുതേ. ഞങ്ങളുടെ നാഥാ, ഞങ്ങൾക്ക് താങ്ങാനാവാത്ത ഭാരം ഞങ്ങളെ നീ വഹിപ്പിക്കരുതേ. ഞങ്ങൾക്ക് നീ മാപ്പുനൽകുകയും, പൊറുത്തുതരികയും, ഞങ്ങളോട് കരുണ കാണിക്കുകയും ചെയ്യേണമേ. നീയാണ് ഞങ്ങളുടെ രക്ഷാധികാരി; അതിനാൽ സത്യനിഷേധികളായ ജനതയ്ക്കെതിരിൽ ഞങ്ങൾക്ക് നീ വിജയം നൽകേണമേ.',
    malayalamTranslation:
      'റസൂൽ തനിക്ക് തന്റെ രക്ഷിതാവിങ്കൽ നിന്ന് അവതരിപ്പിക്കപ്പെട്ടതിൽ വിശ്വസിച്ചിരിക്കുന്നു; സത്യവിശ്വാസികളും. അവരെല്ലാവരും അല്ലാഹുവിലും അവന്റെ മലക്കുകളിലും അവന്റെ വേദഗ്രന്ഥങ്ങളിലും അവന്റെ ദൂതന്മാരിലും വിശ്വസിച്ചിരിക്കുന്നു. അവന്റെ ദൂതന്മാരിൽ ആർക്കുമിടയിലും ഞങ്ങൾ ഒരു വിവേചനവും കൽപ്പിക്കുന്നില്ല (എന്നവർ പറയുന്നു). അവർ പറഞ്ഞു: ഞങ്ങൾ കേൾക്കുകയും അനുസരിക്കുകയും ചെയ്തിരിക്കുന്നു. ഞങ്ങളുടെ രക്ഷിതാവേ, നിന്നോട് ഞങ്ങൾ പാപമോചനം തേടുന്നു, നിന്നിലേക്കാണ് ഞങ്ങളുടെ മടക്കം. അല്ലാഹു ഒരാളോടും അയാളുടെ കഴിവിൽ കവിഞ്ഞത് ശാസിക്കുന്നില്ല. ഓരോരുത്തർക്കും താൻ പ്രവർത്തിച്ച നന്മയുടെ ഫലമുണ്ട്, താൻ ചെയ്ത തിന്മയുടെ ഭാരവുമുണ്ട്. ഞങ്ങളുടെ നാഥാ, ഞങ്ങൾ മറന്നുപോകുകയോ തെറ്റുപറ്റുകയോ ചെയ്തിട്ടുണ്ടെങ്കിൽ ഞങ്ങളെ നീ പിടികൂടരുതേ. ഞങ്ങളുടെ നാഥാ, ഞങ്ങളുടെ മുൻഗാമികളുടെ മേൽ ചുമത്തിയതുപോലുള്ള ഭാരം ഞങ്ങളുടെ മേൽ നീ ചുമത്തരുതേ. ഞങ്ങളുടെ നാഥാ, ഞങ്ങൾക്ക് താങ്ങാനാവാത്ത ഭാരം ഞങ്ങളെ നീ വഹിപ്പിക്കരുതേ. ഞങ്ങൾക്ക് നീ മാപ്പുനൽകുകയും, പൊറുത്തുതരികയും, ഞങ്ങളോട് കരുണ കാണിക്കുകയും ചെയ്യേണമേ. നീയാണ് ഞങ്ങളുടെ രക്ഷാധികാരി; അതിനാൽ സത്യനിഷേധികളായ ജനതയ്ക്കെതിരിൽ ഞങ്ങൾക്ക് നീ വിജയം നൽകേണമേ.',
    target: 1,
    source: 'Sahih al-Bukhari 5009 (Fath al-Bari 9/94) & Sahih Muslim 807 • Hisn al-Muslim Ch. 28, #101',
    virtue:
      'The Prophet (ﷺ) said: "Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him" — protecting him from all evil, harm, and Shaytan throughout the night.',
    malayalamVirtue:
      'തിരുനബി (ﷺ) അരുളി: "ആരെങ്കിലും രാത്രിയിൽ സൂറത്തുൽ ബഖറയിലെ അവസാനത്തെ രണ്ട് ആയത്തുകൾ പാരായണം ചെയ്താൽ അവ അവന് മതിയാകുന്നതാണ്" — ആ രാത്രിയിലെ സകല വിപത്തുകളിൽ നിന്നും പിശാചിന്റെ ഉപദ്രവങ്ങളിൽ നിന്നുമുള്ള കാവലിനും രാത്രി നമസ്കാരത്തിന്റെ പ്രതിഫലത്തിനും ഇത് മതിയാകും (സ്വഹീഹുൽ ബുഖാരി 5009, മുസ്ലിം 807 • ഹിസ്നുൽ മുസ്ലിം #101).',
    repeatNote: '1 time (Surah Al-Baqarah 2:285–286)',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002285.mp3',
    audioUrls: [
      'https://everyayah.com/data/Alafasy_128kbps/002285.mp3',
      'https://everyayah.com/data/Alafasy_128kbps/002286.mp3',
    ],
  },
  {
    id: 'sleep-1',
    category: 'sleep',
    hisnNumber: 102,
    type: 'adhkar',
    title: 'ഉറങ്ങാൻ നേരമുള്ള പ്രാർത്ഥന (ബിസ്മിക റബ്ബീ വളഅ്തു ജൻബീ)',
    arabic:
      'بِاسْمِكَ رَبِّـي وَضَعْـتُ جَنْـبي ، وَبِكَ أَرْفَعُـهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ',
    transliteration:
      "Bismika Rabbi wada'tu janbi, wa bika arfa'uh, fa'in amsakta nafsi farhamha, wa'in arsaltaha fahfazha bima tahfazu bihi 'ibadakas-salihin",
    translation:
      'In Your name my Lord, I lay down my side and in Your name I raise it up. If You take my soul, have mercy upon it, and if You return it, protect it as You protect Your righteous servants.',
    malayalam:
      'എന്റെ രക്ഷിതാവേ, നിന്റെ നാമത്തിൽ ഞാൻ എന്റെ പാർശ്വം വെച്ചു, നിന്റെ സഹായത്താൽ ഞാൻ അതിനെ ഉയർത്തുകയും ചെയ്യുന്നു. നീ എന്റെ ആത്മാവിനെ പിടിച്ചുവെക്കുകയാണെങ്കിൽ അതിനോട് കരുണ കാണിക്കേണമേ. നീ അതിനെ വിട്ടയക്കുകയാണെങ്കിൽ സജ്ജനങ്ങളായ നിന്റെ ദാസന്മാരെ സംരക്ഷിക്കുന്നതുപോലെ അതിനെയും കാത്തുരക്ഷിക്കേണമേ.',
    malayalamTranslation:
      'എന്റെ രക്ഷിതാവേ, നിന്റെ നാമത്തിൽ ഞാൻ എന്റെ പാർശ്വം വെച്ചു, നിന്റെ സഹായത്താൽ ഞാൻ അതിനെ ഉയർത്തുകയും ചെയ്യുന്നു. നീ എന്റെ ആത്മാവിനെ പിടിച്ചുവെക്കുകയാണെങ്കിൽ അതിനോട് കരുണ കാണിക്കേണമേ. നീ അതിനെ വിട്ടയക്കുകയാണെങ്കിൽ സജ്ജനങ്ങളായ നിന്റെ ദാസന്മാരെ സംരക്ഷിക്കുന്നതുപോലെ അതിനെയും കാത്തുരക്ഷിക്കേണമേ.',
    target: 1,
    source: 'Sahih al-Bukhari 6320 & Sahih Muslim 2714 • Hisn al-Muslim Ch. 28, #102',
    virtue:
      'The Prophet (ﷺ) taught that when going to bed, one should dust off the bed three times, lie on the right side, and say this prayer—entrusting the soul to Allah’s mercy if taken in sleep, and to His righteous protection if returned.',
    malayalamVirtue:
      'നിങ്ങളിലൊരാൾ വിരിപ്പിലേക്ക് അണഞ്ഞാൽ വസ്ത്രത്തിന്റെ തുമ്പുകൊണ്ട് വിരിപ്പ് മൂന്ന് തവണ കുടഞ്ഞു വൃത്തിയാക്കി വലതു വശം ചരിഞ്ഞു കിടന്നുകൊണ്ട് ഈ പ്രാർത്ഥന ചൊല്ലാൻ തിരുനബി (ﷺ) കൽപ്പിച്ചു. ഉറക്കത്തിൽ ആത്മാവിനെ അല്ലാഹു തിരിച്ചുപിടിച്ചാൽ അവന്റെ കാരുണ്യം ലഭിക്കാനും, ജീവൻ തിരിച്ചുനൽകിയാൽ സജ്ജനങ്ങളായ ദാസന്മാർക്ക് ലഭിക്കുന്ന ദിവ്യസംരക്ഷണം ലഭിക്കാനും ഇത് കാരണമാകുന്നു (സ്വഹീഹുൽ ബുഖാരി 6320, മുസ്ലിം 2714 • ഹിസ്നുൽ മുസ്ലിം #102).',
    repeatNote: '1 time (Dust off bed 3 times & lie on right side)',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/102.mp3',
  },
  {
    id: 'sleep-khalaqta-nafsi',
    category: 'sleep',
    hisnNumber: 103,
    type: 'adhkar',
    title: 'ആത്മാവിനെ സ്രഷ്ടാവിൽ സമർപ്പിച്ച് സൗഖ്യം തേടുന്ന പ്രാർത്ഥന (അല്ലാഹുമ്മ ഇന്നക ഖലഖ്ത നഫ്സീ)',
    arabic:
      'اللَّهُمَّ إِنَّكَ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ',
    transliteration:
      "Allahumma innaka khalaqta nafsi wa Anta tawaffaha, laka mamatuha wa mahyaha, in ahyaytaha fahfazha, wa in amattaha faghfir laha. Allahumma inni as'alukal-'afiyah.",
    translation:
      'O Allah, Verily You have created my soul and You shall take its life. To You belongs its death and its life. If You keep my soul alive, then protect it; and if You cause it to die, then forgive it. O Allah, I ask You for well-being and safety.',
    malayalam:
      'അല്ലാഹുവേ, തീർച്ചയായും നീയാണ് എന്റെ ആത്മാവിനെ സൃഷ്ടിച്ചത്, നീ തന്നെയാണ് അതിനെ പിടിച്ചെടുക്കുന്നതും. അതിന്റെ മരണവും ജീവിതവും നിനക്കുള്ളതാണ്. നീ അതിനെ ജീവിപ്പിക്കുകയാണെങ്കിൽ അതിനെ നീ കാത്തുരക്ഷിക്കേണമേ; നീ അതിനെ മരിപ്പിക്കുകയാണെങ്കിൽ അതിന് നീ പൊറുത്തുതരേണമേ. അല്ലാഹുവേ, നിന്നോട് ഞാൻ സൗഖ്യവും രക്ഷയും (ആഫിയത്ത്) ചോദിക്കുന്നു.',
    malayalamTranslation:
      'അല്ലാഹുവേ, തീർച്ചയായും നീയാണ് എന്റെ ആത്മാവിനെ സൃഷ്ടിച്ചത്, നീ തന്നെയാണ് അതിനെ പിടിച്ചെടുക്കുന്നതും. അതിന്റെ മരണവും ജീവിതവും നിനക്കുള്ളതാണ്. നീ അതിനെ ജീവിപ്പിക്കുകയാണെങ്കിൽ അതിനെ നീ കാത്തുരക്ഷിക്കേണമേ; നീ അതിനെ മരിപ്പിക്കുകയാണെങ്കിൽ അതിന് നീ പൊറുത്തുതരേണമേ. അല്ലാഹുവേ, നിന്നോട് ഞാൻ സൗഖ്യവും രക്ഷയും (ആഫിയത്ത്) ചോദിക്കുന്നു.',
    target: 1,
    source: 'Sahih Muslim 2712 & Musnad Ahmad (2/79) • Hisn al-Muslim Ch. 28, #103',
    virtue:
      'Entrusts the soul completely to its Creator during sleep, asking for divine preservation in life, forgiveness of sins in death, and complete well-being (\'Afiyah).',
    malayalamVirtue:
      'ഉറക്കമാകുന്ന ചെറിയ മരണത്തിലേക്ക് പ്രവേശിക്കുമ്പോൾ ആത്മാവിന്റെ ജീവിതവും മരണവും സ്രഷ്ടാവായ അല്ലാഹുവിൽ ഭരമേൽപ്പിക്കുകയും, ജീവിച്ചിരിക്കുമ്പോൾ സംരക്ഷണവും മരണപ്പെട്ടാൽ പാപമോചനവും സമ്പൂർണ്ണ ആഫിയത്തും (സൗഖ്യവും) ഉറപ്പാക്കുകയും ചെയ്യുന്ന മഹത്തായ പ്രാർത്ഥന (സ്വഹീഹ് മുസ്ലിം 2712 • ഹിസ്നുൽ മുസ്ലിം #103).',
    repeatNote: '1 time',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/103.mp3',
  },
  {
    id: 's-3',
    category: 'sleep',
    hisnNumber: 104,
    type: 'adhkar',
    title: 'പുനരുത്ഥാന നാളിലെ ശിക്ഷയിൽ നിന്നുള്ള കാവൽ പ്രാർത്ഥന (അല്ലാഹുമ്മ ഖിനീ അദാബക)',
    arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
    translation: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.',
    malayalam:
      'അല്ലാഹുവേ, നിന്റെ ദാസന്മാരെ നീ പുനരുജ്ജീവിപ്പിക്കുന്ന ആ വിചാരണ നാളിൽ നിന്റെ ശിക്ഷയിൽ നിന്ന് എന്നെ കാത്തുരക്ഷിക്കേണമേ.',
    malayalamTranslation:
      'അല്ലാഹുവേ, നിന്റെ ദാസന്മാരെ നീ പുനരുജ്ജീവിപ്പിക്കുന്ന ആ വിചാരണ നാളിൽ നിന്റെ ശിക്ഷയിൽ നിന്ന് എന്നെ കാത്തുരക്ഷിക്കേണമേ.',
    target: 3,
    source: 'Sunan Abi Dawud 5045 & Sunan at-Tirmidhi 3398 • Hisn al-Muslim Ch. 28, #104',
    virtue:
      'Whenever the Prophet (ﷺ) wanted to go to sleep, he would place his right hand under his right cheek and recite this supplication three times, seeking refuge from punishment on the Day of Resurrection.',
    malayalamVirtue:
      'ഉറങ്ങാൻ ഉദ്ദേശിക്കുമ്പോൾ തിരുനബി (ﷺ) തന്റെ വലതു കൈ വലതു കവിളിനടിയിൽ വെച്ച് ഖിബ്‌ലക്ക് അഭിമുഖമായി കിടന്നുകൊണ്ട് ഈ പ്രാർത്ഥന മൂന്ന് തവണ ചൊല്ലുമായിരുന്നു. ഉറക്കവും ഉണർവും മരണത്തെയും പുനരുത്ഥാനത്തെയും ഓർമ്മിപ്പിക്കുന്നതിനാൽ ഖിയാമത്ത് നാളിലെ ശിക്ഷയിൽ നിന്ന് ഇത് സത്യവിശ്വാസിക്ക് കാവൽ നൽകുന്നു (അബൂദാവൂദ് 5045, തിർമിദി 3398 • ഹിസ്നുൽ മുസ്ലിം #104).',
    repeatNote: '3 times (With right hand placed under right cheek)',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/104.mp3',
  },
  {
    id: 'sleep-bismika-amutu',
    category: 'sleep',
    hisnNumber: 105,
    type: 'adhkar',
    title: 'അല്ലാഹുവിന്റെ നാമത്തിൽ ഉറങ്ങുകയും ഉണരുകയും ചെയ്യാനുള്ള പ്രാർത്ഥന',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amootu wa ahya.',
    translation: 'In Your name, O Allah, I die (sleep) and I live (wake up).',
    malayalam:
      'അല്ലാഹുവേ, നിന്റെ നാമത്തിൽ ഞാൻ മരിക്കുകയും (ഉറങ്ങുകയും) ജീവിക്കുകയും (ഉണരുകയും) ചെയ്യുന്നു.',
    malayalamTranslation:
      'അല്ലാഹുവേ, നിന്റെ നാമത്തിൽ ഞാൻ മരിക്കുകയും (ഉറങ്ങുകയും) ജീവിക്കുകയും (ഉണരുകയും) ചെയ്യുന്നു.',
    target: 1,
    source: 'Sahih al-Bukhari 6324 & Sahih Muslim 2711 • Hisn al-Muslim Ch. 28, #105',
    virtue:
      'The constant nightly Sunnah of the Messenger of Allah (ﷺ) upon laying his head down on the pillow, acknowledging that both sleep and waking are entirely in the hands of Allah.',
    malayalamVirtue:
      'വിരിപ്പിലേക്ക് കിടക്കുമ്പോൾ തിരുനബി (ﷺ) പതിവായി ചൊല്ലിയിരുന്ന മഹത്തായ സുന്നത്ത് പ്രാർത്ഥന. ഉറക്കമാകുന്ന ലഘുമരണവും പ്രഭാതത്തിലെ പുനർജീവിതവും അല്ലാഹുവിന്റെ നാമത്തിലും കാവലിലുമാണെന്ന് സത്യവിശ്വാസി സാക്ഷ്യപ്പെടുത്തുന്നു (സ്വഹീഹുൽ ബുഖാരി 6324, മുസ്ലിം 2711 • ഹിസ്നുൽ മുസ്ലിം #105).',
    repeatNote: '1 time',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/105.mp3',
  },
  {
    id: 's-2',
    category: 'sleep',
    hisnNumber: 106,
    type: 'adhkar',
    title: 'തസ്ബീഹ് ഫാത്വിമി — ഉറങ്ങാൻ നേരമുള്ള തസ്ബീഹ് (33 സുബ്ഹാനല്ലാഹ്, 33 അൽഹംദുലില്ലാഹ്, 34 അല്ലാഹു അക്ബർ)',
    arabic: 'سُبْحَانَ اللَّهِ (٣٣)، وَالْحَمْدُ لِلَّهِ (٣٣)، وَاللَّهُ أَكْبَرُ (٣٤)',
    transliteration: 'Subhanallah (33x), wal-Hamdulillah (33x), wallahu Akbar (34x)',
    translation:
      'Glory be to Allah (33 times), Praise be to Allah (33 times), and Allah is the Greatest (34 times).',
    malayalam:
      'സുബ്ഹാനല്ലാഹ് — അല്ലാഹു എത്ര പരിശുദ്ധൻ (33 തവണ), അൽഹംദുലില്ലാഹ് — സർവ്വസ്തുതിയും അല്ലാഹുവിന്നാണ് (33 തവണ), അല്ലാഹു അക്ബർ — അല്ലാഹു ഏറ്റവും മഹാനാണ് (34 തവണ).',
    malayalamTranslation:
      'സുബ്ഹാനല്ലാഹ് — അല്ലാഹു എത്ര പരിശുദ്ധൻ (33 തവണ), അൽഹംദുലില്ലാഹ് — സർവ്വസ്തുതിയും അല്ലാഹുവിന്നാണ് (33 തവണ), അല്ലാഹു അക്ബർ — അല്ലാഹു ഏറ്റവും മഹാനാണ് (34 തവണ).',
    target: 1,
    source: 'Sahih al-Bukhari 3705 & Sahih Muslim 2727 • Hisn al-Muslim Ch. 28, #106',
    virtue:
      'Taught by the Prophet (ﷺ) to his daughter Fatimah (RA) and Ali (RA): reciting 33x SubhanAllah, 33x Alhamdulillah, and 34x Allahu Akbar at bedtime is better for you than having a servant, granting physical strength, relief from daily fatigue, and immense spiritual reward.',
    malayalamVirtue:
      'പകലത്തെ അധ്വാനത്താൽ ക്ഷീണിതയായ പ്രിയ മകൾ ഫാത്വിമ (റ) യോടും അലി (റ) യോടും തിരുനബി (ﷺ) പഠിപ്പിച്ച മഹത്തായ തസ്ബീഹ്: ഒരു സഹായിയെ (വേലക്കാരനെ) ലഭിക്കുന്നതിനേക്കാൾ നിങ്ങൾക്ക് ഉത്തമവും, ശരീരത്തിന് ക്ഷീണമകറ്റി ഉന്മേഷവും ആത്മീയ കരുത്തും നൽകുന്നതുമാണ് ഉറങ്ങാൻ നേരമുള്ള ഈ 100 ദിക്റുകൾ (സ്വഹീഹുൽ ബുഖാരി 3705, മുസ്ലിം 2727 • ഹിസ്നുൽ മുസ്ലിം #106).',
    repeatNote: '33x SubhanAllah + 33x Alhamdulillah + 34x Allahu Akbar (100 total)',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/106.mp3',
  },
  {
    id: 'sleep-rabb-samawat',
    category: 'sleep',
    hisnNumber: 107,
    type: 'adhkar',
    title: 'ഏഴ് ആകാശങ്ങളുടെയും മഹത്തായ അർശിന്റെയും നാഥനോടുള്ള കാവലും കടമോചന പ്രാർത്ഥനയും',
    arabic:
      'اللَّهُمَّ رَبَّ السَّمَاوَاتِ السَّبْعِ وَرَبَّ الْعَرْشِ الْعَظِيمِ، رَبَّنَا وَرَبَّ كُلِّ شَيْءٍ، فَالِقَ الْحَبِّ وَالنَّوَى، وَمُنْزِلَ التَّوْرَاةِ وَالْإِنْجِيلِ وَالْفُرْقَانِ، أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ، اللَّهُمَّ أَنْتَ الْأَوَّلُ فَلَيْسَ قَبْلَكَ شَيْءٌ، وَأَنْتَ الْآخِرُ فَلَيْسَ بَعْدَكَ شَيْءٌ، وَأَنْتَ الظَّاهِرُ فَلَيْسَ فَوْقَكَ شَيْءٌ، وَأَنْتَ الْبَاطِنُ فَلَيْسَ دُونَكَ شَيْءٌ، اقْضِ عَنَّا الدَّيْنَ وَأَغْنِنَا مِنَ الْفَقْرِ',
    transliteration:
      "Allahumma Rabbas-samawatis-sab'i wa Rabbal-'Arshil-'Azeem, Rabbana wa Rabba kulli shay', faliqal-habbi wan-nawa, wa munzilat-Tawrati wal-Injeeli wal-Furqan, a'oodhu bika min sharri kulli shay'in Anta akhidhun binasiyatih. Allahumma Antal-Awwalu falaysa qablaka shay', wa Antal-Akhiru falaysa ba'daka shay', wa Antaz-Zahiru falaysa fawqaka shay', wa Antal-Batinu falaysa doonaka shay', iqdi 'annad-dayna wa aghnina minal-faqr.",
    translation:
      'O Allah, Lord of the seven heavens and Lord of the Magnificent Throne, our Lord and the Lord of everything, Splitter of the grain and the date-stone, Revealer of the Torah, the Gospel, and the Furqan (Quran), I seek refuge in You from the evil of everything whose forelock You hold. O Allah, You are the First and there is nothing before You; You are the Last and there is nothing after You; You are the Most High and there is nothing above You; You are the Most Near and there is nothing closer than You. Settle our debts for us and enrich us from poverty.',
    malayalam:
      'ഏഴ് ആകാശങ്ങളുടെയും നാഥനും മഹത്തായ സിംഹാസനത്തിന്റെ (അർശിന്റെ) നാഥനുമായ അല്ലാഹുവേ! ഞങ്ങളുടെ രക്ഷിതാവേ, സർവ്വ വസ്തുക്കളുടെയും രക്ഷിതാവേ! ധാന്യമണികളും ഈത്തപ്പഴക്കുരുവും പിളർത്തി മുളപ്പിക്കുന്നവനേ, തൗറാത്തും ഇൻജീലും ഫുർഖാനും (ഖുർആനും) അവതരിപ്പിച്ചവനേ! നിന്റെ നിയന്ത്രണത്തിലുള്ള സകല സൃഷ്ടികളുടെയും തിന്മകളിൽ നിന്ന് ഞാൻ നിന്നിൽ ശരണം തേടുന്നു. അല്ലാഹുവേ, നീയാണ് ആദ്യത്തവൻ, നിനക്ക് മുമ്പ് ഒന്നുമില്ല. നീയാണ് അവസാനത്തവൻ, നിനക്ക് ശേഷം ഒന്നുമില്ല. നീയാണ് സർവ്വോന്നതൻ, നിനക്ക് മീതെ ഒന്നുമില്ല. നീയാണ് എല്ലാം സൂക്ഷ്മമായി അറിയുന്നവൻ, നിനക്ക് മറഞ്ഞതായി ഒന്നുമില്ല. ഞങ്ങളുടെ കടങ്ങൾ നീ വീട്ടിത്തരേണമേ, ദാരിദ്ര്യത്തിൽ നിന്ന് ഞങ്ങളെ നീ ധന്യരാക്കേണമേ.',
    malayalamTranslation:
      'ഏഴ് ആകാശങ്ങളുടെയും നാഥനും മഹത്തായ സിംഹാസനത്തിന്റെ (അർശിന്റെ) നാഥനുമായ അല്ലാഹുവേ! ഞങ്ങളുടെ രക്ഷിതാവേ, സർവ്വ വസ്തുക്കളുടെയും രക്ഷിതാവേ! ധാന്യമണികളും ഈത്തപ്പഴക്കുരുവും പിളർത്തി മുളപ്പിക്കുന്നവനേ, തൗറാത്തും ഇൻജീലും ഫുർഖാനും (ഖുർആനും) അവതരിപ്പിച്ചവനേ! നിന്റെ നിയന്ത്രണത്തിലുള്ള സകല സൃഷ്ടികളുടെയും തിന്മകളിൽ നിന്ന് ഞാൻ നിന്നിൽ ശരണം തേടുന്നു. അല്ലാഹുവേ, നീയാണ് ആദ്യത്തവൻ, നിനക്ക് മുമ്പ് ഒന്നുമില്ല. നീയാണ് അവസാനത്തവൻ, നിനക്ക് ശേഷം ഒന്നുമില്ല. നീയാണ് സർവ്വോന്നതൻ, നിനക്ക് മീതെ ഒന്നുമില്ല. നീയാണ് എല്ലാം സൂക്ഷ്മമായി അറിയുന്നവൻ, നിനക്ക് മറഞ്ഞതായി ഒന്നുമില്ല. ഞങ്ങളുടെ കടങ്ങൾ നീ വീട്ടിത്തരേണമേ, ദാരിദ്ര്യത്തിൽ നിന്ന് ഞങ്ങളെ നീ ധന്യരാക്കേണമേ.',
    target: 1,
    source: 'Sahih Muslim 2713 • Hisn al-Muslim Ch. 28, #107',
    virtue:
      'Glorifies Allah by His supreme attributes at bedtime, granting protection from the evil of all creation, relief from the burden of debt, and sufficiency from poverty.',
    malayalamVirtue:
      'ഉറങ്ങാൻ കിടക്കുമ്പോൾ അല്ലാഹുവിന്റെ മഹത്തായ നാമഗുണങ്ങളെ മുൻനിർത്തി സകല സൃഷ്ടികളുടെയും ഉപദ്രവങ്ങളിൽ നിന്ന് കാവൽ തേടാനും, കടബാധ്യതകളിൽ നിന്നും ദാരിദ്ര്യത്തിൽ നിന്നും മോചനവും ഐശ്വര്യവും ലഭിക്കാനും തിരുനബി (ﷺ) പഠിപ്പിച്ച പ്രാർത്ഥന (സ്വഹീഹ് മുസ്ലിം 2713 • ഹിസ്നുൽ മുസ്ലിം #107).',
    repeatNote: '1 time',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/107.mp3',
  },
  {
    id: 'sleep-alhamdulillah-atamana',
    category: 'sleep',
    hisnNumber: 108,
    type: 'adhkar',
    title: 'ഭക്ഷണവും പാനീയവും അഭയവും നൽകിയ അല്ലാഹുവിനെ സ്തുതിക്കുന്ന പ്രാർത്ഥന',
    arabic:
      'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا، وَكَفَانَا وَآوَانَا، فَكَمْ مِمَّنْ لَا كَافِيَ لَهُ وَلَا مُؤْوِيَ',
    transliteration:
      "Alhamdulillahi-lladhi at'amana wa saqana, wa kafana wa awana, fakam mimman la kafiya lahu wa la mu'wiya.",
    translation:
      'All praise is for Allah, Who fed us and gave us drink, Who sufficed us and gave us shelter; for how many are there with none to suffice them and none to give them shelter!',
    malayalam:
      'ഞങ്ങൾക്ക് ഭക്ഷണവും പാനീയവും നൽകുകയും, ഞങ്ങൾക്ക് മതിയാവുകയും, ഞങ്ങൾക്ക് അന്തിയുറങ്ങാൻ അഭയം നൽകുകയും ചെയ്ത അല്ലാഹുവിന് സർവ്വസ്തുതിയും! സംരക്ഷിക്കാനോ അഭയം നൽകാനോ ആരുമില്ലാത്ത എത്രയെത്ര ആളുകളാണുള്ളത്!',
    malayalamTranslation:
      'ഞങ്ങൾക്ക് ഭക്ഷണവും പാനീയവും നൽകുകയും, ഞങ്ങൾക്ക് മതിയാവുകയും, ഞങ്ങൾക്ക് അന്തിയുറങ്ങാൻ അഭയം നൽകുകയും ചെയ്ത അല്ലാഹുവിന് സർവ്വസ്തുതിയും! സംരക്ഷിക്കാനോ അഭയം നൽകാനോ ആരുമില്ലാത്ത എത്രയെത്ര ആളുകളാണുള്ളത്!',
    target: 1,
    source: 'Sahih Muslim 2715 & Sunan Abi Dawud 5053 • Hisn al-Muslim Ch. 28, #108',
    virtue:
      'The Prophet (ﷺ) used to recite this every night upon going to bed, awakening deep gratitude for daily sustenance, protection, and a peaceful home.',
    malayalamVirtue:
      'ഉറങ്ങാൻ വിരിപ്പിലേക്ക് അണയുമ്പോൾ ആ ദിവസത്തെ ഭക്ഷണത്തിനും വെള്ളത്തിനും സംരക്ഷണത്തിനും സുരക്ഷിതമായ വീടിനും അല്ലാഹുവിനോട് നന്ദി (ശുക്റ്) രേഖപ്പെടുത്താൻ തിരുനബി (ﷺ) പതിവായി ചൊല്ലിയിരുന്ന പ്രാർത്ഥന. നന്ദിയുള്ള ദാസന് അല്ലാഹു അനുഗ്രഹങ്ങൾ വർദ്ധിപ്പിച്ചു നൽകുന്നു (സ്വഹീഹ് മുസ്ലിം 2715 • ഹിസ്നുൽ മുസ്ലിം #108).',
    repeatNote: '1 time',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/108.mp3',
  },
  {
    id: 'sleep-alim-ghayb',
    category: 'sleep',
    hisnNumber: 109,
    type: 'adhkar',
    title: 'മനസ്സിന്റെയും പിശാചിന്റെയും തിന്മകളിൽ നിന്നുള്ള രാത്രി കാവൽ പ്രാർത്ഥന',
    arabic:
      'اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا، أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ',
    transliteration:
      "Allahumma 'Alimal-ghaybi wash-shahadati Fatiras-samawati wal-ard, Rabba kulli shay'iw-wa maleekah, ash-hadu al-la ilaha illa Ant, a'oodhu bika min sharri nafsi, wa min sharrish-shaytani wa shirkih, wa an aqtarifa 'ala nafsi soo'an, aw ajurrahu ila Muslim.",
    translation:
      'O Allah, Knower of the unseen and the seen, Creator of the heavens and the earth, Lord and Sovereign of all things: I bear witness that none has the right to be worshipped except You. I seek refuge in You from the evil of my own soul, from the evil of Satan and his traps of shirk, and from committing evil against myself or bringing it upon any Muslim.',
    malayalam:
      'അദൃശ്യവും ദൃശ്യവും അറിയുന്നവനും, ആകാശങ്ങളുടെയും ഭൂമിയുടെയും സ്രഷ്ടാവും, സർവ്വ വസ്തുക്കളുടെയും രക്ഷിതാവും ഉടമസ്ഥനുമായ അല്ലാഹുവേ! നീയല്ലാതെ യാതൊരു ആരാധ്യനുമില്ലെന്ന് ഞാൻ സാക്ഷ്യം വഹിക്കുന്നു. എന്റെ സ്വന്തം മനസ്സിന്റെ തിന്മയിൽ നിന്നും, പിശാചിന്റെ ഉപദ്രവത്തിൽ നിന്നും അവന്റെ ശിർക്കൻ കെണികളിൽ നിന്നും, എന്റെ ആത്മാവിനോട് തന്നെ ഞാൻ വല്ല തിന്മയും പ്രവർത്തിക്കുന്നതിൽ നിന്നും അല്ലെങ്കിൽ ഒരു മുസ്ലിമിന് വല്ല ദോഷവും വരുത്തിവെക്കുന്നതിൽ നിന്നും നിന്നിൽ ഞാൻ അഭയം തേടുന്നു.',
    malayalamTranslation:
      'അദൃശ്യവും ദൃശ്യവും അറിയുന്നവനും, ആകാശങ്ങളുടെയും ഭൂമിയുടെയും സ്രഷ്ടാവും, സർവ്വ വസ്തുക്കളുടെയും രക്ഷിതാവും ഉടമസ്ഥനുമായ അല്ലാഹുവേ! നീയല്ലാതെ യാതൊരു ആരാധ്യനുമില്ലെന്ന് ഞാൻ സാക്ഷ്യം വഹിക്കുന്നു. എന്റെ സ്വന്തം മനസ്സിന്റെ തിന്മയിൽ നിന്നും, പിശാചിന്റെ ഉപദ്രവത്തിൽ നിന്നും അവന്റെ ശിർക്കൻ കെണികളിൽ നിന്നും, എന്റെ ആത്മാവിനോട് തന്നെ ഞാൻ വല്ല തിന്മയും പ്രവർത്തിക്കുന്നതിൽ നിന്നും അല്ലെങ്കിൽ ഒരു മുസ്ലിമിന് വല്ല ദോഷവും വരുത്തിവെക്കുന്നതിൽ നിന്നും നിന്നിൽ ഞാൻ അഭയം തേടുന്നു.',
    target: 1,
    source: 'Sunan Abi Dawud 5067 & Sunan at-Tirmidhi 3392 • Hisn al-Muslim Ch. 28, #109',
    virtue:
      'Taught by the Prophet (ﷺ) to Abu Bakr as-Siddiq (RA) to recite in the morning, evening, and when going to bed to shield oneself from the whispers of Shaytan and the evil inclinations of the soul.',
    malayalamVirtue:
      'അബൂബക്കർ സ്വിദ്ദീഖ് (റ) വിനോട് രാവിലെയും വൈകുന്നേരവും ഉറങ്ങാൻ വിരിപ്പിലേക്ക് അണയുമ്പോഴും ചൊല്ലാൻ തിരുനബി (ﷺ) പ്രത്യേകം വസ്വിയ്യത്ത് ചെയ്ത പ്രാർത്ഥന. പിശാചിന്റെ ദുർബോധനങ്ങളിൽ നിന്നും സ്വന്തം മനസ്സിന്റെ തിന്മകളിൽ നിന്നും ഇത് രാത്രി മുഴുവൻ സംരക്ഷണം നൽകുന്നു (അബൂദാവൂദ് 5067, തിർമിദി 3392 • ഹിസ്നുൽ മുസ്ലിം #109).',
    repeatNote: '1 time',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/109.mp3',
  },
  {
    id: 'sleep-aslamtu-nafsi',
    category: 'sleep',
    hisnNumber: 111,
    type: 'adhkar',
    title: 'ഉറങ്ങുന്നതിന് മുമ്പുള്ള അവസാനത്തെ പശ്ചാത്താപ-സമർപ്പണ പ്രാർത്ഥന (അല്ലാഹുമ്മ അസ്‌ലംതു നഫ്സീ ഇലൈക്ക)',
    arabic:
      'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ',
    transliteration:
      "Allahumma aslamtu nafsi ilayk, wa fawwadtu amri ilayk, wa wajjahtu wajhi ilayk, wa alja'tu zahri ilayk, raghbatan wa rahbatan ilayk, la malja'a wa la manja minka illa ilayk, amantu bi-Kitabikal-ladhi anzalt, wa bi-Nabiyyikal-ladhi arsalt.",
    translation:
      'O Allah, I submit my soul unto You, and I entrust my affair unto You, and I turn my face towards You, and I totally rely on You, in hope and fear of You. Verily there is no refuge nor safe haven from You except with You. I believe in Your Book which You have revealed and in Your Prophet whom You have sent.',
    malayalam:
      'അല്ലാഹുവേ, എന്റെ ആത്മാവിനെ ഞാൻ നിനക്ക് കീഴ്പ്പെടുത്തിയിരിക്കുന്നു, എന്റെ കാര്യങ്ങളെല്ലാം ഞാൻ നിന്നിൽ ഭരമേൽപ്പിച്ചിരിക്കുന്നു, എന്റെ മുഖം ഞാൻ നിന്നിലേക്ക് തിരിച്ചിരിക്കുന്നു, നിന്റെ പ്രതിഫലം ആഗ്രഹിച്ചും നിന്റെ ശിക്ഷയെ ഭയന്നും എന്റെ മുതുകിനെ ഞാൻ നിന്നിലേക്ക് ചാരിയിരിക്കുന്നു (നിന്നെ പൂർണ്ണമായി ആശ്രയിച്ചിരിക്കുന്നു). നിന്നിൽ നിന്നുള്ള രക്ഷയും അഭയവും നിന്നിലല്ലാതെ മറ്റൊരിടത്തുമില്ല. നീ അവതരിപ്പിച്ച നിന്റെ വേദഗ്രന്ഥത്തിലും നീ നിയോഗിച്ച നിന്റെ പ്രവാചകനിലും ഞാൻ വിശ്വസിച്ചിരിക്കുന്നു.',
    malayalamTranslation:
      'അല്ലാഹുവേ, എന്റെ ആത്മാവിനെ ഞാൻ നിനക്ക് കീഴ്പ്പെടുത്തിയിരിക്കുന്നു, എന്റെ കാര്യങ്ങളെല്ലാം ഞാൻ നിന്നിൽ ഭരമേൽപ്പിച്ചിരിക്കുന്നു, എന്റെ മുഖം ഞാൻ നിന്നിലേക്ക് തിരിച്ചിരിക്കുന്നു, നിന്റെ പ്രതിഫലം ആഗ്രഹിച്ചും നിന്റെ ശിക്ഷയെ ഭയന്നും എന്റെ മുതുകിനെ ഞാൻ നിന്നിലേക്ക് ചാരിയിരിക്കുന്നു (നിന്നെ പൂർണ്ണമായി ആശ്രയിച്ചിരിക്കുന്നു). നിന്നിൽ നിന്നുള്ള രക്ഷയും അഭയവും നിന്നിലല്ലാതെ മറ്റൊരിടത്തുമില്ല. നീ അവതരിപ്പിച്ച നിന്റെ വേദഗ്രന്ഥത്തിലും നീ നിയോഗിച്ച നിന്റെ പ്രവാചകനിലും ഞാൻ വിശ്വസിച്ചിരിക്കുന്നു.',
    target: 1,
    source: 'Sahih al-Bukhari 6311 (Fath al-Bari 11/113) & Sahih Muslim 2710 • Hisn al-Muslim Ch. 28, #111',
    virtue:
      'The Prophet (ﷺ) told Al-Bara’ ibn ‘Azib (RA): "When you go to bed, perform ablution (wudu) as you do for prayer, then lie down on your right side and say this supplication, and make these the last words you speak at night. If you die on that night, you will die upon Fitrah (pure Islamic monotheism and forgiveness), and if you wake up in the morning, you will wake up blessed with great good."',
    malayalamVirtue:
      'അൽ-ബറാഅ് ഇബ്നു ആസിബ് (റ) വിനോട് നബി (ﷺ) അരുളി: "നീ വിരിപ്പിലേക്ക് അണയുമ്പോൾ നമസ്കാരത്തിന് എന്നപോലെ വുളൂഅ് ചെയ്യുക, എന്നിട്ട് വലതു വശം ചരിഞ്ഞു കിടന്ന് ഈ പ്രാർത്ഥന ചൊല്ലുക; രാത്രിയിൽ നീ അവസാനമായി പറയുന്ന വാക്കുകൾ ഇതായിരിക്കട്ടെ. ആ രാത്രി നീ മരണപ്പെട്ടാൽ പാപങ്ങൾ പൊറുക്കപ്പെട്ട് ശുദ്ധപ്രകൃതിയായ ഫിത്റത്തിൽ (ഇസ്‌ലാമിൽ) നീ മരണപ്പെടും; പ്രഭാതത്തിൽ ഉണർന്നാൽ മഹത്തായ നന്മയോടെ ഉണരുകയും ചെയ്യും" (സ്വഹീഹുൽ ബുഖാരി 6311, മുസ്ലിം 2710 • ഹിസ്നുൽ മുസ്ലിം #111).',
    repeatNote: '1 time (Recite with Wudu on right side as final words before sleep)',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/111.mp3',
  },
];

export const CATEGORIES_CONFIG = [
  {
    key: 'morning' as const,
    label: 'Morning',
    arabicLabel: 'أذكار الصباح',
    malayalamLabel: 'പ്രഭാത ദിക്റുകൾ',
    icon: 'Sun',
    color: 'amber',
    timeHint: 'Between Fajr & Sunrise / Noon',
  },
  {
    key: 'evening' as const,
    label: 'Evening',
    arabicLabel: 'أذكار المساء',
    malayalamLabel: 'സായാഹ്ന ദിക്റുകൾ',
    icon: 'Moon',
    color: 'indigo',
    timeHint: 'Between Asr & Sunset / Night',
  },
  {
    key: 'prayer' as const,
    label: 'After Prayer',
    arabicLabel: 'بعد الصلاة',
    malayalamLabel: 'നമസ്കാര ശേഷം',
    icon: 'Sparkles',
    color: 'emerald',
    timeHint: 'After obligatory fard prayers',
  },
  {
    key: 'sleep' as const,
    label: 'Night & Sleep',
    arabicLabel: 'أذكار النوم',
    malayalamLabel: 'ഉറക്കത്തിനു മുൻപ്',
    icon: 'BedDouble',
    color: 'purple',
    timeHint: 'Before sleeping at night',
  },
  {
    key: 'favorites' as const,
    label: 'Favorites',
    arabicLabel: 'الأذكار المفضلة',
    malayalamLabel: 'പ്രിയപ്പെട്ടവ',
    icon: 'Star',
    color: 'amber',
    timeHint: 'Your starred supplications for quick access',
  },
  {
    key: 'tasbih' as const,
    label: 'Digital Tasbih',
    arabicLabel: 'المسبحة الإلكترونية',
    malayalamLabel: 'ഡിജിറ്റൽ തസ്ബീഹ്',
    icon: 'CircleDot',
    color: 'teal',
    timeHint: 'Custom target or free remembrance',
  },
  {
    key: 'tasks' as const,
    label: 'Daily Tasks',
    arabicLabel: 'مهام اليوم',
    malayalamLabel: 'പ്രതിദിന കർമ്മങ്ങൾ',
    icon: 'CheckSquare',
    color: 'emerald',
    timeHint: 'Daily Sunnah, prayers & virtuous deeds checklist',
  },
];

export const ALL_ADHKAR_ITEMS: DhikrItem[] = [
  ...MORNING_ADHKAR,
  ...EVENING_ADHKAR,
  ...PRAYER_ADHKAR,
  ...SLEEP_ADHKAR,
];

export const TASBIH_PRESETS = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhanallah',
    translation: 'Glory be to Allah',
    malayalamTranslation: 'അല്ലാഹു എത്ര പരിശുദ്ധൻ',
    target: 33,
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'Praise be to Allah',
    malayalamTranslation: 'സർവ്വസ്തുതിയും അല്ലാഹുവിന്നാണ്',
    target: 33,
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest',
    malayalamTranslation: 'അല്ലാഹു ഏറ്റവും മഹാനാണ്',
    target: 34,
  },
  {
    id: 'lailahaillallah',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
    transliteration: 'La ilaha illallah',
    translation: 'None has the right to be worshipped except Allah',
    malayalamTranslation: 'അല്ലാഹുവല്ലാതെ യാതൊരു ആരാധ്യനുമില്ല',
    target: 100,
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullaha wa atubu ilayh',
    translation: 'I seek forgiveness from Allah and repent to Him',
    malayalamTranslation: 'ഞാൻ അല്ലാഹുവോട് പാപമോചനം തേടുകയും പശ്ചാത്തപിക്കുകയും ചെയ്യുന്നു',
    target: 100,
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    transliteration: "Allahumma salli 'ala Muhammad wa 'ala ali Muhammad",
    translation: 'O Allah, bestow blessings upon Muhammad and his family',
    malayalamTranslation: 'അല്ലാഹുവേ, മുഹമ്മദ് നബിയുടെയും കുടുംബത്തിന്റെയും മേൽ നീ അനുഗ്രഹങ്ങൾ ചൊരിയേണമേ',
    target: 10,
  },
  {
    id: 'hawqala',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    translation: 'There is no power nor strength except with Allah',
    malayalamTranslation: 'അല്ലാഹുവിനെക്കൊണ്ടല്ലാതെ യാതൊരു ശക്തിയും കഴിവുമില്ല',
    target: 100,
  },
];
