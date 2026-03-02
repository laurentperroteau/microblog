---
title: "Décorateurs TypeScript : pourquoi esbuild ne suffit pas"
date: 2025-03-02
---

# Décorateurs TypeScript : pourquoi esbuild ne suffit pas

Les frameworks comme NestJS, Angular ou TypeORM reposent sur les décorateurs TypeScript. Derrière un simple `@Decorator`, deux mécanismes distincts opèrent :

1. **Transpilation syntaxique** : transformer `@Decorator` en JavaScript
2. **Émission de métadonnées** (`emitDecoratorMetadata`) : injecter automatiquement les informations de types via `reflect-metadata`

## Ce que dit la spec ECMAScript

Les décorateurs sont en Stage 3 au TC39. Une proposition séparée (Decorator Metadata, aussi Stage 3) permet aux décorateurs de stocker *explicitement* des métadonnées à l'exécution.

Mais **l'émission automatique des métadonnées de types** — celle qu'utilisent NestJS et TypeORM — est une fonctionnalité spécifique à TypeScript. Elle n'est pas dans la spec et ne le sera probablement jamais.

## Le problème avec esbuild

esbuild supporte la syntaxe des décorateurs, mais refuse d'émettre les métadonnées de types — logique, puisque ce n'est pas dans la spec JavaScript.

Sans ces métadonnées, l'injection de dépendances et le mapping ORM échouent à l'exécution.

## Comment contourner le problème

Deux approches :

**1. Utiliser SWC au lieu d'esbuild**

SWC (Speedy Web Compiler), écrit en Rust, offre des performances similaires à esbuild mais supporte l'émission des métadonnées TypeScript. C'est l'approche choisie par NestJS v12.

**2. Couche de compatibilité avec esbuild**

Angular utilise esbuild dans son nouveau build system, mais ajoute une couche de transformation pour gérer les décorateurs avec métadonnées.

Pour tout projet utilisant des décorateurs avec injection de dépendances ou ORM, le choix du bundler n'est plus anodin.
