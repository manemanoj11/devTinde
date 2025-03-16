const { CronJob } = require('cron')
const { subDays, startOfDay, endOfDay } = require('date-fns')
const sendEmail = require('./sendEmail')
const ConnectionRequest = require('../models/connectionRequest')

const job = new CronJob("14 16 * * *", async () => {
    try {
        const yestarday = subDays(new Date(), 0)
        const yesterdayStart = startOfDay(yestarday)
        const yesterdayEnd = endOfDay(yestarday)

        const pendingRequests = await ConnectionRequest.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            },
        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(pendingRequests.map((req) => req.toUserId.emailId))]

        console.log(listOfEmails)

        for (const email of listOfEmails) {
            // Send Emails
            try {
                const res = await sendEmail.run(
                    "New Friend Requests pending for " + email,
                    "There are so many friend requests pending, please login to Devibes.in and perform a action on the requests."
                );
                console.log(res);
            } catch (err) {
                console.log(err);
            }
        }

    } catch (err) {
        console.log(err)
    }
})

job.start()