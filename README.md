starter for the bpl-app repo using next/react/flask

## Dashboard Preview

![Dashboard Preview](/public/dashboard.png)


TODO:

- navbar? or some navigation back from scheduler
- use github workflows to generate docker images on push?
    - requires more strict branch/PR practices
- note: ngrok.yml is excluded from this repo, it contains the ngrok domain name and api key

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The Flask server will be running on [http://127.0.0.1:5328](http://127.0.0.1:5328) – feel free to change the port in `package.json` (you'll also need to update it in `next.config.js`).