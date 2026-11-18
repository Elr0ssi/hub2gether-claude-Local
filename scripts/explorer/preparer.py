#!/usr/bin/env python3
"""
Prépare les données de l'onglet Explorer : public/explorer/points.json et public/explorer/rivieres.json.

  Données RÉELLES (Natural Earth, domaine public)
    - montagnes : sommets nommés avec altitude (ne_10m_geography_regions_elevation_points)
    - villes    : villes de plus d'un million d'habitants et capitales (ne_10m_populated_places_simple)
    - rivières  : cours d'eau (ne_50m_rivers_lake_centerlines), sans les lacs

  Données D'EXEMPLE (fictives, à remplacer par un dossier vérifié)
    - nucleaire : « centrales » placées au hasard dans le pays
    - sieges    : « sociétés » placées dans de vraies grandes villes
  Elles portent `exemple: true` dans le fichier et sont signalées comme telles dans l'interface.

Usage : python3 scripts/explorer/preparer.py <dossier avec les geojson Natural Earth>
        (les fichiers ne_10m_geography_regions_elevation_points.geojson, ne_10m_populated_places_simple.geojson,
         ne_50m_rivers_lake_centerlines.geojson viennent de github.com/nvkelso/natural-earth-vector)
"""
import json, random, sys, os

src = sys.argv[1]
racine = os.path.join(os.path.dirname(__file__), "..", "..")
pays_geo = json.load(open(os.path.join(racine, "public/geo/ne_50m_countries.simplified.geojson")))

# ── Pays : polygones et boîtes englobantes ──────────────────────────────────
PAYS = []
for f in pays_geo["features"]:
    g = f["geometry"]
    polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    boites = []
    for p in polys:
        xs = [c[0] for c in p[0]]; ys = [c[1] for c in p[0]]
        boites.append((min(xs), min(ys), max(xs), max(ys)))
    PAYS.append((f["properties"]["name"], polys, boites))

def dans_anneau(x, y, ring):
    dedans = False
    j = len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i][0], ring[i][1]; xj, yj = ring[j][0], ring[j][1]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi:
            dedans = not dedans
        j = i
    return dedans

def dans_poly(x, y, poly):
    if not dans_anneau(x, y, poly[0]): return False
    return not any(dans_anneau(x, y, t) for t in poly[1:])

def pays_de(lon, lat):
    for nom, polys, boites in PAYS:
        for p, b in zip(polys, boites):
            if b[0] <= lon <= b[2] and b[1] <= lat <= b[3] and dans_poly(lon, lat, p):
                return nom
    return None

def tire_dans(nom, rng):
    for n, polys, boites in PAYS:
        if n != nom: continue
        i = max(range(len(polys)), key=lambda k: (boites[k][2] - boites[k][0]) * (boites[k][3] - boites[k][1]))
        b = boites[i]
        for _ in range(500):
            x = rng.uniform(b[0], b[2]); y = rng.uniform(b[1], b[3])
            if dans_poly(x, y, polys[i]): return round(x, 3), round(y, 3)
    return None

r2 = lambda v: round(v, 3)

# ── Réel : montagnes ────────────────────────────────────────────────────────
mont = json.load(open(os.path.join(src, "ne_10m_geography_regions_elevation_points.geojson")))
montagnes = []
for f in mont["features"]:
    p = f["properties"]
    if p.get("featurecla") != "mountain" or not p.get("elevation"): continue
    lon, lat = p["long_x"], p["lat_y"]
    pays = pays_de(lon, lat)
    montagnes.append([p.get("name_fr") or p.get("name_en") or p["name"], int(p["elevation"]), r2(lat), r2(lon), pays])

# ── Réel : villes ───────────────────────────────────────────────────────────
vil = json.load(open(os.path.join(src, "ne_10m_populated_places_simple.geojson")))
villes = []
for f in vil["features"]:
    p = f["properties"]
    pop = p.get("pop_max") or 0
    cap = bool(p.get("adm0cap"))
    if pop < 1_000_000 and not (cap and pop > 0): continue
    lon, lat = f["geometry"]["coordinates"]
    pays = pays_de(lon, lat) or p.get("adm0name")
    villes.append([p["name"], int(pop), r2(lat), r2(lon), pays, 1 if cap else 0])

# ── Réel : rivières ─────────────────────────────────────────────────────────
riv = json.load(open(os.path.join(src, "ne_50m_rivers_lake_centerlines.geojson")))
rivieres = []
for f in riv["features"]:
    p = f["properties"]
    if p.get("featurecla") != "River": continue
    g = f["geometry"]
    lignes = g["coordinates"] if g["type"] == "MultiLineString" else [g["coordinates"]]
    pays = set()
    for l in lignes:
        for c in l[:: max(1, len(l) // 12)]:
            n = pays_de(c[0], c[1])
            if n: pays.add(n)
    rivieres.append({"n": p.get("name_en") or p.get("name") or "", "p": sorted(pays), "l": [[[r2(c[0]), r2(c[1])] for c in l] for l in lignes]})

# ── Exemple : centrales et sièges (FICTIFS) ─────────────────────────────────
rng = random.Random(2026)
NUCLEAIRE_PAYS = ["United States of America", "France", "China", "Russia", "Japan", "South Korea", "India", "Canada", "United Kingdom",
                  "Spain", "Germany", "Ukraine", "Sweden", "Belgium", "Finland", "Czechia", "Switzerland", "Pakistan", "Brazil",
                  "Argentina", "South Africa", "Mexico", "Slovakia", "Bulgaria", "Romania", "Hungary", "Armenia", "Iran",
                  "United Arab Emirates", "Taiwan", "Netherlands", "Slovenia", "Belarus", "Bangladesh", "Turkey", "Egypt"]
nucleaire = []
for nom in NUCLEAIRE_PAYS:
    for i in range(rng.randint(2, 9)):
        pt = tire_dans(nom, rng)
        if pt: nucleaire.append([f"Centrale exemple {i + 1}", rng.choice([600, 900, 1000, 1300, 1600]), pt[1], pt[0], nom])

SECTEURS = ["Énergie", "Finance", "Technologie", "Industrie", "Distribution", "Santé", "Transport", "Télécoms"]
par_pays = {}
for v in villes: par_pays.setdefault(v[4], []).append(v)
sieges = []
gros = sorted(par_pays, key=lambda n: -sum(v[1] for v in par_pays[n]))[:60]
for nom in gros:
    vs = par_pays[nom]
    vs = sorted(vs, key=lambda v: -v[1])[:6]
    for i in range(min(len(vs) + 2, 8)):
        v = vs[i % len(vs)]
        dx, dy = rng.uniform(-0.12, 0.12), rng.uniform(-0.08, 0.08)
        sieges.append([f"Société exemple {i + 1}", rng.choice(SECTEURS), round(rng.uniform(5, 400), 1), r2(v[2] + dy), r2(v[3] + dx), nom, v[0]])

os.makedirs(os.path.join(racine, "public/explorer"), exist_ok=True)
json.dump({"montagnes": montagnes, "villes": villes, "nucleaire": nucleaire, "sieges": sieges},
          open(os.path.join(racine, "public/explorer/points.json"), "w"), ensure_ascii=False, separators=(",", ":"))
json.dump(rivieres, open(os.path.join(racine, "public/explorer/rivieres.json"), "w"), ensure_ascii=False, separators=(",", ":"))
print(len(montagnes), "montagnes ;", len(villes), "villes ;", len(rivieres), "rivières ;", len(nucleaire), "centrales (exemple) ;", len(sieges), "sièges (exemple)")
