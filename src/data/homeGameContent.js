// All translatable text for the Home Game walkthrough, extracted from the
// component so it can be localized. Poker terms (small blind, big blind, BB,
// flop, etc.) intentionally stay in English per the project's i18n rule.
//
// The Swedish version lives in homeGameContent.sv.js and is selected via
// getHomeGameContent(lang), with English fallback for any missing key.

export const HOME_GAME_CONTENT_EN = {
  // Header
  kicker: "Home game setup",
  title: "Run a Single-Table Tournament",
  subtitle: "Six steps, start to finish",
  startOver: "Start over",
  next: "Next",
  back: "Back",
  stepOf: (n, total) => `Step ${n} of ${total}`,

  // Step 1 — buy-in
  s1: {
    tag: "The prize pool",
    heading: "Everyone buys in equally",
    p1: "A tournament works like this: everyone pays the same buy-in to join, and that cash forms a single prize pool. In return, each player gets the same pile of chips to play with.",
    p2: "The key thing to understand up front — and the part beginners always trip on — is that the chips are just a scoreboard. They are not money. A player with lots of chips isn't \u201cwinning money\u201d yet; they just have a bigger score. The real cash only changes hands at the very end, when the prize pool is paid out.",
    statBuyinLabel: "Buy-in each",
    statBuyinSub: "4\u20136 players",
    statPoolLabel: "Prize pool",
    statPoolSub: "paid out at the end",
    panelLead: "Why equal buy-ins?",
    panel: " A tournament ends with one winner taking the pot, so it only feels fair if everyone risked the same to get in. (A game where chips equal real cash and people come and go is a \u201ccash game\u201d \u2014 a different format we're not using here.)",
  },

  // Step 2 — which chip set
  s2: {
    tag: "Your chip set",
    heading: "Which set do you have?",
    p1: "Start with the box you own \u2014 it's the first practical thing that shapes the night, because it decides how big a table you can seat.",
    diffLead: "The difference:",
    diff: " the two boxes hold the same kinds of chips \u2014 the 500 set just has more of each colour. If you're 4\u20136 friends, a 300 set is all you need; a 500 set is the upgrade for a bigger table or lots of rebuys.",
  },

  // Step 3 — chips & stack
  s3: {
    tag: "Chips & stack",
    heading: "Set up the chips",
    p1Lead: "Chips are identified by the number printed on them",
    p1: ", not their colour (every set's colours differ \u2014 go by the value). Pick the four values that match your set, then how long a night you want.",
    valuesLabel: "Your chip values",
    lengthLabel: "How long a night?",
    deepNote: "A deep (150 BB) game needs a higher top chip \u2014 switch to the 25 / 100 / 500 / 1000 set for that.",
    stackLabel: "Stack",
    stackSub: "chips each",
    runsLabel: "Runs",
    runsSub: "5\u20136 players",
    eachLabel: "Each player gets",
    mathLead: "The math:",
    mathTail: "the smallest chip equals the small blind, so you can always make change. Every player starts with the identical set. Times are estimates; rebuys and a bigger table run longer.",
    perPlayer: "per player \u2014",
  },

  // Step 4 — blinds & timer
  s4: {
    tag: "Blinds & levels",
    heading: "Set the blinds \u2014 and a timer",
    p1: "Before each hand, two players are forced to put chips in to get the betting started \u2014 otherwise everyone could just fold forever. The player to the dealer's left posts the small blind; the next player posts the big blind (twice the small). These move one seat left every hand, so the burden shares evenly.",
    p1LinkPrefix: " Want the full story? The ",
    lessonLinkText: "Blinds & Button lesson",
    p1LinkSuffix: " covers it.",
    p2a: "Start them at ",
    p2b: " \u2014 that's what makes your ",
    p2c: "-chip stack ",
    p2d: ". Then raise them every ",
    p2bold: "20 minutes",
    p2e: " on a timer (any phone timer works).",
    colLevel: "Level",
    colBlinds: "Small / Big",
    colAfter: "After",
    panelWhyLead: "Why raise them?",
    panelWhy: " Growing blinds slowly cost everyone for sitting still, forcing action \u2014 that's what eventually ends the night instead of folding forever. ",
    panelLongerLead: "Want a longer game?",
    panelLonger: " Raise less often \u2014 every 30 minutes, or stay two timer rounds per level. ",
    panelShorterLead: "Shorter?",
    panelShorter: " Every 10\u201315. The timer, not the chip count, controls how long you play.",
    levelStart: "start",
    level20: "20 min",
    level40: "40 min",
    level1hr: "1 hr",
    level1hr20: "1 hr 20",
    level1hr40: "1 hr 40",
  },

  // Step 5 — rebuys & payout
  s5: {
    tag: "Rules to set first",
    heading: "Decide rebuys & the payout",
    rebuyTitle: "Rebuys for the first hour",
    rebuyBody: "Bust early? Buy back in for another $20, fresh stack. After one hour the game locks \u2014 win or go home. Keeps everyone in the action while still ending cleanly.",
    splitTitle: "Split the prize",
    splitBody: "Simplest is winner-takes-all. For a softer landing, pay the top two.",
    stat1Label: "1st place",
    stat1Sub: "of the pot",
    stat2Label: "2nd place",
    stat2Sub: "of the pot",
    panel: "Lots of rebuys? Add a third spot \u2014 e.g. 65 / 25 / 10. The golden rule: ",
    panelBold: "decide this before you start",
    panelTail: ", never at midnight.",
  },

  // Step 6 — deal & play
  s6: {
    tag: "You're ready",
    heading: "Deal \u2014 and play your spots",
    p1: "That's the whole setup. A few table notes: one person shuffles and deals each hand (or take turns), and a marker called the dealer button sits in front of whoever is \u201cthe dealer\u201d for that hand \u2014 it moves one seat left each hand so everyone takes turns posting the blinds.",
    p1LinkPrefix: " New to how that rotation works? The ",
    lessonLinkText: "Blinds & Button lesson",
    p1LinkSuffix: " walks through it.",
    p2: "Lay a tablecloth or blanket down for easy chip-sliding, deal the first hand at Level 1, and you're playing. From here it comes down to the only thing that actually wins chips: good decisions.",
    cardCaption: "Dealt a big hand short-stacked? That's a push/fold spot.",
    bridge: "When you've got a game on the calendar, the Trainer is the best place to get sharp before everyone shows up.",
    bridgeButton: "Practice in the Trainer",
  },

  // Set presets (player ranges + difference copy)
  sets: {
    300: { players: "4\u20136 players", diff: "The everyday starter box \u2014 about 100 of the smallest chip and ~50 of each other colour. Perfect for a small group." },
    500: { players: "6\u201310 players", diff: "Roughly half-again as many chips of every colour. Seats a bigger table and leaves spares for rebuys." },
  },

  // Depth descriptors + durations
  depths: {
    50:  { descriptor: "Short & fast", duration: "1\u00bd\u20132\u00bd hours" },
    100: { descriptor: "Standard", duration: "2\u00bd\u20133\u00bd hours" },
    150: { descriptor: "Deep & long", duration: "3\u00bd\u20135 hours" },
  },

  // Denomination preset blurbs
  denoms: {
    standard: "The most common box. Works for any length of game.",
    low: "A lower-value set (has a 50 chip). Best for shorter games \u2014 its top chip is only 500.",
    high: "A higher-value set with no small chips, so blinds start at 50 / 100.",
  },
};
