import mongoose, { Schema } from 'mongoose'

const requiredString = {
    type: String,
    required: true
}

const requiredNumber = {
    type: Number,
    required: true
}

const wordleScoreboardSchema = new Schema({
    // User ID
    userId: requiredString,
    guildId: requiredString,
    score: requiredNumber,
    plays: requiredNumber
})

const name = 'wordle-scoreboard'

export default mongoose.models[name] || mongoose.model(name, wordleScoreboardSchema, name)