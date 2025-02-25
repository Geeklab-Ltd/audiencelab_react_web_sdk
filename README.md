# Geeklab AudienceLab SDK

The Geeklab AudienceLab SDK is a powerful tool for integrating audience analytics and event tracking into your React applications.

## Installation

To install the SDK, use npm:

```bash
npm install @geeklab.app/audiencelab-react-web-sdk
```

## Usage

### Initialization

Before using the SDK, you need to initialize it with your API key (string):

```javascript
import { initializeAudiencelab } from "@geeklab.app/audiencelab-sdk";
const apiKey = "YOUR_API_KEY_HERE";
initializeAudiencelab(apiKey)
  .then(({ token, metrics }) => {
    console.log("SDK initialized successfully:", token, metrics);
  })
  .catch((error) => {
    console.error("Failed to initialize SDK:", error);
  });
```

### Sending Custom Events

#### Purchase Event

To send a purchase event, use the `sendCustomPurchaseEvent` function:

```javascript
import { sendCustomPurchaseEvent } from "@geeklab.app/audiencelab-sdk";
sendCustomPurchaseEvent(
  "item123",
  "Premium Subscription",
  9.99,
  "USD",
  "completed"
)
  .then((response) => {
    console.log("Purchase event sent successfully:", response);
  })
  .catch((error) => {
    console.error("Failed to send purchase event:", error);
  });
```

#### Ad Event

To send a ad event, use the `sendCustomAdEvent` function:

```javascript
import { sendCustomAdEvent } from "@geeklab.app/audiencelab-sdk";
sendCustomAdEvent(
  "ad456",
  "Video Ad",
  "YouTube",
  30,
  true,
  "YouTube",
  "Channel1",
  0.5,
  "USD"
)
  .then((response) => {
    console.log("Ad event sent successfully:", response);
  })
  .catch((error) => {
    console.error("Failed to send ad event:", error);
  });
```

## API Reference

```javascript
initializeAudiencelab(apiKey: string): Promise<{ token: string, metrics: any }>
```

Initializes the SDK with the provided API key.

- **apiKey**: Your API key for the Geeklab AudienceLab service.

```javascript
sendCustomPurchaseEvent(id: string, name: string, value: number, currency: string, status: string): Promise<any>
```

Sends a custom purchase event.

- **id**: The ID of the item purchased.
- **name**: The name of the item purchased.
- **value**: The value of the purchase.
- **currency**: The currency of the purchase.
- **status**: The status of the purchase (e.g., 'completed').

```javascript
sendCustomAdEvent(adId: string, name: string, source: string, watchTime: number, reward: boolean, mediaSource: string, channel: string, value: number, currency: string): Promise<any>
```

Sends a custom ad event.

- **adId**: The ID of the ad.
- **name**: The name of the ad.
- **source**: The source of the ad.
- **watchTime**: The watch time of the ad in seconds.
- **reward**: Whether the ad was rewarded.
- **mediaSource**: The media source of the ad.
- **channel**: The channel of the ad.
- **value**: The value associated with the ad.
- **currency**: The currency of the value.

## License

This project is licensed under the terms of the [GEEKLAB SDK EULA](https://github.com/Geeklab-Ltd/audiencelab_unity_sdk/blob/main/LICENSE.md).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or feature requests.

## Support

For support, please contact [support@geeklab.app](mailto:support@geeklab.app).
