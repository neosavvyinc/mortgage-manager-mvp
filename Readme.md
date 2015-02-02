Mortgage Manager Prototype
==========================

Click [here] (server/README.md) for the server readme file

Click [here] (client/README.md) for the client readme file

#### Ansible Deployment Notes ####

##### Generation of SSL Certificates and Keys

1. Generate the private key
    `openssl genrsa -des3 -out server.key 1024`

2. Generate a CSR (Certificate Signing Request)

    `openssl req -new -key server.key -out server.csr`

3. Remove Passphrase from Key

    ```
    cp server.key server.key.org
    openssl rsa -in server.key.org -out server.key
    ```

4. Generating a Self-Signed Certificate

    `openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt`

    

