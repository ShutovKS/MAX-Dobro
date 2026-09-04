#!/usr/bin/env bash
# Запускает deploy.sh в ОТДЕЛЬНОЙ сессии (setsid), чтобы сборка на сервере
# пережила обрыв SSH-соединения из CI. Пишет лог в /tmp/dobro-deploy.log и
# код возврата в /tmp/dobro-deploy.done. CI опрашивает done-файл.
cd /opt/dobroclub || exit 1
rm -f /tmp/dobro-deploy.done /tmp/dobro-deploy.log
setsid bash -c 'bash /opt/dobroclub/deploy/deploy.sh > /tmp/dobro-deploy.log 2>&1; echo $? > /tmp/dobro-deploy.done' < /dev/null > /dev/null 2>&1 &
echo "deploy launched (detached)"
