# ogre

Online game sim

Resources:
- [Play now](https://mpaulweeks.github.io/ogre/)
- [Firebase console](https://console.firebase.google.com/u/0/project/ogre-sim/database/ogre-sim-default-rtdb/data)

## install

How to get this repo working from a fresh clone.

### .env

The app expects a `.env` file with the following properties:

```
REACT_APP_apiKey=
REACT_APP_authDomain=
REACT_APP_databaseURL=
REACT_APP_projectId=
REACT_APP_storageBucket=
REACT_APP_messagingSenderId=
REACT_APP_appId=
REACT_APP_measurementId=
```

### .githooks

The `preinstall` script should automatically set the local git config to use `.githooks`

- `pre-commit`: Updates `public/version.json`
