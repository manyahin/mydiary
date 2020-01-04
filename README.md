# My Private Diary

This app alow you to simply setup your own private diary on your private server (like VPS) using Linux and Docker technology. To use with domain you need to configure web proxy server (like Nginx) on your server and setup your domain zone.

Backend builed on top of loopback.

To access the diary use web ui builded on VueJS.
Also, you can send messages to diary via Telegram bot (need to setup it before and get token, check https://core.telegram.org/bots)

## Setup

    # set password
    echo 'DIARY_PASSWORD=123456' > .docker-env
    # no enable telegram bot set next variables
    echo 'TELEGRAM_BOT_TOKEN=SDFDSF-SDFSDF-SDFDSF' >> .docker-env
    echo 'TELEGRAM_ALLOWED_USERS=myUser' >> .docker-env


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

# optional, set host to check from another device
HOST=10.0.0.1 yarn dev
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

### Update

```bash
git pull origin master
sudo docker-compose build
sudo docker rm -f mydiary_web_1
sudo npm run prod
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
