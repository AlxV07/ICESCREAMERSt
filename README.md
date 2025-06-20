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

## How Hackday Went
First time pretty much for all of us working in a team env for a hackathon so the codebase is not the prettiest
(apologies, code reviewers), but we finished w/ an actually presentable project I think :D
(Writing this at 2a.m. as we're finishing editing the presentation vid)

App is started w/ `python3 app.py` & going to the port the application is serving in browser (after installing required packages in `requirements.txt`);
a `.env` file in the root-project directory w/ a `GROQ_API_KEY` var needs to be set to support AI-search.
The `chrome_extension` folder can be loaded as an unpacked Chrome extension (enable dev mode in `chrome://extensions`)
and will appear in the extension toolbar; requires `app.py` to be running right now to work though.

Though of course there still remain technical hurdles to overcome to become a publicly-usable application
(a secure submit system (perhaps linked to a State Farm account), complete AWS database integration, etc.),
our application lays out a solution and illustrates a functional example of how such an application can serve a real need in corporate.


## Setup for Devs

1. Clone project
2. In project directory: `pip install -r requirements.txt`
3. And then configure AWS (install aws-cli if needed): `aws configure` (will prompt for your credentials, talk to Alex if this setup needed)
4. Open project directory in editor, and you're good to go!

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
|  AWS Database (as of Hackday, we're using a local CSV file as a mock database for simpler testing, but AWS support can always be implemented later) |

```

## Extensions & Scalability

TODO: talk abt potential developments and expansions to the app 
