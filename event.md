# 🎟️ Event Model Reference

This document explains the structure and meaning of each field in the `IEvent` interface.  
It describes how data is stored and where it comes from when integrating with **Ticketmaster APIs** (Discovery, Availability/Offers).

---

## 🏷️ Basic Fields

| Field        | Type      | Description                                                                     |
| ------------ | --------- | ------------------------------------------------------------------------------- |
| **\_id**     | `string`  | MongoDB internal ID. Automatically generated.                                   |
| **id**       | `string`  | Ticketmaster event ID (e.g., `G5diZfkn0B-bh`). Always required and unique.      |
| **title**    | `string`  | Public event name (e.g., "MxPx Live in Québec").                                |
| **detail**   | `string`  | Long description of the event, usually from `info` in the Discovery API.        |
| **notes**    | `string`  | Additional notes such as venue restrictions or disclaimers (from `pleaseNote`). |
| **url**      | `string`  | Ticketmaster event URL where users can view or purchase tickets.                |
| **locale**   | `string`  | Language and region format code (e.g., `en-us`).                                |
| **test**     | `boolean` | Indicates whether this is a test event in Ticketmaster’s sandbox.               |
| **type**     | `string`  | Type of object; usually `"event"`.                                              |
| **status**   | `string`  | Current sales status (e.g., `onsale`, `offsale`, `soldout`).                    |
| **timezone** | `string`  | Event timezone (e.g., `America/New_York`).                                      |

---

## 🗺️ Location Fields

| Field            | Type                                         | Description                                                |
| ---------------- | -------------------------------------------- | ---------------------------------------------------------- |
| **country**      | `string`                                     | Full country name of the venue.                            |
| **country_code** | `string`                                     | ISO 2-letter country code (e.g., `US`, `CA`).              |
| **region**       | `string`                                     | Region or state name (e.g., `New York`).                   |
| **region_code**  | `string`                                     | Region or state code (e.g., `NY`).                         |
| **address**      | `string`                                     | Full textual address of the venue.                         |
| **coordinate**   | `{ longitude, latitude }`                    | Geographic coordinates of the venue (floats).              |
| **loc**          | `{ type: "Point", coordinates: [lon, lat] }` | GeoJSON representation used for MongoDB 2dsphere queries.  |
| **venue**        | `Record<string, unknown>`                    | Raw venue object returned by Ticketmaster (kept flexible). |

---

## 🕓 Timing Fields

| Field                         | Type                                          | Description                                                      |
| ----------------------------- | --------------------------------------------- | ---------------------------------------------------------------- |
| **opening_date**              | `Date`                                        | Event start date/time (UTC). Mapped from `dates.start.dateTime`. |
| **end_date**                  | `Date`                                        | Event end date/time, if applicable.                              |
| **doors_time**                | `Date`                                        | When venue doors open (`doorsTimes.dateTime` in Discovery).      |
| **salesPublic.startDateTime** | `Date`                                        | When public ticket sales begin.                                  |
| **salesPublic.endDateTime**   | `Date`                                        | When public ticket sales end.                                    |
| **salesPresales[]**           | `Array<{ name, startDateTime, endDateTime }>` | Optional presale windows (e.g., VIP or fan-club presales).       |

---

## 🎟️ Ticketing & Access

| Field                                    | Type      | Description                                            |
| ---------------------------------------- | --------- | ------------------------------------------------------ |
| **ticketLimit.globalLimit**              | `number`  | Maximum number of tickets per user (if parsed).        |
| **ticketLimit.accessibilityLimit**       | `number`  | Ticket limit for accessibility sections.               |
| **ticketLimit.info**                     | `string`  | Original limit text message.                           |
| **seatmap.staticUrl**                    | `string`  | URL to a static image of the venue seat map.           |
| **ticketing.safeTixEnabled**             | `boolean` | Whether SafeTix (secure mobile ticketing) is enabled.  |
| **ticketing.allInclusivePricingEnabled** | `boolean` | Whether all-inclusive pricing is used (fees included). |

---

## 💰 Pricing & Availability

