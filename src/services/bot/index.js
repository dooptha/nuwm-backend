const { Telegraf } = require('telegraf')

const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
const _get = require('lodash/get')
const request = require('request')
const events = require('../../persistent/repository/events')

const BOT_API_TOKEN = process.env.TELEGRAM_BOT_API_TOKEN

const HOUR_IN_MILLISECONDS = 60 * 60 * 1000
const MAX_MESSAGES = 3

const FEED_CHAT_ID = parseInt(process.env.FEED_CHAT_ID)

const unhandledErrorMessage = 'Упс! Щось пішло не так 🤷‍♂️'

const caption = (message, isAnon) => {
  const name = isAnon ? 'Анонімно' : (
    `@${_get(message, 'from.username')}` ||
    `${_get(message, 'from.first_name')} ${_get(message, 'from.last_name')}`
  )

  return `Надіслано: ${name}`
}

const appendCaption = (text, message, isAnon) => {
  if (!text) return caption(message, isAnon)

  return [text, caption(message, isAnon)].join('\n\n')
}

// Disabled for now
// #issue Images in media group are sent as separated events
const sendMediaGroup = async (ctx, message) => {
  console.log('message', message)
  const media = _get(message, 'photo', []).map(photo => ({
    type: 'photo',
    media: photo.file_id
  }))

  return ctx.replyWithMediaGroup(media)
}

const notSupportedMessageFormat = (ctx) => {
  // Just copy message sent by user
  // return ctx.telegram.sendCopy(ctx.chat.id, message)

  return ctx.reply('Наразі ми не підтримуємо повідомлення такого формату, вибачте за незручності 🙁')
}

const getPictureUrl = (fileId) => {
  const url = `https://api.telegram.org/bot${BOT_API_TOKEN}/getFile?file_id=${fileId}`

  return new Promise((resolve, reject) => {
    request(url, (error, {body}) => {
      if (error) {
        console.log(error)
        return reject(error)
      }
      const image = _get(body, 'result')

      if (!image) return resolve(null)

      const fileUrl = buildImageUrl(image)

      return resolve(fileUrl)
    })
  })
}

const buildImageUrl = (image) => {
  const filePath = _get(image, 'file_path')
  return `https://api.telegram.org/file/bot${BOT_API_TOKEN}/${filePath}`
}

const findOriginalImage = async (images = []) => {
  const lastEntry = images.pop()
  return _get(lastEntry, 'file_id')
}

const saveMessageToDatabase = async (message) => {
  let data = {}

  const containsImage = !!_get(message, 'photo[0].file_id')

  const sendDate = message.date
  const messageId = message.message_id
  const text = message.text || message.caption

  // Building sharing link
  const sharingUrl = `https://t.me/nuwee_feed/${messageId}`

  if (containsImage) {
    const fileId = await findOriginalImage(message.photo)
    const pictureUrl = await getPictureUrl(fileId)

    data = { pictureUrl}
  }

  data = {...data, messageId, text, sharingUrl, sendDate}

  console.log('data', data)

  return events.save(data)
}

const sendMessage = (ctx, message, isAnon = false) => {
  const containsText = !!message.text
  const containsPhoto = !!message.photo
  const containsMediaGroup = !!message.media_group_id

  if (containsMediaGroup) {
    return sendMediaGroup(ctx, message)
  }

  if (containsPhoto) {
    const fileId = _get(message, 'photo[0].file_id')

    return ctx.replyWithPhoto(fileId, {
      caption: appendCaption(message.caption, message)
    })
  }

  if (containsText) {
    return ctx.reply(appendCaption(message.text, message, isAnon))
  }

  return notSupportedMessageFormat()
}

const creationScene = () => {
  const inlineMessageKeyboard = Markup.inlineKeyboard([
    Markup.callbackButton('✅ Так', 'send'),
    Markup.callbackButton('⛔️ Ні', 'cancel')
  ]).extra()

  return new WizardScene(
    'create-post',
    (ctx) => {
      ctx.reply('Надішліть повідомлення яке ви бажаєте поширити:')
      return ctx.wizard.next()
    },
    async (ctx) => {
      const {session, message, reply, wizard, telegram, from} = ctx

      // #case repetitive message group item
      // #dk Media Groups are sent as few events to the bot
      //   - we should ignore other events expect first one
      if (message.media_group_id && session.mediaGroupId) {
        return ctx.scene.leave()
      }
      if (message.media_group_id) {
        session.mediaGroupId = message.media_group_id
        await reply('Надсилання декількох зображень поки недоступне, вибачте за незручності 🙁')
        return ctx.scene.leave()
      }

      await reply('Ваше повідомлення виглядатиме так:')

      try {
        const sentMessage = await sendMessage(ctx, message)
        session.messageId = sentMessage.message_id
      } catch (error) {
        console.error(error)

        return ctx.reply(unhandledErrorMessage)
      }

      await telegram.sendMessage(from.id, 'Все правильно?', inlineMessageKeyboard)

      return wizard.next()
    },
    async (ctx) => {
      if (ctx.updateType === 'callback_query') {
        const action = _get(ctx, 'update.callback_query.data')

        if (action === 'send') return ctx.wizard.next()
      }

      await ctx.reply('Надсилання відмінено!')

      ctx.session.messageId = null
      ctx.session.mediaGroupId = null

      return ctx.scene.leave()
    },
    async (ctx) => {
      const messageId = ctx.session.messageId

      if (!messageId) {
        ctx.reply(unhandledErrorMessage)

        return ctx.scene.leave()
      }

      const message = await ctx.telegram.forwardMessage(FEED_CHAT_ID, ctx.chat.id, messageId)

      await ctx.reply('Повідомлення надіслано успішно!')

      const results = await saveMessageToDatabase(message)

      console.log(results)

      ctx.session.mediaGroupId = null
      ctx.session.messageId = null

      return ctx.scene.leave()
    }
  )
}

const start = async () => {
  if (!BOT_API_TOKEN) return console.log('BOT_API_TOKEN is absent, bot was not started')

  const bot = new Telegraf(BOT_API_TOKEN)

  const createPost = creationScene()
  const stage = new Stage([createPost])

  bot.use(session())
  bot.use(stage.middleware())

  bot.command('create', (ctx) => {
    session.messagesCount = session.messagesCount || 0

    if (session.messagesCount === MAX_MESSAGES)
      return ctx.reply('Ви вичирпали ліміт оголошень! \nМожна відправляти лише 3 повідмлення в годину ⏱')

    session.messagesCount++

    setTimeout(() => {
      session.messagesCount = 0
    }, HOUR_IN_MILLISECONDS)

    return ctx.scene.enter('create-post')
  })
  
  await bot.launch()

  console.log('NUWM FEED bot is started')

  return bot
}

module.exports = { start }
