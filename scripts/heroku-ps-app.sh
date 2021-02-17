#!/bin/bash

heroku ps:scale worker=$1 -a tab-$2-analyser
heroku ps:scale worker=$1 -a tab-$2-notifications
heroku ps:scale worker=$1 -a tab-$2-scheduler
