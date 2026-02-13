---
title: Ne pas tester l'implémentions dans les tests unitaires
date: 2025-02-11
---

# Ne pas tester l'implémentions dans les tests unitaires

## ❌ DON'T: Test implementation details

```typescript
it('should call findUserById', async () => {
  const findUserById = vi.fn().mockResolvedValue(mockUser());

  await getUserProfile({ userId: 1, findUserById });

  expect(findUserById).toHaveBeenCalledWith(1); // ❌
});
```

**Why is this bad?** If you refactor the service (change call order, add cache, rename method), the test breaks even though the **business logic is still correct**. Tests become a barrier to refactoring.

---

## ✅ DO: Test return values

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

**Why is this good?** You can freely refactor the implementation as long as the **behavior** (input → output) stays the same.

---

## ❌ DON'T: Put side effects in the service

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

## ✅ DO: Return data, let caller handle side effects

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

## Summary

| ❌ Don't | ✅ Do |
|----------|-------|
| `expect(mock).toHaveBeenCalled()` | `expect(result).toEqual(...)` |
| Side effects in service | Service returns data |
| Test implementation | Test behavior (input → output) |
