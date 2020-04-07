// Fichier : serveur-web.js

//-----------------------------------------------------------------------------

// Ne modifiez pas cette section.

// Fonctions d'entrees/sorties pour node.js

var fs = require("fs");

var readFile = function (path) {
    return fs.readFileSync(path).toString();
};

var writeFile = function (path, texte) {
    fs.writeFileSync(path, texte);
};

var print = function (obj) {
    console.log(obj);
};

var decouperEnLignes = function (contenu) {

    var lignes = contenu.split("\r\n");

    if (lignes.length == 1) {
        lignes = contenu.split("\r");
        if (lignes.length == 1) {
            lignes = contenu.split("\n");
        }
    }

    if (lignes[lignes.length-1] == "") {
        lignes.pop();
    }

    return lignes;
};

var texte2CSV = function (contenu) {
    var lignes = decouperEnLignes(contenu);
    var resultat = [];
    for (var i=0; i<lignes.length; i++) {
        resultat.push(lignes[i].split(","));
    }
    return resultat;
};

// Serveur web

var http = require("http");

var n = 0;

var obtenirDocument = function (url) {

    print(++n + " " + url);

    if (url == "/apple-touch-icon-precomposed.png" ||
        url == "/apple-touch-icon.png" ||
        url == "/favicon.ico")
        return ""; // ignorer ces URL
    else if (url == "/")
        url = "/index.html";

    return readFile("documents" + url);
};

var extension = function (path) {
    var i = path.lastIndexOf(".");
    if (i < 0) {
        return "";
    } else {
        return path.slice(i+1, path.length);
    }
};

http.createServer(function (requete, reponse) {

    var url = requete.url;
    var doc = obtenirDocument(url);
    var ext = extension(url);
    var type = "text/plain";

    if (ext == "html") {
        type = "text/html";
    } else if (ext == "css") {
        type = "text/css";
    } else if (ext == "js") {
        type = "text/javascript";
    } else if (ext == "svg") {
        type = "image/svg+xml";
    } else if (ext == "csv") {
        type = "text/html";
        doc = traiterCSV(doc);
    }

    reponse.writeHead(200, {"Content-Type": type});

    reponse.end(doc);
}).listen(8000);

//-----------------------------------------------------------------------------

// Modifiez cette fonction uniquement.

var traiterCSV = function (doc) {

    return "<table border=\"1\" style=\"border-collapse: collapse;\">"
           + " <tr>"
           + "  <td>ce</td>"
           + "  <td>code</td>"
           + " </tr>"
           + " <tr>"
           + "  <td>est</td>"
           + "  <td>incomplet</td>"
           + " </tr>"
           + "</table>";
};

//-----------------------------------------------------------------------------
