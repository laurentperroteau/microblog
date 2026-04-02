---
title: "Node.js n'a pas de limite de sockets"
date: 2026-04-02
---

# Node.js n'a pas de limite de sockets

Le navigateur limite le nombre de requêtes HTTP parallèles vers un même hôte (en général 6). C'est une contrainte volontaire pour ne pas saturer le réseau.

Node.js, lui, n'a aucune limite de ce genre. Un serveur Node peut ouvrir autant de connexions sortantes qu'il veut.

Ce qui peut avoir une limite, c'est le serveur appelé. Un endpoint HTTP classique peut cracker sous la charge. Une Lambda AWS peut en absorber jusqu'à 1000 en parallèle par défaut — mais c'est un quota AWS, pas Node.
