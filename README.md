# sheer-tech-challenge

This is Sam Carpenter's submission for Sheer Health's technical challenge! Here are some notes, details, and thoughts on the work in this repo.

## Navigating this repo

The Playwright script is in `pw-scripts`, and the output file is `medicines.json`. If you want to run the script yourself, I suggest using Chromium - I haven't really tested it with other browsers. Also, to format the JSON with newlines and indents, just hit Alt-Shift-F in VS Code, since the program outputs it all on one line. I've done that with the version in this repo but if you generate your own, you'll need to format it to be human-readable.

## Explanation of the code

In order to get some good results in a reasonable amount of time, I focused on the information I could get consistently from most pages. The NHS unfortunately has very inconsistent formatting across their site, so some things that should be easy were a little tricky. Currently I track the medicine's name, link to page, related conditions, and brand names.

### Name and link to page

This is straightforward, the name is the JSON object's key and the link is the NHS page for that medicine. Every medicine has an associated name and link. It's worth noting that I filter out some of the medicines, since there are a few duplicates / drugs under different names, resulting in links being unique.

### Brand names

Many pages have a caption or blurb at the top with brand names, which I read and filter to save these. One area of potential expansion is that many drugs have an alternative name **in their title**, such as the first medication, titled `Aciclovir (Zovirax)`. There are only a handful, and these may need to be treated differently than other aliases, but future iterations could find a way to cleverly deal with these names.

### Related conditions

This is pretty straightforwardly scraped from section blocks on pages. An opportunity for future expansion could be trying to read these out of the opening blurb or body text if the section doesn't exist.

### Opportunities for future expansion

Here are a few things, in no particular order, that I would build out in a future iteration of this code.

- Some of the medicines on this page aren't really medicines at all, but categories of medicine (i.e. `Antidepressants`). I couldn't find a clever way to filter these out, but a future version could either manually filter these out or find a better way around them.

- I tried to build something to read side effects from these pages but the formatting is so inconsistent it wasn't feasible within this timeframe. Many (but not all) of the side effects are contained on subpages, which makes it trickier, but if this was implemented we'd get a few other things "free" from reading subpages (who can take it, dosage, etc.)

- Since this visits every subpage for every medication, it could totally be made parallel. I didn't bother since it only takes about a minute to run right now, but if we were doing a lot more per page we could see some serious time savings.