const axios = require('axios')

const fcmConfig = {
  sender: '888312469926',
  key: 'AAAAztOMmaY:APA91bHKaqmBrcZdG-N9htjmXkGnUKYaKo3vbPyqUwW-CLwpPjA1xFwdo7HYpQgeg9k9_KcQX44DGMq9EnahgrGQDqcO49tcyuxC2LMltY4isDURhHLguje5AnqKk6saDbBoEB7lWtwq'
}

async function fcmSendNotificationRequest (data) {
  return axios({
    method: 'post',
    url: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `key=${fcmConfig.key}`
    },
    data
  })
}

const createData = {
  type: '',
  from: null,
  to: {
    token: null,
    topic: null
  },
  message: {
    text: ''
  }
}

exports.FCM = class FCM {
  constructor (options = {}, app = null) {
    // constructor
  }

  // GET
  async find () {
    return {
      in: 'FCM',
      methods: ['GET', 'POST'],
      docs: {
        GET: {
          desc: 'Retrieve documentation for endpoint',
          relativeUrl: '/'
        },

        POST: {
          desc: 'Send FCM notification to HomEnd client/s or topic by specified data in body',
          relativeUrl: '/',
          bodyDefinition: {
            type: '[string#enum] message|system',
            from: {
              uid: '[string] firebaseUID',
              displayName: '[string] name of sender to display (title)',
              photoURL: '[string] url to photo to show as notification image',
              token: '[string] sender fcm token (to report an error when sending)'
            },
            to: {
              token: '[string]#optional receiver fcm token',
              topic: '[string]#optional fcm topic'
            },
            message: {
              // pridat volitelna data podle toho co lze nacpat do FCM (vyuzit zas toho jak to prelozit v ciloveem telefonu, tzn odesilani dat atp..)
              text: '[string] text of the message'
            }
          }
        }
      }
    }
  }

  // POST
  async create (data) {
    console.log('we are going to translate incoming data')
    const safeData = this.getSafeData(data)
    console.log(safeData)
    if (safeData.type === 'system') {
      console.log('system message, not implemented yet')
      return {
        status: 'error',
        error: Error('System messages unimplemented!'),
        dataAfterMerge: safeData
      }
    }

    if (safeData.type === 'message') {
      console.log('direct message, check target and validate')
      if (safeData.to.topic) {
        console.log('dm to topic, not implemented yet')
        return {
          status: 'error',
          error: Error('Topic messages unimplemented!'),
          dataAfterMerge: safeData
        }
      }
      if (safeData.to.token) {
        return this.notifyToToken(safeData)
      }
    }

    return {
      error: 'Bad data!',
      dataAfterMerge: safeData
    }
  }

  getSafeData (data) {
    return { ...createData, ...data }
  }

  async notifyToToken (safeData) {
    console.log('dm to token, building body...')

    // check from presence
    if (!safeData.from) {
      console.log('NO FROM SPECIFIED')
      return {
        status: 'error',
        error: Error('No FROM specified!'),
        dataAfterMerge: safeData
      }
    }

    // check from data presence
    if (!safeData.from.uid || !safeData.from.displayName || !safeData.from.photoURL || !safeData.from.token) {
      console.log('INVALID FROM')
      return {
        status: 'error',
        error: Error('Invalid FROM object specified!'),
        dataAfterMerge: safeData
      }
    }

    // build fcm notification
    const fcmData = {
      to: safeData.to.token,
      notification: {
        title: `Notification from ${safeData.from.displayName}`,
        body: safeData.message.text,
        image: safeData.from.photoURL
      }
    }

    // send the notification
    try {
      const fcmResponse = await fcmSendNotificationRequest(fcmData)
      console.log('fcm response')
      console.log(fcmResponse.data)
      return {
        status: 'sent',
        fcmResponse: fcmResponse.data
      }
    } catch (fcmError) {
      console.error('FCM ERROR')
      console.log(fcmError)
      return {
        status: 'error',
        error: fcmError,
        fcmData
      }
    }
  }
}
