Deployment steps (quick)

1) Local build (frontend)

   - From project root:

```bash
cd frontend
npm install
npm run build
```

2) Copy frontend build into backend (so Express serves it)

```bash
rm -rf ../backend/client
mkdir -p ../backend/client
cp -r dist/* ../backend/client/
```

3) Start backend (provide `MONGO_URI` and other env vars)

```bash
cd ../backend
export MONGO_URI="your_mongo_uri"
export NODE_ENV=production
node server.js
```

Windows (PowerShell) replacement for export:

```powershell
$env:MONGO_URI = 'your_mongo_uri'
$env:NODE_ENV = 'production'
node server.js
```

4) Docker (build and run)

```bash
docker build -t lms-app .
docker run -e MONGO_URI='your_mongo_uri' -p 5000:5000 lms-app
```

5) Cloud deployment options

- Use a container host (Railway, Render, Fly, AWS ECS, Azure Container Instances).
- Or deploy frontend separately to Vercel/Netlify and backend to Railway/Render/Heroku.

Notes
- Keep sensitive values like `MONGO_URI` and `JWT_SECRET` in your host's secret/env settings — do NOT commit `.env` to source control.
- If you deploy frontend separately, update `src/api/axios.js` base URL to point to your backend production URL.
