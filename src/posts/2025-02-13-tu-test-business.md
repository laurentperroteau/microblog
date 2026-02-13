---
title: Ne pas tester l'implémentation dans les tests unitaires
date: 2025-02-11
---

# Ne pas tester l'implémentation dans les tests unitaires

## ❌ DON'T

```typescript
it('should compute total spent', async () => {
  const findUserById = vi.fn().mockResolvedValue({ id: 1, firstName: 'John', lastName: 'Doe' });
  const findUserOrders = vi.fn().mockResolvedValue([{ total: 100 }, { total: 50 }]);

  await getUserProfile({ userId: 1, findUserById, findUserOrders });

  expect(findUserById).toHaveBeenCalledWith(1);       // ❌
  expect(findUserOrders).toHaveBeenCalledWith(1);     // ❌
});
```

## ✅ DO

```typescript
it('should return user profile with computed fields', async () => {
  const result = await getUserProfile({
    userId: 1,
    findUserById: vi.fn().mockResolvedValue({ id: 1, firstName: 'John', lastName: 'Doe', birthDate: '1990-01-15' }),
    findUserOrders: vi.fn().mockResolvedValue([{ total: 100 }, { total: 50 }])
  });

  expect(result).toEqual({
    id: 1,
    fullName: 'John Doe',
    age: 36,
    totalSpent: 150  // ✅ Documente une règle métier
  });
});
```

**Pourquoi ?**

- `expect(result.totalSpent).toBe(150)` documente une règle métier. `expect(findUserById).toHaveBeenCalled()` ne documente rien d'utile.
- Un test de comportement reste valide tant que le besoin métier n'a pas changé. Un test d'implémentation doit être réécrit à chaque refactoring — coût de maintenance sans valeur ajoutée.
