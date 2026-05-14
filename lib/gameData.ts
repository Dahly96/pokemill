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
  // ── Game 0: Ascended Heroes – real cards, easy → hard ──
  {
    id: 'asc-test',
    name: 'Ascended Heroes – Test Spill',
    questions: [
      {
        // Q1 – Entei #25 (~kr 2)
        question: 'Hvilken type er den legendære Pokémon Entei?',
        answers: [
          { letter: 'A', answer: 'Vann', correct: false },
          { letter: 'B', answer: 'Ild', correct: true },
          { letter: 'C', answer: 'Psykisk', correct: false },
          { letter: 'D', answer: 'Normal', correct: false },
        ],
        imageUrl: ASC(25),
        prizeName: 'Entei — ~kr 2,-',
      },
      {
        // Q2 – Pikachu #55 (~kr 2,50)
        question: 'Hva heter Pikachu sin trener i Pokémon-anime-serien?',
        answers: [
          { letter: 'A', answer: 'Gary', correct: false },
          { letter: 'B', answer: 'Brock', correct: false },
          { letter: 'C', answer: 'Misty', correct: false },
          { letter: 'D', answer: 'Ash', correct: true },
        ],
        imageUrl: ASC(55),
        prizeName: 'Pikachu — ~kr 2,50',
      },
      {
        // Q3 – Rayquaza #153 (~kr 3) — SILHOUETTE QUESTION
        question: 'Hvem er denne Pokémon?',
        answers: [
          { letter: 'A', answer: 'Flygon', correct: false },
          { letter: 'B', answer: 'Salamence', correct: false },
          { letter: 'C', answer: 'Dragonite', correct: false },
          { letter: 'D', answer: 'Rayquaza', correct: true },
        ],
        imageUrl: ASC(153),
        prizeName: 'Rayquaza — ~kr 3,-',
        // Official front sprite from PokeAPI (transparent background → filter makes it a silhouette)
        questionImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/384.png',
        isSilhouette: true,
      },
      {
        // Q4 – Mega Gardevoir ex #89 (~kr 8)
        question: 'Hva er typekombinsjonen til Gardevoir (etter Generasjon 6)?',
        answers: [
          { letter: 'A', answer: 'Psykisk/Normal', correct: false },
          { letter: 'B', answer: 'Psykisk/Fe', correct: true },
          { letter: 'C', answer: 'Fe/Normal', correct: false },
          { letter: 'D', answer: 'Psykisk/Vann', correct: false },
        ],
        imageUrl: ASC(89),
        prizeName: 'Mega Gardevoir ex — ~kr 8,-',
      },
      {
        // Q5 – Team Rocket's Mewtwo ex #79 (~kr 12) ← SAFE HAVEN
        question: 'I den første Pokémon-filmen (1998) – hvem er den viktigste skurken?',
        answers: [
          { letter: 'A', answer: 'Giovanni', correct: false },
          { letter: 'B', answer: 'Jessie og James', correct: false },
          { letter: 'C', answer: 'Mewtwo', correct: true },
          { letter: 'D', answer: 'Team Aqua', correct: false },
        ],
        imageUrl: ASC(79),
        prizeName: 'Team Rockets Mewtwo ex — ~kr 12,-',
      },
      {
        // Q6 – Fan Rotom #250 (~kr 42)
        question: 'Hvilken typekombinasjon har Rotom i sin opprinnelige form (uten apparat)?',
        answers: [
          { letter: 'A', answer: 'Elektrisk', correct: false },
          { letter: 'B', answer: 'Spøkelse', correct: false },
          { letter: 'C', answer: 'Elektrisk/Spøkelse', correct: true },
          { letter: 'D', answer: 'Normal/Elektrisk', correct: false },
        ],
        imageUrl: ASC(250),
        prizeName: 'Fan Rotom — ~kr 42,-',
      },
      {
        // Q7 – Mega Dragonite ex #152 (~kr 52)
        question: 'Hva er typekombinsjonen til Dragonite?',
        answers: [
          { letter: 'A', answer: 'Drage/Psykisk', correct: false },
          { letter: 'B', answer: 'Normal/Flyging', correct: false },
          { letter: 'C', answer: 'Drage/Normal', correct: false },
          { letter: 'D', answer: 'Drage/Flyging', correct: true },
        ],
        imageUrl: ASC(152),
        prizeName: 'Mega Dragonite ex — ~kr 52,-',
      },
      {
        // Q8 – Mega Charizard Y ex #22 (~kr 92)
        question: 'Hva er den andre typen til Mega Charizard Y (ikke X)?',
        answers: [
          { letter: 'A', answer: 'Drage', correct: false },
          { letter: 'B', answer: 'Flyging', correct: true },
          { letter: 'C', answer: 'Normal', correct: false },
          { letter: 'D', answer: 'Psykisk', correct: false },
        ],
        imageUrl: ASC(22),
        prizeName: 'Mega Charizard Y ex — ~kr 92,-',
      },
      {
        // Q9 – Mega Scrafty ex Special Art #285 (~kr 790)
        question: 'Hvilken generasjon ble Scrafty introdusert i Pokémon-spillene?',
        answers: [
          { letter: 'A', answer: 'Generasjon IV', correct: false },
          { letter: 'B', answer: 'Generasjon V', correct: true },
          { letter: 'C', answer: 'Generasjon VI', correct: false },
          { letter: 'D', answer: 'Generasjon VII', correct: false },
        ],
        imageUrl: ASC(285),
        prizeName: 'Mega Scrafty ex (Spesiell Illustrasjon) — ~kr 790,-',
      },
      {
        // Q10 – Mega Charizard Y ex Secret Rare #294 (~kr 6500) 🏆
        question: 'Hva er Charizard sitt originale japanske navn?',
        answers: [
          { letter: 'A', answer: 'Hitokage', correct: false },
          { letter: 'B', answer: 'Fushigidane', correct: false },
          { letter: 'C', answer: 'Zenigame', correct: false },
          { letter: 'D', answer: 'Lizardon', correct: true },
        ],
        imageUrl: ASC(294),
        prizeName: '✨ Mega Charizard Y ex (Hemmelig Sjelden) — ~kr 6.500,- ✨',
      },
    ],
  },

  // ── Game 1: General Pokémon – Norwegian questions ──
  {
    id: 'game-1',
    name: 'Spill 2 – Pokémon Grunnkurs',
    questions: [
      {
        question: 'Hva er Pikachu sin type?',
        answers: [
          { letter: 'A', answer: 'Ild', correct: false },
          { letter: 'B', answer: 'Elektrisk', correct: true },
          { letter: 'C', answer: 'Vann', correct: false },
          { letter: 'D', answer: 'Normal', correct: false },
        ],
        imageUrl: '/cards/game2/card1.jpg',
        prizeName: 'Vanlig Kort #1',
      },
      {
        question: 'Hva heter den siste pre-evolusjon til Charizard?',
        answers: [
          { letter: 'A', answer: 'Charmander', correct: false },
          { letter: 'B', answer: 'Chimchar', correct: false },
          { letter: 'C', answer: 'Charmeleon', correct: true },
          { letter: 'D', answer: 'Cyndaquil', correct: false },
        ],
        imageUrl: '/cards/game2/card2.jpg',
        prizeName: 'Vanlig Kort #2',
      },
      {
        question: 'Hvilken pokémon er nummer 1 i den originale Pokédex?',
        answers: [
          { letter: 'A', answer: 'Charmander', correct: false },
          { letter: 'B', answer: 'Squirtle', correct: false },
          { letter: 'C', answer: 'Pikachu', correct: false },
          { letter: 'D', answer: 'Bulbasaur', correct: true },
        ],
        imageUrl: '/cards/game2/card3.jpg',
        prizeName: 'Uvanlig Kort #3',
      },
      {
        question: 'Hva heter Magikarp sin evolusjon?',
        answers: [
          { letter: 'A', answer: 'Dragonair', correct: false },
          { letter: 'B', answer: 'Gyarados', correct: true },
          { letter: 'C', answer: 'Lapras', correct: false },
          { letter: 'D', answer: 'Vaporeon', correct: false },
        ],
        imageUrl: '/cards/game2/card4.jpg',
        prizeName: 'Uvanlig Kort #4',
      },
      {
        question: 'Hvilken type er super-effektiv mot Ild-typen?',
        answers: [
          { letter: 'A', answer: 'Gress', correct: false },
          { letter: 'B', answer: 'Elektrisk', correct: false },
          { letter: 'C', answer: 'Vann', correct: true },
          { letter: 'D', answer: 'Normal', correct: false },
        ],
        imageUrl: '/cards/game2/card5.jpg',
        prizeName: 'Sjelden Kort #5',
      },
      {
        question: 'Hva heter den sovende pokémon som blokkerer veier i spillene?',
        answers: [
          { letter: 'A', answer: 'Slowpoke', correct: false },
          { letter: 'B', answer: 'Jigglypuff', correct: false },
          { letter: 'C', answer: 'Clefairy', correct: false },
          { letter: 'D', answer: 'Snorlax', correct: true },
        ],
        imageUrl: '/cards/game2/card6.jpg',
        prizeName: 'Sjelden Kort #6',
      },
      {
        question: 'Hvilken pokémon kan evolvere til åtte forskjellige former?',
        answers: [
          { letter: 'A', answer: 'Ditto', correct: false },
          { letter: 'B', answer: 'Eevee', correct: true },
          { letter: 'C', answer: 'Castform', correct: false },
          { letter: 'D', answer: 'Rotom', correct: false },
        ],
        imageUrl: '/cards/game2/card7.jpg',
        prizeName: 'Super Sjelden #7',
      },
      {
        question: 'Hva er Mewtwo sin type?',
        answers: [
          { letter: 'A', answer: 'Psykisk', correct: true },
          { letter: 'B', answer: 'Normal', correct: false },
          { letter: 'C', answer: 'Mørk', correct: false },
          { letter: 'D', answer: 'Stål', correct: false },
        ],
        imageUrl: '/cards/game2/card8.jpg',
        prizeName: 'Ultra Sjelden #8',
      },
      {
        question: 'Hvilken by er Ash Ketchum fra?',
        answers: [
          { letter: 'A', answer: 'Cerulean City', correct: false },
          { letter: 'B', answer: 'Viridian City', correct: false },
          { letter: 'C', answer: 'Lavender Town', correct: false },
          { letter: 'D', answer: 'Pallet Town', correct: true },
        ],
        imageUrl: '/cards/game2/card9.jpg',
        prizeName: 'Holo Sjelden #9',
      },
      {
        question: 'Hvor mange originale Pokémon finnes det (Generasjon 1)?',
        answers: [
          { letter: 'A', answer: '149', correct: false },
          { letter: 'B', answer: '151', correct: true },
          { letter: 'C', answer: '152', correct: false },
          { letter: 'D', answer: '250', correct: false },
        ],
        imageUrl: '/cards/game2/card10.jpg',
        prizeName: '✨ JACKPOT KORT ✨',
      },
    ],
  },

  // ── Game 2: Expert ──
  {
    id: 'game-2',
    name: 'Spill 3 – Pokémon Expert',
    questions: [
      {
        question: 'Hva er den primære typen til Gengar?',
        answers: [
          { letter: 'A', answer: 'Mørk', correct: false },
          { letter: 'B', answer: 'Psykisk', correct: false },
          { letter: 'C', answer: 'Gift', correct: false },
          { letter: 'D', answer: 'Spøkelse', correct: true },
        ],
        imageUrl: '/cards/game3/card1.jpg',
        prizeName: 'Vanlig Kort #1',
      },
      {
        question: 'Hvilken pokémon er laget av 108 onde ånder?',
        answers: [
          { letter: 'A', answer: 'Haunter', correct: false },
          { letter: 'B', answer: 'Spiritomb', correct: true },
          { letter: 'C', answer: 'Mismagius', correct: false },
          { letter: 'D', answer: 'Gastly', correct: false },
        ],
        imageUrl: '/cards/game3/card2.jpg',
        prizeName: 'Vanlig Kort #2',
      },
      {
        question: 'Hva heter Is-evolusjonen til Eevee?',
        answers: [
          { letter: 'A', answer: 'Flareon', correct: false },
          { letter: 'B', answer: 'Espeon', correct: false },
          { letter: 'C', answer: 'Glaceon', correct: true },
          { letter: 'D', answer: 'Leafeon', correct: false },
        ],
        imageUrl: '/cards/game3/card3.jpg',
        prizeName: 'Uvanlig Kort #3',
      },
      {
        question: 'Hva heter Scyther sin evolusjon?',
        answers: [
          { letter: 'A', answer: 'Scizor', correct: true },
          { letter: 'B', answer: 'Heracross', correct: false },
          { letter: 'C', answer: 'Pinsir', correct: false },
          { letter: 'D', answer: 'Kleavor', correct: false },
        ],
        imageUrl: '/cards/game3/card4.jpg',
        prizeName: 'Uvanlig Kort #4',
      },
      {
        question: 'Hvilken pokémon representerer "The Original One" i Pokémon-mytologien?',
        answers: [
          { letter: 'A', answer: 'Dialga', correct: false },
          { letter: 'B', answer: 'Giratina', correct: false },
          { letter: 'C', answer: 'Arceus', correct: true },
          { letter: 'D', answer: 'Palkia', correct: false },
        ],
        imageUrl: '/cards/game3/card5.jpg',
        prizeName: 'Sjelden Kort #5',
      },
      {
        question: 'Hva er spesielt med Shedinja sin HP?',
        answers: [
          { letter: 'A', answer: 'Den har alltid maks HP', correct: false },
          { letter: 'B', answer: 'HP øker aldri', correct: false },
          { letter: 'C', answer: 'Den har alltid 1 HP', correct: true },
          { letter: 'D', answer: 'HP er låst på 50', correct: false },
        ],
        imageUrl: '/cards/game3/card6.jpg',
        prizeName: 'Sjelden Kort #6',
      },
      {
        question: 'Hva heter bevegelsen der Ditto kopierer motstanderen?',
        answers: [
          { letter: 'A', answer: 'Kopiering', correct: false },
          { letter: 'B', answer: 'Mimikk', correct: false },
          { letter: 'C', answer: 'Transformer', correct: true },
          { letter: 'D', answer: 'Imposter', correct: false },
        ],
        imageUrl: '/cards/game3/card7.jpg',
        prizeName: 'Super Sjelden #7',
      },
      {
        question: 'Hvilken by huser det berømte Pokémon-tårnet i Kanto?',
        answers: [
          { letter: 'A', answer: 'Saffron City', correct: false },
          { letter: 'B', answer: 'Lavender Town', correct: true },
          { letter: 'C', answer: 'Fuchsia City', correct: false },
          { letter: 'D', answer: 'Celadon City', correct: false },
        ],
        imageUrl: '/cards/game3/card8.jpg',
        prizeName: 'Ultra Sjelden #8',
      },
      {
        question: 'Hvilken stein trenger du for å evolvere Pikachu til Raichu?',
        answers: [
          { letter: 'A', answer: 'Ildstein', correct: false },
          { letter: 'B', answer: 'Vannstein', correct: false },
          { letter: 'C', answer: 'Tordenstein', correct: true },
          { letter: 'D', answer: 'Lysstein', correct: false },
        ],
        imageUrl: '/cards/game3/card9.jpg',
        prizeName: 'Holo Sjelden #9',
      },
      {
        question: 'Hva er Mewtwo sin totale base stats-sum?',
        answers: [
          { letter: 'A', answer: '580', correct: false },
          { letter: 'B', answer: '600', correct: false },
          { letter: 'C', answer: '680', correct: true },
          { letter: 'D', answer: '720', correct: false },
        ],
        imageUrl: '/cards/game3/card10.jpg',
        prizeName: '✨ JACKPOT KORT ✨',
      },
    ],
  },
]
