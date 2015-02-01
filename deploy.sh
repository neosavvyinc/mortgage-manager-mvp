#!/bin/bash

# Generate the server side build archive
cd server ; grunt build ; cd ..
cp server/MAM-server.tgz ansible/roles/deploy/files/

# Generate the client side build archive
cd client ; grunt deploy ; cd ..
cp client/MAM-client.zip ansible/roles/deploy/files/

# Run ansible playbook
ansible-playbook -i ansible/hosts/staging ansible/staging.yml
