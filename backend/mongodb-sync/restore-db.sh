#!/usr/bin/bash

db="collect"
port=27017

echo "restoring \"$db\" at port $port from ./dump/$db"
mongorestore -d "$db" --port "$port" ./dump/"$db" --drop > /dev/null
echo "Done!"
echo