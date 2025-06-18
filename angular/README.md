# Geeklab AudienceLab Angular SDK

This folder contains an experimental Angular service that mirrors the functionality of the React SDK.

## Installation

```
npm install @geeklab.app/audiencelab-angular-sdk
```

## Usage

Import the `AudienceLabService` and inject it into your Angular components or services.

```typescript
import { AudienceLabService } from '@geeklab.app/audiencelab-angular-sdk';

constructor(private audienceLab: AudienceLabService) {}

ngOnInit() {
  this.audienceLab.initialize('YOUR_API_KEY');
}
```

The API methods are identical to the React version:

- `initialize(apiKey: string)`
- `sendCustomPurchaseEvent(...)`
- `sendCustomAdEvent(...)`

## Testing

Run the tests inside this directory with:

```
npm test
```
