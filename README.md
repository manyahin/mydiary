# My Private Diary

This app alow you to simply setup your own private diary on your private server (like VPS) using Linux and Docker technology. To use with domain you need to configure web proxy server (like Nginx) on your server and setup your domain zone.

Builed on top of loopback and vuejs.

## Setup

    # set password
    echo 'DIARY_PASSWORD=123456' > .docker-env

## Development

```bash
# start database
docker-compose up -d db

# start api loopback
npm install
yarn dev

# start client part (in new terminal)
cd client
npm install
yarn dev
```

## Production

```bash
# clone repo
git clone https://github.com/manyahin/mydiary.git
cd mydiary

# set password
echo 'DIARY_PASSWORD=123456' > .docker-env

# build
docker-compose build

# start production
npm run prod
```

# Backup

The backup script will make tar.gz archive in backup folder and will upload it to Dropbox

```bash
# setup dropbox app token (only once)
/backup/dropbox_uploader.sh

# run script
/backup/run.sh
```

Restore DB by next command:

```bash
tar -zxvf $FILE.tar.gz
docker run --rm --network mydiary_default -v "$(pwd)/mongo_db":/backup \
  mongo:3.4 bash -c 'mongorestore /backup --host db:27017'
```
