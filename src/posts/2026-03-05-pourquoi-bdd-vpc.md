---
title: Pourquoi les bases de données ne doivent pas être publiques
date: 2026-03-05
---

# Pourquoi les bases de données ne doivent pas être publiques

En 2022, des chercheurs ont trouvé 810 snapshots RDS AWS exposés publiquement par erreur. 250 l'étaient depuis plus d'un mois. Données de santé, mots de passe, clés SSH — tout ça accessible à n'importe qui avec un compte AWS.

## Défense en profondeur

Une base de données, c'est le cœur des données d'une app. Les standards sécu (SOC 2, PCI DSS, HIPAA) demandent plusieurs couches de protection, pas juste une.

Une BDD publique, ça veut dire :
- **Surface d'attaque plus grande** : on peut la scanner et la trouver depuis internet
- **Tout repose sur l'auth** : s'il y a une faille, plus rien ne protège
- **Les auditeurs vont tiquer** : ils s'attendent à une isolation réseau

## Du coup, tout passe dans le VPC

Si la BDD est dans un VPC privé, le code qui y accède doit y être aussi. Sur une stack serverless AWS, ça donne :

- **Lambdas dans le VPC** : cold starts plus lents
- **NAT Gateway** : pour que les Lambdas aient internet (~$30-100/mois)
- **Bastion ou SSM** : pour que les devs accèdent à la base

Plus complexe, plus cher, mais c'est le prix pour cocher les cases conformité.

## L'alternative

Des services comme PlanetScale ou Neon ont des BDD publiques mais blindent la sécu : tokens temporaires, SSL obligatoire, certifs SOC 2 et PCI DSS. C'est leur métier, ils savent ce qu'ils font.
