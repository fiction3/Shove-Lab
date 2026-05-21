// UI string table. Poker terms (shove, all-in, river, pot odds, the trainer
// mode names) intentionally stay in English in every language — only chrome
// and plain UI labels are translated.
//
// Keys are namespaced by area: tab.*, learn.*, common.*, etc.

export const STRINGS = {
  en: {
    // Header / nav
    "header.tagline": "MTT Trainer · Nash + ICM",
    "donate.button": "Donate if you like",

    // Tab labels (these ARE translated; poker mode names below are not)
    "tab.basics": "Basics",
    "tab.hands": "Hands",
    "tab.learn": "Learn",
    "tab.drills": "Drills",
    "tab.trainer": "Trainer",
    "tab.review": "Session Review",
    "tab.ranges": "Range Viewer",
    "tab.icm": "ICM Setup",

    // Learn / Basics shared chrome
    "learn.lessons": "Lessons",
    "learn.basicsList": "Basics",
    "learn.plainEnglish": "Plain English",
    "learn.hidePlainEnglish": "Hide plain English",
    "learn.minRead": "min read",
    "learn.next": "Next",
    "learn.previous": "Previous",
    "learn.practiceThis": "Practice this in a drill",

    // Generic
    "common.close": "Close",

    // Visual labels (descriptive text inside diagrams; poker terms stay English)
    "viz.deal.caption": "The hand unfolds in four stages, each followed by betting.",
    "viz.deal.preflop": "Just your two hole cards. Betting round 1.",
    "viz.deal.flop": "Three community cards. Betting round 2.",
    "viz.deal.turn": "Fourth community card. Betting round 3.",
    "viz.deal.river": "Final community card. Betting round 4.",
    "viz.deal.noCards": "(No community cards yet)",
    "viz.legend.bettingRound": "Betting round",

    // Betting-flow diagram steps + legend
    "viz.flow.caption": "The rhythm of every hand: cards dealt, then a round of betting, then more cards. Repeat until showdown — or until everyone else folds.",
    "viz.flow.blindsPosted": "Blinds posted",
    "viz.flow.blindsPosted.d": "SB and BB put in chips before any cards are dealt",
    "viz.flow.holeCards": "Hole cards dealt",
    "viz.flow.holeCards.d": "Each player gets 2 face-down cards",
    "viz.flow.preflopBet": "Preflop betting",
    "viz.flow.preflopBet.d": "Fold, call, or raise",
    "viz.flow.flopDealt": "Flop dealt",
    "viz.flow.flopDealt.d": "3 community cards face up",
    "viz.flow.flopBet": "Flop betting",
    "viz.flow.flopBet.d": "Check, bet, or raise",
    "viz.flow.turnDealt": "Turn dealt",
    "viz.flow.turnDealt.d": "4th community card",
    "viz.flow.turnBet": "Turn betting",
    "viz.flow.turnBet.d": "Check, bet, or raise",
    "viz.flow.riverDealt": "River dealt",
    "viz.flow.riverDealt.d": "5th community card",
    "viz.flow.riverBet": "River betting",
    "viz.flow.riverBet.d": "Final round of betting",
    "viz.flow.showdown": "Showdown",
    "viz.flow.showdown.d": "Both players reveal — best 5-card hand wins the pot",
    "viz.flow.legend.setup": "Setup",
    "viz.flow.legend.cardsDealt": "Cards dealt",
    "viz.flow.legend.handEnds": "Hand ends",

    // Blinds & Button visual
    "viz.blinds.caption": "The Button moves one seat to the left each hand. SB and BB are forced to bet before any cards are dealt.",
    "viz.blinds.btn": "BTN — Button (acts last)",
    "viz.blinds.bb": "BB — Big Blind (forced full bet)",
    "viz.blinds.sb": "SB — Small Blind (forced half bet)",
    // Button rotation visual
    "viz.rotation.caption": "Each hand, the button shifts one seat clockwise — and the SB and BB shift with it. After enough hands, every player takes a turn at every position.",
    "viz.rotation.btn": "BTN (button)",
    "viz.rotation.sb": "SB (small blind)",
    "viz.rotation.bb": "BB (big blind)",
    // Dangerous boards visual
    "viz.danger.caption": "Memorize these three patterns. Almost every postflop trap comes from one of them.",
    "viz.danger.theBoard": "The board",
    "viz.danger.ifVillain": "If villain has",
    "viz.danger.flush.title": "Flush draw board",
    "viz.danger.flush.makes": "Flush — five hearts",
    "viz.danger.flush.threat": "Three hearts on board. Anyone holding two hearts has a flush.",
    "viz.danger.straight.title": "Straight draw board",
    "viz.danger.straight.makes": "Straight — 8-9-T-J-Q",
    "viz.danger.straight.threat": "Three connected ranks. Anyone holding two cards that fit the run has a straight.",
    "viz.danger.paired.title": "Paired board",
    "viz.danger.paired.makes": "Three of a kind — trip 7s",
    "viz.danger.paired.threat": "Two sevens on board. Anyone holding the third 7 has three of a kind.",
    // MTT payout visual
    "viz.payout.caption": "A typical MTT payout structure. First place gets ~25× what min-cashers get, even though the player skill gap isn't 25× as wide.",
    "viz.payout.minCash": "70th (min cash)",

    // Hold'em hero visual
    "viz.hero.caption": "From your 2 cards + the 5 on the board, you pick the best 5-card hand. The other 2 are just ignored.",
    "viz.hero.step1": "Step 1 · The 7 cards available to you",
    "viz.hero.yourHand": "Your hand",
    "viz.hero.theBoard": "The board",
    "viz.hero.step2": "Step 2 · Pick the best 5 of those 7",
    "viz.hero.straight": "A-K-Q-J-T · Straight to the Ace",
    "viz.hero.dropped": "(The 5 and 2 are dropped — they don't help this hand)",

    // Hand rankings visual caption (the hand NAMES stay English as poker terms)
    "viz.rankings.caption": "The complete hand ranking, strongest to weakest. Memorizing this is the first homework of poker.",
    "viz.rankings.royalFlush": "Best possible hand. Vanishingly rare.",
    "viz.rankings.straightFlush": "Five consecutive cards of the same suit.",
    "viz.rankings.fourOfAKind": "All four of one rank.",
    "viz.rankings.fullHouse": "Three of a kind plus a pair.",
    "viz.rankings.flush": "Five cards of the same suit (not in sequence).",
    "viz.rankings.straight": "Five consecutive cards of mixed suits.",
    "viz.rankings.threeOfAKind": "Three cards of the same rank. Also called \"trips\" or \"a set\".",
    "viz.rankings.twoPair": "Two pairs of different ranks.",
    "viz.rankings.onePair": "Two cards of the same rank.",
    "viz.rankings.highCard": "Nothing else — wins by the highest single card.",
  },

  sv: {
    // Header / nav
    "header.tagline": "MTT-tränare · Nash + ICM",
    "donate.button": "Donera om du vill",

    // Tab labels
    "tab.basics": "Grunderna",
    "tab.hands": "Händer",
    "tab.learn": "Lär dig",
    "tab.drills": "Övningar",
    "tab.trainer": "Tränare",
    "tab.review": "Sessionsöversikt",
    "tab.ranges": "Range-visare",
    "tab.icm": "ICM-inställning",

    // Learn / Basics shared chrome
    "learn.lessons": "Lektioner",
    "learn.basicsList": "Grunderna",
    "learn.plainEnglish": "Förklara enkelt",
    "learn.hidePlainEnglish": "Dölj enkel förklaring",
    "learn.minRead": "min läsning",
    "learn.next": "Nästa",
    "learn.previous": "Föregående",
    "learn.practiceThis": "Öva på detta i en övning",

    // Generic
    "common.close": "Stäng",

    // Visual labels (descriptive text inside diagrams; poker terms stay English)
    "viz.deal.caption": "Handen utvecklas i fyra steg, vart och ett följt av satsande.",
    "viz.deal.preflop": "Bara dina två hole cards. Satsningsrunda 1.",
    "viz.deal.flop": "Tre gemensamma kort. Satsningsrunda 2.",
    "viz.deal.turn": "Fjärde gemensamma kortet. Satsningsrunda 3.",
    "viz.deal.river": "Sista gemensamma kortet. Satsningsrunda 4.",
    "viz.deal.noCards": "(Inga gemensamma kort än)",
    "viz.legend.bettingRound": "Satsningsrunda",

    // Betting-flow diagram steps + legend
    "viz.flow.caption": "Rytmen i varje hand: kort delas, sedan en satsningsrunda, sedan fler kort. Upprepa till showdown — eller tills alla andra foldar.",
    "viz.flow.blindsPosted": "Blinds postas",
    "viz.flow.blindsPosted.d": "SB och BB lägger in marker innan några kort delas ut",
    "viz.flow.holeCards": "Hole cards delas",
    "viz.flow.holeCards.d": "Varje spelare får 2 kort med baksidan upp",
    "viz.flow.preflopBet": "Preflop-satsning",
    "viz.flow.preflopBet.d": "Folda, calla eller raisa",
    "viz.flow.flopDealt": "Floppen delas",
    "viz.flow.flopDealt.d": "3 gemensamma kort med framsidan upp",
    "viz.flow.flopBet": "Flopp-satsning",
    "viz.flow.flopBet.d": "Checka, satsa eller raisa",
    "viz.flow.turnDealt": "Turn delas",
    "viz.flow.turnDealt.d": "Fjärde gemensamma kortet",
    "viz.flow.turnBet": "Turn-satsning",
    "viz.flow.turnBet.d": "Checka, satsa eller raisa",
    "viz.flow.riverDealt": "River delas",
    "viz.flow.riverDealt.d": "Femte gemensamma kortet",
    "viz.flow.riverBet": "River-satsning",
    "viz.flow.riverBet.d": "Sista satsningsrundan",
    "viz.flow.showdown": "Showdown",
    "viz.flow.showdown.d": "Båda visar korten — bästa femkortshanden vinner potten",
    "viz.flow.legend.setup": "Förberedelse",
    "viz.flow.legend.cardsDealt": "Kort delas",
    "viz.flow.legend.handEnds": "Handen slutar",

    // Blinds & Button visual
    "viz.blinds.caption": "Knappen flyttas ett steg åt vänster varje hand. SB och BB tvingas satsa innan några kort delas ut.",
    "viz.blinds.btn": "BTN — Button (agerar sist)",
    "viz.blinds.bb": "BB — Big Blind (tvingad hel satsning)",
    "viz.blinds.sb": "SB — Small Blind (tvingad halv satsning)",
    // Button rotation visual
    "viz.rotation.caption": "Varje hand flyttas knappen ett steg medurs — och SB och BB flyttas med den. Efter tillräckligt många händer får varje spelare turas om vid varje position.",
    "viz.rotation.btn": "BTN (button)",
    "viz.rotation.sb": "SB (small blind)",
    "viz.rotation.bb": "BB (big blind)",
    // Dangerous boards visual
    "viz.danger.caption": "Lär dig de tre mönstren utantill. Nästan varje fälla postflop kommer från ett av dem.",
    "viz.danger.theBoard": "Bordet",
    "viz.danger.ifVillain": "Om motståndaren har",
    "viz.danger.flush.title": "Bord med flush draw",
    "viz.danger.flush.makes": "Flush — fem hjärter",
    "viz.danger.flush.threat": "Tre hjärter på bordet. Vem som helst med två hjärter har en flush.",
    "viz.danger.straight.title": "Bord med straight draw",
    "viz.danger.straight.makes": "Straight — 8-9-T-J-Q",
    "viz.danger.straight.threat": "Tre kort i följd. Vem som helst med två kort som passar in i raden har en straight.",
    "viz.danger.paired.title": "Parat bord",
    "viz.danger.paired.makes": "Triss — trip 7:or",
    "viz.danger.paired.threat": "Två sjuor på bordet. Vem som helst med den tredje 7:an har triss.",
    // MTT payout visual
    "viz.payout.caption": "En typisk MTT-utbetalningsstruktur. Förstaplatsen får ~25× det de som precis når pengarna får, trots att skillnaden i spelarskicklighet inte är 25× så stor.",
    "viz.payout.minCash": "70:e (precis i pengarna)",

    // Hold'em hero visual
    "viz.hero.caption": "Av dina 2 kort + de 5 på bordet plockar du den bästa femkortshanden. De andra 2 ignoreras helt enkelt.",
    "viz.hero.step1": "Steg 1 · De 7 korten du har tillgång till",
    "viz.hero.yourHand": "Din hand",
    "viz.hero.theBoard": "Bordet",
    "viz.hero.step2": "Steg 2 · Plocka de 5 bästa av de 7",
    "viz.hero.straight": "A-K-Q-J-T · Straight till Ace",
    "viz.hero.dropped": "(5:an och 2:an plockas bort — de hjälper inte den här handen)",

    // Hand rankings visual caption (the hand NAMES stay English as poker terms)
    "viz.rankings.caption": "Hela handrangordningen, starkast till svagast. Att lära sig den utantill är pokerns första läxa.",
    "viz.rankings.royalFlush": "Bästa möjliga hand. Extremt sällsynt.",
    "viz.rankings.straightFlush": "Fem kort i följd i samma färg.",
    "viz.rankings.fourOfAKind": "Alla fyra av samma valör.",
    "viz.rankings.fullHouse": "Triss plus ett par.",
    "viz.rankings.flush": "Fem kort i samma färg (inte i följd).",
    "viz.rankings.straight": "Fem kort i följd i blandade färger.",
    "viz.rankings.threeOfAKind": "Tre kort av samma valör. Kallas även \"trips\" eller \"a set\".",
    "viz.rankings.twoPair": "Två par av olika valörer.",
    "viz.rankings.onePair": "Två kort av samma valör.",
    "viz.rankings.highCard": "Inget annat — vinner på det högsta enskilda kortet.",
  },
};