| Field                                    | Type                                    | Description                                                                                             |
| ---------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **priceRanges[]**                        | Array of `{ type, currency, min, max }` | Basic price info from the Discovery API, per ticket type (e.g., `standard`, `vip`).                     |
| **offers[]**                             | Array of `IOffer`                       | Detailed offers from the Availability API, including min/max price, resale status, and inventory count. |
| **availability.status**                  | `string`                                | High-level availability status (`onsale`, `soldout`, etc.).                                             |
| **availability.hasInventory**            | `boolean`                               | Whether any tickets are currently purchasable.                                                          |
| **availability.currency**                | `string`                                | Default currency for this event (e.g., `USD`, `CAD`).                                                   |
| **availability.primaryMin / primaryMax** | `number`                                | Lowest and highest prices in the primary market.                                                        |
| **availability.resaleMin / resaleMax**   | `number`                                | Lowest and highest prices in the resale market.                                                         |
| **availability.totalAvailable**          | `number`                                | Total ticket count available (if provided).                                                             |
| **availability.checkedAt**               | `Date`                                  | Timestamp of the last availability refresh.                                                             |
| **availability.source**                  | `string`                                | Origin of availability data (e.g., `inventory-status`, `partner-availability`).                         |

---

## 🧭 Classification & Metadata

| Field                              | Type       | Description                                                 |
| ---------------------------------- | ---------- | ----------------------------------------------------------- |
| **classifications.segment**        | `string`   | Top-level category (e.g., `"Music"`, `"Sports"`).           |
| **classifications.genre**          | `string`   | Genre (e.g., `"Rock"`, `"Football"`).                       |
| **classifications.subGenre**       | `string`   | Sub-genre or style (e.g., `"Alternative Rock"`).            |
| **classifications.type / subType** | `string`   | Additional classification layers if provided.               |
| **classifications.primary**        | `boolean`  | Whether this classification is the primary one.             |
| **category**                       | `string`   | Internal categorization (optional, for your app).           |
| **subcategories[]**                | `string[]` | Additional internal tags for searching/filtering.           |
| **vibe[]**                         | `string[]` | Optional mood/style tags (e.g., `"energetic"`, `"casual"`). |
| **venue_type[]**                   | `string[]` | Venue type tags (e.g., `"stadium"`, `"club"`).              |

---

## 🎭 Related Entities

| Field             | Type                         | Description                                             |
| ----------------- | ---------------------------- | ------------------------------------------------------- |
| **attractions[]** | Array of `{ id, name, url }` | Performing artists or teams associated with the event.  |
| **promoterId**    | `string`                     | ID of the promoter organizing the event (if available). |

---

## 🖼️ Media

| Field        | Type                                               | Description                                                                          |
| ------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **image**    | `string`                                           | Primary or hero image URL.                                                           |
| **images[]** | Array of `{ ratio, url, width, height, fallback }` | All image variants returned by Ticketmaster (different aspect ratios & resolutions). |

---

## 🧠 System & Internal

| Field                 | Type     | Description                                              |
| --------------------- | -------- | -------------------------------------------------------- |
| **availability_hint** | `string` | Helper field to optimize queries for available events.   |
| **lastSyncedAt**      | `Date`   | When the event record was last synced from Ticketmaster. |
| **createdAt**         | `Date`   | Auto-generated timestamp when record created in MongoDB. |
| **updatedAt**         | `Date`   | Auto-generated timestamp when record last updated.       |

---

## 🔗 Relationships Between Fields

- `id` → primary key for external data sync (Ticketmaster event ID).
- `offers[]` and `availability` are **dynamic** and can be refreshed independently from the static Discovery event data.
- `salesPublic` and `salesPresales` define **when** users can purchase.
- `ticketLimit`, `seatmap`, and `ticketing` define **how** users can purchase.

---

## 🧾 Example Snapshot

```json
{
  "id": "1ad7Zbtx4e3Zd5F8",
  "title": "MxPx",
  "status": "onsale",
  "opening_date": "2025-10-25T00:00:00Z",
  "doors_time": "2025-10-24T23:00:00Z",
  "salesPublic": {
    "startDateTime": "2025-05-02T14:00:00Z",
    "endDateTime": "2025-10-25T02:00:00Z"
  },
  "ticketLimit": {
    "globalLimit": 8,
    "info": "Global limit of 8 tickets per event"
  },
  "seatmap": {
    "staticUrl": "https://mapsapi.tmol.io/maps/geometry/3/event/..."
  },
  "ticketing": { "safeTixEnabled": true },
  "priceRanges": [
    { "type": "standard", "currency": "CAD", "min": 50, "max": 120 }
  ],
  "availability": {
    "status": "onsale",
    "hasInventory": true,
    "currency": "CAD",
    "primaryMin": 50,
    "primaryMax": 120
  }
}
```
