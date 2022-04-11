var esprima = require("esprima");
var options = {tokens: true, tolerant: true, loc: true, range: true};
var fs = require("fs");

function staticAnalysis(filePath){
    var buf = fs.readFileSync(filePath, "utf8");
    var ast = esprima.parse(buf, options);

    //console.log(ast);
    var file = new FileBuilder();
    file.fileName = filePath;

    traverseWithParents(ast, function(node){
        if (node.type === "Literal")
            file.strings++;
    });

    file.report();
}

function traverseWithParents(object, visitor)
{
    var key, child;

    visitor.call(null, object);

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null && key != 'parent') 
            {
            	child.parent = object;
					traverseWithParents(child, visitor);
            }
        }
    }
}

function FileBuilder(){
    this.fileName = "";
    this.strings = 0;
    this.importCount = 0;

    this.report = () => {
        console.log(this.fileName + ", " + this.strings);
    }
}

staticAnalysis("mystery.js");