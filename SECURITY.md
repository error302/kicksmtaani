# Security Policy

## Security Measures

### HTTP Security Headers

The application enforces the following security headers on all routes:

- **X-Frame-Options: DENY** - Prevents clickjacking by denying iframe embedding
- **X-Content-Type-Options: nosniff** - Prevents MIME-type sniffing
- **Referrer-Policy: strict-origin-when-cross-origin** - Controls referrer information leakage
- **X-XSS-Protection: 1; mode=block** - Enables browser XSS filtering
- **Permissions-Policy** - Disables camera, microphone, and geolocation APIs

### Authentication

- JWT-based authentication via HTTP-only cookies
- Password hashing with bcrypt
- Role-based access control (RBAC)

### API Security

- CORS restricted to allowed origins
- Rate limiting on authentication endpoints
- Input validation and sanitization
- MongoDB injection prevention

### Image Optimization

- AVIF and WebP formats enabled for optimal compression
- Restricted image domains to trusted sources

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly by emailing the maintainers directly. Do not open a public issue.
