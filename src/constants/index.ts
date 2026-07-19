export const images = {
  splash: "/images/splash.png",
  logo: "/images/logo.png",
  user: "/images/user.png",
  card1: "/images/card-1.png",
  card2: "/images/card-2.png",
  card3: "/images/card-3.png",
  spinToWin: "/images/spin-to-win.png",
  card: "/images/card.png",
  hotCold: "/images/hotcold.png",
  coin: "/images/coin.png",
  dice: "/images/dice.png",
  box: "/images/box.png",
  betting: "/images/betting.png",
  fruit: "/images/fruit.png",
  lottery: "/images/lottery.png",
  wallet: "/images/wallet.png",
  walletShadow: "/images/wallet-shadow.png",
  avatar: "/images/avatar.png",
  faq: "/images/faq.png",
  mail: "/images/mail.png",
  tip: "/images/tip.png",
  phone: "/images/phone.png",
  coinTail: "/images/coin-tail.png",
  jackOfSpades: "/images/cards/jack_of_spades.png",
  coinPlaceholder: "/images/coin-placeholder.png",
  icon: "/images/icon.png",
};

export const sounds = {
  rollDice: "/sounds/roll-dice.mp3",
  winDice: "/sounds/dice-win.wav",
  winPlayer: "/sounds/win.mp3",
  losePlayer: "/sounds/lose.mp3",
  startPlayer: "/sounds/start.wav",
  flipPlayer: "/sounds/flip.wav",
  errorPlayer: "/sounds/error.wav",
};

export const data = {
  depositMethod: [
    { label: "Airtime", value: "airtime" },
    { label: "Cash", value: "cash" },
  ],
  withdrawMethod: [
    { label: "Data", value: "data" },
    { label: "Airtime", value: "airtime" },
    { label: "Cash", value: "cash" },
  ],
  gender: [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Others", value: "others" },
  ],
  transactionType: [
    { title: "Top Up", value: "topup" },
    { title: "Bonus", value: "bonus" },
    { title: "Profit", value: "profit" },
    { title: "Payout", value: "payout" },
  ],
  transactionRemark: [
    { title: "Pending", value: "pending" },
    { title: "Successful", value: "successful" },
    { title: "Failed", value: "failed" },
    { title: "Reversed", value: "reversed" },
    { title: "Rejected", value: "rejected" },
  ],
};

export const OTP_LENGTH = 6;

export const GAMES = [
  {
    id: "1",
    slug: "dice",
    title: "Dice",
    description: "Challenge luck with every roll.",
    image: images.dice,
  },
  {
    id: "2",
    slug: "lottery",
    title: "Lottery",
    description: "Pick your numbers and win big prizes.",
    image: images.lottery,
  },
  {
    id: "3",
    slug: "card",
    title: "Card",
    description: "Flip the cards and test your luck.",
    image: images.card,
  },
  {
    id: "4",
    slug: "coin",
    title: "Coin",
    description: "Heads or tails - make your call.",
    image: images.coinPlaceholder,
  },
  {
    id: "5",
    slug: "hot-cold",
    title: "Hot Cold",
    description: "Pick a side and feel the heat.",
    image: images.hotCold,
  },
  {
    id: "6",
    slug: "lucky-box",
    title: "Lucky Box",
    description: "Open the box and claim your prize.",
    image: images.box,
  },
  {
    id: "7",
    slug: "reel-streak",
    title: "Reel Streak",
    description: "Spin the reels and match to win.",
    image: images.fruit,
  },
  {
    id: "8",
    slug: "rps-bet",
    title: "RPS Bet",
    description: "Rock, paper, scissors - bet and beat.",
    image: images.betting,
  },
  {
    id: "9",
    slug: "spin",
    title: "Spin 2 Win",
    description: "Spin the wheel and win big rewards.",
    image: images.spinToWin,
  },
] as const;

export type GameSlug = (typeof GAMES)[number]["slug"];
