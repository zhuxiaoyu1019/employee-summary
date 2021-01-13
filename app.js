const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const emailValidator = require('email-validator');
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const team = [];

// Use inquirer to gather information about the development team members, and to create objects for each team member
console.log("Please build your team")
inquirer.prompt([
    {
        type: "input",
        name: "name",
        message: "What is your manager's name?"
    },
    {
        type: "number",
        name: "id",
        message: "What is your manager's id?"
    },
    {
        type: "input",
        name: "email",
        message: "What is your manager's email?",
        validate: input => emailValidator.validate(input) || "Please enter a valid email address."
    },
    {
        type: "number",
        name: "officeNumber",
        message: "What is your manager's office number?"
    }
]).then(({ name, id, email, officeNumber }) => {
    const manager = new Manager(name, id, email, officeNumber);
    team.push(manager);
    addEmployee();
});

function addEmployee() {
    inquirer.prompt([
        {
            type: "list",
            name: "type",
            message: "Which type of team member would you like to add?",
            choices: ["Engineer", "Intern", "I don't want to add any more team members"]
        }
    ]).then(({ type }) => {
        switch (type) {
            case "Engineer":
                engineerInfo();
                break;
            case "Intern":
                internInfo();
                break;
            default:
                writeHtml();
                break;
        }
    });
}

function engineerInfo() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is your engineer's name?"
        },
        {
            type: "number",
            name: "id",
            message: "What is your engineer's id?"
        },
        {
            type: "input",
            name: "email",
            message: "What is your engineer's email?",
            validate: input => emailValidator.validate(input) || "Please enter a valid email address"
        },
        {
            type: "input",
            name: "github",
            message: "What is your engineer's Github username?"
        }
    ]).then(({ name, id, email, github }) => {
        const engineer = new Engineer(name, id, email, github);
        team.push(engineer);
        addEmployee();
    });
}

function internInfo() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is your intern's name?"
        },
        {
            type: "number",
            name: "id",
            message: "What is your intern's id?"
        },
        {
            type: "input",
            name: "email",
            message: "What is your intern's email?",
            validate: input => emailValidator.validate(input) || "Please enter a valid email address"
        },
        {
            type: "input",
            name: "github",
            message: "What is your intern's school?"
        }
    ]).then(({ name, id, email, github }) => {
        const intern = new Intern(name, id, email, github);
        team.push(intern);
        addEmployee();
    });
}


// After the user has input all employees desired, call the `render` function and pass in an array containing all employee objects; the `render` function will generate and return a block of HTML including templated divs for each employee
function writeHtml() {
    const html = render(team);
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    fs.writeFile(outputPath, html, err => {
        if (err) throw err;
    });
}

