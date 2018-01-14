
# Voting Website

This website is for creating and voting on polls that are stored in a database. This was built as part of FreeCodeCamp's backend cirriculum. 

## To Do

* Closing and Opening a poll to future voting.  
* Test bugs with naming replies something like 'null', 'user', 'question', or 'open' and fix them. 
* Replies with the same answer turn into the same when passed into the database upon creation of a poll. This isn't a problem except that users can create polls with only one voting option. 

## User Stories

### FreeCodeCamp User Stories

User Story: As an authenticated user, I can keep my polls and come back later to access them.

User Story: As an authenticated user, I can share my polls with my friends.

User Story: As an authenticated user, I can see the aggregate results of my polls.

User Story: As an authenticated user, I can delete polls that I decide I don't want anymore.

User Story: As an authenticated user, I can create a poll with any number of possible items.

User Story: As an unauthenticated or authenticated user, I can see and vote on everyone's polls.

User Story: As an unauthenticated or authenticated user, I can see the results of polls in chart form. (This could be implemented using Chart.js or Google Charts.)

User Story: As an authenticated user, if I don't like the options on a poll, I can create a new option.

### Personal User Stories

User Story: I can upload a poll with the following options:
* Allow users to write their own answers
* Allow users to reply with multiple answers
* Allow users to rescind a vote
* Allow users to see the results of the poll before voting
* Allow users to use Captcha for their poll

User Story: Searching for polls and viewing all polls. 

User Story: As an owner of a poll, I can add or remove options at a later date.

## Built With

* [MongoDB](https://www.mongodb.com/) - Moving data.
* [Express](https://expressjs.com/) - Routing.
* [Angular](https://angularjs.org/) - Used to display data.
* [mLabs](https://mlab.com/) - Data host.
* [Handlebars](http://handlebarsjs.com/) - HTML view engine template

## Authors

* **Nicolas Crumrine** - *EVERYTHING* - [CrumrineCoder](https://github.com/CrumrineCoder)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* A few friends for reviewing the design of the website over the course of the development of the website. My brother for reviewing the design of the website as well.
