# Vérifications de la maquette

Effectuées le 3 novembre 2026 (Mexique).

- Installation des dépendances et build statique Astro réussis.
- Inspection en navigateur desktop : accueil, images, catalogue et administration.
- Inspection responsive dans un cadre de 390 px : composition mobile, navigation et catalogue.
- Pas d'image cassée détectée dans la page d'accueil desktop.
- Ajout SATA jet X, passage à deux unités : 16 900 × 2 = 33 800 MXN.
- Checkout de démonstration avec méthode SPEI : confirmation et création locale, sans appel à une passerelle.
- Édition prix/stock SATA jet X : 17 100 MXN et 8 unités retrouvés dans la table admin.
- Import SATAgraph 4 : sélection, révision, création en brouillon, prix absent et stock 0.
- Édition du brouillon et publication : SATAgraph 4 retrouvé par recherche dans la boutique avec prix de test 4 900 MXN.

Les changements de QA ont été faits dans le navigateur de prévisualisation et ne modifient pas le catalogue initial livré. Les résultats ne prouvent pas le fonctionnement d'une API Railway, d'un paiement, de la facturation ou d'une logistique : ces intégrations ne sont pas présentes dans la maquette.

## Mise à jour admin — 4 novembre 2026 (UTC)

- Sélecteur client/admin permanent vérifié dans les deux vues.
- Parcours « Probar con un producto » : modification du prix à 17 900,50 MXN, passage à `Sobre pedido` avec stock zéro et délai de 10 à 15 jours. Prix, disponibilité, délai et CTA mis à jour en direct puis retrouvés dans la fiche après enregistrement.
- Achat sur commande accepté à stock zéro.
- Passage du même produit à `No disponible` : aperçu désactivé, ancienne ligne de panier signalée et checkout bloqué.
- Mobile à 390 px : éditeur et onglet « Vista cliente en vivo », changement de délai à 5–8 jours reflété dans l'aperçu ; largeur du document 390 px sans débordement horizontal.
- Correction du style des boutons radio de disponibilité, vérifiée visuellement sur desktop et mobile.
- Cinq tests automatisés dans `tests/commerce.test.mjs` : limites de stock et commandes à stock nul ; revalidation du panier après changement ; validation de publication et brouillons ; libellés de livraison ; reprise des anciens produits sans perte ni délai inventé.
- `node --test tests/commerce.test.mjs` : 5 tests réussis. Build Astro statique réussi.

## Copie GitHub / Vercel — 9 novembre 2026 (Mexique)

- Dépôt cible : `o7digital/etapel-tienda`. Source : version 2 de Precision Store, commit Sites `1b9973466e9c9975697dc5088291006fd87ff199`.
- Code applicatif et assets conservés à l’identique ; ajout de la configuration Vercel, du script `npm test` et de Node.js 22 pour le déploiement.
- `npm test` : cinq tests réussis ; `npm run build` : build statique réussi.
- Chrome : accueil, catalogue de 12 produits, ajout au panier, éditeur de produit, import et largeur mobile de 390 px vérifiés sans erreur JavaScript.
- Les dépendances historiques de la démo sont conservées. `npm audit` signale quatre dépendances vulnérables (Astro et outils associés). Le déploiement est un export statique sans serveur Astro ni endpoint d’optimisation d’images. Une mise à niveau du framework reste à prévoir avant le passage à un backend de production.
- Le Site ChatGPT original et le site vitrine ne sont pas modifiés.
