# Voting App

Built for FreeCodecamp. Currently have the voting and viewing a poll done. These are the current things I'm working on in the project. 

1. Close and open a poll from voting.

Issues:
1. Replies with the same answer turn into one answer in the database. This should be done, but still require the user to make more than 1 reply when creating the poll, or if there's only 1 answer than make users able to write their own answers.
2. I suspect issues with  naming a reply something like null, user, question, or Open
3. Deleting a poll  that isn't on  the end of the poll throws everything after it off
4. Recinding a User Vote should remove both of the options, and properly decrease the vote
5. Editing a poll removes all the spaces from the given replies