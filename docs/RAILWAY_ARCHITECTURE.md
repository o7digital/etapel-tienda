# Architecture de production proposée

Ce document décrit le passage à la production ; aucun service Railway n'est provisionné dans cette livraison.

## Services

- Frontend : Astro et îlots React pour catalogue, panier et compte client. Hébergement Vercel ou service Node adapté selon rendu statique/SSR retenu.
- API : service TypeScript sur Railway, framework serveur à choisir avec le dépôt cible. PostgreSQL géré pour catalogue, variantes, inventaire, utilisateurs, commandes et import.
- Images et fichiers : stockage objet compatible S3 et CDN, avec originaux conservés et transformations optimisées. Ne pas dépendre du disque éphémère du service API.
- Traitements : worker d'import, file de jobs pour images et notifications, outbox transactionnelle pour les actions fiables.
- Paiement : prestataire validé par Etapel, sessions créées côté serveur et webhooks vérifiés.

## Modèle relationnel minimal

| Entité | Champs principaux |
|---|---|
| Product | id, slug unique, name, description, brand_id, category_id, status, sales_mode, source_url unique, imported_at, reviewed_at, version |
| Variant | id, product_id, sku unique, options, currency=MXN, price_centavos, tax_included, availability, delivery_min_business_days, delivery_max_business_days, active |
| Inventory | variant_id, stock_available, stock_reserved, version |
| Media | id, product_id, object_key, alt, source_url, sort_order |
| ImportJob | id, requested_by, source_domain, status, counts, log, created_at |
| ImportCandidate | id, job_id, source_url, parsed_payload, field_diffs, action, review_status |
| Order | id, public_reference unique, customer_id, status, currency, subtotal_centavos, tax_centavos, shipping_centavos, total_centavos |
| OrderItem | order_id, variant_id, sku_snapshot, name_snapshot, qty, unit_price_centavos, tax_snapshot, availability_snapshot, delivery_estimate_snapshot |
| PaymentEvent | provider, event_id unique, order_id, verified_at, processed_at |
| AdminUser / AuditLog | rôle, sessions, action, acteur, objet, avant/après, date |

Les statuts de produit : `draft`, `published`, `archived`. Les modes de vente : `direct`, `quote`. Le mode `direct` requiert une variante, un prix validé, une taxe explicite et une règle de stock. Le mode `quote` ne doit pas passer par le paiement.

La disponibilité est indépendante du mode de vente : `stocked` exige du stock et limite la quantité ; `backorder` accepte une commande à stock zéro selon une politique d'approvisionnement validée ; `unavailable` laisse le produit visible sans permettre d'achat. Un achat direct doit afficher un délai estimé cohérent, minimum et maximum en jours ouvrés. La maquette valide une plage de 1 à 365 jours ; confirmer cette limite métier et le point de départ du délai avec Etapel. Aucun délai ne doit être inventé lors d'un import.

Le serveur doit recalculer ces règles au checkout, y compris pour un panier constitué avant une modification admin. Le délai affiché doit être sauvegardé dans la ligne de commande. La réservation de stock ne s'applique pas de la même manière à un approvisionnement sur commande. Les validations du module frontend `src/commerce.js` servent de référence fonctionnelle, pas de barrière de sécurité.

## Contrat API proposé

| Méthode | Route | Rôle |
|---|---|---|
| GET | /v1/products | Produits publiés, pagination, recherche, catégories et marques |
| GET | /v1/products/:slug | Détail, variantes, médias et disponibilité publique |
| POST | /v1/cart/quote | Recalcule prix, taxes, stock et livraison côté serveur |
| POST | /v1/checkout/sessions | Crée commande provisoire et session de paiement, clé d'idempotence |
| POST | /v1/webhooks/payments | Vérifie signature et applique transition idempotente |
| GET/POST/PATCH | /v1/admin/products | Administration authentifiée et journalisée |
| POST | /v1/admin/imports/preview | Analyse le catalogue Etapel sans mutation des produits |
| GET | /v1/admin/imports/:id/candidates | Résultats et différences par champ |
| POST | /v1/admin/imports/:id/commit | Importe les références sélectionnées en brouillon |
| POST | /v1/admin/products/:id/publish | Vérifie les champs requis puis publie |
| PATCH | /v1/admin/content/home | Met à jour la couverture du site |

## Import

Limiter les URL à une liste explicite de domaines Etapel, refuser les IP privées et les redirections hors liste, fixer taille/temps de réponse et nombre de téléchargements. Nettoyer le HTML et vérifier les MIME des images. Utiliser URL d'origine et SKU validé comme clés métier de rapprochement, jamais la position dans la liste. Produire une prévisualisation des modifications et conserver les champs commerciaux locaux. Une publication est une opération séparée de l'import.

## Variables envisagées

`DATABASE_URL`, `SESSION_SECRET`, `FRONTEND_ORIGIN`, `PAYMENT_SECRET_KEY`, `PAYMENT_WEBHOOK_SECRET`, `OBJECT_STORAGE_ENDPOINT`, `OBJECT_STORAGE_BUCKET`, `OBJECT_STORAGE_ACCESS_KEY`, `OBJECT_STORAGE_SECRET_KEY`.

Ne pas inventer de valeurs. Les variables navigateur ne doivent contenir qu'une URL publique d'API ou les clés explicitement publiques du fournisseur.
