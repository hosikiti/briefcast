# Briefcast

Briefcast is an AI-empowered pod cast generator from any news website.

## What's Changed

- Tuned the default English summarizer to minimize unrelated linking words between topics, referring to this article: https://github.com/openai/openai-cookbook/blob/main/techniques_to_improve_reliability.md
- Inserted 2 seconds pause between topics so we can tell the beginning of the news more easily.
- Added "Trial" feature that supports one-time pod cast generation from any news feed for anyone.
- Implemented automatic CI/CD pipeline with each new code update.

## TODO

- Fix a bug when tapping "Generate" button again after generating the feed.
- Support SSL.
- Allow each user to create an account with Google and add their own favorite web feeds.
- Update each user's feeds once a day at least.
- Limit the total number of generation within a day (probably 300 times a day will be upper) for my budget.
- Add licence.
- ...
