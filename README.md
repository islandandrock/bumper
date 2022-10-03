# bumper
A cool app to help you meet new friends

**How to run the app**
1. Install dependencies for js (`npm install`) and python (see below)
2. Start the backend server and get IP address (see below)
3. Create the file `server.json` in `/bumper/util/`
4. Paste the following into the file: `{"ip" : "REPLACEME"}`
5. Replace the placeholder text with the IP given by the Flask server.
6. Start the expo server

**How to install backend (Linux)**
### (please note that you might have to use python followed by your version if your default version is outdated. EX: `python3.10 -m venv venv`)
```
cd server
python -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
```

**How to install backend (Windows)**
```
cd server
python -m venv venv
venv\Scripts\activate.bat
python -m pip install -r requirements.txt
```

**How to reactivate venv (Linux)**
```
cd server
source venv/bin/activate
```

**How to run backend server**
```
python wsgi.py
```