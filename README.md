### It's Wooper Tuesday!

Small little project to help my friend Wauby manage his Wooper in-game clans. He likes to join a new clan each day of the week, this dashboard allows him and only him to manage the accounts sending him the invites each day.

### How it works
- Wauby Logs in to his main Bungie account via oauth to gain access to the dashboard
- Wauby logs into his other Bungie account via oauth for eaach day of the week
- Each account stores a blob including the necessary authentication tokens, username, and clan name as a json blob in mongo
- A cron job runs every night which uses that day's account information and authorization to send a clan invite to Wauby
