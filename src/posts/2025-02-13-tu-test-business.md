---
title: Ne pas tester l'implémentation dans les tests unitaires
date: 2025-02-11
---

# Ne pas tester l'implémentation dans les tests unitaires

## ❌ DON'T: Tester les détails d'implémentation

```typescript
it('should call findUserById', async () => {
  const findUserById = vi.fn().mockResolvedValue(mockUser());

  await getUserProfile({ userId: 1, findUserById });

  expect(findUserById).toHaveBeenCalledWith(1); // ❌
});
```

**Pourquoi c'est problématique ?** Si vous refactorisez le service (changez l'ordre des appels, ajoutez un cache, renommez une méthode), le test échoue alors que la **logique métier est toujours correcte**. Les tests deviennent un frein au refactoring.

---

## ✅ DO: Tester les valeurs de retour

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
    totalSpent: 150
  });
});
```

**Pourquoi c'est mieux ?** Vous pouvez refactoriser librement l'implémentation tant que le **comportement** (entrée → sortie) reste le même.

---

## ❌ DON'T: Mettre les effets de bord dans le service

```typescript
async function createOrder(params: {
  orderData: OrderInput;
  saveOrder: (order: Order) => Promise<Order>;
  sendConfirmationEmail: () => Promise<void>;  // ❌ side effect
  logger: (msg: string) => void;               // ❌ side effect
}) {
  const order = await params.saveOrder(params.orderData);
  await params.sendConfirmationEmail();
  params.logger('Order created');
  return order.id;
}
```

---

## ✅ DO: Retourner des données, laisser l'appelant gérer les effets de bord

```typescript
// Service returns data
async function createOrder(params: {
  orderData: OrderInput;
  saveOrder: (order: Order) => Promise<Order>;
  findProductById: (id: number) => Promise<Product>;
}): Promise<{ orderId: number; userEmail: string }> {
  const product = await params.findProductById(params.orderData.productId);
  const order = await params.saveOrder({ ...params.orderData, price: product.price });
  return { orderId: order.id, userEmail: order.userEmail };
}

// Handler (route) handles side effects
app.post('/orders', async (req, res) => {
  const result = await createOrder({
    orderData: req.body,
    saveOrder: OrderRepo.save,
    findProductById: ProductRepo.findById
  });

  await sendConfirmationEmail(result.userEmail);  // Side effect in handler
  console.log('Order created:', result.orderId);  // Log in handler

  res.json({ id: result.orderId });
});
```

---

## Résumé

| ❌ Don't | ✅ Do |
|----------|-------|
| `expect(mock).toHaveBeenCalled()` | `expect(result).toEqual(...)` |
| Effets de bord dans le service | Le service retourne des données |
| Tester l'implémentation | Tester le comportement (entrée → sortie) |
