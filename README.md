# [Furrever Friends](https://www.furreverfriends.net)

## Summary

[FurrEverFriends.net](https://www.furreverfriends.net) features animals that
are available for adoption across the United States. It exposes data from the
[RescueGroups API](https://userguide.rescuegroups.org/display/APIDG/v2) so
that users can search for an animal to adopt.

## Setup

### 1. Clone repository

```bash
  git clone https://github.com/adelgado0723/FurrEverFriends.git
```

### 2. Download npm dependencies

```bash
  npm i
```

### 3. Acquire API keys

- [Rescue Groups API](https://rescuegroups.org/services/request-an-api-key/) - used for pulling animal data
- [Google Maps API](https://developers.google.com/maps/documentation/javascript/get-api-key) - used to get a google map with the location of animals

### 4. Create .env file in the root directory

```bash
  cd FurrEverFriends
```

- Create a file with the name ".env" and place your api keys under the following declarations:

```text
  API_KEY=[YOUR_RESCUE_GROUPS_KEY]
  GOOGLE_API_KEY=[YOUR_GOOGLE_MAPS_KEY]
```

### 5. Start the development server

```bash
  npm run dev
```
