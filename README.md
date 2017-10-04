# Voting App

Built for FreeCodecamp. Currently have the voting and viewing a poll done, and am now working on authentication. 

1. Validate that the poll's owner is the one editing the poll and on the user's dashboard. [DONE]

2. I think the user will stay logged in, but use passport to keep the user logged in with cookies [I think this works]

3. If possible, make a way to rescind votes rather than having it be the user can vote more than once, but I'm not sure how. [DONE]

4. CSS Styling 

Issues:
1. Replies with the same answer turn into one answer in the database. This should be done, but still require the user to make more than 1 reply when creating the poll, or if there's only 1 answer than make users able to write their own answers.
2. I suspect issues with  naming a reply something like null, user, question, or Open