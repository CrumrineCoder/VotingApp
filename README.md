# Voting App

Built for FreeCodecamp. Currently have the voting and viewing a poll done, and am now working on authentication. 

To Do Next:

1. Option to link a poll to a user account [DONE]

2. Search  functionality [DONE]

3. Other options during poll creation [DONE]

3a. Fixed vs open answers [DONE]

3b. Multiple replies to a question from the user [DONE]

3c. Allowing change of vote [DONE] (changed to allowing multiple voting)

3d. Allowing seeing the results before voting [DONE]

3e. Captcha [DONE]

-- Change Options to be Boolean rather than Strings -- 

4. Reworking routing depending on how I want the flow of the site to change

4a. Validating that the user has voted / the poll creator has allowed users to see the results before voting [DONE]

4b. If voted, the user can go to the results screen after voting. [DONE]

4c. User can edit their polls after creating them if they link them to their account

5. Fluff up Results page with a bar graph and such 

6. CSS touch up

7. On polllistings, perhaps have some options to sort by like most recent, most popular, and most controversial. Perhaps polls can have topics as well like Gaming, Politics, etc. but  I'm not sure. 

Issues:
1. Replies with the same answer turn into one answer in the database. This should be done, but still require the user to make more than 1 reply when creating the poll, or if there's only 1 answer than make users able to write their own answers.
2. I suspect issues with  naming a reply something like null, user, question, or Open
3. Check if the user selected an option before submitting the form [fixed]