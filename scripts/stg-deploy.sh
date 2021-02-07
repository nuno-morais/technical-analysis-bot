#!/bin/bash

git fetch --all --prune
git checkout main
git push origin main --force-with-lease

git checkout HEROKU-STG-ANALYSER
git rebase main
git push origin HEROKU-STG-ANALYSER --force-with-lease

git checkout HEROKU-STG-NOTIFICATIONS
git rebase main
git push origin HEROKU-STG-NOTIFICATIONS --force-with-lease

git checkout HEROKU-STG-SCHEDULER
git rebase main
git push origin HEROKU-STG-SCHEDULER --force-with-lease

git checkout main
