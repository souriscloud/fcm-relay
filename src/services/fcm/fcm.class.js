const axios = require('axios')

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
      return safeData
    }

    if (safeData.type === 'message') {
      console.log('direct message, check target and validate')
      if (safeData.to.topic) {
        console.log('dm to topic, not implemented yet')
        return safeData
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
    
    return safeData
  }
}
