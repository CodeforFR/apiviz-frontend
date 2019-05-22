---
title : THE APIVIZ ECOSYSTEM
categories:
  - general
tags:
  - documentation
  - configuration
  - ecosystem
  - tadata
toc: true
toc_label: " contents"
toc_sticky: true
light:
  - url: /documentation/configurations/APIVIZ-CONFIGURATIONS-export-details-light.jpg
    image_path: /documentation/configurations/APIVIZ-CONFIGURATIONS-export-details-light.jpg
    alt: "full details"
    title: "main data flows"
---

-----
ApiViz is designed to **agnosticaly display data** and provide an engine to deploy a **datavisualisation website** without (too much) pain, not regarding to the service(s) serving and storing the data. 

Nevertheless to do so an instance of ApiViz must be connected to several external services : one for authentication, one for serving the data, one for storing the static contents (html pages, images...).

The goal of ApiViz is to **work with any external service** fulfilling those roles, but we developed an **eco-system of open source applications** allowing a complete and free way to deploy such a datavisualisation service. 

## OUR OPEN SOURCE WEBAPPS


| logo | the open source eco-system (aka TADATA!) |
|    :----:   |          :--- |
| <img src="https://github.com/co-demos/apiviz-frontend/blob/master/static/logos/logo_apiviz_15.png" alt="apiviz logo"/> | **[Apiviz](https://github.com/co-demos/ApiViz)** as the high-level app for visualisation, a sort of open source CMS for data-visualisation   |
| <img src="https://github.com/co-demos/apiviz-frontend/blob/master/static/logos/logo_solidata.png" alt="solidata logo" /> | **[Solidata](https://github.com/entrepreneur-interet-general/solidata_frontend)** to "API-fy" your data and manage open data projects |
| <img src="https://github.com/co-demos/apiviz-frontend/blob/master/static/logos/logo_auth_microservice.png" alt="toktok logo"/> | **[TokTok](https://github.com/co-demos/toktok)** for a dedicated authentication service to manage users, JWT, and roles  |
| <img src="https://github.com/co-demos/apiviz-frontend/blob/master/static/logos/logo_openscraper_01.png" alt="open scraper logo"/> | **[OpenScraper](https://github.com/entrepreneur-interet-general/OpenScraper)** is a generic web scraper serving the results of the scraping via its API  |

-----

## OPEN SOURCE SERVICES FOR A SOVEREIGN AND DECENTRALIZED DATA FLOW

In the following illustration you can have a general idea of how those several services could work altogether. Check the [`/documentation/configurations`](https://github.com/co-demos/apiviz-frontend/blob/master/documentation/configurations) folder to have a broader look to [other configurations](https://github.com/co-demos/apiviz-frontend/blob/master/documentation/configurations/DATA_WORKFLOW-full.pdf).



{% include gallery id="light" caption="click to enlarge illustration" %}



You can also check those several projects and repository to find some layout for your specific new datavisualisation website : 
- Sonum repo ;
- CIS repo ;
- ... and more to come... 

------

**Note** : all the schemas were realized with [VUE - Visual Understanding Environment](https://vue.tufts.edu/index.cfm), an open source mind mapping tool. The source file for the schemas is [here](https://github.com/co-demos/apiviz-frontend/tree/master/documentation)


-----

## THE APIVIZ ECOSYSTEM IN DETAILS



----

### [TokTok](https://github.com/co-demos/toktok)

centralizes requests concerning user's authentication : 

  - login : given an email and a password responds with an `access_token` and a `refresh_token`
  - register an new user : 
  - modify an user :  
  - retrieves user's infos : 
  - confirm an `access_token` is authorized, valid, or not.


----

### [Solidata](https://github.com/entrepreneur-interet-general/solidata_frontend)

centralizes data management : 

  - stores data as open data projects.
  - "API-fy" your tabular data. 
  - allows distant modifications on data thanks to its backend API.
  - allows you to gather and normalize several datasets into a single open data project / dataset output.

----

### client's Github/Gitlab repo

centralizes html pages, images and external scripts you'll need for your original wabapp : 

  - by storing your static contents on a Github/Gitlab repo, modifying a content for your online server doesn't need to change your app source code anymore, you just need to modify your html/images/scripts on Github/Gitlab, and a few minute after your content is changed directly online.
  - that way you can separate in your team those in charge to modify contents, and those in charge of code maintenance.

----

### [Apiviz](https://github.com/co-demos/ApiViz)

gathers data and app configuration to display an original website : 

  - navbar configuration : define the logo, links, and menus in your apiviz instance's navabr. 
  - footer configuration : define the links present in the apiviz instance's footer.
  - styles configuration : define the CSS styles for your apiviz instance.
  - global configuration : define some metadata for your apiviz instance.
  - routes configuration : define the pages and routes of your apiviz instance, either statics contents or data views.
  - data endpoints configuration : define the data endpoints feeding your apiviz instance and the fields you want to display.