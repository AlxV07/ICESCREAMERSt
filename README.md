# I.C.E.C.R.E.A.M.E.R.S.t.

**I**.ntelligent<br>
**C**.omputer<br>
**E**.ngineers<br>
**S**.ometimes<br>
**C**.reate<br>
**R**.idiculously<br>
**E**.nigmatic<br>
**A**.ggravating<br>
**M**.onstrosities<br>
**E**.xpressed<br>
**R**.adically<br>
as<br>
**S**.horthands<br>
so we made a<br>
**t**.ool<br>
to help with that :D

This idiotic team name drives home the point that 
newcomers (e.g. new employees, interns, non-tech people) 
are sometimes met with complex and confusing
abbreviations, acronyms, or terms which seem to be from
a different language.

ICESCREAMERSt (pronounced ice-screamers-tee) provides a simple solution: a convenient interface 
where users can quickly search find out what
unfamiliar terms mean.


## Setup for Devs

1. Clone project
2. In project directory: `pip install requirements.txt`
3. Open project directory in editor, and you're good to go!

## Project Overview

### Tech Stack
- Vanilla HTML-JS-CSS frontend 
- Served locally over Python Flask server
- AWS DynamoDB database
  - Data:
    - Terms
    - Context/tags/documentation/resources for terms
  - Query Operations:
    - Read terms from database
    - Write new term to database
    - Change term information

### Flow

```
| User Interface |
        ^
        |
Search & sort queries
        |
        v
|  Flask Server  |
        ^
        |
  Query Operations
        |
        v
|  AWS Database  |

```

## Extensions & Scalability

TODO: talk abt potential developments and expansions to the app 
