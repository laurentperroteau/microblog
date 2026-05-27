---
title: "Node HTTP vs Lambda + API Gateway : qui parle HTTP ?"
date: 2026-05-27
---

# Node HTTP vs Lambda + API Gateway : qui parle HTTP ?

## Le modèle classique : Node/Express

Une app Node classique **est** un serveur HTTP. Elle ouvre un socket sur un port, écoute des requêtes, et **écrit** des réponses HTTP directement dans la connexion TCP.

```js
app.get('/users', (req, res) => {
  res.status(500).json({ error: 'boom' });
});
```

Ici, `res` n'est pas un objet à retourner : c'est un flux dans lequel on écrit. Le process Node parle HTTP nativement. Si tu throw sans middleware d'erreur, Express attrape et écrit lui-même un 500 dans le socket.

## Le modèle Lambda : event-driven, pas HTTP

Une Lambda **ne parle pas HTTP**. Elle n'écoute aucun port. C'est une fonction qui :

- reçoit un objet `event` (forme libre selon le trigger)
- retourne un objet (forme libre)

Branchée à SQS, S3, EventBridge : la valeur de retour est ignorée. Seul compte succès ou throw.

```js
export const handler = async (event) => {
  return { anything: 'goes here' };
};
```

## Le pont : API Gateway

Pour exposer une Lambda en HTTP, on intercale **API Gateway** : un reverse proxy managé qui :

1. reçoit la requête HTTP du client
2. la transforme en `event` pour la Lambda
3. lit l'objet retourné
4. le retransforme en réponse HTTP

API Gateway impose alors une **convention de forme** sur le retour :

```js
return {
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ok: true })
};
```

Ce n'est pas du HTTP — c'est un objet JS qui *décrit* une réponse HTTP. C'est API Gateway qui parle HTTP au client.
