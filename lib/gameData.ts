export type Letter = 'A' | 'B' | 'C' | 'D'

export interface Answer {
  letter: Letter
  answer: string
  correct: boolean
}

export interface Question {
  question: string
  answers: Answer[]
  imageUrl: string
  prizeName: string
  /** Optional extra image shown on the question side (e.g. silhouette). Apply silhouette CSS if isSilhouette is true. */
  questionImageUrl?: string
  isSilhouette?: boolean
}

export interface Game {
  id: string
  name: string
  questions: Question[]
}

const ASC = (n: number) =>
  `https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/ASC/ASC_${String(n).padStart(3, '0')}_R_EN_LG.png`

export const games: Game[] = [
  // ── Game 0: Ascended Heroes – real TCGPlayer prices (fetched May 2026) ──
  {
    id: 'asc-test',
    name: 'Ascended Heroes',
    questions: [
      {
        // Q1 – Entei #25 — $0.18 (Common)
        question: 'Hvilken type er den legendære Pokémon Entei?',
        answers: [
          { letter: 'A', answer: 'Vann', correct: false },
          { letter: 'B', answer: 'Ild', correct: true },
          { letter: 'C', answer: 'Psykisk', correct: false },
          { letter: 'D', answer: 'Normal', correct: false },
        ],
        imageUrl: ASC(25),
        prizeName: 'Entei — $0.18',
      },
      {
        // Q2 – Pikachu #55 — $0.25 (Common)
        question: 'Hva heter Pikachu sin trener i Pokémon-anime-serien?',
        answers: [
          { letter: 'A', answer: 'Gary', correct: false },
          { letter: 'B', answer: 'Brock', correct: false },
          { letter: 'C', answer: 'Misty', correct: false },
          { letter: 'D', answer: 'Ash', correct: true },
        ],
        imageUrl: ASC(55),
        prizeName: 'Pikachu — $0.25',
      },
      {
        // Q3 – Rayquaza #153 — $0.34 (Rare) — SILHOUETTE
        question: 'Hvem er denne Pokémon?',
        answers: [
          { letter: 'A', answer: 'Flygon', correct: false },
          { letter: 'B', answer: 'Salamence', correct: false },
          { letter: 'C', answer: 'Dragonite', correct: false },
          { letter: 'D', answer: 'Rayquaza', correct: true },
        ],
        imageUrl: ASC(153),
        prizeName: 'Rayquaza — $0.34',
        questionImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/384.png',
        isSilhouette: true,
      },
      {
        // Q4 – Mega Gardevoir ex #89 — $0.85 (Double Rare)
        question: 'Hva er typekombinsjonen til Gardevoir (etter Generasjon 6)?',
        answers: [
          { letter: 'A', answer: 'Psykisk/Normal', correct: false },
          { letter: 'B', answer: 'Psykisk/Fe', correct: true },
          { letter: 'C', answer: 'Fe/Normal', correct: false },
          { letter: 'D', answer: 'Psykisk/Vann', correct: false },
        ],
        imageUrl: ASC(89),
        prizeName: 'Mega Gardevoir ex — $0.85',
      },
      {
        // Q5 – Team Rocket's Mewtwo ex #79 — $1.31 (Double Rare) ← SAFE HAVEN
        question: 'I den første Pokémon-filmen (1998) – hvem er den viktigste skurken?',
        answers: [
          { letter: 'A', answer: 'Giovanni', correct: false },
          { letter: 'B', answer: 'Jessie og James', correct: false },
          { letter: 'C', answer: 'Mewtwo', correct: true },
          { letter: 'D', answer: 'Team Aqua', correct: false },
        ],
        imageUrl: ASC(79),
        prizeName: 'Team Rockets Mewtwo ex — $1.31',
      },
      {
        // Q6 – Mega Dragonite ex #152 — $4.65 (Double Rare)
        question: 'Hva er typekombinsjonen til Dragonite?',
        answers: [
          { letter: 'A', answer: 'Drage/Psykisk', correct: false },
          { letter: 'B', answer: 'Normal/Flyging', correct: false },
          { letter: 'C', answer: 'Drage/Normal', correct: false },
          { letter: 'D', answer: 'Drage/Flyging', correct: true },
        ],
        imageUrl: ASC(152),
        prizeName: 'Mega Dragonite ex — $4.65',
      },
      {
        // Q7 – Fan Rotom #250 — $4.71 (Illustration Rare)
        question: 'Hvilken typekombinasjon har Rotom i sin opprinnelige form (uten apparat)?',
        answers: [
          { letter: 'A', answer: 'Elektrisk', correct: false },
          { letter: 'B', answer: 'Spøkelse', correct: false },
          { letter: 'C', answer: 'Elektrisk/Spøkelse', correct: true },
          { letter: 'D', answer: 'Normal/Elektrisk', correct: false },
        ],
        imageUrl: ASC(250),
        prizeName: 'Fan Rotom — $4.71',
      },
      {
        // Q8 – Mega Charizard Y ex #22 — $8.61 (Double Rare)
        question: 'Hva er den andre typen til Mega Charizard Y (ikke X)?',
        answers: [
          { letter: 'A', answer: 'Drage', correct: false },
          { letter: 'B', answer: 'Flyging', correct: true },
          { letter: 'C', answer: 'Normal', correct: false },
          { letter: 'D', answer: 'Psykisk', correct: false },
        ],
        imageUrl: ASC(22),
        prizeName: 'Mega Charizard Y ex — $8.61',
      },
      {
        // Q9 – Mega Scrafty ex #285 — $78.74 (Special Illustration Rare)
        question: 'Hvilken generasjon ble Scrafty introdusert i Pokémon-spillene?',
        answers: [
          { letter: 'A', answer: 'Generasjon IV', correct: false },
          { letter: 'B', answer: 'Generasjon V', correct: true },
          { letter: 'C', answer: 'Generasjon VI', correct: false },
          { letter: 'D', answer: 'Generasjon VII', correct: false },
        ],
        imageUrl: ASC(285),
        prizeName: 'Mega Scrafty ex (Special Art) — $78.74',
      },
      {
        // Q10 – Mega Charizard Y ex #294 — $657.87 (Hyper Rare) 🏆
        question: 'Hva er Charizard sitt originale japanske navn?',
        answers: [
          { letter: 'A', answer: 'Hitokage', correct: false },
          { letter: 'B', answer: 'Fushigidane', correct: false },
          { letter: 'C', answer: 'Zenigame', correct: false },
          { letter: 'D', answer: 'Lizardon', correct: true },
        ],
        imageUrl: ASC(294),
        prizeName: '✨ Mega Charizard Y ex (Hyper Rare) — $657.87 ✨',
      },
    ],
  },

  // ── Game 1: Pokémon Grunnleggende – foundations quiz, real TCGPlayer prices ──
  {
    id: 'foundations',
    name: 'Pokémon Grunnleggende',
    questions: [
      {
        // Q1 – Black Belt's Training #255 — $1.10 (Ultra Rare)
        question: 'Hva slags type er Charmander?',
        answers: [
          { letter: 'A', answer: 'Vann', correct: false },
          { letter: 'B', answer: 'Gress', correct: false },
          { letter: 'C', answer: 'Ild', correct: true },
          { letter: 'D', answer: 'Normal', correct: false },
        ],
        imageUrl: ASC(255),
        prizeName: 'Black Belt\'s Training — $1.10',
      },
      {
        // Q2 – Galarian Obstagoon #245 — $3.78 (Art Rare)
        question: 'Hva heter den tredje og siste formen til Squirtle?',
        answers: [
          { letter: 'A', answer: 'Wartortle', correct: false },
          { letter: 'B', answer: 'Blastoise', correct: true },
          { letter: 'C', answer: 'Lapras', correct: false },
          { letter: 'D', answer: 'Feraligatr', correct: false },
        ],
        imageUrl: ASC(245),
        prizeName: 'Galarian Obstagoon — $3.78',
      },
      {
        // Q3 – Mega Scrafty ex #270 — $6.09 (Ultra Rare) — SILHOUETTE
        question: 'Hvem er denne Pokémon?',
        answers: [
          { letter: 'A', answer: 'Haunter', correct: false },
          { letter: 'B', answer: 'Clefable', correct: false },
          { letter: 'C', answer: 'Gengar', correct: true },
          { letter: 'D', answer: 'Nidoking', correct: false },
        ],
        imageUrl: ASC(270),
        prizeName: 'Mega Scrafty ex — $6.09',
        questionImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',
        isSilhouette: true,
      },
      {
        // Q4 – Togekiss #235 — $7.00 (Art Rare)
        question: 'Hva er typekombinsjonen til Charizard?',
        answers: [
          { letter: 'A', answer: 'Ild/Drage', correct: false },
          { letter: 'B', answer: 'Ild/Normal', correct: false },
          { letter: 'C', answer: 'Ild/Flyging', correct: true },
          { letter: 'D', answer: 'Ild/Psykisk', correct: false },
        ],
        imageUrl: ASC(235),
        prizeName: 'Togekiss — $7.00',
      },
      {
        // Q5 – Weavile #228 — $7.27 (Art Rare) ← SAFE HAVEN
        question: 'Hvilken Pokémon er det IKKE mulig å utvikle fra Eevee?',
        answers: [
          { letter: 'A', answer: 'Flareon', correct: false },
          { letter: 'B', answer: 'Vaporeon', correct: false },
          { letter: 'C', answer: 'Espeon', correct: false },
          { letter: 'D', answer: 'Togekiss', correct: true },
        ],
        imageUrl: ASC(228),
        prizeName: 'Weavile — $7.27',
      },
      {
        // Q6 – Hitmontop #240 — $7.62 (Art Rare)
        question: 'Hvilken generasjon ble Fe-typen (Fairy) introdusert i Pokémon-spillene?',
        answers: [
          { letter: 'A', answer: 'Generasjon 4', correct: false },
          { letter: 'B', answer: 'Generasjon 5', correct: false },
          { letter: 'C', answer: 'Generasjon 6', correct: true },
          { letter: 'D', answer: 'Generasjon 7', correct: false },
        ],
        imageUrl: ASC(240),
        prizeName: 'Hitmontop — $7.62',
      },
      {
        // Q7 – Ethan's Magcargo #222 — $8.22 (Art Rare)
        question: 'Hva er de tre legendære fuglene i Kanto-regionen?',
        answers: [
          { letter: 'A', answer: 'Lugia, Ho-Oh og Entei', correct: false },
          { letter: 'B', answer: 'Zapdos, Moltres og Articuno', correct: true },
          { letter: 'C', answer: 'Raikou, Suicune og Entei', correct: false },
          { letter: 'D', answer: 'Mew, Mewtwo og Lugia', correct: false },
        ],
        imageUrl: ASC(222),
        prizeName: "Ethan's Magcargo — $8.22",
      },
      {
        // Q8 – Erika's Tangela #218 — $25.97 (Art Rare)
        question: 'Hvilken Pokémon kan kopiere alle motstanders bevegelser ved hjelp av «Transform»?',
        answers: [
          { letter: 'A', answer: 'Smeargle', correct: false },
          { letter: 'B', answer: 'Zoroark', correct: false },
          { letter: 'C', answer: 'Mew', correct: false },
          { letter: 'D', answer: 'Ditto', correct: true },
        ],
        imageUrl: ASC(218),
        prizeName: "Erika's Tangela — $25.97",
      },
      {
        // Q9 – Mega Froslass ex #275 — $93.73 (Special Illustration Rare)
        question: 'Hva er det offisielle Pokédex-nummeret til Mewtwo?',
        answers: [
          { letter: 'A', answer: '#149', correct: false },
          { letter: 'B', answer: '#151', correct: false },
          { letter: 'C', answer: '#152', correct: false },
          { letter: 'D', answer: '#150', correct: true },
        ],
        imageUrl: ASC(275),
        prizeName: 'Mega Froslass ex (Special Art) — $93.73',
      },
      {
        // Q10 – Lillie's Clefairy ex #280 — $205.65 (Special Illustration Rare) 🏆
        question: 'Hvilken ikke-legendær Pokémon fra Kanto (Gen 1) har den høyeste totale basstatistikken?',
        answers: [
          { letter: 'A', answer: 'Snorlax', correct: false },
          { letter: 'B', answer: 'Starmie', correct: false },
          { letter: 'C', answer: 'Dragonite', correct: true },
          { letter: 'D', answer: 'Rhydon', correct: false },
        ],
        imageUrl: ASC(280),
        prizeName: "✨ Lillie's Clefairy ex (Special Art) — $205.65 ✨",
      },
    ],
  },
]
