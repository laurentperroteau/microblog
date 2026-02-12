---
title: Pourquoi éviter includes() en boucle
date: 2025-02-11
---

# Pourquoi éviter includes() en boucle

Repéré en review :

```js
candidatesRows.filter(
  ({ email }) => !existingEmails.includes(email)
);
```

`includes()` parcourt tout le tableau à chaque tour de boucle. Sur un tableau de 1 000 éléments, ça fait potentiellement **1 000 × 1 000 = 1 million d'opérations**.

Le fix :

```js
candidatesRows.filter(
  ({ email }) => !existingEmails.has(email)
);
```

Avec un `Set` et `.has()`, le lookup est instantané. Sur 1 000 éléments : **max 1 000 opérations**.

> Dans mon cas, c'était max 50 donc négligeable.
