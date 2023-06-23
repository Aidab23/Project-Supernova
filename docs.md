# Project Supernova Docs

> This is the offcical supported docs of Project Supernova. 

> Date of creation: 6/23/23

# API Calls
> Documentation for making API calls to the system.

fill info here nova u dumbass

# App Creation 
> Documentation for creating our own app for Project Supernova

### File Structure:

    📂App Name
        📄manifest.json
        🖼️icon.png
        📄index.html
        > Any Other Files
    
        📂Your file structure

### Manifest.json
> Remember to remove comments before packaging your app!!

    {
        "manifest_ver": 1,
        "application_name": "Example Application",
        "application_ver": "1.0.0",
        "dir": {
            "index_file":"index.html",
            "apis": {
                // see api list for a list of apis
                "apiname": "version of api"
            }
        },
        "author": "Project Supernova",
        "author_website": "https://projectsupernova.net" //optional
    }  
    
