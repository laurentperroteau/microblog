---
title: "PostgreSQL supporte les transactions DDL, MySQL non"
date: 2026-04-02
---

# PostgreSQL supporte les transactions DDL, MySQL non

Sous PostgreSQL, un `ALTER TABLE` peut être enveloppé dans une transaction. Sous MySQL, il ne peut pas — le DDL provoque un commit implicite immédiat.

Ce que ça change concrètement : si tu fais plusieurs changements de schéma en séquence et que l'un d'eux échoue à mi-chemin, PostgreSQL peut tout rollback. Sous MySQL, ce qui a été appliqué avant l'erreur reste en place — tu te retrouves avec un schéma dans un état partiel.

```sql
BEGIN;
ALTER TABLE orders ADD COLUMN shipped_at TIMESTAMPTZ;
ALTER TABLE orders DROP COLUMN legacy_status;
-- Si ça plante ici, PostgreSQL annule tout. MySQL non.
COMMIT;
```

C'est particulièrement critique lors de migrations : sous MySQL, une migration qui part en vrille peut laisser la base dans un état ni avant ni après.
