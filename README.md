# BriefCast

BriefCast is an AI-powered pod cast generator from any website.

## What's Changed

### April 2023

- Add pause after line break in a transcript.
- Add Language selector on the add podcast page.
- Add voice gender selection option.
- Use podcast title in the transcript instead of the feed's title.
- Generate 'all-combined mp3' for 'Play All'.
- Generate a podcast on add.
- Show toast after adding new podcast.
- Skip podcast generation if feed is not changed and MP3 has been created already.
- Added Terms of Use and Privacy Policy.
- Add 'Play All' button.
- Add loading spinners.
- Fix Google Text-to-Speech API fails on a long text.
- Prompt to add a podcast after signing up.
- Add logger.
- Add 'beta' to the title.
- Add Google Analytics.
- Prepare production environment.


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

- Improve overall UI.
- Add "How it works" on top page.
- Show a transript.
- Add sharing my podcast recipe feature.
- Limit trial generation based on the IP address.
- Limit the total number of generations within a day (300 times a day would be the upper limit for my budget).
- Add 'Add Website' button, allowing users to easily add a podcast by specifying a website URL.
- ...

## License

Source code in this repository is licensed under the PolyForm Noncommercial License 1.0.0.
