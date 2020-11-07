const { Telegraf } = require('telegraf')

const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')

const BOT_API_TOKEN = process.env.TELEGRAM_BOT_API_TOKEN

const HOUR_IN_MILLISECONDS = 60 * 60 * 1000
const MAX_MESSAGES = 3

const FEED_CHAT_ID = parseInt(process.env.FEED_CHAT_ID)

const creationScene = () => {
  const inlineMessageRatingKeyboard = Markup.inlineKeyboard([
    Markup.callbackButton('✅', 'send'),
    Markup.callbackButton('⛔️', 'cancel')
  ]).extra()

  return  new WizardScene(
    'create-post',
    (ctx) => {
      ctx.reply('Надішліть повідомлення яке ви хочете поширити:')
      return ctx.wizard.next()
    },
    async ({session, message, reply, wizard, telegram, from}) => {
      await reply('Ваше повідомлення виглядатиме так:')
      session.messageId = message.message_id

      await reply(message)

      await telegram.sendMessage(from.id, 'Все правильно?', inlineMessageRatingKeyboard)

      return wizard.next()
    },
    async (ctx) => {
      if (ctx.updateType === 'callback_query') {
        console.log(ctx.update.callback_query)
        const action = ctx.update.callback_query.data

        if (action === 'send') return ctx.wizard.next()
      }

      await ctx.reply('Надсилання відмінено!')
      ctx.session.messageId = null
      return ctx.scene.leave()
    },
    async (ctx) => {
      const messageId = ctx.session.messageId

      if (!messageId) {
        ctx.reply('Упс! Щось пішло не так 🤷‍♂️')

        return ctx.scene.leave()
      }

      await ctx.telegram.forwardMessage(FEED_CHAT_ID, ctx.chat.id, messageId)
      await ctx.reply('Повідомлення надіслано успішно!')

      return ctx.scene.leave()
    }
  )
}

const start = async () => {
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

  return bot
}

module.exports = { start }
