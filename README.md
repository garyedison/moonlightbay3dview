# Moonlight Bay

Interactive studio for the Moonlight Bay de Consejo container homes in Belize — beach and canal villas, gate and canal-value cottages, lot catalog, and a 3D walk of the plat.

**Live:** after Vercel publish, the 3D walk is at `/3d` (also `/moonlightbay3dview`).

## What’s in this app

- Beach + canal villa interiors (Caribbean Salt palette)
- Mixed neighborhood bands: beach 196–199, canal 103–107, park 234–239, street 241 / 252–259
- Gate-row and canal-value cottages, furnished $180k–$250k
- 3D dollhouse / walk / inside rooms of every lot
- July 2026 site-map snapshot (confirm current lots with the developer)

Factory quotation, FF&E, and MEP documents are issued privately and are not in this repo.

## Local

```bash
npm install
npm run dev
```

Auth and database are off. `VITE_AUTH_ENABLED=false` is set in `.grok/app-env.json`.

## Vercel

Build command: `npm run build`  
Set env `VITE_AUTH_ENABLED=false` on the project so the public site stays auth-off.
