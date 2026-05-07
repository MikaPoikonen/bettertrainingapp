Better Training App

<img width="250" height="250" alt="bettertrainngapplogo_nobackground" src="https://github.com/user-attachments/assets/23424215-1ec1-4e62-b465-b67ac2997ed2" />

Better Training App on web-sovellus, joka auttaa käyttäjää seuraamaan kehon palautumista ja harjoituskuormitusta sykevälivaihtelun (HRV) avulla. Sovellus hyödyntää Kubios HRV -sovelluksella mitattua dataa ja hakee analyysit Kubios Cloud -pilvipalvelusta. Käyttäjä voi tarkastella mittaushistoriaa, seurata kehitystä sekä tehdä päiväkirjamerkintöjä. Sovelluksen tavoitteena on optimoida harjoittelua ja parantaa suorituskykyä mitatun datan avulla.



Keskeiset ominaisuudet:

- HRV-datan seuranta ja analysointi
- Automaattiset trendit ja palautumisen arviointi
- Päiväkirja harjoittelun ja hyvinvoinnin kirjaamiseen
- Harjoitussuositukset datan perusteella
- Mahdollisuus jakaa tietoja ammattilaisille (esim. valmentajalle tai lääkärille)

Linkki sovellukseen 
- #tähän linkki

Linkki sovelluksen rautalankamalliin
- https://www.figma.com/make/6pFLq7NPH3mu0e3sYubO37/HRV-Data-Analysis-App?t=0ktJrJ4etgj82vnG-1

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



















KISSAELÄIN
https://mikapoikonen.github.io/bettertrainingapp/
