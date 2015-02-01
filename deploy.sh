#!/bin/bash

cd server;
grunt build
cd ..

cp server/build/MAM.tgz ansible/roles/deploy/files/

ansible-playbook -i ansible/hosts/staging ansible/staging.yml
