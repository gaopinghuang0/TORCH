#!/usr/bin/bash
db="collect"
port=27017

echo "dumping \"$db\" at port $port to ./dump/$db"
mongodump -d "$db" --port "$port" -o ./dump > /dev/null
echo "Done!"
echo
