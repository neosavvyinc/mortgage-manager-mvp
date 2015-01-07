module.exports = {
    cleanTarget: {
        options: {
            callback: function( err, stdout, stderr, cb ) {
                console.log("Cleaning the target directory.");
                console.log(stdout);
                console.log(stderr);
                cb();
            }
        },
        command: "rm -r ./target"
    },
    testRuby: {
        options: {
            callback: function( err, stdout, stderr, cb ) {
                var output = stdout.split("\n");
                if( output[0] === undefined || output[0] === "" ) {
                    console.log("You need to install Ruby");
                    return false;
                } else {
                    console.log("You have Ruby installed here: [" + output[0] + "]");
                }
                cb();
            }
        },
        command: "which ruby"
    },
    testLess: {
        options: {
            callback: function( err, stdout, stderr, cb ) {
                var output = stdout.split("\n");
                if( output[0] === undefined || output[0] === "" ) {
                    console.log("You need to install Less");
                    return false;
                } else {
                    console.log("You have Less installed here: [" + output[0] + "]");
                }
                cb();
            }
        },
        command: "which less"
    },
    cleanNpm: {
        options: {
            callback: function( err, stdout, stderr, cb ) {
                var output = stdout.split("\n");
                console.log(stdout);
                console.log(stderr);
                cb();

            }
        },
        command: "rm -r node-modules"
    },
    npmInstall: {
        options: {
            callback: function( err, stdout, stderr, cb ) {
                var output = stdout.split("\n");
                console.log(stdout);
                console.log(stderr);
                cb();

            }
        },
        command: "npm install"
    },
    buildVersion : {
        options: {
            callback: function( err, stdout, stderr, cb ) {
                console.log(stdout);
                cb();

            }
        },
        command: [
            "rm src/main/buildinfo.txt",
            "touch src/main/buildinfo.txt",
            "echo `date +%Y-%m-%d` >> src/main/buildinfo.txt",
            "echo 'Built from branch: ' `git rev-parse --verify HEAD` >> src/main/buildinfo.txt",
            "cat src/main/buildinfo.txt"
        ].join("&&")
    },
    symLink: {
        options: {
            callback: function( err, stdout, stderr, cb ) {
                console.log("Adding a symlinks to /tmp for the nginx host");
                console.log(stdout);
                console.log(stderr);
                cb();
            }
        },
        command: [
            "if [ ! -L /tmp/<%= pkg.name %> ]; then ln -s `pwd`/target/ /tmp/<%= pkg.name %>; fi",
            "if [ ! -L /tmp/<%= pkg.name %>-build ]; then ln -s `pwd`/deployment/ /tmp/<%= pkg.name %>-build; fi"
        ].join('&&')
    },
    rmSymLink: {
        options: {
            callback: function( err, stdout, stderr, cb ) {
                console.log("Removing the symlinks from /tmp for the nginx host");
                console.log(stdout);
                console.log(stderr);
                cb();
            }
        },
        command: [
            "if [ -L /tmp/<%= pkg.name %> ]; then rm /tmp/<%= pkg.name %>; fi",
            "if [ -L /tmp/<%= pkg.name %>-build ]; then rm /tmp/<%= pkg.name %>-build; fi"
        ].join('&&')
    },
    startNginx: {
        options: {
            callback: function( err, stdout, stderr, cb ) {
                console.log("Starting Nginx as sudo - enter your user's password");
                console.log(stdout);
                console.log(stderr);
                cb();
            }
        },
        command: "sudo nginx -c `pwd`/nginx.conf"
    },
    stopNginx: {
        options: {
            callback: function( err, stdout, stderr, cb ) {
                console.log("Stopping Nginx as sudo - enter your user's password");
                console.log(stdout);
                console.log(stderr);
                cb();
            }
        },
        command: "sudo pkill nginx"
    },
    testNginx: {
        options: {
            callback: function (err, stdout, stderr, cb) {
                var output = stdout.split("\n");
                if (output[0] === undefined || output[0] === "") {
                    console.log("You need to install nginx");
                    console.log("Run command: 'brew install nginx'");
                    return false;
                } else {
                    console.log("You have nginx installed here: [" + output[0] + "]");
                }
                cb();
            }
        },
        command: "which nginx"
    },
    testPkill: {
        options: {
            callback: function( err, stdout, stderr, cb ) {
                var output = stdout.split("\n");
                if( output[0] === undefined || output[0] === "" ) {
                    console.log("You need to install pkill");
                    console.log("Run command: 'brew install proctools'")
                    return false;
                } else {
                    console.log("You have pkill installed here: [" + output[0] + "]");
                }
                cb();

            }
        },
        command: "which pkill"
    },
 
};
