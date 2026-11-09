# Reprise Codex — Etapel ecommerce

## Objectif

Faire évoluer cette maquette en boutique Astro/React avec backend Railway/PostgreSQL en conservant exactement la direction visuelle validée avec la cliente. Ne pas remplacer le design par un template générique. Ne pas présenter la maquette comme une boutique connectée.

## Point de départ

Installer avec `npm ci`, lancer `npm run dev`, ouvrir le navigateur. Explorer accueil, catalogue, fiche produit, panier, checkout, puis `/#/admin`. Le composant principal utilise un stockage local volontaire pour permettre une démonstration autonome.

Conserver les vraies références et visuels présents dans `src/catalog-source.json`. Les 12 prix et stocks initiaux sont fictifs. Ne jamais les migrer en production comme prix validés. Toutes les références importées entrent en brouillon.

Le sélecteur de présentation en haut de page rend l'admin immédiatement accessible. Conserver le parcours « Probar con un producto », l'aperçu instantané de `ProductEditor.jsx` et les trois choix de disponibilité. `commerce.js` centralise les règles de la démo et `Availability.jsx` leur affichage. Les champs `availability`, `deliveryMin` et `deliveryMax` sont distincts de `quote` et `published`. Les délais initiaux sont eux aussi fictifs. Reprendre ces validations côté serveur ; celles du navigateur ne suffisent pas.

## Travail de production à réaliser

1. Faire confirmer à la cliente les catégories, variantes, SKU, prix TTC/HT, disponibilité, stock source, devis, livraison et facturation. Conserver les équipements lourds sur devis si c'est la règle métier retenue.
2. Créer une API dédiée sur Railway et une base PostgreSQL ; voir `docs/RAILWAY_ARCHITECTURE.md`.
3. Remplacer les accès localStorage par une couche client API, sans réécrire le style ni les composants de présentation. Les prix, stocks et totaux définitifs doivent être calculés côté serveur.
4. Mettre en place une authentification admin réelle, rôles, validation d'entrée, contrôle d'accès serveur, journal d'audit et protection CSRF selon la stratégie de session.
5. Implémenter un import serveur limité au domaine Etapel autorisé : extraction, images, origine, dédoublonnage, prévisualisation des changements, validation humaine, publication. Préserver prix/stock déjà saisis lors d'une réimportation ; afficher les conflits au lieu d'écraser silencieusement.
6. Brancher la passerelle choisie par la cliente. Vérifier l'éligibilité réelle de Tarjeta, SPEI et OXXO auprès du fournisseur avant de les proposer. Utiliser ses composants de paiement ; ne jamais stocker les données de carte.
7. Créer les commandes, réserver le stock des produits `stocked` dans une transaction et appliquer une règle d'approvisionnement séparée pour `backorder`, qui autorise la vente à stock nul. Bloquer `unavailable` et `quote` au paiement. Revérifier prix, publication, disponibilité, quantité et délai au checkout. Conserver dans la commande le délai annoncé lors de l'achat. Valider le statut payé uniquement via webhook signé et idempotent. Gérer expirations, échecs, remboursements et doubles notifications.
8. Ajouter transporteur, calcul d'envoi, confirmation et suivi. Intégrer la facturation choisie et les documents validés (conditions, confidentialité, retours).
9. Passer des routes hash à de vraies pages Astro indexables pour catégories et produits. Ajouter sitemap, canonical, données structurées Product/Offer vérifiées et images optimisées. Retirer noindex seulement après validation de mise en production.
10. Tester parcours client/admin, stock concurrent, permissions, import et paiement en sandbox avant activation réelle.

## Garde-fous de reprise

- Ne jamais écraser le site actuel : il reste le site de référence et la source d'import.
- Conserver les secrets hors du dépôt ; Railway Variables uniquement, aucun secret dans les variables `PUBLIC_*`.
- Un import n'autorise pas la publication automatique de produits incomplets.
- Vérifier les marques et catégories inférées par la maquette avant migration.
- Images et descriptifs réels ; prix, stocks et informations de paiement à obtenir de la cliente.
- L'administration démo ne constitue pas une base sécurisée de production.
- Les montants doivent être stockés en centavos entiers ; ne pas utiliser les flottants JavaScript pour comptabiliser des paiements.

## Première consigne à coller dans Codex

> Lis README.md, CODEX_HANDOFF.md et docs/RAILWAY_ARCHITECTURE.md. Lance le projet et conserve son design premium. Prépare d'abord une couche d'accès aux données et un backend Railway/PostgreSQL séparé, sans activer de paiement réel. N'importe aucun prix ni stock fictif en production. L'import du catalogue doit toujours passer par un brouillon et une validation humaine. Signale les décisions métier manquantes avant de finaliser les flux de vente.
