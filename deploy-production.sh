#!/bin/bash

# Generate the server side build archive
cd server ; npm install;  grunt build ; cd ..
cp server/MAM-server.tgz ansible/roles/deploy/files/

# Generate the client side build archive
cd client ; npm install ; grunt deployment ; cd .. ; cp client/MAM-client.zip ansible/roles/deploy/files/

# Run ansible playbook
ansible-playbook -i ansible/hosts/production ansible/production.yml
