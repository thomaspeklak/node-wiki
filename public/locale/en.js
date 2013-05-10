var i18n = {
    "Identify yourself": "Identify yourself",
    "Just type a username, node wiki ain\'t no high security vault.": "Just type a username, node wiki ain\'t no high security vault.",
    "Save changes": "Save changes",
    "Page could not be saved, please try again later": "Page could not be saved, please try again later",
    "Page saved": "Page saved",
    "new page": "new page",
    "Successfully uploaded": "Successfully uploaded",
    'Internal Server Error': 'Internal Server Error',
    'Unsupported media type':'Unsupported media type',
    "I don't know": "I don't know",
    "Link Title": "Link Title",
    "All Pages": "All Pages",
    "click here and enter page title": "click here and enter new page title",
    "add tags as comma separated list": "add tags as comma separated list",
    "click here and enter new content...": "click here and enter new page content...",
    "search": "search",
    "Tag": "Tag",
    "Page Versions": "Page Versions",
    "Versions": "Versions",
    "Version for": "Version for",
    "Move page": "Re-order page",
    "New path": "New path",
    "Target path exists already. Can not move the page": "Target path exists already. Can not move the page",
    "Page succesfully moved": "Page succesfully moved",
    "Somthing bad happend": "Somthing bad happend",
    "Please enter content manager password:": "Please enter content manager password:",
    "Password wrong. Page wasn't deleted.": "Password wrong. Page wasn't deleted.",
    "Could not delete page.": "The page wasn't deleted. Maybe it's not existing or it is a system page.",
    "New page": "New page",
    "Please enter the new page's path": "Please enter the new page's path",
    "Page couldn't be created.": "Page couldn't be created. Maybe it's already existing?",
    "No static navigation found. Create page 'navigation' first.": "No static navigation found. Create a page named 'navigation' first."
    "Slashes and hashes are not allowed in page names.": "Slashes and hashes are not allowed in page names."
};

// DOM and node translation
if (typeof window !== 'undefined') {
    window.i18n = i18n;
} else {
    module.exports = i18n;
}