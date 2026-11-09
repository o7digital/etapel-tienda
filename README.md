# ETAPEL — Precision Store

Maquette ecommerce premium en espagnol pour le marché mexicain. Réalisée avec Astro 5 et React 19. Direction artistique bleu nuit, blanc minéral, accent orange, photographie du catalogue Etapel.

## Démarrer

Node.js 22 LTS recommandé.

```bash
npm ci
npm run dev
```

Ouvrir l'adresse affichée par Astro. Construire avec `npm run build`, puis vérifier avec `npm run preview`. Le dossier de sortie est `dist/`.

La copie originale reste disponible sur [ChatGPT Sites](https://etapel-ecommerce-premium.osteineur.chatgpt.site) (accès privé). Ce dépôt contient une copie autonome de la version 2 de la démo, sans modifier ce Site ni le site vitrine Etapel. Les données locales du navigateur ne sont pas transférées entre les deux adresses.

## Parcours de démonstration

- Accueil : `/`
- Boutique : `/#/catalogo`
- Administration : `/#/admin` ou sélecteur permanent « Vista del cliente / Administrar mi tienda » en haut de page.
- Sélection initiale : 12 produits, dont 2 sur devis.
- Source d'import : capture de 225 références du catalogue actuel, relevée le 3 novembre 2026 (heure du Mexique).
- Recherche par nom, marque et SKU, catégories, filtre par marque, tri, favoris, fiche produit.
- Panier avec quantités et total MXN. Checkout fictif Tarjeta/SPEI/OXXO, sans saisie de carte ni paiement.
- Admin : création/modification, prix avec centavos, disponibilité, délais, brouillon/publication, import sélectif, édition de la couverture et consultation des commandes fictives.
- « Probar con un producto » ouvre un éditeur avec aperçu client instantané : le prix, la disponibilité, la livraison et le bouton d'achat réagissent avant enregistrement. Sur mobile, deux onglets séparent l'édition de l'aperçu.
- Trois disponibilités : `En stock` limite les achats aux unités disponibles ; `Sobre pedido` permet l'achat même à stock zéro ; `No disponible` conserve la fiche visible mais bloque l'achat. Le devis reste un mode de vente indépendant.
- Un délai estimé en jours ouvrés accompagne la fiche, le panier et le checkout. La publication d'un produit achetable exige un prix et un délai valides. Le panier est revérifié après modification d'un produit.

L'import copie une capture embarquée du catalogue : il ne lance pas de scraping en direct. Les références déjà présentes sont exclues sur la base de leur URL d'origine. Les nouvelles références sont toujours des brouillons avec prix à définir, stock à zéro, disponibilité désactivée et délai à renseigner. La catégorisation et certaines marques sont proposées par des règles simples et doivent être vérifiées avant publication.

## État réel et limites

Cette livraison est une maquette interactive, pas une boutique de production. Railway n'est pas connecté. Tous les changements restent dans le localStorage du navigateur ; ils ne sont pas synchronisés entre utilisateurs. L'administration n'est pas authentifiée. Les prix, stocks, délais et SKU de la sélection sont illustratifs. Les stocks ne sont pas décrémentés par les commandes fictives. L'email, le téléphone et les fiches source sont les liens du site Etapel ; l'envoi d'un email reste manuel.

Les modifications déjà enregistrées dans une version précédente sont conservées. Les anciens produits sans délai affichent « Entrega por confirmar » jusqu'à leur mise à jour. Un navigateur sans données locales montre les exemples initiaux : stock, sur commande et indisponibilité.

Les prix illustratifs sont traités comme TTC (IVA inclus). Les frais d'envoi ne sont pas calculés. Aucun prélèvement réel, message transactionnel, facture ou commande commerciale n'est envoyé.

## Mise en ligne sur Vercel

Sources : https://github.com/o7digital/etapel-tienda. La configuration `vercel.json` définit le framework Astro, l’installation `npm ci`, le build `npm run build` et la sortie `dist`. Node.js 22 est fixé dans `package.json`. La maquette utilise des routes hash et n'a pas besoin de réécriture serveur. Elle porte `noindex,nofollow` pour éviter l'indexation du concept.

## Structure

- `src/pages/index.astro` : point d'entrée, langue, métadonnées.
- `src/components/Store.jsx` : parcours boutique et administration React.
- `src/components/ProductEditor.jsx` : éditeur produit et aperçu client en direct.
- `src/components/Availability.jsx` : affichage commun de disponibilité et livraison.
- `src/commerce.js` : validation de publication, achat et délais.
- `src/styles.css`, `src/admin-enhancement.css` : design responsive.
- `src/products.json` : sélection initiale et données commerciales fictives.
- `src/catalog-source.json` : 225 références source sans prix.
- `public/assets/` : logo, produits, photographie, police Manrope.
- `CODEX_HANDOFF.md` : consignes de reprise et passage à Railway.
- `docs/RAILWAY_ARCHITECTURE.md` : architecture et contrat API proposés.
- `docs/QA.md` : contrôles effectués et limites.
- `tests/commerce.test.mjs` : règles commerciales ; lancer `npm test`.

Les visuels et descriptions sont repris du site fourni par Olivier pour ce projet Etapel. Ne pas réutiliser cette identité et ces assets pour une autre marque. Manrope est distribuée sous SIL Open Font License ; voir `public/assets/OFL-Manrope.txt`.
