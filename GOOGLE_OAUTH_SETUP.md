# Google OAuth Setup Instructions

## Fix "The given origin is not allowed for the given client ID" Error

To fix the Google OAuth origin error, you need to add your frontend URL to the authorized origins in Google Cloud Console:

### Steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **Credentials**
4. Click on your OAuth 2.0 Client ID (the one ending in `.apps.googleusercontent.com`)
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000`
   - `http://localhost:3001` (Vite may use this if 3000 is busy)
   - `http://127.0.0.1:3000`
   - `http://127.0.0.1:3001`
6. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000`
   - `http://localhost:3001`
   - `http://127.0.0.1:3000`
   - `http://127.0.0.1:3001`
7. Click **Save**

### For Production:

When deploying, add your production URLs:
- `https://your-domain.com`
- `https://www.your-domain.com`

### Current Client ID:
```
807666481304-heqm57lec9o5cqisnba8ppke0tt862gs.apps.googleusercontent.com
```

After adding the origins, refresh your browser and try Google login again.
