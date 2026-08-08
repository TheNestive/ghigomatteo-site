# Mode d'emploi — Admin du site ghigomatteo.com

## Se connecter

1. Va sur **tonsite.com/admin** (en local : http://localhost:3000/admin)
2. Entre le mot de passe, clique **ENTRER**.

> Le mot de passe se règle dans le fichier `.env.local` du site (ligne
> `ADMIN_PASSWORD=...`). **Change-le avant la mise en ligne.**

## Ce que tu peux faire

### La page d'accueil et l'index
La colonne de gauche a **trois blocs** :

1. **BANDE D'ACCUEIL** (6 max) — la grande bande horizontale en haut de l'accueil.
2. **GRILLE « LA SUITE »** (6 max) — la grille juste en dessous. Le **H** / **V**
   à côté de chaque ligne indique si le slot est horizontal ou vertical.
3. **INDEX · ORDRE DES PROJETS** — la liste complète, dans l'ordre où elle
   apparaît dans l'index du site (bouton « Voir plus »).

**Mettre un projet dans la bande / la grille :** dans l'index, clique le bouton
**B** (bande) ou **G** (grille) sur sa ligne. Il apparaît alors dans le bloc du
haut. Pour l'enlever : re-clique **B**/**G**, ou le **✕** dans le bloc du haut.
(Les boutons se grisent quand la bande ou la grille est pleine — 6.)

**Changer l'ordre :** les flèches **↑ ↓**. Dans la bande / la grille, elles
changent l'ordre d'affichage sur l'accueil. Dans l'index, elles changent l'ordre
de la liste complète. Bande et index sont **indépendants** : réordonner l'index
ne bouge pas la bande.

**Masquer de l'index :** l'œil **●** (visible) / **◌** (masqué) sur une ligne
d'index. Un projet masqué disparaît de la liste « Voir plus » mais peut rester
dans la bande (ex. un projet uniquement en vidéo).

Termine toujours par **ENREGISTRER**.

### Choisir les covers d'un projet (★ et ◆)
Sur chaque photo du projet, dans l'admin :
- **★** = la cover principale (vignette de la bande d'accueil / de l'index).
- **◆** = la cover « grille » : la photo utilisée quand le projet apparaît
  dans la section « La suite du travail ». Ça sert à **ne pas afficher deux
  fois la même photo** pour un projet présent à la fois dans la bande et dans
  la grille (ex. Tomorrowland, Tomorrowland Winter). Si tu ne choisis pas de
  ◆, la grille recadre simplement la cover principale.
- **◉** = photo montrée dans le mini-carrousel au survol de la carte.

### Modifier les infos d'un projet
Clique sur un projet, modifie ses champs :
- **Titre** : le grand titre (page projet + index)
- **Label de carte** : le petit « // NOM » affiché sur les vignettes
- **Année**, **Date**, **Lieu**, **Description**
- **Lien** : texte affiché + URL (laisser vide = pas de lien)
- **Catégorie** : Événement / Corporate / Lifestyle

### Gérer les photos d'un projet
- **+ AJOUTER DES PHOTOS** : choisis un ou plusieurs fichiers (JPG, PNG,
  WebP, AVIF). Elles s'ajoutent à la fin.
- **★** : définit la photo comme **cover** (la vignette du projet sur
  l'accueil — encadrée en rouge). Une photo verticale donne une carte 3:4,
  une horizontale une carte 4:3.
- **← →** : change l'ordre. Les premières photos servent aussi au
  mini-carrousel quand on survole la carte.
- **✕** : retire la photo du projet (le fichier n'est pas supprimé du
  serveur, on peut la remettre plus tard).

### Créer / supprimer un projet
- En bas de la liste : titre + catégorie → **+ CRÉER**, puis ajoute des
  photos. Un projet **sans photo n'apparaît pas** sur le site.
- **SUPPRIMER LE PROJET** (en haut de la fiche) : le retire du site, les
  fichiers photos restent sur le serveur.

## ⚠️ Le bouton ENREGISTRER

Aucun changement n'est publié tant que tu n'as pas cliqué sur
**ENREGISTRER** (barre en bas). La barre affiche
« ● MODIFICATIONS NON ENREGISTRÉES » tant qu'il reste des changements en
attente. Après enregistrement, le site est à jour immédiatement (pas de
rebuild nécessaire).

## Notes techniques (pour l'hébergement)

- Le site doit tourner en mode serveur Node (`npm run build` puis
  `npm run start`) pour que l'admin fonctionne (écriture des données et
  upload de fichiers). Un hébergement type VPS / Railway / Render convient ;
  un hébergement 100 % statique ne permettra pas l'admin.
- Données : `src/data/projects.json` · Photos : `public/photos/…`
  → à inclure dans les sauvegardes.
