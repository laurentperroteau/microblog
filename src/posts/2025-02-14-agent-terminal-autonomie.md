---
title: Pourquoi un agent de code est plus efficace dans le terminal
date: 2025-02-14
---

# Pourquoi un agent de code est plus efficace dans le terminal

Un agent de code efficace a besoin d'**autonomie**. Et pour être autonome, mieux vaut avoir accès à l'ensemble du système plutôt qu'à un simple projet dans un IDE.

## Le terminal : accès universel

Le terminal n'est pas qu'un outil parmi d'autres. C'est la base même de l'informatique moderne. Les serveurs web, l'infrastructure cloud, les pipelines CI/CD — tout repose sur des systèmes Linux sans interface graphique, pilotés par le terminal.

Un agent dans le terminal a accès à :
- **Bash** : des milliers d'outils en un seul
- **Read / Grep / Glob** : explorer n'importe quel fichier
- **Edit** : modifier le code
- **Task** : déléguer des sous-tâches à d'autres agents

## Bash : l'adaptateur universel

Bash permet à l'agent de composer des outils selon ses besoins : `rg`, `jq`, `pytest`, `npm`... L'agent peut essayer des choses, et si ça ne marche pas, essayer autre chose.

## Exemple concret

Imaginons qu'on demande à l'agent de vérifier un calcul mathématique complexe. Un agent terminal peut :

1. Créer un script Python dans `/tmp`
2. L'exécuter
3. Récupérer le résultat
4. Supprimer le script

```bash
# L'agent peut faire ça spontanément
python3 /tmp/calcul.py && rm /tmp/calcul.py
```

Un agent confiné dans un IDE, scopé sur un seul projet ? Il ne peut pas. Il est limité aux fichiers du projet, sans accès au système.

## La boucle agentique

Au fond, un agent de code suit une boucle simple :

```
while(tool_call):
    execute_tool()
    feed_results_to_model()
    repeat()
```

Mais cette boucle n'a de sens que si les outils disponibles sont puissants. Et le terminal, c'est **tous les outils**.

---

*Source : [Claude Code Deep Dive](https://www.youtube.com/watch?v=RFKCzGlAU6Q&t=3135s)*
