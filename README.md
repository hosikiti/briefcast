# Briefcast

Briefcast is an AI-powered pod cast generator from any news website.

## What's Changed

### April 2023

- Added Terms of Use and Privacy Policy.

### March 2023

- Supported updating user podcasts twice a day.
- Allowed a user to add RSS feeds and listen each feed's podcast from the top page.
- Added sign-in with Google.
- Supported SSL.
- Tuned the default English summarizer to minimize unrelated linking words between topics, referring to this article: https://github.com/openai/openai-cookbook/blob/main/techniques_to_improve_reliability.md
- Inserted 2 second pause between topics so we can tell the beginning of the news more easily.
- Added a Trial feature that supports one-time pod cast generation from any news feed for anyone.
- Implemented automatic CI/CD pipeline with each new code update.

## TODOs

- Add 'Add Website' button, allowing users to easily add a podcast by specifying a website URL.
- Add 'Play All' button.
- Add loading spinners.
- Prepare production environment.
- Add logger.
- Add Google Analytics.
- Limit the total number of generations within a day (300 times a day would be the upper limit for my budget).
- Add licence.
- ...
