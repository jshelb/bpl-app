
# For the Commish

### Running the App

1. **Install Docker**:
   - Before running the app, make sure you have Docker installed. You can download and install Docker from [here](https://docs.docker.com/engine/install/).
   - you can easily check if you have docker by checking your system for the Docker desktop app (search your applications)

2. **Download the App Bundle**:
   - Download the app bundle [StartApp.zip](StartApp.zip). This bundle includes the necessary scripts and configurations for running the app.
   - After downloading `StartApp.zip`, unzip the bundle to extract its contents. You can typically do this by double-clicking the zip file or using a utility like `unzip` on the command line.


3. **Run the App**:
   - Open `start.sh` with Terminal to run the app.
   - If you encounter issues opening `start.sh`, follow these steps:
     - Right-click on `start.sh`.
     - Choose "Open With" -> "Other" -> "All Applications" -> Select "Terminal" -> Check "Always Open With".
   - Running `start.sh` will start the app and open a browser window. Refresh the browser to view the app.

4. **Stop the App**:
   - To stop the app, open `stop.sh` with Terminal using the same steps outlined above for `start.sh`.
   - Running `stop.sh` will gracefully stop the app and clean up any resources it was using.



## Admin Dashboard v2

![Admin Dashboard Preview](/public/adminv2.png)

## User Dashboard v2

![User Dashboard Preview](/public/userv2.png)

### (Deprecated - see above for updated info) Installation and Running the App 

- **Requirements**: Docker
- Simply follow these steps:
    1. Install Docker.
    2. download the `docker-compose.yml` file [here](/deploy/docker-compose.yml).
    3. run `docker-compose up -d` in the terminal in the same folder as the file
    4. run `docker-compose down` to end the session (data will be saved for next time)

- **Possible Port Issues Troubleshooting**:
    - If you encounter port issues, please refer to Docker documentation for troubleshooting.

- **Note**: 
    - The app runs on your local machine. When your computer is shut down or deactivated, the app stops running.
    - Data is stored locally on your computer within a Docker directory (location is not important).
    - Users who follow the installation steps will see a blank app, reflecting the initial state.

TODO: Add deployment specifics (shell script, Docker config)

## Using the App

**Main Point**: Follow the installation steps and then access the app using:
- `http://localhost:3000` for user mode during gameplay
- `http://localhost:3000/dashboard` for admin mode (scheduling, season management)

### Scoring Games

- Available in user mode or admin.
- To score a game:
    1. Click "Score Game".
    2. Select the two teams that played each other and their cups hit.
- **Scoring Logic**:
    - No ties allowed; teams cannot play themselves.
    - Winning team must hit 10 cups.
    - **Overtime**: Scored as 11-10, regardless of actual cup outcome.

### Admin Access

- Administrative tools accessible at `http://localhost:3000/dashboard`.
- **User Mode Activation**:
    - Switch to user mode using the button at the top.

#### Creating a New Season [Admin]

- **Note**: This action removes all existing saved data and starts a new season.
- Steps to create a new season:
    1. Click "Create New Season".
    2. Paste the column of team names into the box.
        - Format: Name1/Name2 (unique team names required).

#### Using the Scheduling Tool [Admin]

- Generates a schedule with the fewest repeat games possible.
- To use:
    1. Click "Scheduling Tool".
    2. Enter the number of weeks for the season.
    3. Specify the number of groups for each week.
        - A group represents a pod of teams playing every other team in their pod once.
    4. Click "Generate" and wait for the schedule to be created.
    5. Optionally, click "Save Schedule" to store the displayed schedule for later use.    



# For Developers:

[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-shelbyjm%2Fbpl--app-blue?style=for-the-badge&logo=docker)](https://hub.docker.com/repository/docker/shelbyjm/bpl-app/general)

TODO (higher priority at top):

- note: ngrok.yml is excluded from this repo, it contains the ngrok domain name and api key
- add/remove games as admin
    - recalculate elos (sequential calculation)
    - may need to add timestamp to game entries

- testing of some sort 
- migrate to production flask server (waitress?) instead of flask builtin
    - this is recommended in flask docs for deployment "WSGI"
- use github workflows to generate docker images on push?
    - requires more strict branch/PR practices


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

**Create a virtual environment (optional but recommended):**
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

**Then run "npm run dev" which will install the dependencies and run the backend and frontend**

see the scripts in `package.json` to see what is going on when you run this command 

The Flask server will be running on [http://127.0.0.1:5328](http://127.0.0.1:5328) – feel free to change the port in `package.json` (you'll also need to update it in `next.config.js`).

## Dev Overview

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
    - this works but not sure if its easiest option for non technical users (commisioners)
