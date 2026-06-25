import Pusher from 'pusher'

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || 'dummy',
  key: process.env.PUSHER_KEY || 'dummy',
  secret: process.env.PUSHER_SECRET || 'dummy',
  cluster: process.env.PUSHER_CLUSTER || 'eu',
  useTLS: true,
})
