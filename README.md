# Trending Movies Newsletter

A serverless Hono app that displays the current trending movies and can send them to your email.

## Built Using

- [Hono](https://github.com/honojs/hon) - Web framework used
- [Resend](https://resend.com/docs/send-with-nodejs) - To send the email
- [TMBD API](https://developer.themoviedb.org/reference/intro/getting-started) - Trending movie data
- [React Email](https://github.com/resend/react-email) - Style emails and create the email template

## Usage Example

- Visit the `/send` route with the api token to send an email with the trending movies at the time.
- Set up a cron job to visit the url on a schedule to send the email

## Routes

- `/` to see the email template preview
- `/send?api-token=<api token>` (the api token is specified in the .dev.vars file) to send the email. Note: Change the from and to email in the code to send the email to your desired email address.

## To Develop Locally

To run:

```
npm install
npm run dev
```

To deploy:

```
npm run deploy
```

---

## License

Licensed under the [GNU AGPLv3](https://www.gnu.org/licenses/agpl-3.0.en.html). Please see [LICENSE.txt](./LICENSE.txt) for more information.
