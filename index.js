#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var htmlmd = require('html-md');
var postsDir = path.join(process.cwd(), "app", "_posts");
var backupDir = path.join(process.cwd(), "app", "_posts_html");
var files = fs.readdirSync(postsDir);

if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
}

console.log("Running html-md on", files.length, "markdown files in _posts");
files.forEach(function(fileName) {
    if (fileName.indexOf(".html") === fileName.length - 5) {
        var filePrefix = fileName.substr(0, fileName.lastIndexOf(".html"));
        var backupFilepath = path.join(backupDir, fileName);
        var outputFilePath = path.join(postsDir, filePrefix + ".md");
        var filePath = path.join(postsDir, fileName);

        console.log("reading", filePath);
        var file = fs.readFileSync(filePath, 'utf8');

        console.log("backing up", filePath);
        fs.writeFileSync(backupFilepath, file);

        var afterSeparatorIndex = file.lastIndexOf('\n---\n') + 5;
        var yaml = file.substr(0, afterSeparatorIndex);
        var html = file.substr(afterSeparatorIndex);
        var markDown = htmlmd(html);
        var finalContents = markDown.replace(/\n[\s\r]*\n/gm, "\n\n");

        console.log("writing", outputFilePath);
        fs.writeFileSync(outputFilePath, yaml + finalContents);

        console.log("deleting", filePath);
        fs.unlink(filePath);
    }
});