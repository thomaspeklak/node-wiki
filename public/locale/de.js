var i18n = {
    "Identify yourself": "Identifizieren Sie sich",
    "Just type a username, node wiki ain\'t no high security vault.": "Geben Sie lediglich Ihren Benutzername an.",
    "Save changes": "Änderungen speichern",
    "Page could not be saved, please try again later": "Seite konnte nicht gespeichert werden. Versuchen Sie es später noch einmal.",
    "Page saved": "Seite gespeichert.",
    "new page": "Neue Seite",
    "Successfully uploaded": "Erfolgreich hochgeladen",
    'Internal Server Error': 'Interner Server-Fehler',
    'Unsupported media type':'Nicht unterstützter Dateityp',
    "I don't know": "Unbekannter Fehler",
    "Link Title": "Link-Titel",
    "All Pages": "Alle Seiten",
    "click here and enter page title": "klicken Sie hier und geben Sie den neuen Seiten-Titel an",
    "add tags as comma separated list": "fügen Sie Tags per komma-separierte Liste hinzu",
    "click here and enter new content...": "klicken Sie hier und geben Sie den neuen Seiten-Inhalt ein...",
    "search": "Suche",
    "Tag": "Tag",
    "Page Versions": "Seiten-Versionen",
    "Versions": "Versionen",
    "Version for": "Version für ",
    "Move page": "Seite neu einordnen",
    "New path": "Neuer Pfad",
    "Target path exists already. Can not move the page": "Der Ziel-Pfad existiert bereits. Verschieben nicht möglich.",
    "Page succesfully moved": "Die Seite wurde erfolgreich verschoben.",
    "Somthing bad happend": "Unbekannter Fehler",
    "Please enter content manager password:": "Bitte geben Sie das Manager-Passwort ein:",
    "Password wrong. Page wasn't deleted.": "Falsches Passwort. Seite wurde nicht gelöscht.",
    "Could not delete page.": "Die Seite konnte nicht gelöscht werden. Möglicherweise existiert sie nicht oder ist eine Systemseite.",
    "New page": "Neue Seite",
    "Please enter the new page's path": "Bitte geben Sie den Pfad der neuen Seite ein.",
    "Page couldn't be created.": "Seite konnte nicht erstellt werden. Möglicherweise existiert sie schon?",
    "No static navigation found. Create page 'navigation' first.": "Keine statische Navigation gefunden. Legen Sie zunächst eine Seite mit dem Namen 'navigation' an.",
    "Slashes and hashes are not allowed in page names.": "Slashes und Rauten sind in Seiten-Namen nicht erlaubt.",
    "Please name and save the page first.": "Bitte speichern Sie zuerst die Seite und geben sie ihr einen Namen."
};

// DOM and node translation
if (typeof window !== 'undefined') {
    window.i18n = i18n;
    window.locale = "de";
} else {
    module.exports = i18n;
}