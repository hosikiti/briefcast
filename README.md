# Briefcast

Briefcast is an AI-powered pod cast generator from any news website.

## What's Changed

### March 2023

- Support SSL.
- Tuned the default English summarizer to minimize unrelated linking words between topics, referring to this article: https://github.com/openai/openai-cookbook/blob/main/techniques_to_improve_reliability.md
- Inserted 2 second pause between topics so we can tell the beginning of the news more easily.
- Added a Trial feature that supports one-time pod cast generation from any news feed for anyone.
- Implemented automatic CI/CD pipeline with each new code update.

## TODO

- Add logger.
- Allow each user to create an account with Google and add their own favorite web feeds.
- Update each user's feeds automatically at least once a day.
- Limit the total number of generations within a day (300 times a day would be the upper limit for my budget).
- Add licence.
- ...
