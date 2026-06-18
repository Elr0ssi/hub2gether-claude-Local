export type PoliticalOrientation = "far_left" | "left" | "center" | "right" | "far_right";

export interface PoliticalPeriod {
  from: number;
  to: number;
  regime: string;
  orientation: PoliticalOrientation;
  party?: string;
  leader: string;
  leader_title: string;
  mandate: string;
  notable_events?: string[];
}

export interface PoliticsCountry {
  name: string;
  periods: PoliticalPeriod[];
}

export const POLITICS_COUNTRIES: PoliticsCountry[] = [
  {
    name: "France",
    periods: [
      { from: 1900, to: 1939, regime: "République parlementaire", orientation: "center", party: "Radical/SFIO", leader: "Présidents successifs", leader_title: "Président", mandate: "1900–1939", notable_events: ["Affaire Dreyfus résolue (1906)", "Première Guerre mondiale (1914–1918)", "Front populaire (1936)"] },
      { from: 1940, to: 1944, regime: "État français (Vichy)", orientation: "far_right", party: "Aucun parti", leader: "Philippe Pétain", leader_title: "Chef de l'État", mandate: "1940–1944", notable_events: ["Armistice avec l'Allemagne (1940)", "Lois de Vichy", "Collaboration avec l'occupant nazi", "Débarquement allié (1944)"] },
      { from: 1944, to: 1958, regime: "IVe République", orientation: "center", party: "MRP/SFIO/PCF", leader: "De Gaulle / Auriol / Coty", leader_title: "Président", mandate: "1944–1958", notable_events: ["Libération (1944)", "Création de la Sécurité sociale (1945)", "Guerre d'Indochine", "Crise algérienne (1958)"] },
      { from: 1958, to: 1969, regime: "Ve République", orientation: "right", party: "RPF / UNR", leader: "Charles de Gaulle", leader_title: "Président", mandate: "1959–1969", notable_events: ["Indépendance de l'Algérie (1962)", "Établissement de la Ve République", "Mai 68", "Référendum perdu (1969)"] },
      { from: 1969, to: 1974, regime: "Ve République", orientation: "right", party: "UDR", leader: "Georges Pompidou", leader_title: "Président", mandate: "1969–1974", notable_events: ["Modernisation industrielle", "Élargissement de la CEE"] },
      { from: 1974, to: 1981, regime: "Ve République", orientation: "center", party: "UDF / RI", leader: "Valéry Giscard d'Estaing", leader_title: "Président", mandate: "1974–1981", notable_events: ["Droit de vote à 18 ans (1974)", "Loi Veil sur l'IVG (1975)", "Choc pétrolier"] },
      { from: 1981, to: 1995, regime: "Ve République", orientation: "left", party: "PS", leader: "François Mitterrand", leader_title: "Président", mandate: "1981–1995", notable_events: ["Nationalisations (1981)", "Abolition de la peine de mort", "Cohabitation Chirac (1986–1988)", "Réunification allemande"] },
      { from: 1995, to: 2007, regime: "Ve République", orientation: "right", party: "RPR / UMP", leader: "Jacques Chirac", leader_title: "Président", mandate: "1995–2007", notable_events: ["Essais nucléaires dans le Pacifique", "Refus de la guerre en Irak (2003)", "Référendum constitutionnel européen (2005)"] },
      { from: 2007, to: 2012, regime: "Ve République", orientation: "right", party: "UMP", leader: "Nicolas Sarkozy", leader_title: "Président", mandate: "2007–2012", notable_events: ["Crise financière mondiale (2008)", "Présidence du G20", "Intervention en Libye (2011)"] },
      { from: 2012, to: 2017, regime: "Ve République", orientation: "left", party: "PS", leader: "François Hollande", leader_title: "Président", mandate: "2012–2017", notable_events: ["Mariage pour tous (2013)", "Attentats de Paris (2015)", "COP21 à Paris (2015)"] },
      { from: 2017, to: 9999, regime: "Ve République", orientation: "center", party: "LREM / Renaissance", leader: "Emmanuel Macron", leader_title: "Président", mandate: "2017–présent", notable_events: ["Mouvement des Gilets jaunes (2018–2019)", "COVID-19 (2020)", "Guerre en Ukraine (2022)", "Réforme des retraites (2023)"] },
    ],
  },
  {
    name: "Germany",
    periods: [
      { from: 1900, to: 1918, regime: "Empire wilhelmien", orientation: "right", party: "Parti du Centre / Nationaux-libéraux", leader: "Guillaume II", leader_title: "Kaiser", mandate: "1888–1918", notable_events: ["Première Guerre mondiale (1914–1918)", "Armistice (1918)"] },
      { from: 1919, to: 1932, regime: "République de Weimar", orientation: "center", party: "SPD / DDP", leader: "Ebert / Hindenburg", leader_title: "Président", mandate: "1919–1932", notable_events: ["Traité de Versailles (1919)", "Inflation (1923)", "Crise de 1929"] },
      { from: 1933, to: 1945, regime: "IIIe Reich", orientation: "far_right", party: "NSDAP", leader: "Adolf Hitler", leader_title: "Führer", mandate: "1933–1945", notable_events: ["Prise du pouvoir (1933)", "Nuit de Cristal (1938)", "Seconde Guerre mondiale (1939–1945)", "Holocauste"] },
      { from: 1949, to: 1963, regime: "République fédérale (RFA)", orientation: "right", party: "CDU/CSU", leader: "Konrad Adenauer", leader_title: "Chancelier", mandate: "1949–1963", notable_events: ["Plan Marshall", "Adhésion à l'OTAN (1955)", "Miracle économique allemand"] },
      { from: 1963, to: 1969, regime: "République fédérale (RFA)", orientation: "center", party: "CDU/SPD", leader: "Erhard / Kiesinger", leader_title: "Chancelier", mandate: "1963–1969", notable_events: ["Grande coalition CDU-SPD (1966)"] },
      { from: 1969, to: 1982, regime: "République fédérale (RFA)", orientation: "left", party: "SPD", leader: "Willy Brandt / Helmut Schmidt", leader_title: "Chancelier", mandate: "1969–1982", notable_events: ["Ostpolitik de Brandt", "Prix Nobel de la paix à Brandt (1971)", "Crise pétrolière (1973)"] },
      { from: 1982, to: 1998, regime: "République fédérale", orientation: "right", party: "CDU/CSU", leader: "Helmut Kohl", leader_title: "Chancelier", mandate: "1982–1998", notable_events: ["Réunification allemande (1990)", "Traité de Maastricht (1992)", "Adhésion à l'Euro"] },
      { from: 1998, to: 2005, regime: "République fédérale", orientation: "left", party: "SPD", leader: "Gerhard Schröder", leader_title: "Chancelier", mandate: "1998–2005", notable_events: ["Réforme Hartz (chômage)", "Refus de la guerre en Irak (2003)"] },
      { from: 2005, to: 2021, regime: "République fédérale", orientation: "center", party: "CDU/CSU", leader: "Angela Merkel", leader_title: "Chancelière", mandate: "2005–2021", notable_events: ["Crise financière (2008)", "Crise des réfugiés (2015)", "Gestion du COVID-19"] },
      { from: 2021, to: 9999, regime: "République fédérale", orientation: "center", party: "SPD", leader: "Olaf Scholz", leader_title: "Chancelier", mandate: "2021–présent", notable_events: ["Guerre en Ukraine (2022)", "Zeitenwende — réarmement", "Crise énergétique (2022)"] },
    ],
  },
  {
    name: "United Kingdom",
    periods: [
      { from: 1900, to: 1916, regime: "Monarchie constitutionnelle", orientation: "center", party: "Libéraux / Conservateurs", leader: "Asquith / Lloyd George", leader_title: "Premier ministre", mandate: "1900–1916", notable_events: ["Entente Cordiale (1904)", "Première Guerre mondiale (1914)"] },
      { from: 1916, to: 1940, regime: "Monarchie constitutionnelle", orientation: "right", party: "Conservateurs / Coalition", leader: "Lloyd George / Baldwin / Chamberlain", leader_title: "Premier ministre", mandate: "1916–1940", notable_events: ["Traité de Versailles (1919)", "Crise de 1929", "Politique d'apaisement envers Hitler"] },
      { from: 1940, to: 1945, regime: "Monarchie constitutionnelle", orientation: "right", party: "Conservateurs (coalition)", leader: "Winston Churchill", leader_title: "Premier ministre", mandate: "1940–1945", notable_events: ["Bataille d'Angleterre (1940)", "Victoire de la Seconde Guerre mondiale"] },
      { from: 1945, to: 1951, regime: "Monarchie constitutionnelle", orientation: "left", party: "Labour", leader: "Clement Attlee", leader_title: "Premier ministre", mandate: "1945–1951", notable_events: ["Création du NHS (1948)", "Nationalisation des industries", "Indépendance de l'Inde (1947)"] },
      { from: 1951, to: 1964, regime: "Monarchie constitutionnelle", orientation: "right", party: "Conservateurs", leader: "Churchill / Eden / Macmillan / Douglas-Home", leader_title: "Premier ministre", mandate: "1951–1964", notable_events: ["Crise de Suez (1956)", "Décolonisation"] },
      { from: 1964, to: 1979, regime: "Monarchie constitutionnelle", orientation: "left", party: "Labour / Conservateurs", leader: "Wilson / Heath / Callaghan", leader_title: "Premier ministre", mandate: "1964–1979", notable_events: ["Adhésion à la CEE (1973)", "Crise des syndicats"] },
      { from: 1979, to: 1997, regime: "Monarchie constitutionnelle", orientation: "right", party: "Conservateurs", leader: "Margaret Thatcher / John Major", leader_title: "Premier ministre", mandate: "1979–1997", notable_events: ["Guerre des Malouines (1982)", "Privatisations massives", "Réforme syndicale", "Traité de Maastricht (1992)"] },
      { from: 1997, to: 2010, regime: "Monarchie constitutionnelle", orientation: "center", party: "Labour (New Labour)", leader: "Tony Blair / Gordon Brown", leader_title: "Premier ministre", mandate: "1997–2010", notable_events: ["Accord du Vendredi saint (1998)", "Guerre en Irak (2003)", "Crise financière (2008)"] },
      { from: 2010, to: 2019, regime: "Monarchie constitutionnelle", orientation: "right", party: "Conservateurs", leader: "David Cameron / Theresa May", leader_title: "Premier ministre", mandate: "2010–2019", notable_events: ["Référendum sur le Brexit (2016)", "Austérité budgétaire"] },
      { from: 2019, to: 2022, regime: "Monarchie constitutionnelle", orientation: "right", party: "Conservateurs", leader: "Boris Johnson", leader_title: "Premier ministre", mandate: "2019–2022", notable_events: ["Brexit effectif (2020)", "Gestion du COVID-19"] },
      { from: 2022, to: 2024, regime: "Monarchie constitutionnelle", orientation: "right", party: "Conservateurs", leader: "Liz Truss / Rishi Sunak", leader_title: "Premier ministre", mandate: "2022–2024", notable_events: ["Crise économique (Truss)", "Couronnement de Charles III (2023)"] },
      { from: 2024, to: 9999, regime: "Monarchie constitutionnelle", orientation: "center", party: "Labour", leader: "Keir Starmer", leader_title: "Premier ministre", mandate: "2024–présent", notable_events: ["Victoire électorale historique Labour (2024)"] },
    ],
  },
  {
    name: "United States of America",
    periods: [
      { from: 1900, to: 1912, regime: "République fédérale", orientation: "right", party: "Républicain", leader: "McKinley / T. Roosevelt / Taft", leader_title: "Président", mandate: "1900–1912", notable_events: ["Guerres Philippines", "Canal de Panama (1904)", "Politique du « Big Stick »"] },
      { from: 1913, to: 1920, regime: "République fédérale", orientation: "center", party: "Démocrate", leader: "Woodrow Wilson", leader_title: "Président", mandate: "1913–1921", notable_events: ["Première Guerre mondiale (1917)", "Traité de Versailles", "14 points de Wilson", "Création de la Fed"] },
      { from: 1921, to: 1932, regime: "République fédérale", orientation: "right", party: "Républicain", leader: "Harding / Coolidge / Hoover", leader_title: "Président", mandate: "1921–1932", notable_events: ["Prospérité des années 20", "Krach boursier (1929)", "Grande Dépression"] },
      { from: 1933, to: 1952, regime: "République fédérale", orientation: "left", party: "Démocrate", leader: "Franklin D. Roosevelt / Harry Truman", leader_title: "Président", mandate: "1933–1952", notable_events: ["New Deal (1933)", "Seconde Guerre mondiale", "Bombe atomique (1945)", "Plan Marshall", "Guerre de Corée (1950)"] },
      { from: 1953, to: 1960, regime: "République fédérale", orientation: "right", party: "Républicain", leader: "Dwight Eisenhower", leader_title: "Président", mandate: "1953–1960", notable_events: ["Armistice de Corée (1953)", "Début de la Guerre froide", "Alunissage Spoutnik (1957)"] },
      { from: 1961, to: 1968, regime: "République fédérale", orientation: "center", party: "Démocrate", leader: "John F. Kennedy / Lyndon B. Johnson", leader_title: "Président", mandate: "1961–1968", notable_events: ["Crise de Cuba (1962)", "Assassinat de JFK (1963)", "Civil Rights Act (1964)", "Escalade au Vietnam"] },
      { from: 1969, to: 1976, regime: "République fédérale", orientation: "right", party: "Républicain", leader: "Richard Nixon / Gerald Ford", leader_title: "Président", mandate: "1969–1976", notable_events: ["Lune (1969)", "Détente avec l'URSS", "Watergate (1974)", "Fin de la guerre du Vietnam (1975)"] },
      { from: 1977, to: 1980, regime: "République fédérale", orientation: "center", party: "Démocrate", leader: "Jimmy Carter", leader_title: "Président", mandate: "1977–1981", notable_events: ["Accords de Camp David (1978)", "Crise des otages iraniens (1979)", "Choc pétrolier"] },
      { from: 1981, to: 1992, regime: "République fédérale", orientation: "right", party: "Républicain", leader: "Ronald Reagan / George H.W. Bush", leader_title: "Président", mandate: "1981–1992", notable_events: ["Reaganomics", "Fin de la Guerre froide (1989)", "Chute du mur de Berlin", "Guerre du Golfe (1991)"] },
      { from: 1993, to: 2000, regime: "République fédérale", orientation: "center", party: "Démocrate", leader: "Bill Clinton", leader_title: "Président", mandate: "1993–2001", notable_events: ["ALENA (1994)", "Boom internet", "Scandale Monica Lewinsky", "Intervention au Kosovo (1999)"] },
      { from: 2001, to: 2008, regime: "République fédérale", orientation: "right", party: "Républicain", leader: "George W. Bush", leader_title: "Président", mandate: "2001–2009", notable_events: ["Attentats du 11 septembre (2001)", "Guerre en Afghanistan (2001)", "Guerre en Irak (2003)", "Crise financière (2008)"] },
      { from: 2009, to: 2016, regime: "République fédérale", orientation: "center", party: "Démocrate", leader: "Barack Obama", leader_title: "Président", mandate: "2009–2017", notable_events: ["Prix Nobel de la paix (2009)", "Obamacare (2010)", "Mort de Ben Laden (2011)", "Accord de Paris (2015)"] },
      { from: 2017, to: 2020, regime: "République fédérale", orientation: "far_right", party: "Républicain (MAGA)", leader: "Donald Trump", leader_title: "Président", mandate: "2017–2021", notable_events: ["Retrait de l'accord de Paris", "Impeachment (2019)", "COVID-19 (2020)", "Assaut du Capitole (2021)"] },
      { from: 2021, to: 2024, regime: "République fédérale", orientation: "center", party: "Démocrate", leader: "Joe Biden", leader_title: "Président", mandate: "2021–2025", notable_events: ["Retrait d'Afghanistan (2021)", "Guerre en Ukraine (2022)", "IRA — investissement vert (2022)", "Soutien à Israël (2023)"] },
      { from: 2025, to: 9999, regime: "République fédérale", orientation: "far_right", party: "Républicain (MAGA)", leader: "Donald Trump", leader_title: "Président", mandate: "2025–présent", notable_events: ["Retour au pouvoir", "Politiques protectionnistes", "Retrait de l'OTAN partiel"] },
    ],
  },
  {
    name: "Russia",
    periods: [
      { from: 1900, to: 1916, regime: "Empire russe", orientation: "right", party: "Autocratie tsariste", leader: "Nicolas II", leader_title: "Tsar", mandate: "1894–1917", notable_events: ["Révolution de 1905", "Première Guerre mondiale (1914)", "Raspoutine"] },
      { from: 1917, to: 1923, regime: "Régime soviétique naissant", orientation: "far_left", party: "Bolcheviks (POSDR)", leader: "Lénine", leader_title: "Président du Sovnarkom", mandate: "1917–1924", notable_events: ["Révolution d'Octobre (1917)", "Guerre civile (1918–1921)", "NEP (1921)", "Fondation de l'URSS (1922)"] },
      { from: 1924, to: 1952, regime: "URSS — Régime stalinien", orientation: "far_left", party: "PCUS", leader: "Joseph Staline", leader_title: "Secrétaire général du PCUS", mandate: "1924–1953", notable_events: ["Collectivisation (1929)", "Grande Terreur (1936–1938)", "Pacte germano-soviétique (1939)", "Seconde Guerre mondiale", "Blocus de Berlin (1948)"] },
      { from: 1953, to: 1964, regime: "URSS", orientation: "far_left", party: "PCUS", leader: "Nikita Khrouchtchev", leader_title: "Premier secrétaire du PCUS", mandate: "1953–1964", notable_events: ["Déstalinisation (1956)", "Spoutnik (1957)", "Crise de Cuba (1962)", "Construction du mur de Berlin"] },
      { from: 1964, to: 1984, regime: "URSS", orientation: "far_left", party: "PCUS", leader: "Léonid Brejnev", leader_title: "Secrétaire général du PCUS", mandate: "1964–1982", notable_events: ["Doctrine Brejnev", "Invasion de la Tchécoslovaquie (1968)", "Invasion de l'Afghanistan (1979)"] },
      { from: 1985, to: 1991, regime: "URSS (réforme)", orientation: "left", party: "PCUS réformateur", leader: "Mikhaïl Gorbatchev", leader_title: "Secrétaire général / Président", mandate: "1985–1991", notable_events: ["Glasnost et Perestroïka", "Chute du mur de Berlin (1989)", "Dissolution de l'URSS (1991)"] },
      { from: 1991, to: 1999, regime: "Fédération de Russie", orientation: "center", party: "Notre Maison Russie / Indépendant", leader: "Boris Eltsine", leader_title: "Président", mandate: "1991–1999", notable_events: ["Choc libéral (thérapie de choc)", "Guerre de Tchétchénie (1994)", "Crise constitutionnelle (1993)"] },
      { from: 2000, to: 9999, regime: "Régime autoritaire", orientation: "right", party: "Russie Unie", leader: "Vladimir Poutine", leader_title: "Président / Premier ministre", mandate: "2000–présent", notable_events: ["Guerre de Tchétchénie II", "Invasion de la Géorgie (2008)", "Annexion de la Crimée (2014)", "Invasion de l'Ukraine (2022)"] },
    ],
  },
  {
    name: "China",
    periods: [
      { from: 1900, to: 1911, regime: "Empire Qing", orientation: "right", party: "Autocratie impériale", leader: "Cixi / Puyi", leader_title: "Impératrice / Empereur", mandate: "1900–1912", notable_events: ["Révolte des Boxers (1900)", "Réformes manquées"] },
      { from: 1912, to: 1926, regime: "République de Chine", orientation: "center", party: "Kuomintang (KMT)", leader: "Sun Yat-sen / Yuan Shikai", leader_title: "Président", mandate: "1912–1927", notable_events: ["Proclamation de la République (1912)", "Fondation du PCC (1921)"] },
      { from: 1927, to: 1949, regime: "République de Chine (KMT)", orientation: "right", party: "Kuomintang (KMT)", leader: "Chiang Kai-shek", leader_title: "Généralissime", mandate: "1928–1949", notable_events: ["Purge anti-communiste (1927)", "Guerre sino-japonaise (1937)", "Guerre civile avec le PCC"] },
      { from: 1949, to: 1976, regime: "République populaire (Mao)", orientation: "far_left", party: "PCC", leader: "Mao Zedong", leader_title: "Président du PCC", mandate: "1949–1976", notable_events: ["Proclamation de la RPC (1949)", "Grand Bond en avant (1958–1962)", "Révolution culturelle (1966–1976)", "Guerre de Corée (1950)"] },
      { from: 1976, to: 1989, regime: "République populaire (réforme)", orientation: "far_left", party: "PCC", leader: "Deng Xiaoping", leader_title: "Paramount Leader", mandate: "1978–1989", notable_events: ["Réformes économiques (1978)", "Ouverture aux investissements étrangers", "Massacre de Tiananmen (1989)"] },
      { from: 1989, to: 2012, regime: "République populaire", orientation: "far_left", party: "PCC", leader: "Jiang Zemin / Hu Jintao", leader_title: "Président de la RPC", mandate: "1989–2012", notable_events: ["Retrocession de Hong Kong (1997)", "Entrée dans l'OMC (2001)", "JO de Pékin (2008)"] },
      { from: 2012, to: 9999, regime: "République populaire (Xi)", orientation: "far_left", party: "PCC", leader: "Xi Jinping", leader_title: "Président de la RPC", mandate: "2012–présent", notable_events: ["Initiative « Belt and Road »", "Répression à Hong Kong (2020)", "COVID-19 (2019)", "Tensions avec Taïwan"] },
    ],
  },
  {
    name: "Italy",
    periods: [
      { from: 1900, to: 1921, regime: "Monarchie constitutionnelle", orientation: "center", party: "Libéraux", leader: "Giolitti et successeurs", leader_title: "Président du Conseil", mandate: "1900–1922", notable_events: ["Guerre de Libye (1911)", "Première Guerre mondiale"] },
      { from: 1922, to: 1943, regime: "Fascisme", orientation: "far_right", party: "PNF (Fasciste)", leader: "Benito Mussolini", leader_title: "Duce / Chef du gouvernement", mandate: "1922–1943", notable_events: ["Marche sur Rome (1922)", "Conquête de l'Éthiopie (1935)", "Pacte d'Acier avec Hitler (1939)", "Défaite en Afrique du Nord (1943)"] },
      { from: 1943, to: 1993, regime: "République (DC dominante)", orientation: "center", party: "Démocratie Chrétienne (DC)", leader: "De Gasperi et successeurs", leader_title: "Président du Conseil", mandate: "1946–1994", notable_events: ["Traité de Rome (1957)", "« Années de plomb » (1970s)", "Enlèvement Moro (1978)", "Tangentopoli (1992)"] },
      { from: 1994, to: 2011, regime: "République (Deuxième République)", orientation: "right", party: "Forza Italia / CDL", leader: "Silvio Berlusconi / alternance gauche", leader_title: "Président du Conseil", mandate: "1994–2011", notable_events: ["Entrée dans l'Euro (2002)", "Guerre en Irak (2003)", "Crise financière (2008)"] },
      { from: 2011, to: 2022, regime: "République", orientation: "center", party: "Coalitions variées", leader: "Monti / Renzi / Gentiloni / Draghi", leader_title: "Président du Conseil", mandate: "2011–2022", notable_events: ["Crise de la dette souveraine", "Gouvernement Conte (populiste 2018–2021)", "COVID-19 (2020)"] },
      { from: 2022, to: 9999, regime: "République", orientation: "far_right", party: "Fratelli d'Italia (FdI)", leader: "Giorgia Meloni", leader_title: "Présidente du Conseil", mandate: "2022–présent", notable_events: ["Première femme cheffe de gouvernement en Italie", "Restrictions migratoires", "Soutien à l'Ukraine"] },
    ],
  },
  {
    name: "Spain",
    periods: [
      { from: 1900, to: 1930, regime: "Monarchie / Dictature Primo de Rivera", orientation: "right", party: "Partis dynastiques / PUD", leader: "Alphonse XIII / Primo de Rivera", leader_title: "Roi / Président du Conseil", mandate: "1900–1931", notable_events: ["Désastre de 1898", "Dictature Primo de Rivera (1923–1930)"] },
      { from: 1931, to: 1939, regime: "République / Guerre civile", orientation: "center", party: "PSOE / CEDA / Front populaire", leader: "Alcalá-Zamora / Azaña", leader_title: "Président de la République", mandate: "1931–1939", notable_events: ["Proclamation de la République (1931)", "Guerre civile (1936–1939)"] },
      { from: 1939, to: 1975, regime: "Franquisme", orientation: "far_right", party: "Movimiento Nacional", leader: "Francisco Franco", leader_title: "Caudillo", mandate: "1939–1975", notable_events: ["Victoire dans la Guerre civile", "Non-intervention dans la Seconde Guerre mondiale", "Développement économique tardif (1960s)"] },
      { from: 1975, to: 1982, regime: "Monarchie constitutionnelle (Transition)", orientation: "center", party: "UCD", leader: "Adolfo Suárez", leader_title: "Président du gouvernement", mandate: "1977–1981", notable_events: ["Transition vers la démocratie", "Constitution de 1978", "Tentative de coup d'État (1981)"] },
      { from: 1982, to: 1996, regime: "Monarchie constitutionnelle", orientation: "left", party: "PSOE", leader: "Felipe González", leader_title: "Président du gouvernement", mandate: "1982–1996", notable_events: ["Adhésion à la CEE (1986)", "Adhésion à l'OTAN", "Jeux olympiques de Barcelone (1992)"] },
      { from: 1996, to: 2004, regime: "Monarchie constitutionnelle", orientation: "right", party: "PP", leader: "José María Aznar", leader_title: "Président du gouvernement", mandate: "1996–2004", notable_events: ["Entrée dans l'Euro (2002)", "Guerre en Irak (2003)", "Attentat de Madrid (2004)"] },
      { from: 2004, to: 2011, regime: "Monarchie constitutionnelle", orientation: "left", party: "PSOE", leader: "José Luis Rodríguez Zapatero", leader_title: "Président du gouvernement", mandate: "2004–2011", notable_events: ["Mariage homosexuel (2005)", "Crise financière (2008–2010)"] },
      { from: 2011, to: 2018, regime: "Monarchie constitutionnelle", orientation: "right", party: "PP", leader: "Mariano Rajoy", leader_title: "Président du gouvernement", mandate: "2011–2018", notable_events: ["Austérité budgétaire", "Crise catalane (2017)"] },
      { from: 2018, to: 9999, regime: "Monarchie constitutionnelle", orientation: "center", party: "PSOE", leader: "Pedro Sánchez", leader_title: "Président du gouvernement", mandate: "2018–présent", notable_events: ["Coalition avec Podemos (2020)", "COVID-19 (2020)", "Crise catalane"] },
    ],
  },
  {
    name: "Japan",
    periods: [
      { from: 1900, to: 1931, regime: "Empire du Japon (libéral)", orientation: "right", party: "Rikken Seiyukai / Minseitō", leader: "Empereurs Meiji / Taisho", leader_title: "Empereur", mandate: "1900–1932", notable_events: ["Victoire sur la Russie (1905)", "Ere Taisho (démocratie)", "Tremblement de terre de Tokyo (1923)"] },
      { from: 1931, to: 1945, regime: "Empire militariste", orientation: "far_right", party: "Armée impériale", leader: "Hirohito / Tōjō", leader_title: "Empereur / Premier ministre", mandate: "1926–1945", notable_events: ["Invasion de la Mandchourie (1931)", "Massacre de Nankin (1937)", "Attaque de Pearl Harbor (1941)", "Bombes atomiques (1945)"] },
      { from: 1945, to: 1955, regime: "Démocratie (occupation alliée)", orientation: "center", party: "Partis variés", leader: "MacArthur / Shigeru Yoshida", leader_title: "Commandant suprême / Premier ministre", mandate: "1945–1955", notable_events: ["Constitution pacifiste (1947)", "Traité de San Francisco (1951)"] },
      { from: 1955, to: 2009, regime: "Démocratie libérale (PLD dominant)", orientation: "right", party: "PLD (Parti libéral-démocrate)", leader: "Successifs PLD", leader_title: "Premier ministre", mandate: "1955–2009", notable_events: ["Miracle économique japonais", "Bulle économique (1980s)", "Stagnation (1990s–2000s)"] },
      { from: 2009, to: 2012, regime: "Démocratie libérale", orientation: "center", party: "DPJ (Parti démocrate)", leader: "Yukio Hatoyama / Naoto Kan", leader_title: "Premier ministre", mandate: "2009–2012", notable_events: ["Tremblement de terre de Tōhoku (2011)", "Fukushima (2011)"] },
      { from: 2012, to: 2020, regime: "Démocratie libérale", orientation: "right", party: "PLD", leader: "Shinzo Abe", leader_title: "Premier ministre", mandate: "2012–2020", notable_events: ["Abenomics", "JO de Tokyo (report 2021)", "Réarmement constitutionnel"] },
      { from: 2020, to: 9999, regime: "Démocratie libérale", orientation: "right", party: "PLD", leader: "Suga / Kishida / Ishiba", leader_title: "Premier ministre", mandate: "2020–présent", notable_events: ["JO de Tokyo (2021)", "Assassinat d'Abe (2022)", "Renforcement défense (2023)"] },
    ],
  },
  {
    name: "Brazil",
    periods: [
      { from: 1900, to: 1929, regime: "Première République (oligarchique)", orientation: "right", party: "PRP / PRM", leader: "Présidents successifs", leader_title: "Président", mandate: "1900–1930", notable_events: ["Politique café-au-lait", "Centenaire (1922)"] },
      { from: 1930, to: 1945, regime: "Estado Novo (Vargas)", orientation: "center", party: "Indépendant / PTB", leader: "Getúlio Vargas", leader_title: "Président / Dictateur", mandate: "1930–1945", notable_events: ["Coup de 1930", "Estado Novo (1937)", "Entrée dans la Seconde Guerre mondiale (1942)"] },
      { from: 1945, to: 1964, regime: "Démocratie", orientation: "center", party: "Alternance PSD/PTB/UDN", leader: "Dutra / Vargas / JK / Goulart", leader_title: "Président", mandate: "1945–1964", notable_events: ["Construction de Brasilia (1960)", "Crise des missiles de Cuba (1962)"] },
      { from: 1964, to: 1985, regime: "Dictature militaire", orientation: "right", party: "ARENA / PDS", leader: "Castelo Branco / Costa e Silva / Médici / Geisel / Figueiredo", leader_title: "Président militaire", mandate: "1964–1985", notable_events: ["Coup militaire (1964)", "Miracle économique brésilien (1968–1973)", "Torture et répression", "Ouverture graduelle (abertura)"] },
      { from: 1985, to: 2002, regime: "Démocratie (Nouvelle République)", orientation: "center", party: "PMDB / PSDB", leader: "Sarney / Collor / Franco / Cardoso", leader_title: "Président", mandate: "1985–2003", notable_events: ["Constitution de 1988", "Hyperinflation (1989–1994)", "Plan Real (1994)", "Élection de Lula I"] },
      { from: 2003, to: 2016, regime: "Démocratie", orientation: "left", party: "PT (Parti des travailleurs)", leader: "Lula / Dilma Rousseff", leader_title: "Président / Présidente", mandate: "2003–2016", notable_events: ["Bolsa Família", "Réduction de la pauvreté", "Scandale Petrobras (2014)", "Destitution de Dilma (2016)"] },
      { from: 2016, to: 2018, regime: "Démocratie", orientation: "center", party: "PMDB", leader: "Michel Temer", leader_title: "Président", mandate: "2016–2018", notable_events: ["Réformes du travail", "Crise économique"] },
      { from: 2019, to: 2022, regime: "Démocratie (polarisation)", orientation: "far_right", party: "PSL / PL", leader: "Jair Bolsonaro", leader_title: "Président", mandate: "2019–2022", notable_events: ["Déforestation amazonienne", "Gestion controversée du COVID-19", "Défaite électorale (2022)"] },
      { from: 2023, to: 9999, regime: "Démocratie", orientation: "left", party: "PT", leader: "Luiz Inácio Lula da Silva", leader_title: "Président", mandate: "2023–présent", notable_events: ["3e mandat de Lula", "Protection de l'Amazonie", "Alliance du Sud global"] },
    ],
  },
  {
    name: "India",
    periods: [
      { from: 1900, to: 1946, regime: "Colonie britannique (Raj)", orientation: "right", party: "Empire britannique / INC", leader: "Vice-rois britanniques / Gandhi", leader_title: "Vice-roi", mandate: "1900–1947", notable_events: ["Partition du Bengale (1905)", "Massacre d'Amritsar (1919)", "Non-coopération de Gandhi (1920)", "Seconde Guerre mondiale"] },
      { from: 1947, to: 1963, regime: "République fédérale (démocratique)", orientation: "center", party: "INC (Parti du Congrès)", leader: "Jawaharlal Nehru", leader_title: "Premier ministre", mandate: "1947–1964", notable_events: ["Indépendance (1947)", "Partition avec le Pakistan", "Non-alignement", "Guerre de 1962 avec la Chine"] },
      { from: 1964, to: 1977, regime: "République fédérale", orientation: "center", party: "INC", leader: "Shastri / Indira Gandhi", leader_title: "Premier ministre", mandate: "1964–1977", notable_events: ["Guerre indo-pakistanaise (1965)", "Création du Bangladesh (1971)", "État d'urgence (1975–1977)"] },
      { from: 1977, to: 1979, regime: "République fédérale", orientation: "center", party: "Janata Party", leader: "Morarji Desai", leader_title: "Premier ministre", mandate: "1977–1979", notable_events: ["Fin de l'état d'urgence"] },
      { from: 1979, to: 1989, regime: "République fédérale", orientation: "center", party: "INC", leader: "Indira Gandhi / Rajiv Gandhi", leader_title: "Premier ministre", mandate: "1979–1989", notable_events: ["Opération Étoile bleue (1984)", "Assassinat d'Indira Gandhi", "Désastre de Bhopal (1984)"] },
      { from: 1989, to: 2014, regime: "République fédérale (coalitions)", orientation: "center", party: "INC / BJP / coalitions", leader: "Singh / Rao / Vajpayee / Manmohan Singh", leader_title: "Premier ministre", mandate: "1989–2014", notable_events: ["Libéralisation économique (1991)", "Essais nucléaires (1998)", "Montée du BJP"] },
      { from: 2014, to: 9999, regime: "République fédérale", orientation: "right", party: "BJP (nationaliste hindou)", leader: "Narendra Modi", leader_title: "Premier ministre", mandate: "2014–présent", notable_events: ["Montée du nationalisme hindou", "Abrogation art. 370 Kashmir (2019)", "Covid-19 (2020)", "GOAT économique mondial"] },
    ],
  },
  {
    name: "Turkey",
    periods: [
      { from: 1900, to: 1918, regime: "Empire ottoman", orientation: "right", party: "Comité Union et Progrès", leader: "Mehmed V / Enver Pacha", leader_title: "Sultan / Ministre de la guerre", mandate: "1900–1918", notable_events: ["Guerres balkaniques (1912–1913)", "Première Guerre mondiale", "Génocide arménien (1915)"] },
      { from: 1919, to: 1938, regime: "République kémaliste", orientation: "center", party: "CHP (Parti républicain du peuple)", leader: "Mustafa Kemal Atatürk", leader_title: "Président", mandate: "1923–1938", notable_events: ["Proclamation de la République (1923)", "Abolition du califat (1924)", "Réformes laïques", "Latinisation de l'alphabet (1928)"] },
      { from: 1938, to: 1950, regime: "République (parti unique)", orientation: "center", party: "CHP", leader: "İsmet İnönü", leader_title: "Président", mandate: "1938–1950", notable_events: ["Neutralité pendant la Seconde Guerre mondiale", "Transition vers le multipartisme"] },
      { from: 1950, to: 1960, regime: "Démocratie", orientation: "center", party: "DP (Parti démocrate)", leader: "Adnan Menderes", leader_title: "Premier ministre", mandate: "1950–1960", notable_events: ["Adhésion à l'OTAN (1952)", "Coup militaire (1960)", "Pendaison de Menderes"] },
      { from: 1960, to: 2002, regime: "Démocratie (interventions militaires)", orientation: "center", party: "Alternance CHP/AP/ANAP", leader: "Successifs", leader_title: "Premier ministre", mandate: "1960–2002", notable_events: ["Coups militaires (1971, 1980)", "Invasion de Chypre (1974)", "Crise économique (2001)"] },
      { from: 2002, to: 9999, regime: "Présidentialisme", orientation: "right", party: "AKP (islamo-conservateur)", leader: "Recep Tayyip Erdoğan", leader_title: "Premier ministre / Président", mandate: "2002–présent", notable_events: ["Réformes pro-EU (2000s)", "Coup manqué (2016)", "Référendum constitutionnel (2017)", "Crise avec la Grèce"] },
    ],
  },
  {
    name: "Argentina",
    periods: [
      { from: 1900, to: 1929, regime: "République oligarchique", orientation: "right", party: "PAN / UCR", leader: "Roca / Yrigoyen", leader_title: "Président", mandate: "1900–1930", notable_events: ["Loi Sáenz Peña (suffrage universel masculin 1912)"] },
      { from: 1930, to: 1945, regime: "Oligarchie militaire", orientation: "right", party: "Militaires / conservateurs", leader: "Uriburu / Justo / Castillo", leader_title: "Président", mandate: "1930–1943", notable_events: ["Coup militaire (1930)", "« Décennie infâme »"] },
      { from: 1946, to: 1955, regime: "Péronisme", orientation: "center", party: "Partido Peronista / PJ", leader: "Juan Perón", leader_title: "Président", mandate: "1946–1955", notable_events: ["Nationalisation des entreprises", "Évita Perón", "Renversement par coup militaire (1955)"] },
      { from: 1955, to: 1973, regime: "Coups militaires / alternance", orientation: "right", party: "Militaires / UCR", leader: "Lonardi / Frondizi / Illia / Onganía", leader_title: "Président", mandate: "1955–1973", notable_events: ["Interdit du péronisme", "Coups successifs"] },
      { from: 1973, to: 1976, regime: "Démocratie (péronisme)", orientation: "center", party: "PJ (FREJULI)", leader: "Cámpora / Perón / Isabelita", leader_title: "Président", mandate: "1973–1976", notable_events: ["Retour de Perón (1973)", "Massacre d'Ezeiza", "Mort de Perón (1974)"] },
      { from: 1976, to: 1983, regime: "Dictature militaire", orientation: "far_right", party: "Junta militaire (PEN)", leader: "Videla / Viola / Galtieri / Bignone", leader_title: "Président militaire", mandate: "1976–1983", notable_events: ["Guerre sale — 30 000 disparus", "Mondial de foot (1978)", "Guerre des Malouines (1982)"] },
      { from: 1983, to: 2003, regime: "Démocratie", orientation: "center", party: "UCR / PJ", leader: "Alfonsín / Menem / De la Rúa / Kirchner", leader_title: "Président", mandate: "1983–2003", notable_events: ["Procès des juntes (1985)", "Convertibilité peso-dollar (1991)", "Crise de 2001 — 5 présidents en 2 semaines"] },
      { from: 2003, to: 2015, regime: "Démocratie (kirchnérisme)", orientation: "left", party: "FPV (péronisme de gauche)", leader: "Néstor Kirchner / Cristina Fernández", leader_title: "Président / Présidente", mandate: "2003–2015", notable_events: ["Relance économique", "Droits de l'homme", "Conflit avec les fonds vautours"] },
      { from: 2015, to: 2019, regime: "Démocratie", orientation: "right", party: "PRO (Cambiemos)", leader: "Mauricio Macri", leader_title: "Président", mandate: "2015–2019", notable_events: ["Réformes libérales", "Récession (2018–2019)"] },
      { from: 2019, to: 2023, regime: "Démocratie", orientation: "center", party: "PJ (péronisme)", leader: "Alberto Fernández", leader_title: "Président", mandate: "2019–2023", notable_events: ["COVID-19 (2020)", "Inflation record", "Accord avec le FMI"] },
      { from: 2023, to: 9999, regime: "Démocratie (libertarianisme)", orientation: "far_right", party: "La Libertad Avanza", leader: "Javier Milei", leader_title: "Président", mandate: "2023–présent", notable_events: ["Victoire surprise (2023)", "Dollarisation", "Ajustement extrême", "Chainsaw politique"] },
    ],
  },
  {
    name: "Mexico",
    periods: [
      { from: 1900, to: 1910, regime: "Dictature (Porfiriato)", orientation: "right", party: "Parti de la Réélection", leader: "Porfirio Díaz", leader_title: "Président", mandate: "1876–1911", notable_events: ["Modernisation économique", "Répression des opposants"] },
      { from: 1910, to: 1920, regime: "Révolution mexicaine", orientation: "center", party: "Révolutionnaires (Madero/Zapata/Villa/Carranza)", leader: "Madero / Carranza / Obregón", leader_title: "Président", mandate: "1910–1920", notable_events: ["Révolution mexicaine (1910)", "Zapata et Villa", "Constitution de 1917"] },
      { from: 1920, to: 2000, regime: "Présidentialisme (PRI)", orientation: "center", party: "PRI (Parti révolutionnaire institutionnel)", leader: "Successifs PRI", leader_title: "Président", mandate: "1929–2000", notable_events: ["71 ans de pouvoir PRI", "Massacre de Tlatelolco (1968)", "Tremblement de terre de Mexico (1985)", "ALENA (1994)", "Zapatistes (1994)", "Crise peso (1994)"] },
      { from: 2000, to: 2018, regime: "Démocratie alternante", orientation: "center", party: "PAN / PRI", leader: "Fox / Calderón / Peña Nieto", leader_title: "Président", mandate: "2000–2018", notable_events: ["Fin du PRI (2000)", "Guerre contre les narcotrafiquants", "Scandale Peña Nieto"] },
      { from: 2018, to: 2024, regime: "Démocratie (4e transformation)", orientation: "left", party: "Morena", leader: "Andrés Manuel López Obrador (AMLO)", leader_title: "Président", mandate: "2018–2024", notable_events: ["Lutte contre la corruption", "COVID-19 (2020)", "Relations compliquées avec les États-Unis"] },
      { from: 2024, to: 9999, regime: "Démocratie", orientation: "left", party: "Morena", leader: "Claudia Sheinbaum", leader_title: "Présidente", mandate: "2024–présent", notable_events: ["Première femme présidente du Mexique", "Continuité de la 4e transformation"] },
    ],
  },
  {
    name: "Poland",
    periods: [
      { from: 1918, to: 1926, regime: "République parlementaire", orientation: "center", party: "PPS / PSL", leader: "Piłsudski / Narutowicz / Wojciechowski", leader_title: "Chef de l'État / Président", mandate: "1918–1926", notable_events: ["Indépendance (1918)", "Guerre polono-soviétique (1920)"] },
      { from: 1926, to: 1939, regime: "Régime autoritaire (Sanacja)", orientation: "right", party: "Bloc de Coopération sans partis (BBWR)", leader: "Józef Piłsudski / Rydz-Śmigły", leader_title: "Maréchal / Inspecteur général", mandate: "1926–1939", notable_events: ["Coup de mai (1926)", "Constitution autoritaire (1935)", "Invasion nazie (1939)"] },
      { from: 1944, to: 1989, regime: "République populaire (communisme)", orientation: "far_left", party: "PZPR (communiste)", leader: "Bierut / Gomułka / Gierek / Jaruzelski", leader_title: "Secrétaire général / Président", mandate: "1944–1989", notable_events: ["Soviétisation (1944–1947)", "Dégel de 1956", "Loi martiale (1981)", "Solidarność (1980)"] },
      { from: 1989, to: 2005, regime: "Démocratie (3e République)", orientation: "center", party: "Solidarność / AWS / SLD", leader: "Wałęsa / Kwaśniewski", leader_title: "Président", mandate: "1989–2005", notable_events: ["Table ronde (1989)", "Adhésion à l'OTAN (1999)", "Adhésion à l'UE (2004)"] },
      { from: 2005, to: 2007, regime: "Démocratie", orientation: "right", party: "PiS (Droit et Justice)", leader: "Jarosław Kaczyński / Lech Kaczyński", leader_title: "Premier ministre / Président", mandate: "2005–2007", notable_events: ["Victoire du PiS", "Tensions avec l'UE"] },
      { from: 2007, to: 2015, regime: "Démocratie", orientation: "center", party: "PO (Plateforme civique)", leader: "Donald Tusk / Bronisław Komorowski", leader_title: "Premier ministre / Président", mandate: "2007–2015", notable_events: ["Crash de Smolensk (2010)", "Croissance économique"] },
      { from: 2015, to: 2023, regime: "Démocratie (conservatisme national)", orientation: "far_right", party: "PiS (Droit et Justice)", leader: "Beata Szydło / Mateusz Morawiecki", leader_title: "Premier ministre", mandate: "2015–2023", notable_events: ["Réforme judiciaire controversée", "Tensions avec l'UE", "Crise des réfugiés", "Guerre en Ukraine (2022)"] },
      { from: 2023, to: 9999, regime: "Démocratie", orientation: "center", party: "KO (Coalition civique)", leader: "Donald Tusk", leader_title: "Premier ministre", mandate: "2023–présent", notable_events: ["Retour de Tusk", "Réconciliation avec l'UE", "Soutien renforcé à l'Ukraine"] },
    ],
  },
  {
    name: "Hungary",
    periods: [
      { from: 1900, to: 1918, regime: "Monarchie austro-hongroise", orientation: "right", party: "Parti libéral / Parti du travail", leader: "François-Joseph / Charles I", leader_title: "Roi-Empereur", mandate: "1900–1918", notable_events: ["Première Guerre mondiale", "Dissolution de l'Empire (1918)"] },
      { from: 1919, to: 1944, regime: "Régime Horthy", orientation: "far_right", party: "Parti de l'unité nationale", leader: "Miklós Horthy", leader_title: "Régent", mandate: "1920–1944", notable_events: ["République soviétique de Béla Kun (1919 — 133 jours)", "Traité de Trianon (1920)", "Alliance avec l'Axe (1940)", "Occupation nazie (1944)"] },
      { from: 1945, to: 1956, regime: "République populaire (stalinisme)", orientation: "far_left", party: "MDP (communiste)", leader: "Mátyás Rákosi", leader_title: "Secrétaire général", mandate: "1945–1956", notable_events: ["Soviétisation (1947–1949)", "Salami Tactics", "Révolution de 1956 (réprimée)"] },
      { from: 1956, to: 1989, regime: "République populaire (goulache communisme)", orientation: "far_left", party: "MSZMP (communiste réformé)", leader: "János Kádár", leader_title: "Secrétaire général", mandate: "1956–1988", notable_events: ["Communisme de consommation unique en bloc soviétique", "Aide à Solidarność polonaise (1989)", "Ouverture du rideau de fer (1989)"] },
      { from: 1990, to: 1994, regime: "Démocratie", orientation: "center", party: "MDF (Forum démocratique hongrois)", leader: "József Antall", leader_title: "Premier ministre", mandate: "1990–1993", notable_events: ["Transition démocratique pacifique", "Décès d'Antall (1993)"] },
      { from: 1994, to: 2010, regime: "Démocratie (alternance)", orientation: "center", party: "MSZP / Fidesz", leader: "Horn / Orbán / Medgyessy / Gyurcsány / Bajnai", leader_title: "Premier ministre", mandate: "1994–2010", notable_events: ["Adhésion à l'UE (2004)", "Crise financière (2008)"] },
      { from: 2010, to: 9999, regime: "Démocratie illibérale", orientation: "far_right", party: "Fidesz (Viktor Orbán)", leader: "Viktor Orbán", leader_title: "Premier ministre", mandate: "2010–présent", notable_events: ["Constitution de 2011", "Tensions avec l'UE", "Réforme judiciaire", "Anti-immigration", "Rapprochement avec Poutine"] },
    ],
  },
  {
    name: "Iran",
    periods: [
      { from: 1900, to: 1924, regime: "Empire qajar", orientation: "right", party: "Autocratie / Révolution constitutionnelle", leader: "Mozaffar ad-Din Shah / Ahmad Shah", leader_title: "Shah", mandate: "1896–1925", notable_events: ["Révolution constitutionnelle (1906)", "Première Guerre mondiale"] },
      { from: 1925, to: 1941, regime: "Monarchie Pahlavi (Reza Shah)", orientation: "right", party: "Autocratie nationaliste", leader: "Reza Shah", leader_title: "Shah", mandate: "1925–1941", notable_events: ["Modernisation et sécularisation", "Renommage en Iran (1935)", "Abdication sous pression (1941)"] },
      { from: 1941, to: 1953, regime: "Monarchie constitutionnelle", orientation: "center", party: "Tudeh / Front national", leader: "Mohammad Reza Shah / Mossadegh", leader_title: "Shah / Premier ministre", mandate: "1941–1953", notable_events: ["Nationalisation du pétrole par Mossadegh (1951)", "Coup d'État soutenu par CIA/MI6 (1953)"] },
      { from: 1953, to: 1979, regime: "Monarchie autoritaire (Shah)", orientation: "right", party: "Rastakhiz (parti unique)", leader: "Mohammad Reza Shah", leader_title: "Shah", mandate: "1953–1979", notable_events: ["Révolution blanche (1963)", "SAVAK (police secrète)", "Révolution islamique (1979)"] },
      { from: 1979, to: 1989, regime: "République islamique (Khomeini)", orientation: "far_right", party: "PRI (islamiste)", leader: "Ruhollah Khomeini", leader_title: "Guide suprême", mandate: "1979–1989", notable_events: ["Révolution islamique (1979)", "Otages américains (1979–1981)", "Guerre Iran-Irak (1980–1988)"] },
      { from: 1989, to: 9999, regime: "République islamique", orientation: "far_right", party: "Conservateurs / Réformateurs (sous guidage Khamenei)", leader: "Khamenei (Guide) / Présidents successifs", leader_title: "Guide suprême", mandate: "1989–présent", notable_events: ["Programme nucléaire", "Accord JCPOA (2015)", "Sanctions américaines", "Manifestations (2019, 2022)"] },
    ],
  },
  {
    name: "South Korea",
    periods: [
      { from: 1948, to: 1960, regime: "Première République (autoritaire)", orientation: "right", party: "Liberal Party", leader: "Syngman Rhee", leader_title: "Président", mandate: "1948–1960", notable_events: ["Guerre de Corée (1950–1953)", "Fraude électorale", "Révolution d'avril (1960)"] },
      { from: 1961, to: 1988, regime: "Dictature militaire / développementaliste", orientation: "right", party: "DRP / KCIA", leader: "Park Chung-hee / Chun Doo-hwan", leader_title: "Président", mandate: "1961–1988", notable_events: ["Miracle économique coréen", "Yushin (1972 — constitution autoritaire)", "Mouvement de Gwangju (1980)"] },
      { from: 1988, to: 1998, regime: "Démocratie (transition)", orientation: "center", party: "DLP / NKP", leader: "Roh Tae-woo / Kim Young-sam", leader_title: "Président", mandate: "1988–1998", notable_events: ["JO de Séoul (1988)", "Adhésion à l'ONU (1991)", "Crise financière asiatique (1997)"] },
      { from: 1998, to: 2008, regime: "Démocratie", orientation: "center", party: "MDP (Parti millenaire démocratique)", leader: "Kim Dae-jung / Roh Moo-hyun", leader_title: "Président", mandate: "1998–2008", notable_events: ["Prix Nobel de la paix Kim (2000)", "Politique du « Soleil radieux »", "Rapprochement Nord-Sud"] },
      { from: 2008, to: 2017, regime: "Démocratie", orientation: "right", party: "GNP / Saenuri", leader: "Lee Myung-bak / Park Geun-hye", leader_title: "Président / Présidente", mandate: "2008–2017", notable_events: ["Tensions avec la Corée du Nord", "Destitution de Park Geun-hye (2017)"] },
      { from: 2017, to: 2022, regime: "Démocratie", orientation: "center", party: "Parti démocratique", leader: "Moon Jae-in", leader_title: "Président", mandate: "2017–2022", notable_events: ["Diplomatie avec la Corée du Nord (2018)", "COVID-19 (2020)"] },
      { from: 2022, to: 9999, regime: "Démocratie", orientation: "right", party: "PPP (Pouvoir du peuple)", leader: "Yoon Suk-yeol", leader_title: "Président", mandate: "2022–présent", notable_events: ["Alliance OTAN renforcée", "Brève loi martiale (2024)"] },
    ],
  },
  {
    name: "South Africa",
    periods: [
      { from: 1910, to: 1948, regime: "Dominion britannique", orientation: "right", party: "SAP / UP", leader: "Botha / Smuts / Hertzog", leader_title: "Premier ministre", mandate: "1910–1948", notable_events: ["Formation de l'Union (1910)", "Première et Seconde Guerres mondiales", "Ségrégation légale croissante"] },
      { from: 1948, to: 1994, regime: "Apartheid", orientation: "far_right", party: "NP (Parti national)", leader: "Malan / Verwoerd / Vorster / Botha / De Klerk", leader_title: "Premier ministre / Président", mandate: "1948–1994", notable_events: ["Apartheid institutionnalisé (1948)", "Massacre de Sharpeville (1960)", "Emprisonnement de Mandela (1964)", "Soweto (1976)", "Fin de l'apartheid (1991)"] },
      { from: 1994, to: 1999, regime: "Démocratie arc-en-ciel", orientation: "center", party: "ANC", leader: "Nelson Mandela", leader_title: "Président", mandate: "1994–1999", notable_events: ["Élections libres (1994)", "Commission Vérité et Réconciliation", "Constitution de 1996"] },
      { from: 1999, to: 2018, regime: "Démocratie (ANC dominant)", orientation: "center", party: "ANC", leader: "Thabo Mbeki / Kgalema Motlanthe / Jacob Zuma", leader_title: "Président", mandate: "1999–2018", notable_events: ["Déni du SIDA (Mbeki)", "Mondial de foot (2010)", "Scandales de corruption (Zuma)"] },
      { from: 2018, to: 9999, regime: "Démocratie", orientation: "center", party: "ANC", leader: "Cyril Ramaphosa", leader_title: "Président", mandate: "2018–présent", notable_events: ["Coalition ANC-DA-IFP (2024)", "Coupe du monde de cricket", "Crise électrique"] },
    ],
  },
  {
    name: "Sweden",
    periods: [
      { from: 1900, to: 1932, regime: "Monarchie constitutionnelle", orientation: "right", party: "Högerpartiet / Libéraux", leader: "Hjalmar Branting / successeurs", leader_title: "Premier ministre", mandate: "1900–1932", notable_events: ["Dissolution de l'union avec la Norvège (1905)", "Réforme électorale (1921 — suffrage universel)"] },
      { from: 1932, to: 1976, regime: "Monarchie constitutionnelle (SAP dominant)", orientation: "left", party: "SAP (Social-démocrate)", leader: "Per Albin Hansson / Erlander / Palme", leader_title: "Premier ministre", mandate: "1932–1976", notable_events: ["État-providence suédois (Folkhemmet)", "Neutralité pendant la Seconde Guerre mondiale", "Palme — social-démocratie internationale"] },
      { from: 1976, to: 1982, regime: "Monarchie constitutionnelle", orientation: "center", party: "Coalition bourgeoise (C/M/FP)", leader: "Thorbjörn Fälldin / Ola Ullsten", leader_title: "Premier ministre", mandate: "1976–1982", notable_events: ["Fin du monopole SAP", "Référendum nucléaire (1980)"] },
      { from: 1982, to: 1991, regime: "Monarchie constitutionnelle", orientation: "left", party: "SAP", leader: "Olof Palme / Ingvar Carlsson", leader_title: "Premier ministre", mandate: "1982–1991", notable_events: ["Assassinat de Palme (1986)", "Dévaluation économique"] },
      { from: 1991, to: 1994, regime: "Monarchie constitutionnelle", orientation: "center", party: "Coalition Moderaterna", leader: "Carl Bildt", leader_title: "Premier ministre", mandate: "1991–1994", notable_events: ["Adhésion à l'EEE (1994)", "Crise économique"] },
      { from: 1994, to: 2006, regime: "Monarchie constitutionnelle", orientation: "left", party: "SAP", leader: "Ingvar Carlsson / Göran Persson", leader_title: "Premier ministre", mandate: "1994–2006", notable_events: ["Adhésion à l'UE (1995)", "Non à l'Euro (2003)"] },
      { from: 2006, to: 2014, regime: "Monarchie constitutionnelle", orientation: "center", party: "Alliance (Moderaterna/C/FP/KD)", leader: "Fredrik Reinfeldt", leader_title: "Premier ministre", mandate: "2006–2014", notable_events: ["Réformes du marché du travail", "Gestion de la crise financière"] },
      { from: 2014, to: 2022, regime: "Monarchie constitutionnelle", orientation: "center", party: "SAP", leader: "Stefan Löfven / Magdalena Andersson", leader_title: "Premier ministre", mandate: "2014–2022", notable_events: ["Crise migratoire (2015)", "COVID-19 (2020)", "Décision d'adhésion à l'OTAN"] },
      { from: 2022, to: 9999, regime: "Monarchie constitutionnelle", orientation: "right", party: "Moderaterna (coalition droite)", leader: "Ulf Kristersson", leader_title: "Premier ministre", mandate: "2022–présent", notable_events: ["Adhésion à l'OTAN (2024)", "Politique migratoire restrictive"] },
    ],
  },
  {
    name: "Australia",
    periods: [
      { from: 1901, to: 1929, regime: "Fédération (monarchie constitutionnelle)", orientation: "right", party: "Libéral / Labor / Nationalist", leader: "Premiers ministres successifs", leader_title: "Premier ministre", mandate: "1901–1929", notable_events: ["Fédération (1901)", "Première Guerre mondiale (1914–1918)", "Politique de l'Australie blanche"] },
      { from: 1929, to: 1949, regime: "Fédération", orientation: "center", party: "Labor / Coalition", leader: "Scullin / Curtin / Chifley / Menzies (premier)", leader_title: "Premier ministre", mandate: "1929–1949", notable_events: ["Grande Dépression", "Seconde Guerre mondiale — Pacifique", "Engagement contra Japon"] },
      { from: 1949, to: 1972, regime: "Fédération", orientation: "right", party: "Parti libéral (Coalition)", leader: "Robert Menzies", leader_title: "Premier ministre", mandate: "1949–1966", notable_events: ["« Menzies era »", "Guerre de Corée (1950)", "Guerre du Vietnam (1965)"] },
      { from: 1972, to: 1975, regime: "Fédération", orientation: "left", party: "Labor (ALP)", leader: "Gough Whitlam", leader_title: "Premier ministre", mandate: "1972–1975", notable_events: ["Fin conscription", "Ouverture à la Chine", "Destitution constitutionnelle (1975)"] },
      { from: 1975, to: 1983, regime: "Fédération", orientation: "right", party: "Coalition (Lib/NP)", leader: "Malcolm Fraser", leader_title: "Premier ministre", mandate: "1975–1983", notable_events: ["Crise Whitlam", "Réfugiés indochinois"] },
      { from: 1983, to: 1996, regime: "Fédération", orientation: "center", party: "Labor (ALP)", leader: "Bob Hawke / Paul Keating", leader_title: "Premier ministre", mandate: "1983–1996", notable_events: ["Dérégulation économique", "Libéralisme économique de gauche", "Réconciliation avec les peuples autochtones (Mabo 1992)"] },
      { from: 1996, to: 2007, regime: "Fédération", orientation: "right", party: "Coalition (Lib/NP)", leader: "John Howard", leader_title: "Premier ministre", mandate: "1996–2007", notable_events: ["Contrôle des armes (1996)", "Guerre en Irak (2003)", "Tampa affair (2001)"] },
      { from: 2007, to: 2013, regime: "Fédération", orientation: "center", party: "Labor (ALP)", leader: "Kevin Rudd / Julia Gillard", leader_title: "Premier ministre", mandate: "2007–2013", notable_events: ["Excuses aux Autochtones (2008)", "Taxe carbone", "Crise politique interne"] },
      { from: 2013, to: 2022, regime: "Fédération", orientation: "right", party: "Coalition (Lib/NP)", leader: "Abbott / Turnbull / Morrison", leader_title: "Premier ministre", mandate: "2013–2022", notable_events: ["Instabilité politique (3 PM en 3 ans)", "COVID-19 (2020)", "Incendies (2019–2020)"] },
      { from: 2022, to: 9999, regime: "Fédération", orientation: "center", party: "Labor (ALP)", leader: "Anthony Albanese", leader_title: "Premier ministre", mandate: "2022–présent", notable_events: ["Politique climatique renforcée", "Référendum autochtone (2023)", "AUKUS / défense"] },
    ],
  },
  {
    name: "Canada",
    periods: [
      { from: 1900, to: 1921, regime: "Dominion (monarchie constitutionnelle)", orientation: "right", party: "Libéral / Conservateur", leader: "Laurier / Borden", leader_title: "Premier ministre", mandate: "1900–1920", notable_events: ["Première Guerre mondiale", "Crise de la conscription (1917)"] },
      { from: 1921, to: 1957, regime: "Dominion / Fédération", orientation: "center", party: "Libéral / Conservateur", leader: "King / Bennett / St. Laurent", leader_title: "Premier ministre", mandate: "1921–1957", notable_events: ["Grande Dépression", "Seconde Guerre mondiale", "OTAN (1949)"] },
      { from: 1957, to: 1968, regime: "Fédération", orientation: "right", party: "Parti progressiste-conservateur", leader: "John Diefenbaker / Lester Pearson", leader_title: "Premier ministre", mandate: "1957–1968", notable_events: ["Accord NORAD (1957)", "Drapeau canadien (1965)", "Assurance-maladie (1966)"] },
      { from: 1968, to: 1984, regime: "Fédération", orientation: "center", party: "Parti libéral", leader: "Pierre Elliott Trudeau", leader_title: "Premier ministre", mandate: "1968–1984", notable_events: ["Crise d'octobre (1970)", "Bilinguisme officiel", "Rapatriement de la Constitution (1982)"] },
      { from: 1984, to: 1993, regime: "Fédération", orientation: "right", party: "Parti progressiste-conservateur", leader: "Brian Mulroney", leader_title: "Premier ministre", mandate: "1984–1993", notable_events: ["ALÉNA négocié", "Accord du lac Meech (rejeté)", "TPS (taxe)"] },
      { from: 1993, to: 2006, regime: "Fédération", orientation: "center", party: "Parti libéral", leader: "Jean Chrétien / Paul Martin", leader_title: "Premier ministre", mandate: "1993–2006", notable_events: ["Référendum québécois (1995)", "Droit gay (2005)", "Surplus budgétaire"] },
      { from: 2006, to: 2015, regime: "Fédération", orientation: "right", party: "Parti conservateur", leader: "Stephen Harper", leader_title: "Premier ministre", mandate: "2006–2015", notable_events: ["Conservatisme fiscal", "Refus de Kyoto", "Mission en Afghanistan"] },
      { from: 2015, to: 9999, regime: "Fédération", orientation: "center", party: "Parti libéral", leader: "Justin Trudeau", leader_title: "Premier ministre", mandate: "2015–présent", notable_events: ["Légalisation cannabis (2018)", "COVID-19 (2020)", "Convoi de la liberté (2022)", "Enjeux autochtones"] },
    ],
  },
];

export function getPoliticsForYear(countryName: string, year: number): PoliticalPeriod | undefined {
  const country = POLITICS_COUNTRIES.find((c) => c.name === countryName);
  if (!country) return undefined;
  return country.periods.find((p) => year >= p.from && year <= p.to);
}

export function getAllPoliticsForYear(year: number): Record<string, PoliticalPeriod> {
  const result: Record<string, PoliticalPeriod> = {};
  for (const country of POLITICS_COUNTRIES) {
    const period = country.periods.find((p) => year >= p.from && year <= p.to);
    if (period) result[country.name] = period;
  }
  return result;
}

export const POLITICS_MIN_YEAR = 1900;
export const POLITICS_MAX_YEAR = 2025;
