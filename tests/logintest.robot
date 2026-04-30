*** Settings ***
Library    Browser
Resource    Keywords.robot
Library     Browser    auto_closing_level=KEEP

*** Variables ***
${NOTE}   Kissaselain
${NOTEUP}   Kissa

*** Test Cases ***
Avaa kissaselain
    New Browser    chromium   headless=False
    New Page    http://localhost:5173/
    Get Title  ==  Better Training App
    Type Text    id=loginusername   ${Username}         delay=0.05s       
    Type Text   id=loginpassword   ${Password}   delay=0.05s
    Click  id=loginbutton  
    Sleep    3s
    Click  id=hrvchart
    Sleep   2s
    Click  id=closeHrvDialog
    Sleep   2s
    Click  id=addDiaryBtn
    Sleep   1s
    Type Text  id=entry_date   30-03-2026
    Type Text  id=mood   4    delay=0.05s
    Type Text  id=weight_now   100    delay=0.05s
    Type Text  id=sleep_hours   7    delay=0.05s
    Type Text  id=diaryText    ${NOTE}
    Click  id=saveDiary
    Sleep   3s
    Click  id=putDiaryBtn
    Type Text  id=diaryDate   30-03-2026
    Type Text  id=diaryMood   1    delay=0.05s
    Type Text  id=diaryWeight   75    delay=0.05s
    Type Text  id=diarySleep   3    delay=0.05s
    Type Text  id=diaryTextUpdate    ${NOTEUP}
    Click  id=saveDiaryUpdate
    Sleep   3s
          