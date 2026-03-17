export interface UserSyncedEvent {
  readonly eventName: "auth.user.synced";
  readonly userId: string;
  readonly occurredAt: string;
}
