# API_CONTRACTS.md

# Principles

- Shared DTOs across platforms
- Strong typing required
- Versioned contracts
- Backward compatibility preferred

---

# Example Task DTO

```ts
interface Task {
  id: string;
  title: string;
  notes?: string;
  dueDate?: string;
  dueTime?: string;
  reminderOffsetMinutes?: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

# Notification Payload

```ts
interface NotificationPayload {
  title: string;
  body: string;
  scheduledAt: string;
}
```
