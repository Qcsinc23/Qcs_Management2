# Comprehensive Content Security Policy (CSP) Guide

## Table of Contents
1. [Introduction to CSP](#introduction)
2. [Common CSP Errors](#common-errors)
3. [Specific Scenarios](#specific-scenarios)
4. [Configuration Examples](#configuration)
5. [Best Practices](#best-practices)
6. [Testing & Deployment](#testing-deployment)
7. [Troubleshooting](#troubleshooting)

## Introduction to CSP
Content Security Policy (CSP) is a security standard that helps prevent various types of attacks by controlling which resources can be loaded and executed on a web page.

### Key Directives
- `default-src`: Fallback for other directives
- `script-src`: Controls JavaScript sources
- `style-src`: Controls CSS sources
- `img-src`: Controls image sources
- `connect-src`: Controls fetch/XHR sources
- `frame-src`: Controls frame/iframe sources
- `font-src`: Controls font sources
- `object-src`: Controls plugin sources
- `base-uri`: Controls base URL
- `form-action`: Controls form submission targets

## Common CSP Errors

### 1. Inline Style Violations
**Problem:** Browser blocks inline styles
**Root Cause:** Missing `style-src` or `unsafe-inline` directive
**Solution:**
```javascript
// In your CSP header
Content-Security-Policy: style-src 'self' 'unsafe-inline';
```
**Best Practice:** Use external stylesheets or hash/nonce-based inline styles

### 2. Connection Source Restrictions
**Problem:** API requests blocked
**Root Cause:** Missing `connect-src` directive
**Solution:**
```javascript
Content-Security-Policy: connect-src 'self' https://api.example.com;
```
**Best Practice:** Whitelist specific API endpoints

### 3. Frame Ancestor Policies
**Problem:** Page embedding blocked
**Root Cause:** Missing `frame-ancestors` directive
**Solution:**
```javascript
Content-Security-Policy: frame-ancestors 'self' https://trusted-site.com;
```
**Best Practice:** Restrict embedding to trusted domains

## Specific Scenarios

### Stripe.js Integration
```javascript
Content-Security-Policy:
  script-src 'self' https://js.stripe.com https://cdn.firebase.com https://cdn.supabase.com;
  frame-src 'self' https://js.stripe.com https://secure.clerk.com;
  connect-src 'self' https://api.stripe.com https://*.supabase.co https://*.firebaseio.com https://*.clerk.com;
```

### Clerk Authentication

#### Development vs Production Keys
Clerk uses different keys for development and production environments. These keys should be managed securely and configured appropriately in your CSP.

**Development Environment:**
```javascript
Content-Security-Policy:
  script-src 'self' https://cdn.clerk.dev;
  connect-src 'self' https://api.clerk.dev;
  frame-src 'self' https://secure.clerk.dev;
```

**Production Environment:**
```javascript
Content-Security-Policy:
  script-src 'self' https://cdn.clerk.com;
  connect-src 'self' https://api.clerk.com;
  frame-src 'self' https://secure.clerk.com;
```

#### Key Management Best Practices
1. Store Clerk keys in environment variables
2. Never commit keys to version control
3. Use different keys for development and production
4. Restrict API access using Clerk's dashboard settings
5. Regularly rotate keys
6. Use Clerk's key permissions system to limit access

#### Security Considerations
- Development keys should only be used in local environments
- Production keys should have strict CSP rules
- Use Clerk's webhook verification for additional security
- Implement rate limiting on Clerk endpoints
- Monitor key usage through Clerk's dashboard

### React DevTools
```javascript
Content-Security-Policy:
  script-src 'self' 'unsafe-eval'; // Required for React DevTools
```

## Configuration Examples

### Basic CSP Header
```javascript
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://js.stripe.com https://cdn.firebase.com https://cdn.supabase.com https://cdn.clerk.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  connect-src 'self' https://api.stripe.com https://*.supabase.co https://*.firebaseio.com https://api.clerk.com;
  frame-src 'self' https://js.stripe.com https://secure.clerk.com;
  object-src 'none';
```

### Production-Ready CSP
```javascript
Content-Security-Policy:
  default-src 'none';
  script-src 'self' https://js.stripe.com https://cdn.firebase.com https://cdn.supabase.com https://cdn.clerk.com;
  style-src 'self';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self' https://api.stripe.com https://*.supabase.co https://*.firebaseio.com https://api.clerk.com;
  frame-src 'self' https://js.stripe.com https://secure.clerk.com;
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
```

## Best Practices

1. Start with restrictive policies and gradually relax them
2. Use nonces or hashes for inline scripts/styles
3. Regularly audit your CSP
4. Implement reporting with `report-uri`
5. Use `Content-Security-Policy-Report-Only` in development
6. Keep directives specific and minimal
7. Regularly update allowed sources

## Testing & Deployment

### Testing Procedure
1. Start with `Content-Security-Policy-Report-Only`
2. Monitor browser console for violations
3. Gradually implement restrictions
4. Use automated testing tools

### Deployment Checklist
- [ ] Verify all directives
- [ ] Test in staging environment
- [ ] Implement reporting
- [ ] Monitor production logs
- [ ] Document all policies

## Troubleshooting

1. Check browser console for CSP violations
2. Use `report-uri` to collect violation reports
3. Verify all sources are properly whitelisted
4. Check for missing directives
5. Test with different browsers
6. Use online CSP validators

## Quick Reference

| Directive         | Example Value                     |
|-------------------|-----------------------------------|
| default-src       | 'self'                           |
| script-src        | 'self' 'nonce-abc123'            |
| style-src         | 'self' 'unsafe-inline'           |
| img-src           | 'self' data:                     |
| connect-src       | 'self' https://api.example.com   |
| frame-src         | 'none'                           |
| font-src          | 'self' https://fonts.example.com |
| object-src        | 'none'                           |
| base-uri          | 'self'                           |
| form-action       | 'self'                           |

## Official Documentation
- [MDN Web Docs: CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Google CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [CSP Reference](https://content-security-policy.com/)
