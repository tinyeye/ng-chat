# Migration Guide: Angular 16 → Angular 18

This guide helps you migrate from the previous version (Angular 16) to the new Angular 18 compatible version of ng-chat.

## Breaking Changes

### 1. Node.js Version Requirement
- **Before**: Node.js 10+
- **After**: Node.js 18.13.0+ (recommended: 20.x LTS)

### 2. Angular Version Requirement  
- **Before**: Angular 16.x
- **After**: Angular 18.x

### 3. TypeScript Version
- **Before**: TypeScript 5.1
- **After**: TypeScript 5.4+

### 4. HTTP Client Changes
The `HttpClientModule` has been deprecated in favor of the new `provideHttpClient()` function.

**Before:**
```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule],
  // ...
})
```

**After:**
```typescript
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  providers: [provideHttpClient()],
  // ...
})
```

### 5. Standalone Components Support
Angular 18 encourages the use of standalone components. While the traditional module approach still works, we recommend migrating to standalone components:

**Traditional (still supported):**
```typescript
@NgModule({
  imports: [NgChatModule],
  // ...
})
```

**Standalone (recommended):**
```typescript
@Component({
  standalone: true,
  imports: [NgChatModule],
  // ...
})
```

## Development Changes

### 1. Linting: TSLint → ESLint
- **Removed**: TSLint configuration (`tslint.json`)
- **Added**: ESLint configuration (`eslint.config.js`)
- **New command**: `ng lint` now uses ESLint

### 2. E2E Testing: Protractor → Cypress
- **Removed**: Protractor configuration
- **Added**: Cypress configuration (`cypress.config.ts`)
- **New commands**: 
  - `npm run e2e` (headless)
  - `npm run e2e:open` (interactive)

### 3. Build System Updates
- New application builder for improved performance
- Updated TypeScript configuration for better type checking
- Modernized package.json with engine requirements

## Migration Steps

### Step 1: Update Dependencies
Update your project's dependencies to meet the new requirements:

```bash
# Update Node.js to 20.x LTS
# Update Angular CLI
npm install -g @angular/cli@18

# Update your project
ng update @angular/core @angular/cli
```

### Step 2: Update HttpClient Usage
Replace `HttpClientModule` imports with `provideHttpClient()`:

```typescript
// Remove this import
import { HttpClientModule } from '@angular/common/http';

// Add this import
import { provideHttpClient } from '@angular/common/http';

// Update your module
@NgModule({
  imports: [
    // Remove: HttpClientModule
  ],
  providers: [
    provideHttpClient() // Add this
  ]
})
```

### Step 3: Consider Standalone Components
For new components or when refactoring, consider using standalone components:

```typescript
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgChatModule],
  template: '<ng-chat [adapter]="adapter" [userId]="userId"></ng-chat>'
})
export class ChatComponent {
  // ...
}
```

### Step 4: Update Development Workflow
1. **Linting**: Use `ng lint` (now with ESLint)
2. **E2E Testing**: Use `npm run e2e` or `npm run e2e:open`
3. **Building**: Use `ng build` (now with new application builder)

## New Features Available

### Angular 18 Control Flow Syntax
You can now use the new Angular control flow syntax in your templates:

**Before:**
```html
<div *ngIf="showChat">
  <ng-chat [adapter]="adapter" [userId]="userId"></ng-chat>
</div>

<div *ngFor="let message of messages">
  {{ message.content }}
</div>
```

**After (optional but recommended):**
```html
@if (showChat) {
  <ng-chat [adapter]="adapter" [userId]="userId"></ng-chat>
}

@for (message of messages; track message.id) {
  <div>{{ message.content }}</div>
}
```

### Improved Performance
- Faster builds with new application builder
- Better tree-shaking and bundle optimization
- Improved development server with HMR support

### Better Type Safety
- Stricter TypeScript configuration
- Enhanced type checking for templates
- Better IntelliSense support

## Compatibility Notes

### Backward Compatibility
- All existing ng-chat APIs remain the same
- Your chat adapters will continue to work without changes
- Component inputs and outputs are unchanged

### Testing Compatibility
- Unit tests should continue to work with minimal changes
- E2E tests will need to be rewritten for Cypress (if you had custom Protractor tests)

## Troubleshooting

### Common Issues

**1. Node.js Version Mismatch**
```
Error: This version of Angular requires Node.js version 18.13.0 or higher
```
**Solution**: Update to Node.js 20.x LTS

**2. TypeScript Compilation Errors**
```
Error: TypeScript version mismatch
```
**Solution**: Update TypeScript to 5.4+ in your project

**3. ESLint Configuration Issues**
```
Error: Cannot find module '@angular-eslint/...'
```
**Solution**: Install ESLint dependencies:
```bash
ng add @angular-eslint/schematics
```

**4. Build Errors with New Builder**
**Solution**: Update your `angular.json` configuration (this should be done automatically by `ng update`)

## Support

If you encounter issues during migration:

1. Check the [UPGRADE_PLAN.md](./UPGRADE_PLAN.md) for detailed technical information
2. Review the [README.md](./README.md) for updated setup instructions
3. Open an issue on [GitHub](https://github.com/tinyeye/ng-chat/issues) with:
   - Your Angular version
   - Node.js version
   - Error messages
   - Steps to reproduce

## Benefits of Upgrading

- **Performance**: Faster builds and runtime performance
- **Developer Experience**: Better tooling and debugging
- **Security**: Latest security patches and updates
- **Future-proofing**: Stay current with Angular ecosystem
- **Modern Features**: Access to latest Angular 18 features
- **Better Testing**: Improved testing tools and workflows