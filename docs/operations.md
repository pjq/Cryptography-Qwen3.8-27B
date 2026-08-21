# Operations

## Local verification

```sh
node tests/ciphers.test.js
npm run check
git diff --check
python3 -m http.server 8200
curl -I http://127.0.0.1:8200/
```

For browser smoke tests, use a managed browser and confirm that `window.Ciphers.validate()` is true, the canvas renderer is present, the map opens, language toggles, and each activity mounts.

## VPS deployment

The application is static and is served by the existing nginx `chitchat.pjq.me` site. The user account can write the public content directory without root privileges:

```sh
tar czf - --exclude .git . | ssh proxy.pjq.me \
  "mkdir -p /mnt/backup_ssf/chitchat/download/cryptography && tar xzf - -C /mnt/backup_ssf/chitchat/download/cryptography"
curl -fsS https://chitchat.pjq.me/download/cryptography/index.html >/dev/null
```

Do not edit nginx or restart services for this static deployment. Root privileges are unnecessary. If the VPS disk is full, stop and inspect rather than deleting user data; the known stack has chronically constrained disks.

## Cache invalidation

`sw.js` uses `cryptoworld-v1`. Increment the cache name when changing the asset list or when a browser appears to serve stale JavaScript. The service worker is intentionally same-origin and scoped to the app directory.
