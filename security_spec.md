# Security Specification

## 1. Data Invariants
1. **User Profile Invariant**: A user document at `/users/{userId}` can only be read, created, or updated by the authenticated user whose `request.auth.uid == userId`. PII (address, email, phone) is strictly private to the user.
2. **Order Invariant**: An order document at `/orders/{orderId}` must have `incoming().userId == request.auth.uid`. A user can only view their own orders (`resource.data.userId == request.auth.uid`). Once created, orders cannot be tampered with or deleted by clients.
3. **Product Invariant**: Products at `/products/{productId}` can be read and listed publicly by all store visitors. Write operations are restricted to prevent unauthorized catalog manipulation.

## 2. The Dirty Dozen Payloads (Targeting Exploits)
1. **Payload 1 (User ID Spoofing)**: Attacker attempts to write to `/users/victim_123` with `userId: "victim_123"` while authenticated as `attacker_456`. (Expected: PERMISSION_DENIED)
2. **Payload 2 (Unauthenticated User Read)**: Anonymous unauthenticated client attempts to read `/users/user_abc`. (Expected: PERMISSION_DENIED)
3. **Payload 3 (PII Snoop Attack)**: Authenticated user `user_1` attempts to read `/users/user_2`. (Expected: PERMISSION_DENIED)
4. **Payload 4 (Ghost Field Injection)**: User attempts to inject `isAdmin: true` into `/users/{userId}`. (Expected: PERMISSION_DENIED)
5. **Payload 5 (Order User ID Spoofing)**: User `user_1` attempts to place an order with `userId: "user_2"`. (Expected: PERMISSION_DENIED)
6. **Payload 6 (Order List Snooping)**: User `user_1` attempts to list orders without `where('userId', '==', 'user_1')` or query `user_2`'s orders. (Expected: PERMISSION_DENIED)
7. **Payload 7 (Order Tampering)**: User attempts to modify `status` to "delivered" or change price after an order is placed. (Expected: PERMISSION_DENIED)
8. **Payload 8 (Product Price Modification)**: Customer attempts to update product price to $0.01 at `/products/prod-1`. (Expected: PERMISSION_DENIED)
9. **Payload 9 (Product Injection)**: Customer attempts to create malicious product entries. (Expected: PERMISSION_DENIED)
10. **Payload 10 (Oversized Payload Exhaustion)**: User attempts to upload a 50MB string into user profile. (Expected: PERMISSION_DENIED)
11. **Payload 11 (ID Traversal / Special Char Attack)**: User attempts to target a document ID with path traversal or invalid symbols like `../../secrets`. (Expected: PERMISSION_DENIED)
12. **Payload 12 (Negative Total Order)**: User attempts to place an order with negative total amount. (Expected: PERMISSION_DENIED)
