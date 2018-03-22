import * as newclient from './scripts/newclient';

const commands = {
    NEWCLIENT: 'newclient'
};

function displayHelp() {
    console.error(`Available commands: ${Object.values(commands).join(', ')}`);
    process.exit(1);
}

const run = async () => {
    if (process.argv.length < 3) {
        displayHelp();
    }

    const [command, ...args] = process.argv.splice(2);

    if (!Object.values(commands).includes(command)) {
        displayHelp();
    }

    switch (command) {
    case commands.NEWCLIENT:
        await newclient.run(args);
    }
};

run();
