*** Settings ***
Library    Browser
Library     Browser    auto_closing_level=KEEP

*** Test Cases ***
Avaa kissaselain
    New Browser    chromium   headless=False
    New Page    http://localhost:5173/
    Get Title  ==  Better Training App
    Type Text    id=loginusername   ${Username}         delay=0.05s       
    Type Text   id=loginpassword   ${Password}   delay=0.05s
    Click  id=loginbutton  
    Sleep    5s
    