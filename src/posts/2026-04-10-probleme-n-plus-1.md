---
title: "Le problème N+1"
date: 2026-04-10
---

# Le problème N+1

Au lieu de faire une seule requête qui récupère tout ce dont tu as besoin, tu fais 1 requête pour la liste, puis N requêtes supplémentaires — une par élément. Sur 50 éléments, ça fait 51 requêtes au lieu d'une ou deux.

Chaque requête a un coût fixe : connexion TCP, TLS, aller-retour réseau. Le compute est souvent négligeable, c'est cet overhead multiplié par N qui tue.

## Comment le repérer

Le red flag classique : une requête (SQL ou HTTP) dans une boucle. Un `.map()` ou un `.forEach()` qui fait un appel async à chaque itération. Dans les logs, tu vois la même requête répétée X fois avec juste l'ID qui change.

## Comment le résoudre

Deux approches :

- **Un `SELECT` avec un `JOIN`** — la DB fait tout le travail, mais les données de la table parente sont dupliquées dans le résultat
- **Deux requêtes avec un `WHERE id IN (...)`** — zéro duplication, tu assembles côté code. C'est ce que font la plupart des ORMs

Pour les appels HTTP, même principe : une route batch qui accepte plusieurs IDs d'un coup.

Et si le `IN` contient des milliers d'IDs ? Soit tu batches par chunks de 500-1000, soit — mieux — tu repenses ta requête. Si tu as 10 000 IDs en mémoire, c'est probablement qu'un filtre côté DB (`WHERE status = 'active'`) remplacerait la liste.
