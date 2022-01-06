import mongoose, { Schema } from 'mongoose'

const requiredString = {
    type: String,
    required: true
}

const wordleChannelConfigSchema = new Schema({
    // Guild ID
    _id: requiredString,
    channelId: requiredString,
    timezone: requiredString
})

const name = 'wordle-channel-config'

export default mongoose.models[name] || mongoose.model(name, wordleChannelConfigSchema, name)