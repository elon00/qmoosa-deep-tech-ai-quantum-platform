# Security Specification & Threat Model

## 1. Data Invariants
- `handshake_logs`: Must contain valid `status`, `clientPublicX25519`, and `createdAt` strings.
- Only authenticated users (including anonymous authenticated users) can write session handshake records.
- Document IDs must conform to `isValidId()` limits (alphanumeric, dashes, underscores up to 128 chars).

## 2. Security Test Scenarios
1. Unauthenticated write attempt to `/handshake_logs/{logId}` -> `PERMISSION_DENIED`.
2. Malformed payload exceeding field `maxLength` -> `PERMISSION_DENIED`.
3. Injected path variable with bad characters (e.g., `<script>` in logId) -> `PERMISSION_DENIED`.
