-- Module Conflits : modèle normalisé. Non appliqué automatiquement (aucune base connectée dans cette livraison).
-- Idempotent (IF NOT EXISTS) et réversible (voir 001_schema.down.sql). Les identifiants VIZ-C-001…068 sont conservés tels quels.

create table if not exists conflict_sources (
  id text primary key,                         -- SRC-… / SOURCE-LEGACY-…
  titre text not null,
  url text not null check (url ~ '^https://'),
  organisme text,
  type text,                                   -- onu | base_scientifique | ong | media | gouvernement | partie_impliquee | piste_inventaire
  date_publication date,
  date_consultation date,
  version text,
  citation text,
  droit_usage text,                            -- licence ou conditions de redistribution
  generique boolean not null default false,    -- tableau de bord ou page d'accueil : ne prouve aucun fait précis
  statut_controle text not null default 'non_teste'
);

create table if not exists countries (
  iso3 text primary key,                       -- XKX = Kosovo, code non officiel ISO 3166-1
  iso2 text,
  nom text not null,
  statut text not null,                        -- entite_iso_3166_1 | code_non_officiel
  ne_name text                                 -- clé de jointure avec la géométrie Natural Earth du site
);

create table if not exists conflicts (
  id text primary key check (id ~ '^VIZ-C-[0-9]{3}$'),
  nom text not null,
  titre_court text,
  categorie text not null check (categorie in ('Conflit armé','Violences armées','Tension géopolitique')),
  region text,
  zone text,
  situation_inventaire text,
  statut_operationnel text,                    -- null tant que non vérifié indépendamment
  debut date, debut_precision text check (debut_precision in ('jour','mois','annee')),
  fin date,   fin_precision text   check (fin_precision   in ('jour','mois','annee')),
  resume text, resume_verification text,
  etat_publication text not null default 'brouillon' check (etat_publication in ('brouillon','sources_a_verifier','valide','publie','archive')),
  date_inventaire date not null,
  edite_le timestamptz not null default now()
);

create table if not exists conflict_country_roles (
  conflict_id text references conflicts(id) on delete cascade,
  iso3 text references countries(iso3),
  role text not null check (role in ('theatre','belligerant','etat_implique','mediateur','affecte','autre')),
  valide_du date, valide_au date,
  source_id text references conflict_sources(id),
  justification text,
  verification text not null default 'cartographie_preliminaire_a_controler',
  primary key (conflict_id, iso3, role)
);

create table if not exists actors (
  id bigint generated always as identity primary key,
  nom text not null, alias text[] default '{}',
  type text check (type in ('etat','armee','mouvement','milice','institution','coalition')),
  iso3 text references countries(iso3)
);
create table if not exists conflict_actors (
  conflict_id text references conflicts(id) on delete cascade,
  actor_id bigint references actors(id),
  role text, objectifs text, zone_presence text,
  periode_debut date, periode_fin date,
  soutien text check (soutien in ('demontre','allegue')),
  verification text not null default 'a_verifier',
  source_id text references conflict_sources(id),
  primary key (conflict_id, actor_id)
);

create table if not exists causes (
  id bigint generated always as identity primary key,
  conflict_id text not null references conflicts(id) on delete cascade,
  type text not null check (type in ('structurelle','declencheur','aggravant','enjeu')),
  nature text not null default 'analytique' check (nature in ('fait','position_revendiquee','analytique')),
  texte text not null,
  verification text not null default 'a_verifier',
  source_id text references conflict_sources(id)
);

create table if not exists events (
  id text primary key,                          -- EV-… ; stable
  conflict_id text not null references conflicts(id) on delete cascade,
  type text not null,                           -- combat | frappe | massacre | accord | cessez_le_feu | sanction | mediation | deplacement | prise_de_ville…
  titre text not null, recit text,
  date_debut date, date_fin date, precision_date text not null check (precision_date in ('jour','mois','annee')),
  lieu text, lat double precision check (lat between -90 and 90), lon double precision check (lon between -180 and 180),
  precision_geo text check (precision_geo in ('site','zone')),
  iso3 text references countries(iso3),
  acteur_ids bigint[] default '{}',
  verification text not null default 'a_verifier',
  source_id text references conflict_sources(id),
  ucdp_id text, acled_id text,                  -- rapprochement éventuel avec un jeu externe, jamais un doublon de comptage
  check (date_debut is null or date_debut <= date '2026-10-31')
);

create table if not exists observations (
  id text primary key,
  conflict_id text not null references conflicts(id) on delete cascade,
  type text not null,                           -- civils_tues | personnes_tuees | civils_blesses | personnes_deplacees_internes | refugies…
  value numeric,                                -- NULL = inconnu, jamais 0 par défaut
  min numeric, max numeric, range_type text,
  unite text not null, population text, territoire text,
  period_start date, period_end date, as_of date, publication_date date,
  is_cumulative boolean, stock_or_flow text check (stock_or_flow in ('stock','flux')),
  disaggregation text, coverage_note text, caveat text, methodology text,
  reliability text not null check (reliability in ('vérifié','estimé','revendiqué','contesté')),
  source_id text not null references conflict_sources(id),
  check (value is null or value >= 0)
);

create table if not exists diplomatic_relations (
  id text primary key,
  type text not null check (type in ('alliance_traite','differend_territorial','sanction','mediation','rupture_relations','normalisation','soutien_militaire_documente','vote_onu')),
  acteur_a text not null references countries(iso3), acteur_b text not null references countries(iso3),
  orientation text check (orientation in ('a_vers_b','b_vers_a','reciproque')),
  debut date not null, fin date,
  preuve text not null, source_id text not null references conflict_sources(id),
  proxy boolean not null default false,         -- vrai pour les votes ONU : indicateur indirect, pas une alliance
  conflict_id text references conflicts(id),
  check (type <> 'vote_onu' or proxy)
);

create table if not exists conflict_edges (
  from_id text references conflicts(id) on delete cascade,
  to_id text references conflicts(id) on delete cascade,
  type text not null check (type in ('sous_dossier','sous_dossier_potentiel','meme_contexte_regional','operations_associees','conflit_distinct_memes_acteurs','connexite_non_hierarchique')),
  justification text, validation text,
  primary key (from_id, to_id, type), check (from_id <> to_id)
);

create table if not exists data_versions (
  id text primary key,                          -- ucdp_ged_26_1, faostat_qcl_2026_11_01…
  jeu text not null, version text not null, periode text,
  licence text, url text, sha256 text, lignes bigint,
  statut text not null default 'definitif' check (statut in ('definitif','preliminaire')),
  importe_le timestamptz not null default now()
);
create table if not exists import_log (
  id bigint generated always as identity primary key,
  version_id text references data_versions(id),
  date_ingestion timestamptz not null default now(),
  regles_dedup text, avertissements jsonb default '[]', erreurs jsonb default '[]', validation jsonb
);

-- Historique long (tables normalisées par jeu : les catégories et conventions de chaque organisme sont conservées).
create table if not exists hist_ucdp_conflict_year (
  version_id text references data_versions(id),
  conflict_id bigint not null, year int not null,
  location text, side_a text, side_b text, incompatibility int, territory_name text,
  intensity_level int, type_of_conflict int, cumulative_intensity int, region text,
  start_date date, ep_end boolean,
  primary key (version_id, conflict_id, year)
);
create table if not exists hist_ucdp_ged_country_year (
  version_id text references data_versions(id),
  year int not null, country text not null, type_of_violence int not null,
  events int not null, deaths_best int, deaths_low int, deaths_high int, deaths_civilians int,
  primary key (version_id, year, country, type_of_violence)
);
