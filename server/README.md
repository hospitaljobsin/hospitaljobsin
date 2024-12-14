Server auth idea: inspired by MrBeast's viewstats.com

send an email verification token which is valid for 10-15 minutes

have a cron job that cleans up verification tokens. if the tokens are expired and haven't been used to activate the account,
delete the token and the corresponding account as well.

display a message:

the code expires in 10 minutes. If you miss it, you'll have to sign up again!