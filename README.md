
# For the Commish

## Installing and running the app
- docker
- that should be all
- possible port issues troubleshooting
- your computer hosts the app. When you shut down your computer or deactivate it, the app is no longer running
    - data is stored locally on your computer in some docker directory somewhere (not important)
    - you receive a blank app which is what others will see when they follow the install steps, ie. they will not see changes made on your computer

TODO: add deployment specifics (shell script, docker config)

## Using the app

Main Point: run the app using steps above and put http://localhost:3000 in your browser during game play for "user mode"; put http://localhost:3000/dashboard in for admin uses (scheduling, season management)

### Scoring Games
- available in user mode or admin
- click "Score Game"
    - select the two teams that played each other and their cups hit
- Scoring Logic:
    - no ties, teams can't play themselves
    - winning team must have >= 10 cups hit
    - Overtime:
        - overtime games are scored 11-10, regardless of the actual cup outcome (winning team with 11 obviously)

### Admin access
- administrative tools will be available at http://localhost:3000/dashboard
    - user mode can be activated from the button at the top
- Creating a new season [admin]
    -  note: this will remove all existing saved data and start a new season
    - Click "Create New Season" and paste the column of team names into the box
        - this should be a bunch of team names separated by a new line in the input box. I recommend Name1/Name2 format
        - unique team names needed obviously
- Using the Scheduling Tool [admin]
    - the scheduling tool will create a schedule with the fewest repeat games possible. It may take a few seconds as it compares thousands of candidate schedules
    - Click on "Scheduling Tool" in green
        - enter the number of weeks your season will be
        - enter the number of groups you would like to have each week
            - a group is a pod of teams that plays every other team in their pod once
    - Click "Save Schedule" if you want to save the displayed schedule to use later
        - if not, adjust the inputs and generate again
    
    

[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-shelbyjm%2Fbpl--app-blue?style=for-the-badge&logo=docker)](https://hub.docker.com/repository/docker/shelbyjm/bpl-app/general)

    
## Dashboard v1.0

![Dashboard Preview](/public/dashboard.png)



# For Developers:

TODO:

- navbar? or some navigation back from scheduler
- use github workflows to generate docker images on push?
    - requires more strict branch/PR practices
- note: ngrok.yml is excluded from this repo, it contains the ngrok domain name and api key
- recent games tab bottom right
    - add/remove games as admin
    - recalculate elos (sequential calculation)
    - may need to add timestamp to game entries

## Getting Started

### Clone the repo and navigate to the bpl-app directory in your terminal 

for the next steps, follow the instructions in the terminal or look it up if you receive errors. For example, you may not have npm or python installed already.

### For the frontend (nextjs/react):

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Developer: If you want to use a virtual environment (Flask/Python):

**Create a virtual environment (optional):**
   ```bash
   python3 -m venv pyenv
   ```

**Activate the virtual environment:**

On Windows:
```bash
.\venv\Scripts\activate
```
On Unix or MacOS:
```bash
source venv/bin/activate
```

**Then run "npm run dev" which will install the dependencies and run the backend**

The Flask server will be running on [http://127.0.0.1:5328](http://127.0.0.1:5328) – feel free to change the port in `package.json` (you'll also need to update it in `next.config.js`).

## Dev quickstart

- Flask backend is in the `/api` directory
    - all endpoints found in `index.py`
        - same as app.py in some flask deployments
    - persisted data volumes in `/api/data`
- frontend is in `/app`
    - with NextJS, the routing is determined by the directory structure within this folder
    - all pages in this folder inherit from `/app/layout.tsx`
- deployment
    - still figuring out the best way to do this ...
    - initial thinking is docker images
        - frontend
        - backend
        - ngrok 
            - exposes localhost to the web, reachable from other devices
    - this works but not sure if its easiest option for non technical users (bums)