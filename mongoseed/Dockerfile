FROM mongo

COPY init.json /init.json
CMD mongoimport --host mongo --db mainDB --collection projects --type json --file /init.json --jsonArray
