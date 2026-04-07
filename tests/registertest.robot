*** Settings ***
Library    Browser

*** Test Cases ***
Avaa kissaselain
    New Browser    chromium   headless=False
    New Page    http://localhost:5173/
    Get Title  ==  Better Training App
    Click  id=open_register_dialog
    Sleep    5s