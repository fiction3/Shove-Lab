// Swedish translation of the Home Game walkthrough.
//
// Poker terms stay in English (small blind, big blind, BB, button, flop,
// push/fold, rebuy, cash game) — that's how Swedish poker players actually
// speak, and it matches the project's i18n rule. Only the surrounding
// explanatory prose and UI chrome is translated.

export const HOME_GAME_CONTENT_SV = {
  kicker: "Bygg ditt hemmaspel",
  title: "K\u00f6r en single-table-turnering",
  subtitle: "Sex steg, fr\u00e5n b\u00f6rjan till slut",
  startOver: "B\u00f6rja om",
  next: "N\u00e4sta",
  back: "Tillbaka",
  stepOf: (n, total) => `Steg ${n} av ${total}`,

  s1: {
    tag: "Prispotten",
    heading: "Alla k\u00f6per in f\u00f6r lika mycket",
    p1: "En turnering fungerar s\u00e5 h\u00e4r: alla betalar samma buy-in f\u00f6r att vara med, och de pengarna bildar en gemensam prispott. I utbyte f\u00e5r varje spelare lika m\u00e5nga marker att spela med.",
    p2: "Det viktigaste att f\u00f6rst\u00e5 fr\u00e5n b\u00f6rjan \u2014 och det nyb\u00f6rjare alltid g\u00e5r bet p\u00e5 \u2014 \u00e4r att markerna bara \u00e4r en po\u00e4ngtavla. De \u00e4r inte pengar. En spelare med m\u00e5nga marker \u201cvinner\u201d inte pengar \u00e4nnu; den har bara en h\u00f6gre po\u00e4ng. De riktiga pengarna byter \u00e4gare f\u00f6rst p\u00e5 slutet, n\u00e4r prispotten betalas ut.",
    statBuyinLabel: "Buy-in per person",
    statBuyinSub: "4\u20136 spelare",
    statPoolLabel: "Prispott",
    statPoolSub: "betalas ut p\u00e5 slutet",
    panelLead: "Varf\u00f6r lika buy-in?",
    panel: " En turnering slutar med att en vinnare tar potten, s\u00e5 det k\u00e4nns bara r\u00e4ttvist om alla riskerade lika mycket f\u00f6r att vara med. (Ett spel d\u00e4r markerna motsvarar riktiga pengar och folk kommer och g\u00e5r kallas \u201ccash game\u201d \u2014 ett annat format som vi inte anv\u00e4nder h\u00e4r.)",
  },

  s2: {
    tag: "Din markersats",
    heading: "Vilken sats har du?",
    p1: "B\u00f6rja med vilken set-up du \u00e4ger \u2014 det \u00e4r det f\u00f6rsta praktiska som formar kv\u00e4llen, eftersom den avg\u00f6r hur stort bord du kan ha.",
    diffLead: "Skillnaden:",
    diff: " b\u00e5da l\u00e5dorna inneh\u00e5ller samma sorts marker \u2014 500-satsen har bara fler av varje f\u00e4rg. \u00c4r ni 4\u20136 v\u00e4nner r\u00e4cker en 300-sats; en 500-sats \u00e4r uppgraderingen f\u00f6r ett st\u00f6rre bord eller m\u00e5nga rebuys.",
  },

  s3: {
    tag: "Marker & stack",
    heading: "St\u00e4ll in markerna",
    p1Lead: "Marker k\u00e4nns igen p\u00e5 siffran som st\u00e5r p\u00e5 dem",
    p1: ", inte f\u00e4rgen (varje sats har olika f\u00e4rger \u2014 g\u00e5 efter v\u00e4rdet). V\u00e4lj de fyra v\u00e4rden som matchar din sats, och sedan hur l\u00e5ng kv\u00e4ll du vill ha.",
    valuesLabel: "Dina markerv\u00e4rden",
    lengthLabel: "Hur l\u00e5ng kv\u00e4ll?",
    deepNote: "Ett djupt spel (150 BB) beh\u00f6ver en h\u00f6gre toppmarker \u2014 byt till satsen 25 / 100 / 500 / 1000 f\u00f6r det.",
    stackLabel: "Stack",
    stackSub: "marker var",
    runsLabel: "Varar",
    runsSub: "5\u20136 spelare",
    eachLabel: "Varje spelare f\u00e5r",
    mathLead: "R\u00e4kningen:",
    mathTail: "den minsta markern motsvarar small blind, s\u00e5 du kan alltid v\u00e4xla. Alla spelare b\u00f6rjar med exakt samma upps\u00e4ttning. Tiderna \u00e4r uppskattningar; rebuys och ett st\u00f6rre bord g\u00f6r kv\u00e4llen l\u00e4ngre.",
    perPlayer: "per spelare \u2014",
  },

  s4: {
    tag: "Blinds & niv\u00e5er",
    heading: "St\u00e4ll in blinds \u2014 och en timer",
    p1: "F\u00f6re varje hand tvingas tv\u00e5 spelare l\u00e4gga in marker f\u00f6r att f\u00e5 ig\u00e5ng spelet \u2014 annars skulle alla bara kunna l\u00e4gga sig f\u00f6r evigt. Spelaren till v\u00e4nster om dealern l\u00e4gger small blind; n\u00e4sta spelare l\u00e4gger big blind (dubbelt s\u00e5 mycket). De flyttar ett steg \u00e5t v\u00e4nster varje hand, s\u00e5 b\u00f6rdan delas j\u00e4mnt.",
    p1LinkPrefix: " Vill du ha hela historien? ",
    lessonLinkText: "Blinds & Button-lektionen",
    p1LinkSuffix: " g\u00e5r igenom det.",
    p2a: "B\u00f6rja p\u00e5 ",
    p2b: " \u2014 det g\u00f6r din ",
    p2c: "-marker-stack ",
    p2d: ". H\u00f6j dem sedan var ",
    p2bold: "20:e minut",
    p2e: " med en timer (vilken mobiltimer som helst funkar).",
    colLevel: "Niv\u00e5",
    colBlinds: "Small / Big",
    colAfter: "Efter",
    panelWhyLead: "Varf\u00f6r h\u00f6ja dem?",
    panelWhy: " Stigande blinds kostar alla n\u00e5got f\u00f6r att sitta still, vilket tvingar fram action \u2014 det \u00e4r det som till slut avslutar kv\u00e4llen i st\u00e4llet f\u00f6r att alla l\u00e4gger sig i all evighet. ",
    panelLongerLead: "Vill du ha ett l\u00e4ngre spel?",
    panelLonger: " H\u00f6j mer s\u00e4llan \u2014 var 30:e minut, eller stanna tv\u00e5 timerrundor per niv\u00e5. ",
    panelShorterLead: "Kortare?",
    panelShorter: " Var 10\u201315:e minut. Det \u00e4r timern, inte antalet marker, som styr hur l\u00e4nge ni spelar.",
    levelStart: "start",
    level20: "20 min",
    level40: "40 min",
    level1hr: "1 tim",
    level1hr20: "1 tim 20",
    level1hr40: "1 tim 40",
  },

  s5: {
    tag: "Regler att best\u00e4mma f\u00f6rst",
    heading: "Best\u00e4m rebuys & utbetalning",
    rebuyTitle: "Rebuys f\u00f6rsta timmen",
    rebuyBody: "\u00c5kt ut tidigt? K\u00f6p in dig igen f\u00f6r ytterligare 20 dollar och f\u00e5 en ny stack. Efter en timme l\u00e5ses spelet \u2014 vinn eller \u00e5k hem. H\u00e5ller alla med i spelet samtidigt som det \u00e4nd\u00e5 f\u00e5r ett rent slut.",
    splitTitle: "Dela upp prispotten",
    splitBody: "Enklast \u00e4r att vinnaren tar allt. F\u00f6r en mjukare landning, betala ut till de tv\u00e5 b\u00e4sta.",
    stat1Label: "1:a plats",
    stat1Sub: "av potten",
    stat2Label: "2:a plats",
    stat2Sub: "av potten",
    panel: "M\u00e5nga rebuys? L\u00e4gg till en tredje plats \u2014 t.ex. 65 / 25 / 10. Gyllene regeln: ",
    panelBold: "best\u00e4m detta innan ni b\u00f6rjar",
    panelTail: ", aldrig vid midnatt.",
  },

  s6: {
    tag: "Du \u00e4r redo",
    heading: "Dela ut \u2014 och spela dina spots",
    p1: "Det var hela upps\u00e4ttningen. N\u00e5gra bordsanteckningar: en person blandar och delar varje hand (eller turas om), och en markering som kallas button ligger framf\u00f6r den som \u00e4r \u201cdealer\u201d f\u00f6r handen \u2014 den flyttar ett steg \u00e5t v\u00e4nster varje hand s\u00e5 att alla turas om att l\u00e4gga blinds.",
    p1LinkPrefix: " Ny p\u00e5 hur den rotationen funkar? ",
    lessonLinkText: "Blinds & Button-lektionen",
    p1LinkSuffix: " g\u00e5r igenom det.",
    p2: "L\u00e4gg en duk eller filt p\u00e5 bordet s\u00e5 markerna glider l\u00e4tt, dela f\u00f6rsta handen p\u00e5 niv\u00e5 1, och ni \u00e4r ig\u00e5ng. H\u00e4rifr\u00e5n handlar det om det enda som faktiskt vinner marker: bra beslut.",
    cardCaption: "Fick du en stor hand med kort stack? Det \u00e4r en push/fold-spot.",
    bridge: "N\u00e4r du har ett spel inbokat \u00e4r Trainer det b\u00e4sta st\u00e4llet att v\u00e4ssa formen innan alla dyker upp.",
    bridgeButton: "\u00d6va i Trainer",
  },

  sets: {
    300: { players: "4\u20136 spelare", diff: "Standardl\u00e5dan f\u00f6r nyb\u00f6rjare \u2014 ungef\u00e4r 100 av den minsta markern och ~50 av varje annan f\u00e4rg. Perfekt f\u00f6r en liten grupp." },
    500: { players: "6\u201310 spelare", diff: "Ungef\u00e4r h\u00e4lften s\u00e5 m\u00e5nga marker till av varje f\u00e4rg. R\u00e4cker till ett st\u00f6rre bord och l\u00e4mnar marker \u00f6ver f\u00f6r rebuys." },
  },

  depths: {
    50:  { descriptor: "Kort & snabb", duration: "1\u00bd\u20132\u00bd timmar" },
    100: { descriptor: "Standard", duration: "2\u00bd\u20133\u00bd timmar" },
    150: { descriptor: "Djup & l\u00e5ng", duration: "3\u00bd\u20135 timmar" },
  },

  denoms: {
    standard: "Den vanligaste l\u00e5dan. Funkar f\u00f6r spel av alla l\u00e4ngder.",
    low: "En sats med l\u00e4gre v\u00e4rden (har en 50-marker). B\u00e4st f\u00f6r kortare spel \u2014 dess toppmarker \u00e4r bara 500.",
    high: "En sats med h\u00f6gre v\u00e4rden utan sm\u00e5 marker, s\u00e5 blinds b\u00f6rjar p\u00e5 50 / 100.",
  },
};
