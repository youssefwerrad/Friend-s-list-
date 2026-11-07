# Friends API

A small Express API and browser interface for managing a friends list.

## Run the app

Install dependencies and start the regular API:

```bash
npm ci
npm start
```

Open [http://localhost:5000](http://localhost:5000) to use the frontend.

To run the session-authenticated API instead, use `npm run start_auth` and open
the same URL. The demo login asks for a username and does not use a password.
Only one server mode can use port 5000 at a time.

The list is held in memory, so changes reset when the server restarts.