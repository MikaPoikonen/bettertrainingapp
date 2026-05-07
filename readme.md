Better Training App

<img width="250" height="250" alt="bettertrainngapplogo_nobackground" src="https://github.com/user-attachments/assets/23424215-1ec1-4e62-b465-b67ac2997ed2" />

Better Training App on web-sovellus, joka auttaa käyttäjää seuraamaan kehon palautumista ja harjoituskuormitusta sykevälivaihtelun (HRV) avulla. Sovellus hyödyntää Kubios HRV -sovelluksella mitattua dataa ja hakee analyysit Kubios Cloud -pilvipalvelusta. Käyttäjä voi tarkastella mittaushistoriaa, seurata kehitystä sekä tehdä päiväkirjamerkintöjä. Sovelluksen tavoitteena on optimoida harjoittelua ja parantaa suorituskykyä mitatun datan avulla.
----------------------------------------------------

Sovelluksen käyttöliittymä

<img width="500" height="350" alt="image" src="https://github.com/user-attachments/assets/6c3dfcdc-8907-41cb-9f33-cd60d311b83b" />

<img width="500" height="350" alt="image" src="https://github.com/user-attachments/assets/f0ac28d5-57d2-45bb-b4cd-cf9a18fb707f" />

<img width="500" height="350" alt="image" src="https://github.com/user-attachments/assets/d4a542ca-883d-4df5-8d22-f6576fc61417" />

<img width="500" height="350" alt="image" src="https://github.com/user-attachments/assets/980e6f13-2adb-454e-8654-359e7ea9fa9a" />

<img width="500" height="350" alt="image" src="https://github.com/user-attachments/assets/e4f1a1cb-06d1-4fd9-af1d-0bc42e452f68" />

<img width="500" height="350" alt="image" src="https://github.com/user-attachments/assets/46651a68-5510-479c-8855-72ac8158e478" />

-----------------------------------------
Keskeiset ominaisuudet:

- HRV-datan seuranta ja analysointi
- Automaattiset trendit ja palautumisen arviointi
- Päiväkirja harjoittelun ja hyvinvoinnin kirjaamiseen
- Harjoitussuositukset datan perusteella
- Mahdollisuus jakaa tietoja ammattilaisille (esim. valmentajalle tai lääkärille)
---------------------------------------
Linkki sovellukseen 
- bettertrainingapp.switzerlandnorth.cloudapp.azure.com
---------------------------------------
Linkki sovelluksen rautalankamalliin
- https://www.figma.com/make/6pFLq7NPH3mu0e3sYubO37/HRV-Data-Analysis-App?t=0ktJrJ4etgj82vnG-1
--------------------------------------
Linkki sovelluksen automaatiotestauksen outputs-kansioon
- https://github.com/MikaPoikonen/bettertrainingapp/tree/main/outputs
--------------------------------------
Sovelluksen tietokanta

```mermaid
erDiagram

USERS {
    INT user_id PK
    VARCHAR username
    VARCHAR password
    VARCHAR email
    DECIMAL start_weight
    DATE birth_year
    DATETIME created_at
    VARCHAR user_level
}

DIARY_ENTRIES {
    INT entry_id PK
    INT user_id FK
    DATE entry_date
    VARCHAR mood
    DECIMAL weight_now
    INT sleep_hours
    TEXT notes
    DATETIME created_at
}

KUBIOS_PAYLOAD {
    INT entry_id PK
    INT user_id FK
    DATE entry_date
    DECIMAL hrv_data
    DECIMAL readiness_data
    DECIMAL stress_data
    VARCHAR physiological_age
    VARCHAR bpm
    VARCHAR mood
    DATETIME created_at
    VARCHAR kubios_id
}

USERS ||--o{ DIARY_ENTRIES : writes
USERS ||--o{ KUBIOS_PAYLOAD : measures
```
--------------------------------------
Sovelluksen Api-dokumentaatio

Listaus api toiminnoista
GET Pyynnöt
GET/users/:ID
GET/entries/:ID
GET/entries/latest/:ID
GET/kubios/user-data
GET/kubios/sql/:ID
GET pyynnöt tarvitsevat käyttäjän ID:n

POST Pyynnöt
POST/users
POST/users/login
POST/entries
POST/kubios/sql
POST pyynnöt tarvitsevat käyttäjä tai päiväkirjamerkintään tarvittavat tiedot, 
login pyyntö tarvitsee käyttäjänimen ja salasanan

PUT Pyynnöt
PUT/users/:ID
PUT/entries/:ID
PUT pyynnöt tarvitsevat id:n ja tiedot joita haluat muokata

DELETE Pyynnöt
DELETE/users/:ID
DELETE/entries
Päiväkirja merkinnän poistossa tarvitsee käyttäjän ja merkinnän id:t

Esimerkki vastauksia
POST user json vastaus
 res.status(201).json({ message: "new user added", user_id: newUserId });

POST login json vastaus
return res.json({ message: "login ok", user, token });

Esimerkkikutsuja
GET user by id
GET {{apiurl}}/users/19
Authorization: Bearer {{token}}

POST user
POST {{apiurl}}/users
Content-Type: application/json

{
    "username": "logintesti",
    "password": "Salasana123",
    "email": "login@testi.fi",
    "start_weight": 90,
    "birth_year": "2000-02-02"
}


########### User logIn
POST {{apiurl}}/users/login
Content-Type: application/json

{
  "username": "",
  "password": ""
}


PUT user
PUT {{apiurl}}/users/17
Content-Type: application/json

{
"username": "muutettu",
"password": "Salasana123",
"email": "muutettu@muutettu11.fi",
"start_weight": 90,
"birth_year": "2000-02-02"
} 


Delete user by id
DELETE {{apiurl}}/users/3
----------------------------------------
AI:n hyödyntäminen projektissa

Projektissa on hyödynnetty tekoälyä ohjelmoinnin tukena. Tekoälyä käytettiin esimerkiksi:
- virheiden etsimisen tukemiseen ja selittämiseen tarvittaessa miksi esim. koodi meni rikki. yksittäisiä parametrejä tai undefinied / null ongelmia
- erilaisten css ulkoasujen suunnitteluun. Mitä vaihtoehtoja olisi käyttää tai saada esim laatikoille hyvät shadow.
- Azure serverin pystyttämisessä. Matin ohjeissa olevaa linux serveriä esim ei ollut enää. Lisäksi tuli ongelmia regionin kanssa että pystyi käyttämään esim halvinta 8 dollarin serveriä joka oli nyt 2 luokan alla.
- Tekoäly ei tuottanut valmista projektia kokonaan, vaan sitä käytettiin oppimisen tukena ja yksittäisten ongelmien pienten osien ratkaisemiseen.
- Lisäksi AI:n käyttöä merkitty erikseen kommentteihin ja sillä on luotu myös sovelluksen logo.

------------------------------------------------
Referenssit ja kirjastot:

- https://www.w3schools.com/
- https://www.amcharts.com/demos/gauge-with-bands/
- https://www.amcharts.com/demos/control-chart/
- Oppimisessa on käytettu Ulla Söderlöf ja Matti Peltoniemi Githubin opetusmateriaalia niin fron-endissä kuin back-endissä.
- Oppimateriaalia on osittain käytetty suoraan apuna ja myös muokattu projektiin sopivaksi



















KISSAELÄIN
https://mikapoikonen.github.io/bettertrainingapp/
